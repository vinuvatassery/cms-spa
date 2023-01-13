/** Angular **/
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { BehaviorSubject, catchError, forkJoin, mergeMap, of, Subject } from 'rxjs';
/** Entities **/
import { DatapointsAdjustment, WorkFlowProgress, WorkflowMaster, WorkflowSession } from '../entities/workflow';
import { CompletionChecklist, WorkflowProcessCompletionStatus } from '../entities/workflow-stage-completion-status';
import { AdjustOperator } from '../enums/adjustment-operator.enum';
import { DataPointType } from '../enums/data-point-type.enum';
import { EntityTypeCode } from '../enums/entity-type-code.enum';
/** Enums **/
import { NavigationType } from '../enums/navigation-type.enum';
import { WorkflowTypeCode } from '../enums/workflow-type.enum';
import { StatusFlag } from '../enums/status-flag.enum';
/** Services **/
import { WorkflowDataService } from '../infrastructure/workflow.data.service';
import {  FormGroup } from '@angular/forms';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Injectable({
  providedIn: 'root'
})
export class WorkflowFacade {

  /** Private properties **/
  private saveAndContinueClickedSubject = new Subject<NavigationType>();
  private navigationTriggerSubject = new Subject<NavigationType>();
  private wfProcessCompletionStatusSubject = new BehaviorSubject<WorkflowProcessCompletionStatus[]>([]);
  private routesSubject = new BehaviorSubject<any>([]);
  private sessionSubject = new BehaviorSubject<any>([]);
  private sessionDataSubject = new Subject<any>();
  private workflowReadySubject = new Subject<boolean>();
  /** Public properties **/
  saveAndContinueClicked$ = this.saveAndContinueClickedSubject.asObservable();
  navigationTrigger$ = this.navigationTriggerSubject.asObservable();
  routes$ = this.routesSubject.asObservable();
  completionStatus$ = this.wfProcessCompletionStatusSubject.asObservable();
  sessionSubject$ = this.sessionSubject.asObservable();
  sessionDataSubject$ = this.sessionDataSubject.asObservable();
  workflowReady$ = this.workflowReadySubject.asObservable();

  clientId: number | undefined;
  clientCaseId: string | undefined;
  clientCaseEligibilityId: string | undefined; 

  completionChecklist!: WorkflowProcessCompletionStatus[];
  currentSession!: WorkflowSession;
  currentWorkflowMaster!: WorkflowMaster[];
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  /**Constructor */
  constructor(private readonly workflowService: WorkflowDataService, private router: Router, private actRoute: ActivatedRoute
    ,   private readonly loaderService: LoaderService,
    private loggingService : LoggingService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    public intl: IntlService,
    private configurationProvider : ConfigurationProvider ) { }
  

  ShowHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.HideLoader();   
  }

  ShowLoader()
  {
    this.loaderService.show();
  }

  HideLoader()
  {
    this.loaderService.hide();
  }

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

  createNewSession(newCaseFormData: FormGroup) {
    this.ShowLoader();
    const sessionData = {
      entityId: newCaseFormData?.controls["programId"].value,
      EntityTypeCode: EntityTypeCode.Program,
      workflowTypeCode: WorkflowTypeCode.NewCase,
      assignedCwUserId: newCaseFormData?.controls["caseOwnerId"].value,
      caseOriginCode: newCaseFormData?.controls["caseOriginCode"].value,
      caseStartDate: newCaseFormData?.controls["applicationDate"].value
    }      
    
    sessionData.caseStartDate =  this.intl.formatDate(sessionData.caseStartDate,this.dateFormat)   
    this.workflowService.createNewSession(sessionData)
      .subscribe({
        next: (sessionResp: any) => {
          if (sessionResp && sessionResp?.workflowSessionId) {
            this.router.navigate(['case-management/case-detail'], {
              queryParams: {
                sid: sessionResp?.workflowSessionId,
                eid: sessionData?.entityId
              },
            });
          }
          this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS , 'New Session Created Successfully')  
          this.HideLoader();
        },
        error: (err: any) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },

      });
  }

  loadWorkflowSession(type: string, entityId: string, sessionId: string) {
    this.workflowReadySubject.next(false);
    this.ShowLoader();
    this.workflowService.loadWorkflowMaster(entityId, EntityTypeCode.Program, type)
      .pipe(
        mergeMap((wfMaster: any) =>
          forkJoin(
            [
              of(wfMaster),
              this.workflowService.loadWorkflow(sessionId)             
            ])
        ),
      ).subscribe({
        next: ([wfMaster, wfSession]: [WorkflowMaster[], WorkflowSession]) => {
          this.currentSession = wfSession;
          this.currentWorkflowMaster = wfMaster;
          this.createCompletionChecklist(wfMaster, wfSession);
          this.routesSubject.next(wfSession?.workFlowProgress);
          this.sessionSubject.next(this.currentSession);          
          this.HideLoader();
        },
        error: (err: any) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      })
  }

  updateSequenceNavigation(navType: NavigationType, processId: string) {
    const currentWorkflowStep = this.deepCopy(this.currentSession?.workFlowProgress)?.filter((wf: WorkFlowProgress) =>
      wf.processId === processId)[0];

    if (currentWorkflowStep) {
      this.updateNavigation(currentWorkflowStep, navType);
    }
    return of(null);
  }

  saveWorkflowProgress(navType: NavigationType, sessionld: string, processId: string) {
    const currentWorkflowStep = this.deepCopy(this.currentSession?.workFlowProgress)?.filter((wf: WorkFlowProgress) =>
      wf.processId === processId)[0];

    const completionStatus: WorkflowProcessCompletionStatus = this.deepCopy(this.completionChecklist)
      ?.filter((wf: WorkflowProcessCompletionStatus) =>
        wf.processId === processId
      )[0];

    if (currentWorkflowStep && completionStatus) {
      const navUpdate = {
        navType: navType,
        workflowProgressId: currentWorkflowStep?.workflowProgressId,
        requiredDatapointsCount: completionStatus?.calcualtedTotalCount ?? 0,
        completedDatapointsCount: completionStatus?.completedCount ?? 0
      }

      return this.workflowService.saveWorkflowProgress(navUpdate, sessionld)
      .pipe(
        catchError((err: any) => {
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
          if (!(err?.error ?? false)) {
            this.loggingService.logException(err);
          }
          return of(false);
        })
      );
    }

    return of(false);
  }

  saveNonequenceNavigation(workflowProgressId: string, sessionId: string) {
    return this.workflowService.updateActiveWorkflowStep(workflowProgressId, sessionId)
  }

  updateNonequenceNavigation(currentWorkflow: WorkFlowProgress,) {
    const previousRoute = this.deepCopy(this.currentSession?.workFlowProgress)?.filter((wf: WorkFlowProgress) =>
      wf?.currentFlag == StatusFlag.Yes)[0];
    this.updateRoutes(previousRoute, currentWorkflow);
  }

  updateBasedOnDtAttrChecklist(ajustData: CompletionChecklist[]) {
    const processId = this.actRoute.snapshot.queryParams['pid'];
    const processCompChecklist: WorkflowProcessCompletionStatus = this.deepCopy(this.completionChecklist)
      ?.filter((cs: WorkflowProcessCompletionStatus) => cs.processId === processId)[0];

    let workflowMaster: WorkflowMaster = this.deepCopy(this.currentWorkflowMaster)
      ?.filter((wm: WorkflowMaster) =>
        wm.processId === processId)[0];
    const AdjustAttributes = workflowMaster?.datapointsAdjustment
      ?.filter((adj: DatapointsAdjustment) => adj.adjustmentTypeCode === DataPointType.Ajusted);

    if (processCompChecklist && AdjustAttributes) {
      ajustData?.forEach((data: CompletionChecklist) => {
        const curAdjItem: DatapointsAdjustment = this.deepCopy(AdjustAttributes)?.filter((adt: DatapointsAdjustment) => adt.datapointName === data?.dataPointName)[0];
        const children: DatapointsAdjustment[] = this.deepCopy(AdjustAttributes)?.filter((adt: DatapointsAdjustment) => adt.parentId === curAdjItem?.dataPointAdjustmentId);

        if (curAdjItem && children) {
          children?.forEach(child => {
            if (data?.status == StatusFlag.Yes) {
              if (curAdjItem?.adjustmentOperator === AdjustOperator.Add) {
                this.addChkListItem(processCompChecklist?.completionChecklist, child?.datapointName);
              }
              if (curAdjItem?.adjustmentOperator === AdjustOperator.Remove) {
                const newList = processCompChecklist?.completionChecklist?.filter((chkitem: CompletionChecklist) => chkitem?.dataPointName !== child?.datapointName);
                processCompChecklist.completionChecklist = newList;
              }
            }
            else if (data?.status == StatusFlag.No) {
              if (curAdjItem?.adjustmentOperator === AdjustOperator.Add) {
                const newList = processCompChecklist?.completionChecklist?.filter((chkitem: CompletionChecklist) => chkitem?.dataPointName !== child?.datapointName);
                processCompChecklist.completionChecklist = newList;
              }
              if (curAdjItem?.adjustmentOperator === AdjustOperator.Remove) {
                this.addChkListItem(processCompChecklist?.completionChecklist, child?.datapointName);
              }
            }
          });
        }
      });

      const compStatusIndex = this.completionChecklist.findIndex((chklst: WorkflowProcessCompletionStatus) => chklst.processId === processId);
      if (compStatusIndex != null) {
        this.completionChecklist[compStatusIndex].completionChecklist = processCompChecklist?.completionChecklist;
      }
    }
  }

  updateChecklist(completedDataPoints: CompletionChecklist[], updateCount:boolean = true) {
    const processId = this.actRoute.snapshot.queryParams['pid'];
    if (completedDataPoints) {
      let completionChecklist: WorkflowProcessCompletionStatus = this.deepCopy(this.completionChecklist)
        ?.filter((cs: WorkflowProcessCompletionStatus) => cs.processId === processId)[0];

      if (completionChecklist) {

        completedDataPoints?.forEach((completedDtpoint: CompletionChecklist) => {
          this.updateCompletionStatus(completionChecklist?.completionChecklist, completedDtpoint);
        });

        this.updateWorkflowCompletionStatus(completionChecklist, updateCount);
      }
    }
  }

  resetWorkflowNavigation() {
    const newRoute = this.deepCopy(this.currentSession?.workFlowProgress)[0];
    this.saveNonequenceNavigation(newRoute?.workflowProgressId, this.currentSession.workflowSessionId)
      .subscribe(() => {
        const currentRoute = this.deepCopy(this.currentSession?.workFlowProgress)?.filter((wf: WorkFlowProgress) =>
          wf?.currentFlag == StatusFlag.Yes)[0];
        this.updateRoutes(currentRoute, newRoute);
      });
  }


  /** Private methods **/
  private navigateNext() {
    this.navigationTriggerSubject.next(NavigationType.Next);
  }

  private navigatePrevious() {
    this.navigationTriggerSubject.next(NavigationType.Previous);
  }
  private updateNavigation(currentWorkflow: WorkFlowProgress, navType: NavigationType) {
    const nextWorkflow = this.deepCopy(this.currentSession?.workFlowProgress)?.filter((wf: WorkFlowProgress) =>
      wf.sequenceNbr == (navType == NavigationType.Next ? currentWorkflow?.sequenceNbr + 1 : currentWorkflow?.sequenceNbr - 1))[0];

    if (nextWorkflow) {
      this.updateRoutes(currentWorkflow, nextWorkflow);
    }
  }

  private createCompletionChecklist(workflowMaster: WorkflowMaster[], workflowSession: WorkflowSession) {
    const processCompletionChecklist: WorkflowProcessCompletionStatus[] = [];
    workflowMaster.forEach((wf: WorkflowMaster) => {
      const completionChecklist: CompletionChecklist[] = [];
      wf.datapointsAdjustment.forEach((dtAdjust: DatapointsAdjustment) => {
        if (dtAdjust?.adjustmentTypeCode === DataPointType.Default) {
          const checklistItem: CompletionChecklist = {
            dataPointName: dtAdjust.datapointName,
            status: StatusFlag.No,
          }
          completionChecklist.push(checklistItem);
        }
      });

      const workflowProgress = this.deepCopy(workflowSession.workFlowProgress).filter((wp: WorkFlowProgress) => wp.processId === wf.processId)[0];
      const processCompletion: WorkflowProcessCompletionStatus = {
        processId: wf.processId,
        calcualtedTotalCount: workflowProgress && workflowProgress?.requiredDatapointsCount != 0 ? workflowProgress?.requiredDatapointsCount : wf?.requiredCount,
        completedCount: workflowProgress ? workflowProgress?.completedDatapointsCount : 0,
        completionChecklist: completionChecklist
      };

      processCompletionChecklist.push(processCompletion);
    });
    this.completionChecklist = processCompletionChecklist;
    this.wfProcessCompletionStatusSubject.next(processCompletionChecklist);
    this.workflowReadySubject.next(true);
  }

  private updateRoutes(currentWorkflow: WorkFlowProgress, nextWorkflow: WorkFlowProgress) {
    currentWorkflow.currentFlag = StatusFlag.No;
    currentWorkflow.visitedFlag = StatusFlag.Yes;
    nextWorkflow.currentFlag = StatusFlag.Yes;
    nextWorkflow.visitedFlag = StatusFlag.Yes;

    const currentIndex = this.deepCopy(this.currentSession?.workFlowProgress)?.findIndex((wf: WorkFlowProgress) => wf.workflowProgressId === currentWorkflow.workflowProgressId);
    if (currentIndex !== -1) {
      this.currentSession.workFlowProgress[currentIndex] = currentWorkflow;

      const nextIndex = this.deepCopy(this.currentSession?.workFlowProgress)?.findIndex((wf: WorkFlowProgress) => wf.workflowProgressId === nextWorkflow.workflowProgressId);
      if (nextIndex !== -1) {
        this.currentSession.workFlowProgress[nextIndex] = nextWorkflow;
        this.currentSession = this.currentSession;
        this.routesSubject.next(this.currentSession.workFlowProgress);
      }
    }
  }

  private addChkListItem(checklist: CompletionChecklist[], item: string) {
    const index = this.deepCopy(checklist)?.findIndex((cs: CompletionChecklist) => cs.dataPointName === item);
    if (index === -1) {
      const chkItem = {
        dataPointName: item,
        status: StatusFlag.No
      }

      checklist?.push(chkItem);
    }
  }

  private updateWorkflowCompletionStatus(completionStatus: WorkflowProcessCompletionStatus, updateCount:boolean) {
    if (completionStatus) {
      let currentScreenStatus: WorkflowProcessCompletionStatus = this.deepCopy(this.completionChecklist)?.filter((status: WorkflowProcessCompletionStatus) => status?.processId === completionStatus?.processId)[0];
      let currentScreenStatusIndex = this.deepCopy(this.completionChecklist)?.findIndex((status: WorkflowProcessCompletionStatus) => status?.processId === completionStatus?.processId);
      if (currentScreenStatusIndex !== -1) {
        currentScreenStatus.completedCount = completionStatus?.completionChecklist?.filter(chklist => chklist?.status === StatusFlag.Yes)?.length;
        currentScreenStatus.calcualtedTotalCount = completionStatus?.completionChecklist?.length;
        currentScreenStatus.completionChecklist = completionStatus?.completionChecklist;
        this.completionChecklist[currentScreenStatusIndex] = currentScreenStatus;
        if(updateCount === true){
        this.wfProcessCompletionStatusSubject.next(this.completionChecklist);
        }
      }
    }
  }

  private updateCompletionStatus(completionChecklist: CompletionChecklist[], dataCompleted: CompletionChecklist) {
    const index = this.deepCopy(completionChecklist).findIndex((chklist: any) => chklist.dataPointName === dataCompleted?.dataPointName);
    if (index !== -1) {
      completionChecklist[index] = dataCompleted;
    }
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }


  loadWorkFlowSessionData(sessionId: string): void {
    this.workflowService.loadWorkflowSessionData(sessionId).subscribe({
      next: (ddlsessionDataResponse) => {
        if (ddlsessionDataResponse) {
          const sessionData = JSON.parse(ddlsessionDataResponse?.sessionData);
          if (ddlsessionDataResponse) {
            this.clientId = sessionData?.clientId;
            this.clientCaseId = sessionData?.ClientCaseId;
            this.clientCaseEligibilityId = sessionData?.clientCaseEligibilityId;
          }
        }
        this.sessionDataSubject.next(ddlsessionDataResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
} 
