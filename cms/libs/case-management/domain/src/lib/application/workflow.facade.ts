/** Angular **/
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  mergeMap,
  of,
  Subject,
} from 'rxjs';
/** Entities **/
import {
  DatapointsAdjustment,
  WorkFlowProgress,
  WorkflowMaster,
  WorkflowSession,
} from '../entities/workflow';
import {
  CompletionChecklist,
  WorkflowProcessCompletionStatus,
} from '../entities/workflow-stage-completion-status';
import { AdjustOperator } from '../enums/adjustment-operator.enum';
import { DataPointType } from '../enums/data-point-type.enum';
import { EntityTypeCode } from '../enums/entity-type-code.enum';
/** Enums **/
import { NavigationType } from '../enums/navigation-type.enum';
import { WorkflowTypeCode } from '../enums/workflow-type.enum';
/** Services **/
import { WorkflowDataService } from '../infrastructure/workflow.data.service';

import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SessionData } from '../entities/session-data';
import { StatusFlag } from '@cms/shared/ui-common';

@Injectable({
  providedIn: 'root',
})
export class WorkflowFacade {
  /** Private properties **/
  private saveAndContinueClickedSubject = new Subject<NavigationType>();
  private navigationTriggerSubject = new Subject<NavigationType>();
  private wfProcessCompletionStatusSubject = new BehaviorSubject<
    WorkflowProcessCompletionStatus[]
  >([]);
  private routesSubject = new BehaviorSubject<any>([]);
  private routesDataSubject = new Subject<any>();
  private sessionSubject = new BehaviorSubject<any>([]);
  private sessionDataSubject = new Subject<any>();
  private workflowReadySubject = new Subject<boolean>();
  private saveForLaterClickedSubject = new Subject<boolean>();
  private saveForLaterValidationSubject = new Subject<boolean>();
  private saveForLaterConfirmationSubject = new Subject<boolean>();
  private sendEmailLetterSubject = new Subject<boolean>();
  private isSaveButtonEnabledSubject = new Subject<boolean>();
  private discardChangesClickedSubject = new Subject<boolean>();
  private cancelApplicationClickedSubject = new Subject<boolean>();
  /** Public properties **/
  showSplitButtonSubject = new Subject<boolean>();
  saveAndContinueClicked$ = this.saveAndContinueClickedSubject.asObservable();
  navigationTrigger$ = this.navigationTriggerSubject.asObservable();
  routes$ = this.routesSubject.asObservable();
  routesData$ = this.routesDataSubject.asObservable();
  completionStatus$ = this.wfProcessCompletionStatusSubject.asObservable();
  sessionSubject$ = this.sessionSubject.asObservable();
  sessionDataSubject$ = this.sessionDataSubject.asObservable();
  workflowReady$ = this.workflowReadySubject.asObservable();
  isSaveButtonEnabled$ = this.isSaveButtonEnabledSubject.asObservable();

  saveForLaterClicked$ = this.saveForLaterClickedSubject.asObservable();
  saveForLaterValidationClicked$ =
    this.saveForLaterValidationSubject.asObservable();
  saveForLaterConfirmationClicked$ =
    this.saveForLaterConfirmationSubject.asObservable();
  sendEmailLetterClicked$ = this.sendEmailLetterSubject.asObservable();
  discardChangesClicked$ = this.discardChangesClickedSubject.asObservable();
  cancelApplicationClicked$ =
    this.cancelApplicationClickedSubject.asObservable();
  showSplitButton$ = this.showSplitButtonSubject.asObservable();
  clientId: number | undefined;
  clientCaseId: string | undefined;
  clientCaseEligibilityId: string | undefined;

  completionChecklist!: WorkflowProcessCompletionStatus[];
  currentSession!: WorkflowSession;
  currentWorkflowMaster!: WorkflowMaster[];
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  sessionData!: SessionData;
  sendLetterEmailFlag!:string;
  caseStatus!:string;

