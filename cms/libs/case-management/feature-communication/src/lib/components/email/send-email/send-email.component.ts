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
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, EsignFacade, CommunicationEventTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserDataService } from '@cms/system-config/domain';

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
  @Input() paperlessFlag! : any
  @Input() data!: any;
  @Input() ddlEmails$!: Observable<any>;
  @Input() toEmail: Array<string> = [];
  @Input() clientCaseEligibilityId!: any;
  @Input() clientId!: any;
  @Input() isCerForm!: any;
  @Input() communicationEmailTypeCode!: any;
  @Input() screenName!: any;
  @Input() vendorId!: string;

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() cerEmailContentEvent = new EventEmitter<any>();
  @Output() emailEditorValueEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();
  @Output() isSendEmailSuccess = new EventEmitter<boolean>();

  /** Public properties **/
  ddlLetterTemplates$ = this.communicationFacade.ddlLetterTemplates$;
  ddlTemplates: any = [];
  selectEmail: any = [];
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
  prevClientCaseEligibilityId!: string;
  cerAuthorizationEmailTypeCode!: string;
  selectedToEmail!: any;
  selectedEmail: any=[];
  ccEmail: Array<string> = [];
  selectedCCEmail: any = [];
  showToEmailLoader: boolean = true;
  caseEligibilityId!:any;
  cerEmailAttachedFiles: any[] = [];
  userSelectedAttachment: any[] = [];
  clientAndVendorAttachedFiles: any[] = [];
  @Input() emailSubject!: string;
  existingFile: any = [];
  loginUserId!: any;
  isSaveFoLater: boolean = false;
  isButtonsVisible: boolean = true;
  isCCDropdownVisible: boolean = true;
  attachmentCount: number = 0;
  entityId!: string;

  /** Private properties **/
  private currentSessionSubscription !: Subscription;

  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder,
    private readonly userDataService: UserDataService,
    private readonly esignFacade: EsignFacade,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.updateOpenSendEmailFlag();
    this.loadEmailTemplates();
    if (CommunicationEventTypeCode.CerAuthorizationEmail !== this.communicationEmailTypeCode){
      this.loadClientAndVendorDraftEmailTemplates();
    }
    else
      this.loadDraftEsignRequest();
  }

  loadClientAndVendorDraftEmailTemplates() {
    if(this.clientId){
      this.entityId = this.clientId;
    }
    if(this.vendorId){
      this.entityId = this.vendorId;
    }
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId)
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.ddlTemplates = this.ddlTemplates.filter((item: any) => item.templateDesc === 'Draft Custom Email');
          this.ddlTemplates.push(data);
          this.ref.detectChanges();
        }else{
          this.loadEmailTemplates();
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
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

  private loadEmailTemplates() {
    if(this.communicationEmailTypeCode==undefined)
      return;
    this.loaderService.show();
    const channelTypeCode = CommunicationEvents.Email;
    this.communicationFacade.loadEmailTemplates(this.communicationEmailTypeCode ?? '', channelTypeCode??'')
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.ddlTemplates = data;
          this.ref.detectChanges();
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
    },
  });
  }

  private loadDraftEsignRequest() {
    this.loaderService.show();
    this.esignFacade.loadDraftEsignRequestByClinetId(this.clientId ?? 0, this.clientCaseEligibilityId ?? '', this.loginUserId)
    .subscribe({
      next: (data: any) =>{
        if (data.length > 0) {
          this.ddlTemplates = data;
          for (let template of this.ddlTemplates){
            template.description = template.requestSubject;
            template.documentTemplateId = template.esignRequestId;
           }
          this.ref.detectChanges();
        }else{
          this.loadEmailTemplates();
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  /** Internal event methods **/
  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.isOpenSendEmailClicked = true;
    this.emailEditorValueEvent.emit(this.currentEmailData);
    this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
    this.selectedTemplate.toEmailAddress = this.selectedToEmail;
    if (this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationLetter)
    {
      this.saveDraftEsignRequest(this.selectedTemplate);
    }else{
      this.saveEmailNotificationDraft(this.selectedTemplate);
    }
  }

  saveEmailNotificationDraft(draftTemplate: any) {
    this.loaderService.show();
    let emailRequestFormdata = this.communicationFacade.prepareClientAndVendorFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.clientId, this.emailSubject, this.loginUserId, this.selectedCCEmail);
    let draftEsignRequest = this.communicationFacade.prepareClientAndVendorEmailData(emailRequestFormdata, draftTemplate, this.clientAndVendorAttachedFiles, this.vendorId);
      if(draftTemplate?.notificationDraftId == undefined || draftTemplate?.notificationDraftId == null){
        this.communicationFacade.saveClientAndVendorNotificationForLater(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
    }else{
        this.communicationFacade.updateSavedClientandVendorEmailTemplate(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
      }
  }

  onCloseSaveForLaterClicked(){
    this.isShowSaveForLaterPopupClicked = false;
    this.isShowPreviewEmailPopupClicked = false;
    this.isOpenSendEmailClicked = true;
  }

  OnEditEmailClicked() {
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = false;
    this.isOpenSendEmailClicked = true;
  }

  onSaveForLaterClicked() {
    this.isShowSaveForLaterPopupClicked = true;
  }

  onSendEmailDailougeConfirmationClicked(){
    this.isShowSendEmailConfirmationPopupClicked = false;
  }

  onPreviewEmailClicked() {
    this.isShowPreviewEmailPopupClicked = true;
    this.emailEditorValueEvent.emit(this.currentEmailData);
    this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
    this.generateText(this.selectedTemplate, CommunicationEvents.Preview);
  }

  onSendEmailConfirmationDialogClicked(event: any) {
    this.isShowSendEmailConfirmationPopupClicked = false;
    if (CommunicationEvents.Print === event) {
      this.emailEditorValueEvent.emit(this.currentEmailData);
      this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
      if (this.communicationEmailTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter)
      {
      this.initiateAdobeEsignProcess(this.selectedTemplate, CommunicationEvents.SendEmail);
      }else{
        this.initiateSendEmailProcess(this.selectedTemplate);
      }
    }
  }

  initiateSendEmailProcess(selectedTemplate: any) {
    this.loaderService.show();
    let esignRequestFormdata = this.communicationFacade.prepareClientAndVendorFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.clientId, this.emailSubject, this.loginUserId, this.selectedCCEmail);
    let formData = this.communicationFacade.prepareClientAndVendorEmailData(esignRequestFormdata, selectedTemplate, this.clientAndVendorAttachedFiles, this.vendorId);
    this.communicationFacade.initiateSendemailRequest(formData, selectedTemplate)
        .subscribe({
          next: (data: any) =>{
          if (data) {
          this.onCloseSendEmailClicked();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Sent! Event Logged.')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  onSendEmailConfirmationClicked() {
    this.isOpenSendEmailClicked = true;
    this.isShowPreviewEmailPopupClicked = false;
    this.isShowSendEmailConfirmationPopupClicked = true;
  }

  onCloseSendEmailClicked() {
    this.closeSendEmailEvent.emit(CommunicationEvents.Close);
  }

onClosePreviewEmail(){
  this.isShowPreviewEmailPopupClicked = false;
}
  /** External event methods **/
  handleDdlEmailValueChange(event: any) {
    this.isClearEmails =true;
    this.emailSubject = event.description;
    this.isShowToEmailLoader$.next(true);
    this.isOpenDdlEmailDetails = true;
    this.selectedTemplate = event;
    this.emailContentValue = event.templateContent == undefined? event.requestBody : event.templateContent;
    this.selectedEmail = [];
    this.selectedEmail.push(this.toEmail[0]?.trim());
    this.selectedToEmail = this.selectedEmail;
    this.handleEmailEditor(event);
    this.showToEmailLoader = false;
    if (CommunicationEventTypeCode.CerAuthorizationEmail===this.communicationEmailTypeCode) {
      this.getCCEmailList(this.clientId, this.loginUserId);
    }
    this.ref.detectChanges();
  }

  handleEmailEditor(emailData: any) {
    this.currentEmailData = emailData;
  }

  onEmailChange(event: any){
    this.selectedToEmail = event[0].email;
  }

  private initiateAdobeEsignProcess(emailData: any, requestType: string){
    this.loaderService.show();
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.clientId, this.emailSubject, this.loginUserId, this.selectedCCEmail, this.isSaveFoLater);
    let formData = this.esignFacade.prepareAdobeEsingData(esignRequestFormdata, emailData, this.cerEmailAttachedFiles);
    this.esignFacade.initiateAdobeesignRequest(formData, emailData)
        .subscribe({
          next: (data: any) =>{
          if (data) {
          this.isSendEmailSuccess.emit(true);
          this.closeSendEmailEvent.emit(CommunicationEvents.Print);
          this.onCloseSendEmailClicked();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent for Esign..')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
  }

  private generateText(emailData: any, requestType: string){
    this.loaderService.show();
    let formData = this.communicationFacade.preparePreviewModelData(emailData);
    this.communicationFacade.generateTextTemplate(this.clientId ?? 0, this.clientCaseEligibilityId ?? '', formData ?? '', requestType ?? '', this.vendorId ?? '')
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
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
        },
      });
  }

  private saveDraftEsignRequest(draftTemplate: any) {
    this.loaderService.show();
    this.isSaveFoLater = true;
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.clientId, this.emailSubject, this.loginUserId, this.selectedCCEmail, this.isSaveFoLater);
    let draftEsignRequest = this.esignFacade.prepareDraftAdobeEsignRequest(esignRequestFormdata, draftTemplate, this.cerEmailAttachedFiles);
      if(draftTemplate?.esignRequestId == undefined || draftTemplate?.esignRequestId == null){
        this.esignFacade.saveDraftEsignRequest(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
    }else{
        this.esignFacade.updateEmailTemplateForLater(draftEsignRequest)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
        },
      });
      }
  }

  cerEmailAttachments(event:any){
    if (this.communicationEmailTypeCode == CommunicationEventTypeCode.CerAuthorizationLetter)
    {
      this.cerEmailAttachedFiles = event;
      this.attachmentCount = this.cerEmailAttachedFiles?.length;
    }else{
      this.clientAndVendorAttachedFiles = event;
      this.attachmentCount = this.clientAndVendorAttachedFiles?.length;
    }
  }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
        this.loginUserId= profile[0]?.loginUserId;
      }
    })
    this.loaderService.hide();
  }

  getCCEmailList(clientId: number, loginUserId: string){
    this.loaderService.show();
    this.communicationFacade.getCCList(clientId ?? 0, loginUserId ?? '')
    .subscribe({
      next: (data: any) =>{
      if (data){
        this.ccEmail = data;
        this.selectedCCEmail = data;
        this.ref.detectChanges();
      }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.isOpenSendEmailClicked = true;
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }
}

