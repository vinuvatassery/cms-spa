/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';

@Component({
  selector: 'case-management-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent implements OnInit, OnDestroy {
  /** Input properties **/
  @Input() data!: any;
  @Input() ddlEmails$!: Observable<any>;

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() cerEmailContentEvent = new EventEmitter<any>(); 
  @Output() emailEditorValueEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();

  /** Public properties **/
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any = [];
  emailContentValue: any;
  isOpenSendEmailClicked!: boolean;
  isOpenDdlEmailDetails = false;
  isShowSaveForLaterPopupClicked = false;
  isShowPreviewEmailPopupClicked = false;
  isShowSendEmailConfirmationPopupClicked = false;
  isShowToEmailLoader$ = new BehaviorSubject<boolean>(false);
  emailSubscription$ = new Subscription();
  formUiStyle: UIFormStyle = new UIFormStyle();
  isClearEmails=false;
  selectedTemplate!: any;
  templateData:any = [];
  templateName: any = [];
  currentEmailData:any;
  showEmailPreview: boolean = false;
  previewEmailContent!: any;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  cerAuthorizationEmailTypeCode!: string;
  /** Private properties **/
  private currentSessionSubscription !: Subscription;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateOpenSendEmailFlag();
    this.loadDdlEmails();
    this.loadEmailTemplates();
  }

  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
  }

  private loadCurrentSession() {
    const sessionId = this.route.snapshot.queryParams['sid'];
    this.loaderService.show();
    this.workflowFacade.loadWorkFlowSessionData(sessionId);
    this.currentSessionSubscription = this.workflowFacade.sessionDataSubject$.subscribe((resp) => {
      if (resp) {
        this.prevClientCaseEligibilityId = JSON.parse(resp.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true;
        }
        this.loaderService.hide();
      }
    });
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;    
        this.loggingService.logException(err)
      }  
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();   
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  private updateOpenSendEmailFlag() {
    if (this.data) {
      this.isOpenSendEmailClicked = true;
    } else {
      this.isOpenSendEmailClicked = false;
    }
  }

  private loadDdlLetterTemplates() {
    this.communicationFacade.loadDdlLetterTemplates();
    this.ddlLetterTemplates$.subscribe({
      next: (ddlTemplates) => {
        this.ddlTemplates = ddlTemplates.filter((templates: any) => {
          return templates.screenName === this.data;
        });
      },
      error: (err) => {
        console.log('err', err);
      },
    });
  }

  private loadEmailTemplates() {
    this.loaderService.show();
    this.cerAuthorizationEmailTypeCode = 'CER_AUTHORIZATION_EMAIL';
    this.communicationFacade.loadEmailTemplates(this.cerAuthorizationEmailTypeCode ?? '')
        .subscribe((data: any) => {
          if (data) {
            this.ddlTemplates = data;
          }
          this.loaderService.hide();
        });
  }

  private loadDdlEmails() {
    this.communicationFacade.loadDdlEmails();
  }

  /** Internal event methods **/
  onCloseSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.onCloseSendEmailClicked();
  }

  OnEditEmailClicked() {
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = false;
    this.isOpenSendEmailClicked = true;
  }

  onSaveForLaterClicked() { 
    this.isShowSaveForLaterPopupClicked = true;
  }

  onPreviewEmailClicked() { 
    this.isShowPreviewEmailPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentEmailData);
    this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
    this.generateText(this.selectedTemplate);
  }

  onSendEmailConfirmationDialogClicked(event: any) {
    this.isShowSendEmailConfirmationPopupClicked = false;
    if (CommunicationEvents.Print === event) {
      this.closeSendEmailEvent.emit(CommunicationEvents.Print);
    } else if (CommunicationEvents.Close === event) {
      this.closeSendEmailEvent.emit(CommunicationEvents.Close);
    }
  }

  onSendEmailConfirmationClicked() {
    this.isOpenSendEmailClicked = false;
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = true;
    this.emailEditorValueEvent.emit(true);
  }

  onCloseSendEmailClicked() {
    this.closeSendEmailEvent.emit(CommunicationEvents.Close);
  }

  /** External event methods **/
  handleDdlEmailValueChange(event: any) {
    this.isClearEmails =true;
    this.isShowToEmailLoader$.next(true);
    this.isOpenDdlEmailDetails = true;
    this.selectedTemplate = event;
    // this.editorValue.emit(event);
    this.emailContentValue = event.templateContent;
    this.handleEmailEditor(event);
    this.ref.detectChanges();
  }

  handleEmailEditor(emailData: any) {
    this.currentEmailData = emailData;
  }
  onClosePreviewEmail(){
    this.isShowPreviewEmailPopupClicked = false;
  }

  showEmailPreviewContent(event: any){
    this.previewEmailContent = event;
    this.showEmailPreview = true;
  }

  private generateText(emailData: any){
    this.loaderService.show();
    this.loadCurrentSession();
    const clientId = this.workflowFacade.clientId ?? 0;
    const caseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    this.communicationFacade.generateTextTemplate(clientId ?? 0, caseEligibilityId ?? '', emailData ?? '')
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.currentEmailData = data;
            this.emailContentValue = this.currentEmailData;
            this.emailEditorValueEvent.emit(this.emailContentValue);
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
        },
      });
  }
}

