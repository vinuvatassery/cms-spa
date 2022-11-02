import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Subject } from 'rxjs';
import { CompletionChecklist, CompletionStatusUpdate, ProcessDatapointsAdjustment, UpdateWorkFlowProgress, Workflow, WorkFlowProgress } from '../entities/workflow';
import { WorkflowStageCompletionStatus } from '../entities/workflow-stage-completion-status';
import { NavigationType } from '../enums/navigation-type.enum';
import { ScreenRouteDataService } from '../infrastructure/screen-route.data.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowFacade {

  /** Private properties **/
  private saveAndContinueClickedSubject = new Subject<NavigationType>();
  private navigationTriggerSubject = new Subject<NavigationType>();
  private wfStageCompletionStatusSubject = new BehaviorSubject<WorkflowStageCompletionStatus[]>([]);
  private routesSubject = new BehaviorSubject<any>([]);
  private workflowRoutes!: Workflow[];


  /** Public properties **/
  saveAndContinueClicked$ = this.saveAndContinueClickedSubject.asObservable();
  navigationTrigger$ = this.navigationTriggerSubject.asObservable();
  routes$ = this.routesSubject.asObservable();
  wfStageCompletionStatus$ = this.wfStageCompletionStatusSubject.asObservable();
  currentWorkflowStage!: Workflow;
  completionStatus!: WorkflowStageCompletionStatus[];

  /**Constructor */
  constructor(private readonly routeService: ScreenRouteDataService) { }


  /** Public methods **/
  save(navigationType: NavigationType) {
    this.saveAndContinueClickedSubject.next(navigationType);
  }

  navigate(navigationType: NavigationType) {
    if (navigationType === NavigationType.Next) {
      this.navigateNext();
    }
    else if (navigationType === NavigationType.Previous) {
      this.navigatePrevious();
    }
  }

  setWorkflowCompletionStatus(workflow: Workflow[]) {
    let completionStatusList: any[] = []
    workflow.forEach(wf => {
      if (wf?.workFlowProgress[0]) {
        let wfStageStatus: WorkflowStageCompletionStatus = {
          workflowStepId: wf.workflowStepId,
          name: wf.processName,
          dataPointsCompleted: wf?.workFlowProgress[0]?.datapointsCompletedCount ?? 0,
          dataPointsTotal: wf?.workFlowProgress[0]?.datapointsTotalCount ?? 0,
          completionChecklist: wf.completionChecklist
        };

        completionStatusList.push(wfStageStatus);
      }
    });
    this.completionStatus = completionStatusList;
    this.wfStageCompletionStatusSubject.next(completionStatusList);
  }

  loadRoutes(
    screen_flow_type_code: string,
    program_id: number,
    case_id?: number
  ) {
    this.routeService
      .loadWorkflow(screen_flow_type_code, program_id, case_id)
      .pipe(
        map((wf: any) =>
          wf.map((workflowItem: Workflow, index: number) => {
            if (workflowItem.workFlowProgress.length === 0) {
              if (workflowItem?.processMetadata) {
                var processMetadata = JSON.parse(workflowItem.processMetadata);

                let workflowProgress: WorkFlowProgress = {
                  currentFlag: index === 0 ? 'Y' : 'N',
                  datapointsCompletedCount: 0,
                  datapointsTotalCount: Number(processMetadata?.datapointsTotalCount ?? 0)
                };
                workflowItem.workFlowProgress.push(workflowProgress);
              }
            }
            return workflowItem;
          }))
      ).subscribe({
        next: (data) => {
          this.updateWorkflow(data, undefined);
        },
        error: (err) => {
          console.log('Error', err);
        },
      });
  }

  /** private  methods **/
  private navigateNext() {
    this.navigationTriggerSubject.next(NavigationType.Next);
  }

  private navigatePrevious() {
    this.navigationTriggerSubject.next(NavigationType.Previous);
  }

  private updateWorkflow(data: any, currentWorkflowStage: any) {
    this.workflowRoutes = data;
    this.routesSubject.next(data);
    this.setWorkflowCompletionStatus(data);
  }

  updateWorkflowCompletionStatus(completionStatus: WorkflowStageCompletionStatus) {
    if (completionStatus) {
      let currentScreenStatus = this.deepCopy(this.completionStatus)?.filter((status: WorkflowStageCompletionStatus) => status?.name === completionStatus?.name)[0] as WorkflowStageCompletionStatus;
      let currentScreenStatusIndex = this.deepCopy(this.completionStatus)?.findIndex((status: WorkflowStageCompletionStatus) => status?.name === completionStatus?.name);
      if (currentScreenStatusIndex !== -1) {
        currentScreenStatus.dataPointsCompleted = completionStatus?.completionChecklist?.filter(chklist => chklist?.status === 'Y')?.length;
        currentScreenStatus.dataPointsTotal = completionStatus?.completionChecklist?.length;
        currentScreenStatus.completionChecklist = completionStatus?.completionChecklist;
        this.completionStatus[currentScreenStatusIndex] = currentScreenStatus;
        this.wfStageCompletionStatusSubject.next(this.completionStatus);
      }
    }
  }

  updateChecklist(processName: string, completedDataPoints: string[]) {
    let usedDataPoints: string[] = [];
    if (completedDataPoints) {
      let completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
        ?.filter((wf: WorkflowStageCompletionStatus) => wf.name === processName)[0];
      if (completionStatus) {

        let datapointAdjustments: ProcessDatapointsAdjustment[] =
          this.deepCopy(this.workflowRoutes).filter((wf: Workflow) =>
            wf?.processName === processName)[0]?.processDatapointsAdjustment;

        if (datapointAdjustments?.length > 0) {
          completedDataPoints.forEach(dataCompleted => {

            let dataPoint: ProcessDatapointsAdjustment = this.deepCopy(datapointAdjustments)
              ?.filter((dtpoint: ProcessDatapointsAdjustment) =>
                dtpoint.dataPointName === dataCompleted)[0];

            if (dataPoint) {
              this.updateAjustAttrOnCheckList(
                dataPoint,
                completionStatus?.completionChecklist,
                completedDataPoints,
                usedDataPoints
              )
            }

            this.updateCompletionStatus(completionStatus?.completionChecklist, dataCompleted);
          });
        }

        this.removeAllUnusedAdjustDataPoints(usedDataPoints, datapointAdjustments, completionStatus.completionChecklist, completedDataPoints);
        this.removeClearedItems(completionStatus.completionChecklist, completedDataPoints);
        this.updateWorkflowCompletionStatus(completionStatus);
      }
    }
  }

  updateCompletionStatus(completionChecklist: CompletionChecklist[], dataCompleted: string) {
    const index = this.deepCopy(completionChecklist).findIndex((chklist: any) => chklist.dataPointName === dataCompleted);
    if (index !== -1) {
      completionChecklist[index].status = 'Y';
    }
  }

  updateAjustAttrOnCheckList(dataPoint: ProcessDatapointsAdjustment, completionChecklist: CompletionChecklist[], completedDataPoints: string[], usedDataPoints: string[]) {
    const children: string[] = dataPoint?.children?.split(',');
    children?.forEach((child: string) => {
      const isExist = this.deepCopy(completionChecklist)?.map((i: any) => i.dataPointName)?.includes(child) ?? false;
      if (dataPoint?.adjustmentOperator === '+' && !isExist) {
        const checklistItem: CompletionChecklist = {
          dataPointName: child,
          status: completedDataPoints?.includes(child) ? 'Y' : 'N',
          count: 1
        };

        completionChecklist.push(checklistItem);
      }
      else if (dataPoint?.adjustmentOperator === '-' && isExist) {
        const chklstIndex = this.deepCopy(completionChecklist).findIndex((chklist: any) => chklist.dataPointName === child);
        if (chklstIndex !== -1) {
          completionChecklist.splice(chklstIndex, 1);
        }
      }

      usedDataPoints.push(dataPoint?.dataPointName);
    })
  }

  removeClearedItems(completionChecklist: CompletionChecklist[], completedDataPoints: string[]) {
    const clearedFields: CompletionChecklist[] = this.deepCopy(completionChecklist).filter((status: CompletionChecklist) => !completedDataPoints.includes(status?.dataPointName ?? '') && status.status === 'Y');
    clearedFields.forEach(clearedFields => {
      const index = completionChecklist.findIndex((chklist: any) => chklist.dataPointName === clearedFields?.dataPointName);
      if (index !== -1) {
        completionChecklist[index].status = 'N';
      }
    });
  }

  removeAllUnusedAdjustDataPoints(usedDataPoints: string[], datapointAdjust: ProcessDatapointsAdjustment[], completionChecklist: CompletionChecklist[], completedDataPoints: string[]) {
    const unUsedDataPoinsts = datapointAdjust.filter((dtPnt: ProcessDatapointsAdjustment) => !usedDataPoints.includes(dtPnt.dataPointName));
    unUsedDataPoinsts?.forEach((dtPnt: ProcessDatapointsAdjustment) => {
      const fieldNames = dtPnt?.children?.split(',');
      fieldNames.forEach(fieldName => {
        if (dtPnt.adjustmentOperator === '+') {
          const index = completionChecklist.findIndex((item: CompletionChecklist) => item?.dataPointName === fieldName);
          if (index !== -1) {
            completionChecklist.splice(index, 1);
          }
        }
        else if (dtPnt.adjustmentOperator === '-') {
          const index = completionChecklist.findIndex((item: CompletionChecklist) => item?.dataPointName === fieldName);
          if (index === -1) {
            const checklistItem: CompletionChecklist = {
              dataPointName: fieldName,
              status: completedDataPoints?.includes(fieldName) ? 'Y' : 'N',
              count: 1
            };

            completionChecklist.push(checklistItem);
          }
        }
      })
    })
  }

  // calculateAdjustmentAttributeCount(processName: string, adjAttributeName: string[]) {
  //   if (adjAttributeName) {
  //     let completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
  //       ?.filter((wf: WorkflowStageCompletionStatus) => wf.name === processName)[0];

  //     adjAttributeName?.forEach(element => {
  //       if (!this.deepCopy(completionStatus.completionChecklist).map((i: any) => i.status).includes(adjAttributeName)) {
  //         let adjAttributeItem: CompletionChecklist = {
  //           dataPointName: element,
  //           status: 'N',
  //           count: 1
  //         }
  //         completionStatus.completionChecklist.push(adjAttributeItem);
  //       }
  //     });

  //     this.updateWorkflowCompletionStatus(completionStatus);
  //   }
  // }

  // updateAjustAttrOnCompletedChkList(processName: string, adjAttributeName: string) {
  //   if (adjAttributeName) {
  //     let completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
  //       ?.filter((wf: WorkflowStageCompletionStatus) => wf.name === processName)[0];
  //   }
  // }



  // updateWorkflowStageCount(currentWorkflowStage: Workflow) {
  //   if (currentWorkflowStage) {
  //     let currentWorkflowIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === currentWorkflowStage.workflowStepId);
  //     if (currentWorkflowIndex !== -1) {
  //       this.workflowRoutes[currentWorkflowIndex] = currentWorkflowStage;
  //     }

  //     this.updateWorkflow(this.workflowRoutes, currentWorkflowStage);
  //   }
  // }

  // updateAutomaticWorkflowChange(currentWorkflowStage: Workflow, navigationType: NavigationType) {
  //   if (currentWorkflowStage) {

  //     let nextWorkflowStage: Workflow = this.deepCopy(this.workflowRoutes)
  //       .filter((wf: Workflow) =>
  //         wf.sequenceNbr === (navigationType === NavigationType.Next ?
  //           (currentWorkflowStage.sequenceNbr + 1)
  //           : (currentWorkflowStage.sequenceNbr - 1))
  //       )[0];

  //     currentWorkflowStage.workFlowProgress[0].currentFlag = 'N';
  //     currentWorkflowStage.workFlowProgress[0].visitedFlag = 'Y';
  //     nextWorkflowStage.workFlowProgress[0].currentFlag = 'Y';

  //     let currentWorkflowIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === currentWorkflowStage.workflowStepId);
  //     let nextWorkflowStepIndex = this.workflowRoutes?.findIndex(wf => wf.workflowStepId === nextWorkflowStage.workflowStepId);
  //     if (currentWorkflowIndex !== -1) {
  //       this.workflowRoutes[currentWorkflowIndex] = currentWorkflowStage;
  //     }

  //     if (nextWorkflowStepIndex !== -1) {
  //       this.workflowRoutes[nextWorkflowStepIndex] = nextWorkflowStage;
  //     }

  //     // it will trigger the work flow and update the work current screen.
  //     this.updateWorkflow(this.workflowRoutes, nextWorkflowStage);
  //   }
  // }

  // appyAutomaticWorkflowProgress(updateworkflowProgress: UpdateWorkFlowProgress, currentWorkflowStage: Workflow, navigationType: NavigationType) {
  //   let resp = this.routeService.saveWorkflowProgress(updateworkflowProgress)
  //   this.updateAutomaticWorkflowChange(currentWorkflowStage, navigationType);
  //   return resp;
  // }

  applyManualWorkflowChange(currentWorkflowStage: Workflow) {
    let model = {
      clientCaseEligibilityId: currentWorkflowStage?.workFlowProgress[0]?.clientCaseEligibilityId ?? '2500D14F-FB9E-4353-A73B-0336D79418CF',
      workflowStepId: currentWorkflowStage?.workflowStepId,
      workflowProgressId: currentWorkflowStage?.workFlowProgress[0]?.workflowProgressId ?? 'e3b0a899-8a42-4ff7-bc90-ca545f02b3f0',
    }
    let wokflowUpdate = this.routeService.saveManualWorkflowChange(model);
    if (currentWorkflowStage?.workFlowProgress[0]?.visitedFlag === 'Y') {
      this.updateManualWorkflowChange(currentWorkflowStage);
    }

    return wokflowUpdate;

  }

  updateManualWorkflowChange(currentWorkflow: Workflow) {
    currentWorkflow.workFlowProgress[0].visitedFlag = 'Y';
    let currentWorkflowIndex = this.deepCopy(this.workflowRoutes)?.findIndex((wf: Workflow) => wf.workflowStepId === currentWorkflow.workflowStepId);
    this.workflowRoutes[currentWorkflowIndex] = currentWorkflow;
    this.updateWorkflow(this.workflowRoutes, currentWorkflow);
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }
} 
