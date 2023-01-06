/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy, EventEmitter, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/** External libraries **/
import { DateInputSize, DateInputRounded, DateInputFillMode, } from '@progress/kendo-angular-dateinputs';
import { forkJoin, mergeMap, of, Subscription, tap,first } from 'rxjs';

/** Internal Libraries **/
import { CommunicationEvents, ScreenType, NavigationType, CaseFacade, WorkflowFacade, WorkflowTypeCode, StatusFlag, ButtonType,CaseStatusCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Router } from '@angular/router';





@Component({
  selector: 'case-management-case-detail-page',
  templateUrl: './case-detail-page.component.html',
  styleUrls: ['./case-detail-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseDetailPageComponent implements OnInit {

  /**Private properties**/
  private navigationSubscription !: Subscription;
  private loadSessionSubscription !:Subscription;
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';

  public formUiStyle: UIFormStyle = new UIFormStyle();
  workflowNavigationEvent = new EventEmitter<string>();
  openedSaveLater = false;
  openedDeleteConfirm = false;
  openedDiscardConfirm = false;
  openedSendNewLetter = false;
  openedPreviewLetter = false;
  openedSaveForLater = false;
  openedSendLetterToPrint = false;
  ddlCommonActions$ = this.caseFacade.ddlCommonActions$;
  ScreenName = ScreenType.CaseDetailPage;
  popupClass = 'app-c-split-button';
  isShowSaveLaterPopup = false;
  isShowDeleteConfirmPopup = false;
  isShowDiscardConfirmPopup = false;
  isShowSendNewLetterPopup = false;
  isInnerLeftMenuOpen = false;
  sessionId!: string;
  clientCaseId:any;
  case$ = this.caseFacade.getCase$;
  showDelete:boolean=true;
  data: Array<any> = [
    {
      text: '',
    },
  ];
  public saveForLaterData = [
    {
      buttonType: "btn-h-primary",
      text: "Save For Later",
      icon: "save",
      click: (): void => {
        this.onSaveLaterClicked();
      },
    },
    {
      buttonType: "btn-h-primary",
      text: "Discard Changes",
      icon: "do_disturb_alt",
      click: (): void => {
        this.onDiscardConfirmClicked()
      },
    },
    {
      buttonType: "btn-h-danger",
      text: "Delete Application",
      icon: "delete",
      click: (): void => {
        this.onDeleteConfirmClicked()
      },
    },

  ];

  routes$ = this.workflowFacade.routes$;
  completeStaus$ = this.workflowFacade.completionStatus$;
  currentSession = this.workflowFacade.currentSession
  constructor(
    private caseFacade: CaseFacade,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private loaderService: LoaderService,
    private loggingService : LoggingService,
    private readonly snackbarService : NotificationSnackbarService,
    private router: Router
  ) {
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.loadQueryParams();
    this.loadDdlCommonAction();
    this.addNavigationSubscription();
    this.loadCase();   
    this.getCase();
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }
  cancelClientCase(){
    this.loaderService.show()    
    this.caseFacade.cancelCase(this.clientCaseId) .subscribe(
      (response: any) => {
        this.caseFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'client case canceled successfully.'
        ); 
        this.onCloseDeleteConfirmClicked();  
        this.loaderService.hide() 
        this.router.navigateByUrl(`dashboard`); 
      },
      (error: any) => {
        if (error) {
          this.caseFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          this.loggingService.logException(
            {
              name:SnackBarNotificationType.ERROR,
              message:error
            });
          this.loaderService.hide()    
        }
      }
    );
  }
  getCase(){ 
    this.case$.subscribe((caseData:any)=>{ 
      this.clientCaseId = caseData.clientCaseId;
      if(caseData.caseStatusCode ===CaseStatusCode.NEW || 
        caseData.caseStatusCode === CaseStatusCode.INCOMPLETE || 
        caseData.caseStatusCode === CaseStatusCode.REVIEW){
        this.showDelete = true;
      }
      else{
        this.showDelete = false;
      }
    })
     
  }
  private loadCase()
  {     
   this.sessionId = this.route.snapshot.queryParams['sid'];    
   this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription =this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
    .subscribe((session: any) => {      
     this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId     
     this.caseFacade.loadCasesById(this.clientCaseId);      
    });        
  } 
  hideButton(type:any){
    if(type===ButtonType.DELETE_APPLICATION &&  !this.showDelete){
    return false;
    }
    else {
      return true;
    }
  }
  cancelDeletion(){
    this.isShowDeleteConfirmPopup = false;
  }
  cancelDiscard(){
    this.isShowDiscardConfirmPopup = false;
  }
  discardChanges(){
    this.isShowDiscardConfirmPopup = false;
    this.router.navigateByUrl(`case-management/cases/case360/${this.clientCaseId}`); 
  }
  /** Private Methods */
  private loadQueryParams() {
    const workflowType: string = WorkflowTypeCode.NewCase;
    const entityId: string = this.route.snapshot.queryParams['eid'];
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkflowSession(workflowType, entityId, this.sessionId);
  }

  private loadDdlCommonAction() {
    this.caseFacade.loadDdlCommonActions();
  }

  private addNavigationSubscription() {
    this.navigationSubscription = this.workflowFacade.navigationTrigger$
      .pipe(
        tap(()=> this.loaderService.show()),
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
    this.isShowSaveLaterPopup = true;
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

  onSendNewLetterClicked() {
    this.isShowSendNewLetterPopup = true;
    this.isShowSaveLaterPopup = false;
  }

  /** External event methods **/
  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    if (event === CommunicationEvents.Close) {
      this.isShowSendNewLetterPopup = false;
    }
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
      this.loaderService.hide();
    }
    else if (object?.route?.visitedFlag === StatusFlag.Yes || object?.isReview) {
      this.workflowFacade.saveNonequenceNavigation(object?.route?.workflowProgressId, this.sessionId ?? '')
        .subscribe(() => {
          this.loaderService.hide();
          this.workflowFacade.updateNonequenceNavigation(object?.route);
        });
    }
  }

  openInnerLeftMenu() {
    this.isInnerLeftMenuOpen = !this.isInnerLeftMenuOpen
  }
}
