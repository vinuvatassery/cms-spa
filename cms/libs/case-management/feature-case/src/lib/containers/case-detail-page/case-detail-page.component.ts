/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LovFacade } from '@cms/system-config/domain'
/** External libraries **/
import { DateInputSize, DateInputRounded, DateInputFillMode, } from '@progress/kendo-angular-dateinputs';
import { forkJoin, mergeMap, of, Subscription, tap, first, filter } from 'rxjs';

/** Internal Libraries **/
import { CommunicationEvents, ScreenType, NavigationType, CaseFacade, WorkflowFacade, ButtonType, CaseStatusCode, ContactFacade, WorkflowTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { StatusFlag } from '@cms/shared/ui-common';
@Component({
  selector: 'case-management-case-detail-page',
  templateUrl: './case-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailPageComponent implements OnInit, OnDestroy {

  /**Private properties**/
  @ViewChild('sendNewEmailModalDialog', { read: TemplateRef })
  sendNewEmailModalDialog!: TemplateRef<any>;  
  @ViewChild('sendNewLetterModalDialog', { read: TemplateRef })
  sendNewLetterModalDialog!: TemplateRef<any>;  
  private navigationSubscription !: Subscription;
  private loadSessionSubscription !: Subscription;
  private showSendNewsLetterSubscription !: Subscription;
  private showCancelApplicationSubscription !: Subscription;
  private showSplitButtonSubscription !: Subscription
  private showConfirmationPopupSubscription !: Subscription; public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  isCerForm = false;
  clientCaseId: any;
  clientId: any;
  clientCaseEligibilityId: any;
  clientCaseStatusData: any = {};
  prevClientCaseEligibilityId! : string;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  workflowNavigationEvent = new EventEmitter<string>();
  openedSaveLater = false;
  openedDeleteConfirm = false;
  openedDiscardConfirm = false;
  openedSendNewLetter = false;
  openedPreviewLetter = false;
  openedSaveForLater = false;
  openedSendLetterToPrint = false;
  caseStatuses: [] = [];
  ScreenName = ScreenType.ClientProfile;
  popupClass = 'app-c-split-button';
  isShowSaveLaterPopup = false;
  isShowDeleteConfirmPopup = false;
  isShowDiscardConfirmPopup = false;
  isInnerLeftMenuOpen = false;
  sessionId!: string;
  case$ = this.caseFacade.getCase$;
  showDelete: boolean = true;
  currentStatusCode: string = "";
  isSubmitted: boolean = false;
  sendLetterFlag!: any;
  cancelApplicationFlag!: boolean;
  workflowType! :string
  sendNewEmailModalDialogService : any;
  paperless$ = this.contactFacade.paperless$;
  paperlessFlag!: any;
  data: Array<any> = [
    {
      text: '',
    },
  ];
  public saveForLaterData = [
    {
      buttonType: "btn-h-primary",
      text: "SAVE FOR LATER",
      icon: "save",
      click: (): void => {
        this.onSaveLaterClicked();
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "DISCARD CHANGES",
      icon: "do_disturb_alt",
      click: (): void => {
        this.onDiscardConfirmClicked()
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "DELETE APPLICATION",
      icon: "delete",
      click: (): void => {
        this.onDeleteConfirmClicked()
      },
    },

  ];

  routes$ = this.workflowFacade.routes$;
  completeStaus$ = this.workflowFacade.completionStatus$;
  currentSession = this.workflowFacade.currentSession;
  isWorkflowReady$ = this.workflowFacade.workflowReady$;
  isSaveButtonEnabled$ = this.workflowFacade.isSaveButtonEnabled$;
  showSplitButton$ = this.workflowFacade.showSplitButton$;
  showButton:boolean = true;
  constructor(
    private caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private loaderService: LoaderService,
    private loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly router: Router,
    private lovFacade: LovFacade,
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private readonly contactFacade: ContactFacade,
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadQueryParams();
    this.loadDdlCommonAction();
    this.addNavigationSubscription();
    this.loadCase();
    this.getCase();
    this.addConfirmationPopupSubscription();
    this.loadSessionData();
    this.getCaseStatusLov();
    this.showSendNewsLetterPopup();
    this.addSessionChangeSubscription();
    this.showCancelApplicationPopup();
    this.resetReadOnlyView();
    this.showSplitButtonSubscriptionInitializer();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.showConfirmationPopupSubscription.unsubscribe();
    this.workflowFacade.unloadWorkflowSession();
    this.showSendNewsLetterSubscription.unsubscribe();
    this.showCancelApplicationSubscription.unsubscribe();
    this.showSplitButtonSubscription.unsubscribe();
  }

  addSessionChangeSubscription() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
    ).subscribe(() => {
      const newSessionId = this.route.snapshot.queryParams['sid'];
      if (newSessionId !== this.sessionId) {
        this.workflowFacade.unloadWorkflowSession();
        this.loadQueryParams();
        this.loadCase();
        this.getCase();
        this.loadSessionData();
      }
    });
  }

  showSplitButtonSubscriptionInitializer(){
    this.showSplitButtonSubscription =this.showSplitButtonSubscription = this. showSplitButton$.subscribe((show:boolean)=>{
      this.showButton = show;
    })
  }

  cancelCase() {
    this.loaderService.show()
    this.caseFacade.updateCaseStatus(this.clientCaseId, CaseStatusCode.canceled,this.clientCaseEligibilityId).subscribe({
      next: (response: any) => {
        this.caseFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Case canceled successfully.'
        );
        this.onCloseDeleteConfirmClicked();
        this.loaderService.hide()
        this.router.navigateByUrl(`case-management/cases`);
      },
      error: (error: any) => {
        if (error) {
          this.caseFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loggingService.logException(
            {
              name: SnackBarNotificationType.ERROR,
              message: error
            });
          this.loaderService.hide()
        }
      }
    });
  }
  getCase() {
    this.case$.subscribe((caseData: any) => {
      this.clientCaseId = caseData.clientCaseId;
      if (
        caseData.caseStatusCode === CaseStatusCode.incomplete ||
        caseData.caseStatusCode === CaseStatusCode.review) {
        this.showDelete = true;
      }
      else {
        this.showDelete = false;
      }
    })

  }
  private loadCase() {
    this.workflowFacade.disableSaveButton();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
        this.clientId = JSON.parse(session.sessionData).clientId;
        this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
        this.caseFacade.loadCasesById(this.clientCaseId);
        this.prevClientCaseEligibilityId =  JSON.parse( session.sessionData)?.prevClientCaseEligibilityId
        if (this.prevClientCaseEligibilityId) { this.isCerForm = true; }
        if(this.clientId && this.clientCaseEligibilityId)
        {
        this.loadClientPaperLessStatusHandle();
        }
      });
  }
  hideButton(type: any) {
    if (type === ButtonType.deleteApplication && !this.showDelete) {
      return false;
    }
    else {
      return true;
    }
  }
  cancelDeletion() {
    this.isShowDeleteConfirmPopup = false;
  }
  cancelDiscard() {
    this.isShowDiscardConfirmPopup = false;
  }
  discardChanges() {
    this.isShowDiscardConfirmPopup = false;
    this.workflowFacade.discardChanges(true);
  }
  /** Private Methods */
  private loadQueryParams() {    
    this.workflowType  = this.route.snapshot.queryParams['wtc'];
    const entityId: string = this.route.snapshot.queryParams['eid'];
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkflowSession(this.workflowType, entityId, this.sessionId);
  }

  private loadDdlCommonAction() {
    this.caseFacade.loadDdlCommonActions();
  }

  private addNavigationSubscription() {
    this.navigationSubscription = this.workflowFacade.navigationTrigger$
      .pipe(
        tap(() => this.loaderService.show()),
        mergeMap((navigationType: NavigationType) =>
          forkJoin(
            [
              of(navigationType),
              this.workflowFacade.saveWorkflowProgress(navigationType, this.sessionId, this.route.snapshot.queryParams['pid'])
            ])
        )
      )
      .subscribe({
        next: ([navigationType, Object]) => {
          const paramProcessId: string = this.route.snapshot.queryParams['pid'];
          if (paramProcessId) {
            this.workflowFacade.updateSequenceNavigation(navigationType, paramProcessId);
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
          this.loggingService.logException(err);
        },
      });
  }

  /** Internal event methods **/
  onCloseSaveLaterClicked() {
    this.isShowSaveLaterPopup = false;
  }

  onSaveLaterClicked() {

    this.workflowFacade.saveForLaterValidations(true);
  }

  onCloseDeleteConfirmClicked() {
    this.isShowDeleteConfirmPopup = false;
  }

  onDeleteConfirmClicked() {
    this.isShowDeleteConfirmPopup = true;
  }

  onCloseDiscardConfirmClicked() {
    this.isShowDiscardConfirmPopup = false;
  }

  onDiscardConfirmClicked() {
    this.isShowDiscardConfirmPopup = true;
  }

  onSendNewLetterClicked(template: TemplateRef<unknown>): void {
    this.sendNewEmailModalDialogService = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    }); 
    
    this.isShowSaveLaterPopup = false;
  }
 
 

  /** External event methods **/
  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    if (event === CommunicationEvents.Close) {
      
      this.sendNewEmailModalDialogService.close(true)
    }
    this.router.navigateByUrl(`case-management/cases`);
  }
  public onPaste(): void {
    console.log("Paste");
  }

  public closePreviewLetter() {
    this.openedPreviewLetter = false;
  }

  public openPreviewLetter() {
    this.openedPreviewLetter = true;
    this.openedSendNewLetter = false;
    this.openedSaveForLater = false;
    this.openedSendLetterToPrint = false;
  }

  public closeSaveForLater() {
    this.openedSaveForLater = false;
  }

  public openSaveForLater() {
    this.openedSaveForLater = true;
    this.openedSendNewLetter = false;
  }

  public closeSendLetterToPrint() {
    this.openedSendLetterToPrint = false;
  }

  public openSendLetterToPrint() {
    this.openedSendLetterToPrint = true;
    this.openedSendNewLetter = false;
    this.openedPreviewLetter = false;
  }

  onSaveAndContinueClicked() {
    this.workflowFacade.save(NavigationType.Next);
  }

  applyWorkflowChanges(object: any) {
    this.loaderService.show();
    if (object?.isReset ?? false) {
      this.workflowFacade.resetWorkflowNavigation();
    }
    else if (object?.route?.visitedFlag === StatusFlag.Yes || object?.isReview) {
      this.workflowFacade.saveNonSequenceNavigation(object?.route?.workflowProgressId, this.sessionId ?? '')
        .subscribe(() => {
          this.loaderService.hide();
          this.workflowFacade.updateNonequenceNavigation(object?.route);
        });
    }
  }

  openInnerLeftMenu() {
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }

  private addConfirmationPopupSubscription(): void {
    this.showConfirmationPopupSubscription = this.workflowFacade.saveForLaterConfirmationClicked$.subscribe((val) => {
      if (val) {
        this.isShowSaveLaterPopup = true;
        this.sendLetterFlag = '';
        this.currentStatusCode = '';
        this.isSubmitted = false;
      }
    });
  }

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.getCaseStatusDetails();
          if(JSON.parse(session.sessionData).clientId){
              const activeSession = {
                sessionId : this.sessionId,
                clientCaseId :this.clientCaseId,
                clientId : this.clientId
            };          
            this.caseFacade.createActiveSession(activeSession);
        }
        }
      });
  }

  getCaseStatusDetails() {
    this.loaderService.show();
    this.caseFacade.getCaseStatusById(this.clientCaseId).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        this.clientCaseStatusData = response;
        this.currentStatusCode = response.caseStatusCode
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
      }
    })
  }

  getCaseStatusLov() {
    this.lovFacade.getCaseStatusLovs();
    this.lovFacade.caseStatusType$.subscribe((statusResponse: any) => {

      if (statusResponse.length > 0 && this.workflowType === WorkflowTypeCode.CaseEligibilityReview) {
        this.caseStatuses = statusResponse.filter((x: any) => x.lovCode == CaseStatusCode.incomplete 
          || x.lovCode == CaseStatusCode.disenrolled)
      }
      else if (statusResponse.length > 0) {
        this.caseStatuses = statusResponse.filter((x: any) => x.lovCode == CaseStatusCode.incomplete || x.lovCode == CaseStatusCode.reject)
      }
    })
  }

  onUpdateCaseStatusClicked() {
    this.isSubmitted = true;
    if (this.currentStatusCode != "") {
      this.loaderService.show();
      this.caseFacade.updateCaseStatus(this.clientCaseId, this.currentStatusCode,this.clientCaseEligibilityId).subscribe({
        next: (casesResponse: any) => {
          this.loaderService.hide();
          this.workflowFacade.caseStatus = this.currentStatusCode;
          if (this.sendLetterFlag == StatusFlag.Yes) {
            this.workflowFacade.sendLetterEmailFlag = this.sendLetterFlag;
            this.workflowFacade.saveForLater(true);
          }
          else {
            this.workflowFacade.sendLetterEmailFlag = this.sendLetterFlag;
            this.workflowFacade.saveForLater(false);
          }
          this.isShowSaveLaterPopup = false;
          this.cdr.detectChanges()
          this.caseFacade.loadActiveSession();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.caseFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        }
      })
    }
  }

  showSendNewsLetterPopup() {
    this.showSendNewsLetterSubscription = this.workflowFacade.sendEmailLetterClicked$.subscribe((response: any) => {
      if (response) {
        if(this.paperlessFlag == 'Y'){
          this.onSendNewLetterClicked(this.sendNewEmailModalDialog);
        }else{
          this.onSendNewLetterClicked(this.sendNewLetterModalDialog);
        }        
        this.cdr.detectChanges();
      }
    })
  }

  showCancelApplicationPopup(){
    this.showCancelApplicationSubscription = this.workflowFacade.cancelApplicationClicked$.subscribe((response: any) => {
      if (response) {
        this.cancelApplicationFlag=true;
        this.cdr.detectChanges();
      }
    })
  }

  closeCancelApplicationPopup(){
    this.cancelApplicationFlag=false;
    this.cdr.detectChanges();
  }

  onContinueClick(){
    this.closeCancelApplicationPopup();
    this.workflowFacade.showSaveForLaterConfirmationPopup(true);
  }

  resetReadOnlyView(){
    this.caseFacade.setCaseReadOnly(false);
  }

  loadClientPaperLessStatusHandle(): void {
    this.contactFacade.loadClientPaperLessStatus(
      this.clientId,
      this.clientCaseEligibilityId
    );
    this.loadPeperLessStatus();
  }
  
  loadPeperLessStatus() {    
    this.paperless$
      ?.pipe(first((emailData: any) => emailData?.paperlessFlag != null))
      .subscribe((emailData: any) => {
        if (emailData?.paperlessFlag) {
          this.paperlessFlag = emailData?.paperlessFlag;
        }
      });
  }
}