  /**Constructor */
  constructor(
    private readonly workflowService: WorkflowDataService,
    private readonly router: Router,
    private readonly actRoute: ActivatedRoute,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  /** Public methods **/
  save(navigationType: NavigationType) {
    this.saveAndContinueClickedSubject.next(navigationType);
  }

  saveForLater(data: boolean) {
    this.saveForLaterClickedSubject.next(data);
  }

  saveForLaterValidations(validation: boolean) {
    this.saveForLaterValidationSubject.next(validation);
  }

  showSaveForLaterConfirmationPopup(showHide: boolean) {
    this.saveForLaterConfirmationSubject.next(showHide);
  }

  showSendEmailLetterPopup(showHideValue: boolean) {
    this.sendEmailLetterSubject.next(showHideValue);
  }

  showCancelApplicationPopup(showHideValue: boolean) {
    this.cancelApplicationClickedSubject.next(showHideValue);
  }

  discardChanges(data: boolean) {
    this.discardChangesClickedSubject.next(data);
  }

  navigate(navigationType: NavigationType) {
    if (navigationType === NavigationType.Next) {
      this.navigateNext();
    } else if (navigationType === NavigationType.Previous) {
      this.navigatePrevious();
    }
  }

  createNewSession(newCaseFormData?: any, cerSessionData?: any) {
    this.showLoader();
    let successMessage = '';
    let navigationPath = '';

    if (newCaseFormData) {
      this.sessionData = {
        entityId: newCaseFormData?.controls['programId'].value,
        EntityTypeCode: EntityTypeCode.Program,
        workflowTypeCode: WorkflowTypeCode.NewCase,
        assignedCwUserId: newCaseFormData?.controls['caseOwnerId'].value,
        caseOriginCode: newCaseFormData?.controls['caseOriginCode'].value,
        caseStartDate: this.intl.formatDate(
          newCaseFormData?.controls['applicationDate'].value,
          this.dateFormat
        ),
        clientCaseEligibilityId: null,
      };
      successMessage = 'New Session Created Successfully';
      navigationPath = 'case-detail';
    } else {
      this.sessionData = {
        entityId: '00000000-0000-0000-0000-000000000000',
        EntityTypeCode: EntityTypeCode.Program,
        workflowTypeCode: WorkflowTypeCode.CaseEligibilityReview,
        assignedCwUserId: '00000000-0000-0000-0000-000000000000',
        caseOriginCode: '00000000-0000-0000-0000-000000000000',
        caseStartDate: this.intl.formatDate(new Date(), this.dateFormat),
        clientCaseEligibilityId: cerSessionData?.clientCaseEligibilityId,
      };
      successMessage = 'New CER Session Created Successfully';
      navigationPath = 'cer-case-detail';
    }

    this.workflowService.createNewSession(this.sessionData).subscribe({
      next: (sessionResp: any) => {
        if(sessionResp?.statusCode === "ACCEPT")
        {
          this.showHideSnackBar(SnackBarNotificationType.WARNING, "CER Complete");
        }
        else
        {
            if (sessionResp && sessionResp?.workflowSessionId) {
              this.router.navigate(['case-management/' + navigationPath], {
                queryParams: {
                  sid: sessionResp?.workflowSessionId,
                  eid: sessionResp?.sessionData?.entityID,
                  wtc: sessionResp?.workflowTypeCode,
                },
              });
            }
            if (!sessionResp?.sessionData?.prevClientCaseEligibilityId) {
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS, successMessage);
            }
      }
        this.hideLoader();
      },
      error: (err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadWorkflowSession(type: string, entityId: string, sessionId: string) {
    this.workflowReadySubject.next(false);
    this.showLoader();
    this.workflowService
      .loadWorkflowMaster(entityId, EntityTypeCode.Program, type)
      .pipe(
        mergeMap((wfMaster: any) =>
          forkJoin([of(wfMaster), this.workflowService.loadWorkflow(sessionId)])
        )
      )
      .subscribe({
        next: ([wfMaster, wfSession]: [WorkflowMaster[], WorkflowSession]) => {
          this.currentSession = wfSession;
          this.currentWorkflowMaster = wfMaster;
          this.createCompletionChecklist(wfMaster, wfSession);
          this.routesSubject.next(wfSession?.workFlowProgress);
          this.sessionSubject.next(this.currentSession);
          this.hideLoader();
        },
        error: (err: any) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }


  loadWorkFlowMaster(sessionId : string) {

    this.showLoader();
    this.workflowService
      .loadWorkflow(sessionId)
      .subscribe({
        next: (session) => {
          this.routesDataSubject.next(session?.workFlowProgress);
                   this.hideLoader();
        },
        error: (err: any) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  updateSequenceNavigation(navType: NavigationType, processId: string) {
    const currentWorkflowStep = this.deepCopy(
      this.currentSession?.workFlowProgress
    )?.filter((wf: WorkFlowProgress) => wf.processId === processId)[0];

    if (currentWorkflowStep) {
      this.updateNavigation(currentWorkflowStep, navType);
    }
    return of(null);
  }

  saveWorkflowProgress(
    navType: NavigationType,
    sessionld: string,
    processId: string
  ) {
    const currentWorkflowStep = this.deepCopy(
      this.currentSession?.workFlowProgress
    )?.filter((wf: WorkFlowProgress) => wf.processId === processId)[0];

    const completionStatus: WorkflowProcessCompletionStatus = this.deepCopy(
      this.completionChecklist
    )?.filter(
      (wf: WorkflowProcessCompletionStatus) => wf.processId === processId
    )[0];

    if (currentWorkflowStep && completionStatus) {
      const navUpdate = {
        navType: navType,
        workflowProgressId: currentWorkflowStep?.workflowProgressId,
        requiredDatapointsCount: completionStatus?.calculatedTotalCount ?? 0,
        completedDatapointsCount: completionStatus?.completedCount ?? 0,
      };

      return this.workflowService
        .saveWorkflowProgress(navUpdate, sessionld)
        .pipe(
          catchError((err: any) => {
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.ERROR,
              err
            );
            if (!(err?.error ?? false)) {
              this.loggingService.logException(err);
            }
            return of(false);
          })
        );
    }

    return of(false);
  }

  saveNonSequenceNavigation(workflowProgressId: string, sessionId: string) {
    return this.workflowService.updateActiveWorkflowStep(
      workflowProgressId,
      sessionId
    );
  }

  updateNonequenceNavigation(currentWorkflow: WorkFlowProgress) {
    let previousRoute = this.deepCopy(
      this.currentSession?.workFlowProgress
    )?.filter((wf: WorkFlowProgress) => wf?.currentFlag == StatusFlag.Yes)[0];

    if(!previousRoute){
      const processId = this.actRoute.snapshot.queryParams['pid'];
      previousRoute = this.deepCopy(
          this.currentSession?.workFlowProgress
        )?.find((wf: WorkFlowProgress) => wf?.processId == processId)
    }

    this.updateRoutes(previousRoute, currentWorkflow);
  }

  updateBasedOnDtAttrChecklist(ajustData: CompletionChecklist[]) {
    const processId = this.actRoute.snapshot.queryParams['pid'];
    const processCompChecklist: WorkflowProcessCompletionStatus = this.deepCopy(
      this.completionChecklist
    )?.filter(
      (cs: WorkflowProcessCompletionStatus) => cs.processId === processId
    )[0];

    let workflowMaster: WorkflowMaster = this.deepCopy(
      this.currentWorkflowMaster
    )?.filter((wm: WorkflowMaster) => wm.processId === processId)[0];
    const AdjustAttributes = workflowMaster?.datapointsAdjustment?.filter(
      (adj: DatapointsAdjustment) =>
        adj.adjustmentTypeCode === DataPointType.Ajusted
    );

    const isChecklistUpdateRequired = processCompChecklist && AdjustAttributes;
    if (!isChecklistUpdateRequired) return;
    ajustData?.forEach((data: CompletionChecklist) => {
      const curAdjItem: DatapointsAdjustment = this.deepCopy(
        AdjustAttributes
      )?.filter(
        (adt: DatapointsAdjustment) => adt.datapointName === data?.dataPointName
      )[0];
      const children: DatapointsAdjustment[] = this.deepCopy(
        AdjustAttributes
      )?.filter(
        (adt: DatapointsAdjustment) =>
          adt.parentId === curAdjItem?.dataPointAdjustmentId
      );

      if (curAdjItem && children) {
        children?.forEach((child) => {
          const isYesStatus = data?.status === StatusFlag.Yes;
          const isAddOperator =
            curAdjItem?.adjustmentOperator === AdjustOperator.Add;
          const isRemoveOperator =
            curAdjItem?.adjustmentOperator === AdjustOperator.Remove;
          this.updateAdjItem(
            processCompChecklist,
            child?.datapointName,
            isYesStatus,
            isAddOperator,
            isRemoveOperator
          );
        });
      }
    });

    const compStatusIndex = this.completionChecklist.findIndex(
      (chklst: WorkflowProcessCompletionStatus) =>
        chklst.processId === processId
    );
    if (compStatusIndex != -1) {
      this.completionChecklist[compStatusIndex].completionChecklist =
        processCompChecklist?.completionChecklist;
    }
  }

  private updateAdjItem(
    processCompChecklist: WorkflowProcessCompletionStatus,
    datapointName: string,
    isYesStatus: boolean,
    isAddOperator: boolean,
    isRemoveOperator: boolean
  ) {
    if (isYesStatus) {
      if (isAddOperator) {
        this.addChkListItem(
          processCompChecklist?.completionChecklist,
          datapointName
        );
      }
      if (isRemoveOperator) {
        const newList = processCompChecklist?.completionChecklist?.filter(
          (chkitem: CompletionChecklist) =>
            chkitem?.dataPointName !== datapointName
        );
        processCompChecklist.completionChecklist = newList;
      }
    } else if (!isYesStatus) {
      if (isAddOperator) {
        const newList = processCompChecklist?.completionChecklist?.filter(
          (chkitem: CompletionChecklist) =>
            chkitem?.dataPointName !== datapointName
        );
        processCompChecklist.completionChecklist = newList;
      }
      if (isRemoveOperator) {
        this.addChkListItem(
          processCompChecklist?.completionChecklist,
          datapointName
        );
      }
    }
  }

  updateChecklist(
    completedDataPoints: CompletionChecklist[],
    updateCount: boolean = true
  ) {
    const processId = this.actRoute.snapshot.queryParams['pid'];
    if (completedDataPoints) {
      let completionChecklist: WorkflowProcessCompletionStatus = this.deepCopy(
        this.completionChecklist
      )?.filter(
        (cs: WorkflowProcessCompletionStatus) => cs.processId === processId
      )[0];

      if (completionChecklist) {
        completedDataPoints?.forEach(
          (completedDtpoint: CompletionChecklist) => {
            this.updateCompletionStatus(
              completionChecklist?.completionChecklist,
              completedDtpoint
            );
          }
        );

        this.updateWorkflowCompletionStatus(completionChecklist, updateCount);
      }
    }
  }

  replaceChecklist(checklist: CompletionChecklist[]) {
    if (checklist) {
      const processId = this.actRoute.snapshot.queryParams['pid'];
      let completionChecklist: WorkflowProcessCompletionStatus = this.deepCopy(
        this.completionChecklist
      )?.filter(
        (cs: WorkflowProcessCompletionStatus) => cs.processId === processId
      )[0];
      if (completionChecklist) {
        completionChecklist.completionChecklist = checklist;
      }

      this.updateWorkflowCompletionStatus(completionChecklist, true);
    }
  }

  addDynamicDataPoints(checklist: CompletionChecklist[]) {
    if (checklist) {
      const processId = this.actRoute.snapshot.queryParams['pid'];
      const completionChecklist: CompletionChecklist[] | undefined = this.completionChecklist?.find((cs: WorkflowProcessCompletionStatus) => cs.processId === processId)?.completionChecklist;
      if (completionChecklist) {
        checklist.forEach((chk: any) => {
          const isNotExist = completionChecklist.findIndex((i: any) => i.dataPointName === chk.dataPointName) === -1;
          if (isNotExist) {
            completionChecklist.push(chk);
          }

          this.addChkListItem(completionChecklist, chk.dataPointName);
        });
      }
    }
  }

  removeDynamicDataPoints(checklist: CompletionChecklist[]) {
    if (checklist) {
      const processId = this.actRoute.snapshot.queryParams['pid'];
      const completionChecklist: CompletionChecklist[] | undefined = this.completionChecklist?.find((cs: WorkflowProcessCompletionStatus) => cs.processId === processId)?.completionChecklist;
      if (completionChecklist) {
        checklist.forEach((chk: any) => {
          const index = completionChecklist.findIndex((i: any) => i.dataPointName === chk.dataPointName);
          if (index !== -1) {
            completionChecklist.splice(index, 1);
          }
        });
      }
    }
  }

  resetWorkflowNavigation() {
    const newRoute = this.deepCopy(this.currentSession?.workFlowProgress)[0];
    this.saveNonSequenceNavigation(
      newRoute?.workflowProgressId,
      this.currentSession.workflowSessionId
    ).subscribe(() => {
      const currentRoute = this.deepCopy(
        this.currentSession?.workFlowProgress
      )?.filter((wf: WorkFlowProgress) => wf?.currentFlag == StatusFlag.Yes)[0];
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
  private updateNavigation(
    currentWorkflow: WorkFlowProgress,
    navType: NavigationType
  ) {
    const nextWorkflow = this.deepCopy(
      this.currentSession?.workFlowProgress
    )?.filter(
      (wf: WorkFlowProgress) =>
        wf.sequenceNbr ==
        (navType == NavigationType.Next
          ? currentWorkflow?.sequenceNbr + 1
          : currentWorkflow?.sequenceNbr - 1)
    )[0];

    if (nextWorkflow) {
      this.updateRoutes(currentWorkflow, nextWorkflow);
    }
  }

  private createCompletionChecklist(
    workflowMaster: WorkflowMaster[],
    workflowSession: WorkflowSession
  ) {
    const processCompletionChecklist: WorkflowProcessCompletionStatus[] = [];
    workflowMaster.forEach((wf: WorkflowMaster) => {
      const completionChecklist: CompletionChecklist[] = [];
      wf.datapointsAdjustment.forEach((dtAdjust: DatapointsAdjustment) => {
        if (dtAdjust?.adjustmentTypeCode === DataPointType.Default) {
          const checklistItem: CompletionChecklist = {
            dataPointName: dtAdjust.datapointName,
            status: StatusFlag.No,
          };
          completionChecklist.push(checklistItem);
        }
      });

      const workflowProgress = this.deepCopy(
        workflowSession.workFlowProgress
      ).filter((wp: WorkFlowProgress) => wp.processId === wf.processId)[0];
      let totalCount = 0;
      if (workflowProgress && workflowProgress?.requiredDatapointsCount != 0) {
        totalCount = workflowProgress?.requiredDatapointsCount;
      } else {
        totalCount = wf?.requiredCount === 0 ? 1 : wf?.requiredCount;
      }

      const processCompletion: WorkflowProcessCompletionStatus = {
        processId: wf.processId,
        calculatedTotalCount: totalCount,
        completedCount: workflowProgress
          ? workflowProgress?.completedDatapointsCount
          : 0,
        completionChecklist: completionChecklist,
      };

      if (workflowProgress?.title === 'Case Details') {
        processCompletion.calculatedTotalCount =
          completionChecklist?.length ?? 0;
        processCompletion.completedCount = completionChecklist?.length ?? 0;
      }

      processCompletionChecklist.push(processCompletion);
    });
    this.completionChecklist = processCompletionChecklist;
    this.wfProcessCompletionStatusSubject.next(processCompletionChecklist);
    this.workflowReadySubject.next(true);
  }

  private updateRoutes(
    currentWorkflow: WorkFlowProgress,
    nextWorkflow: WorkFlowProgress
  ) {
    currentWorkflow.currentFlag = StatusFlag.No;
    currentWorkflow.visitedFlag = StatusFlag.Yes;
    nextWorkflow.currentFlag = StatusFlag.Yes;
    nextWorkflow.visitedFlag = StatusFlag.Yes;

    const completionCount = this.deepCopy(this.completionChecklist)?.filter(
      (checklist: WorkflowProcessCompletionStatus) =>
        checklist.processId === currentWorkflow.processId
    )[0];
    if (completionCount) {
      if (completionCount?.calculatedTotalCount === 0) {
        currentWorkflow.completedDatapointsCount = 1;
        currentWorkflow.requiredDatapointsCount = 1;
      } else {
        currentWorkflow.completedDatapointsCount =
          completionCount?.completedCount;
        currentWorkflow.requiredDatapointsCount =
          completionCount?.calculatedTotalCount;
      }
    }

    const currentIndex = this.deepCopy(
      this.currentSession?.workFlowProgress
    )?.findIndex(
      (wf: WorkFlowProgress) =>
        wf.workflowProgressId === currentWorkflow.workflowProgressId
    );
    if (currentIndex !== -1) {
      this.currentSession.workFlowProgress[currentIndex] = currentWorkflow;

      const nextIndex = this.deepCopy(
        this.currentSession?.workFlowProgress
      )?.findIndex(
        (wf: WorkFlowProgress) =>
          wf.workflowProgressId === nextWorkflow.workflowProgressId
      );
      if (nextIndex !== -1) {
        this.currentSession.workFlowProgress[nextIndex] = nextWorkflow;
        this.routesSubject.next(this.currentSession.workFlowProgress);
      }
    }
  }

  private addChkListItem(checklist: CompletionChecklist[], item: string) {
    const index = this.deepCopy(checklist)?.findIndex(
      (cs: CompletionChecklist) => cs.dataPointName === item
    );
    if (index === -1) {
      const chkItem = {
        dataPointName: item,
        status: StatusFlag.No,
      };

      checklist?.push(chkItem);
    }
  }

  private updateWorkflowCompletionStatus(
    completionStatus: WorkflowProcessCompletionStatus,
    updateCount: boolean
  ) {
    if (completionStatus) {
      let currentScreenStatus: WorkflowProcessCompletionStatus = this.deepCopy(
        this.completionChecklist
      )?.filter(
        (status: WorkflowProcessCompletionStatus) =>
          status?.processId === completionStatus?.processId
      )[0];
      let currentScreenStatusIndex = this.deepCopy(
        this.completionChecklist
      )?.findIndex(
        (status: WorkflowProcessCompletionStatus) =>
          status?.processId === completionStatus?.processId
      );
      if (currentScreenStatusIndex !== -1) {
        currentScreenStatus.completedCount =
          completionStatus?.completionChecklist?.filter(
            (chklist) => chklist?.status === StatusFlag.Yes
          )?.length;
        currentScreenStatus.calculatedTotalCount =
          completionStatus?.completionChecklist?.length;
        currentScreenStatus.completionChecklist =
          completionStatus?.completionChecklist;
        this.completionChecklist[currentScreenStatusIndex] =
          currentScreenStatus;
        if (updateCount === true) {
          this.wfProcessCompletionStatusSubject.next(this.completionChecklist);
        }
      }
    }
  }

  private updateCompletionStatus(
    completionChecklist: CompletionChecklist[],
    dataCompleted: CompletionChecklist
  ) {
    const index = this.deepCopy(completionChecklist).findIndex(
      (chklist: any) => chklist.dataPointName === dataCompleted?.dataPointName
    );
    if (index !== -1) {
      completionChecklist[index] = dataCompleted;
    }
  }

  deepCopy(data: any): any {
    return JSON.parse(JSON.stringify(data === undefined ? null : data));
  }

  loadWorkFlowSessionData(sessionId: string): void {
    this.showLoader();
    this.workflowService.loadWorkflowSessionData(sessionId).subscribe({
      next: (sessionResponse) => {
        if (sessionResponse) {
          const sessionData = {
            clientId: JSON.parse(sessionResponse?.sessionData).ClientId,
            ClientCaseId: JSON.parse(sessionResponse?.sessionData).ClientCaseId,
            clientCaseEligibilityId: JSON.parse(sessionResponse?.sessionData)
              .ClientCaseEligibilityId,
            entityID: JSON.parse(sessionResponse?.sessionData).EntityID,
            EntityTypeCode: JSON.parse(sessionResponse?.sessionData)
              .EntityTypeCode,
            prevClientCaseEligibilityId: JSON.parse(sessionResponse?.sessionData)?.PrevClientCaseEligibilityId
          };
          const workflowResponseData = {
            sessionData: JSON.stringify(sessionData),
            workFlowProgress: sessionResponse?.workFlowProgress,
            workflowId: sessionResponse?.workflowId,
            workflowSessionId: sessionResponse?.workflowSessionId,
            workflow: sessionResponse?.workFlow,
          };

          this.clientId = sessionData?.clientId;
          this.clientCaseId = sessionData?.ClientCaseId;
          this.clientCaseEligibilityId = sessionData?.clientCaseEligibilityId;
          this.sessionDataSubject.next(workflowResponseData);
        }

        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  unloadWorkflowSession() {
    this.routesSubject.next([]);
    this.wfProcessCompletionStatusSubject.next([]);
  }

  enableSaveButton() {
    this.isSaveButtonEnabledSubject.next(true);
  }

  disableSaveButton() {
    this.isSaveButtonEnabledSubject.next(false);
  }

  handleSendNewsLetterpopup(showHideValue: boolean) {
    if (showHideValue) {
      this.showSendEmailLetterPopup(true);
    } else {
      this.router.navigate([`/case-management/cases/case360/${this.clientId}`]);
    }
  }
}
