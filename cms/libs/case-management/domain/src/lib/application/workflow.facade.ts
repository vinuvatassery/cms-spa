/** Angular **/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, map, of, Subject } from 'rxjs';
import { AjustedDataPointsCheckList, CompletionChecklist, DatapointsAdjustment, UpdateWorkFlowProgress, Workflow, WorkFlowProgress } from '../entities/workflow';
import { WorkflowStageCompletionStatus } from '../entities/workflow-stage-completion-status';
import { NavigationType } from '../enums/navigation-type.enum';
import { ScreenFlowType } from '../enums/screen-flow-type.enum';
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
  workflowsessionId: string | undefined;

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
    entity_id: string,
    session_id?: string
  ) {
    this.routeService
      .loadWorkflow(screen_flow_type_code, entity_id, session_id)
      .pipe(
        map((wf: any) =>
          wf.map((workflowItem: Workflow, index: number) => {
            if (workflowItem?.workFlowProgress?.requiredDatapointsCount == 0 && workflowItem?.metadata) {
              var metadata = JSON.parse(workflowItem.metadata);
              workflowItem.workFlowProgress.requiredDatapointsCount = Number(metadata?.datapointsTotalCount ?? 0)
            }
            return workflowItem;
          }))
      ).subscribe({
        next: (data) => {
          this.updateWorkflow(data, true);
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

  private updateWorkflow(data: any, isUpdateChecklist: boolean = false) {
    this.workflowRoutes = data;
    this.routesSubject.next(data);
    if (isUpdateChecklist) {
      this.setWorkflowCompletionStatus(data);
    }
  }

  private setWorkflowCompletionStatus(workflow: Workflow[]) {
    let completionStatusList: any[] = []
    workflow.forEach((wf: Workflow) => {
      const completionChecklist: CompletionChecklist[] = [];
      const adjustedCheckList: AjustedDataPointsCheckList[] = [];
      wf.datapointsAdjustment.forEach((dtAdjust: DatapointsAdjustment) => {
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
              const adjItem = this.deepCopy(wf.datapointsAdjustment)
                ?.filter((item: DatapointsAdjustment) => item.dataPointAdjustmentId === dtAdjust?.parentId)[0];
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
          url: wf.url,
          dataPointsCompleted: wf?.workFlowProgress?.completedDatapointsCount ?? 0,
          dataPointsTotal: wf?.workFlowProgress?.requiredDatapointsCount ?? 0,
          completionChecklist: completionChecklist,
          adjustDataPointChecklist: adjustedCheckList
        };

        completionStatusList.push(wfStageStatus);
      }
    });
    this.completionStatus = completionStatusList;
    //console.log(completionStatusList);
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

  updateSequenceNavigation(navType: NavigationType) {
    const currentRoute = this.router.url;
    const currentWorkflowStep = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      currentRoute.includes(wf.url))[0];

    if (currentWorkflowStep) {
      this.updateNavigation(currentWorkflowStep, navType);
    }
    return of(null);
  }

  updateNavigation(currentWorkflow: Workflow, navType: NavigationType) {
    const nextWorkflow = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      wf.sequenceNbr == (navType == NavigationType.Next ? currentWorkflow?.sequenceNbr + 1 : currentWorkflow?.sequenceNbr - 1))[0];

    if (nextWorkflow) {
      this.updateRoutes(currentWorkflow, nextWorkflow);
    }
  }

  updateNonequenceNavigation(currentWorkflow: Workflow) {
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

  saveWorkflowProgress(navType: NavigationType) {
    const currentRoute = this.router.url;
    const currentWorkflowStep = this.deepCopy(this.workflowRoutes)?.filter((wf: Workflow) =>
      currentRoute.includes(wf.url))[0];

    const completionStatus: WorkflowStageCompletionStatus = this.deepCopy(this.completionStatus)
      ?.filter((wf: WorkflowStageCompletionStatus) =>
        wf.workflowStepId === currentWorkflowStep?.workflowStepId
      )[0];

    const navUpdate: UpdateWorkFlowProgress = {
      workflowProgressId: currentWorkflowStep?.workFlowProgress?.workflowProgressId,
      datapointsDerivedTotalCount: completionStatus?.dataPointsTotal,
      datapointsCompletedCount: completionStatus?.dataPointsCompleted
    }

    return this.routeService.saveWorkflowProgress(navUpdate, navType);
  }

  createSession(entityId: string) {
    let sessionData = {
      entityId: "3B8DD4FC-86FD-43E7-8493-0037A6F9160B",
      workflowTypeCode: ScreenFlowType.NewCase,
      sessiondata: {
        clientCaseEligibilityId: "8600D14F-FB9E-4353-A73B-0336D79418E5"
      }
    }

    this.routeService.createNewSession(sessionData).subscribe((resp: any)=>{
      if(resp && resp.workflowSessionId){
        this.workflowsessionId = resp.workflowSessionId;
        this.router.navigate(['case-management/case-detail/contact-info'], {
          queryParams: {
            type: ScreenFlowType.NewCase,
            pid: entityId,
            sid:resp.workflowSessionId
          },
        });
    
      }
    });       
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }
} 
