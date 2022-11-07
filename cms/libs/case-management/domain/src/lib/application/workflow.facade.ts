/** Angular **/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map, of, Subject } from 'rxjs';
import { AjustedDataPointsCheckList, CompletionChecklist, ProcessDatapointsAdjustment, Workflow, WorkFlowProgress } from '../entities/workflow';
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
  clientCaseEligibilityId: string | undefined;

  /**Constructor */
  constructor(private readonly routeService: ScreenRouteDataService, private router: Router) { }


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
            if (!workflowItem.workFlowProgress) {
              if (workflowItem?.processMetadata) {
                var processMetadata = JSON.parse(workflowItem.processMetadata);

                let workflowProgress: WorkFlowProgress = {
                  currentFlag: index === 0 ? 'Y' : 'N',
                  visitedFlag: index === 0 ? 'Y' : 'N',
                  datapointsCompletedCount: 0,
                  datapointsDerivedTotalCount: Number(processMetadata?.datapointsTotalCount ?? 0)
                };
                workflowItem.workFlowProgress = workflowProgress;
              }
            }
            return workflowItem;
          }))
      ).subscribe({
        next: (data) => {
          this.updateWorkflow(data);
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

  private updateWorkflow(data: any) {
    this.workflowRoutes = data;
    this.routesSubject.next(data);
    if (!this.completionStatus) {
      this.setWorkflowCompletionStatus(data);
    }
  }

  private setWorkflowCompletionStatus(workflow: Workflow[]) {
    let completionStatusList: any[] = []
    workflow.forEach((wf: Workflow) => {
      const completionChecklist: CompletionChecklist[] = [];
      const adjustedCheckList: AjustedDataPointsCheckList[] = [];
      wf.processDatapointsAdjustment.forEach((dtAdjust: ProcessDatapointsAdjustment) => {
        if (dtAdjust?.adjustmentTypeCode === 'default') {
          const checklistItem: CompletionChecklist = {
            dataPointName: dtAdjust.datapointName,
            status: 'N',
            //count:1
          }
          completionChecklist.push(checklistItem);
        }
        else if (dtAdjust?.adjustmentTypeCode === 'adjusted') {
          if (dtAdjust?.parentId) {
            const parentIndex = adjustedCheckList.findIndex((adj: any) => adj.parentId === dtAdjust?.parentId)
            if (parentIndex !== -1) {
              adjustedCheckList[parentIndex]?.children?.push(dtAdjust?.datapointName);
            }
            else {
              const adjItem = this.deepCopy(wf.processDatapointsAdjustment)
                ?.filter((item: ProcessDatapointsAdjustment) => item.dataPointAdjustmentId === dtAdjust?.parentId)[0];
              if (adjItem) {
                let adjustItem: AjustedDataPointsCheckList = {
                  parentId: adjItem?.dataPointAdjustmentId,
                  parentName: adjItem?.datapointName,
                  children: [dtAdjust.datapointName],
                  adjustmentOperator: adjItem?.adjustmentOperator
                };

                adjustedCheckList.push(adjustItem);
              }
            }
          }
          else {
            const parentIndex = adjustedCheckList.findIndex((adj: any) => adj.parentId === dtAdjust?.dataPointAdjustmentId)
            if (parentIndex === -1) {
              let adjustItem: AjustedDataPointsCheckList = {
                parentId: dtAdjust?.dataPointAdjustmentId,
                parentName: dtAdjust?.datapointName,
                children: [],
                adjustmentOperator: dtAdjust?.adjustmentOperator
              };
              adjustedCheckList.push(adjustItem);
            }
          }
        }
      })
      if (wf?.workFlowProgress) {
        let wfStageStatus: WorkflowStageCompletionStatus = {
          workflowStepId: wf.workflowStepId,
          ///name: wf.title,
          url: wf.url,
          dataPointsCompleted: wf?.workFlowProgress?.datapointsCompletedCount ?? 0,
          dataPointsTotal: wf?.workFlowProgress?.datapointsDerivedTotalCount ?? 0,
          completionChecklist: completionChecklist,
          adjustDataPointChecklist: adjustedCheckList
        };

        completionStatusList.push(wfStageStatus);
      }
    });
    this.completionStatus = completionStatusList;
    console.log(completionStatusList);
    this.wfStageCompletionStatusSubject.next(completionStatusList);
  }

  updateWorkflowCompletionStatus(completionStatus: WorkflowStageCompletionStatus) {
    if (completionStatus) {
      let currentScreenStatus = this.deepCopy(this.completionStatus)?.filter((status: WorkflowStageCompletionStatus) => status?.workflowStepId === completionStatus?.workflowStepId)[0] as WorkflowStageCompletionStatus;
      let currentScreenStatusIndex = this.deepCopy(this.completionStatus)?.findIndex((status: WorkflowStageCompletionStatus) => status?.workflowStepId === completionStatus?.workflowStepId);
      if (currentScreenStatusIndex !== -1) {
        currentScreenStatus.dataPointsCompleted = completionStatus?.completionChecklist?.filter(chklist => chklist?.status === 'Y')?.length;
        currentScreenStatus.dataPointsTotal = completionStatus?.completionChecklist?.length;
        currentScreenStatus.completionChecklist = completionStatus?.completionChecklist;
        this.completionStatus[currentScreenStatusIndex] = currentScreenStatus;
        this.wfStageCompletionStatusSubject.next(this.completionStatus);
      }
    }
  }

  updateChecklist(completedDataPoints: CompletionChecklist[]) {
    let usedDataPoints: string[] = [];
    if (completedDataPoints) {
      const CurrentRoute = this.router.url;
      let completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
        ?.filter((wf: WorkflowStageCompletionStatus) => CurrentRoute.includes(wf.url))[0];

      if (completionStatus) {

        completedDataPoints?.forEach((completedDtpoint: CompletionChecklist) => {
          this.updateCompletionStatus(completionStatus?.completionChecklist, completedDtpoint);
        });

        this.updateWorkflowCompletionStatus(completionStatus);
      }
    }
  }

  updateCompletionStatus(completionChecklist: CompletionChecklist[], dataCompleted: CompletionChecklist) {
    const index = this.deepCopy(completionChecklist).findIndex((chklist: any) => chklist.dataPointName === dataCompleted?.dataPointName);
    if (index !== -1) {
      completionChecklist[index] = dataCompleted;
    }
  }

  updateBasedOnDtAttrChecklist(ajustData: CompletionChecklist[]) {
    const CurrentRoute = this.router.url;
    const stageCompChecklist: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
      ?.filter((wf: WorkflowStageCompletionStatus) => CurrentRoute.includes(wf.url))[0];

    if (stageCompChecklist) {
      ajustData?.forEach((data: CompletionChecklist) => {
        let adjustAttribute: AjustedDataPointsCheckList = this.deepCopy(stageCompChecklist)
          ?.adjustDataPointChecklist?.filter((dtAdj: AjustedDataPointsCheckList) =>
            dtAdj.parentName === data?.dataPointName)[0];

        const checklist = stageCompChecklist?.completionChecklist;

        if (adjustAttribute && adjustAttribute?.children) {
          adjustAttribute?.children?.forEach(childName => {
            if (data?.status == 'Y') {
              if (adjustAttribute?.adjustmentOperator === '+') {
                this.addChkListItem(checklist, childName);
              }
              if (adjustAttribute?.adjustmentOperator === '-') {
                const newList = stageCompChecklist?.completionChecklist?.filter((chkitem: CompletionChecklist) => chkitem?.dataPointName !== childName);
                stageCompChecklist.completionChecklist = newList;
              }
            }
            else if (data?.status == 'N') {
              if (adjustAttribute?.adjustmentOperator === '+') {
                const newList = stageCompChecklist?.completionChecklist?.filter((chkitem: CompletionChecklist) => chkitem?.dataPointName !== childName);
                stageCompChecklist.completionChecklist = newList;
              }
              if (adjustAttribute?.adjustmentOperator === '-') {
                this.addChkListItem(checklist, childName);
              }
            }
          });

          const compStatusIndex = this.completionStatus.findIndex((chklst: WorkflowStageCompletionStatus) => chklst.workflowStepId === stageCompChecklist.workflowStepId);
          if (compStatusIndex != null) {
            this.completionStatus[compStatusIndex].completionChecklist = stageCompChecklist?.completionChecklist;
          }
        }
      });
    }
  }

  addChkListItem(checklist: CompletionChecklist[], item: string) {
    const index = this.deepCopy(checklist)?.findIndex((cs: CompletionChecklist) => cs.dataPointName === item);
    if (index === -1) {
      const chkItem = {
        dataPointName: item,
        status: 'N'
      }

      checklist?.push(chkItem);
    }
  }

  removeChkLstItem(checklist: CompletionChecklist[], item: string) {
    const index = this.deepCopy(checklist)
      ?.findIndex((cs: CompletionChecklist) => cs.dataPointName === item);
    if (index !== -1) {
      const k = checklist?.filter((chkitem: CompletionChecklist) => chkitem?.dataPointName !== item);
      checklist = k;
      console.log(k);
    }
  }

  updateAjustAttrOnCheckList(dataPoint: ProcessDatapointsAdjustment, completionChecklist: CompletionChecklist[], completedDataPoints: string[], usedDataPoints: string[]) {
    // if (!dataPoint?.children) return;
    // const children = JSON.parse(dataPoint?.children);
    // if (children?.fieldNames.length <= 0) return;
    // children?.fieldNames?.forEach((child: string) => {
    //   const isExist = this.deepCopy(completionChecklist)?.map((i: any) => i.dataPointName)?.includes(child) ?? false;
    //   if (dataPoint?.adjustmentOperator === '+' && !isExist) {
    //     const checklistItem: CompletionChecklist = {
    //       dataPointName: child,
    //       status: completedDataPoints?.includes(child) ? 'Y' : 'N',
    //       count: 1
    //     };

    //     completionChecklist.push(checklistItem);
    //   }
    //   else if (dataPoint?.adjustmentOperator === '-' && isExist) {
    //     const chklstIndex = this.deepCopy(completionChecklist).findIndex((chklist: any) => chklist.dataPointName === child);
    //     if (chklstIndex !== -1) {
    //       completionChecklist.splice(chklstIndex, 1);
    //     }
    //   }

    //   usedDataPoints.push(dataPoint?.dataPointName);
    // })

  }

  removeClearedItems(completionChecklist: CompletionChecklist[], completedDataPoints: string[]) {
    // const clearedFields: CompletionChecklist[] = this.deepCopy(completionChecklist).filter((status: CompletionChecklist) => !completedDataPoints.includes(status?.dataPointName ?? '') && status.status === 'Y');
    // clearedFields.forEach(clearedFields => {
    //   const index = completionChecklist.findIndex((chklist: any) => chklist.dataPointName === clearedFields?.dataPointName);
    //   if (index !== -1) {
    //     completionChecklist[index].status = 'N';
    //   }
    // });
  }

  removeAllUnusedAdjustDataPoints(usedDataPoints: string[], datapointAdjust: ProcessDatapointsAdjustment[], completionChecklist: CompletionChecklist[], completedDataPoints: string[]) {
    // const unUsedDataPoinsts = datapointAdjust.filter((dtPnt: ProcessDatapointsAdjustment) => !usedDataPoints.includes(dtPnt.dataPointName));
    // unUsedDataPoinsts?.forEach((dtPnt: ProcessDatapointsAdjustment) => {
    //   if (dtPnt?.children) {
    //     const children = JSON.parse(dtPnt?.children);
    //     if (children?.fieldNames.length <= 0) return;
    //     children?.fieldNames?.forEach((fieldName: string) => {
    //       if (dtPnt.adjustmentOperator === '+') {
    //         const index = completionChecklist.findIndex((item: CompletionChecklist) => item?.dataPointName === fieldName);
    //         if (index !== -1) {
    //           completionChecklist.splice(index, 1);
    //         }
    //       }
    //       else if (dtPnt.adjustmentOperator === '-') {
    //         const index = completionChecklist.findIndex((item: CompletionChecklist) => item?.dataPointName === fieldName);
    //         if (index === -1) {
    //           const checklistItem: CompletionChecklist = {
    //             dataPointName: fieldName,
    //             status: completedDataPoints?.includes(fieldName) ? 'Y' : 'N',
    //             count: 1
    //           };

    //           completionChecklist.push(checklistItem);
    //         }
    //       }
    //     })
    //   }
    // })
  }

  updateWorkflowNavigation(navType: NavigationType) {
    const currentRoute = this.router.url;
    const currentWorkflowStep = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      currentRoute.includes(wf.url))[0];

    if (currentWorkflowStep) {
      //if (currentWorkflowStep?.workflowProgress?.workflowProgressId) {
      this.updateNavigation(currentWorkflowStep, navType);
      // return this.saveWorkflowProgress(
      //   currentWorkflowStep?.workflowProgress.workflowProgressId,
      //   currentWorkflowStep?.workflowStepId,
      //   navType);

      // }
      // else {
      //this.createSession();
      //TODO create session.
      // }
    }
  }

  updateNavigation(currentWorkflow: Workflow, navType: NavigationType) {
    const nextWorkflow = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      wf.sequenceNbr == (navType == NavigationType.Next ? currentWorkflow?.sequenceNbr + 1 : currentWorkflow?.sequenceNbr - 1))[0];

    if (nextWorkflow) {
      this.updateRoutes(currentWorkflow, nextWorkflow);
    }

  }

  updateActiveWorkflowStep(currentWorkflow: Workflow) {
    const previousRoute = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      wf?.workFlowProgress?.currentFlag == 'Y')[0];

    return currentWorkflow?.workFlowProgress?.workflowProgressId ?
      this.routeService.updateActiveWorkflowStep(currentWorkflow?.workFlowProgress?.workflowProgressId)
      : of(false);
  }

  updateRoutes(currentWorkflow: Workflow, nextWorkflow: Workflow) {
    currentWorkflow.workFlowProgress.currentFlag = 'N';
    currentWorkflow.workFlowProgress.visitedFlag = 'Y';
    nextWorkflow.workFlowProgress.currentFlag = 'Y';
    nextWorkflow.workFlowProgress.visitedFlag = 'Y';

    const currentIndex = this.deepCopy(this.workflowRoutes)?.findIndex((wf: Workflow) => wf.workflowStepId === currentWorkflow.workflowStepId);
    if (currentIndex !== -1) {
      this.workflowRoutes[currentIndex] = currentWorkflow;

      const nextIndex = this.deepCopy(this.workflowRoutes)?.findIndex((wf: Workflow) => wf.workflowStepId === nextWorkflow.workflowStepId);
      if (nextIndex !== -1) {
        this.workflowRoutes[nextIndex] = nextWorkflow;
        this.updateWorkflow(this.workflowRoutes);
      }
    }
  }

  private saveWorkflowProgress(workflowProgressId: string, workflowStepId: string, navType: NavigationType) {
    const completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
      ?.filter((wf: WorkflowStageCompletionStatus) =>
        wf.workflowStepId === workflowStepId
      )[0];

    const navUpdate = {
      workflowProgressId: workflowProgressId,
      workflowStepId: workflowStepId,
      datapointsDerivedTotalCount: completionStatus?.dataPointsTotal,
      datapointsCompletedCount: completionStatus?.dataPointsCompleted
    }

    this.routeService.saveWorkflowProgress(navUpdate, navType);
  }

  private createSession() {
    let sessionData = {
      programId: "7B52CDA2-AADD-4D4D-A42A-FC765165B506",
      sessionMetadata: {
        clientCaseEligibilityId: this.clientCaseEligibilityId//"3500D14F-FB9E-4353-A73B-0336D79418EF"
      }
    }

    return this.routeService.createNewSession(sessionData);
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }
} 
