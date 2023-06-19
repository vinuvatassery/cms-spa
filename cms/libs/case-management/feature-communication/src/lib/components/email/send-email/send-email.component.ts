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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  @Input() toEmail: any = [];
  @Input() clientCaseEligibilityId!: any;
  @Input() clientId!: any;
  @Input() isCerForm!: any; 
  

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
  showToEmailLoader: boolean = true;
  caseEligibilityId!:any;
  cerEmailAttachedFiles: any[] = [];
  userSelectedAttachment: any[] = [];
  emailSubject!: string;
  existingFile: any = [];
  selectedEmail!: string;
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
    private formBuilder: FormBuilder,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.updateOpenSendEmailFlag();
    this.loadEmailTemplates();
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
    this.loaderService.show();
    this.cerAuthorizationEmailTypeCode = CommunicationEvents.CerAuthorizationEmail;
    const channelTypeCode = CommunicationEvents.Email;
    this.communicationFacade.loadEmailTemplates(this.cerAuthorizationEmailTypeCode ?? '', channelTypeCode??'')
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.ddlTemplates = data;
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

  /** Internal event methods **/
  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.emailEditorValueEvent.emit(this.currentEmailData);
    this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
    this.selectedTemplate.toEmailAddress = this.selectedToEmail;
    this.saveTemplateForLater(this.selectedTemplate);
    this.onCloseSendEmailClicked();
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
    this.generateText(this.selectedTemplate,"Preview");
  }

  onSendEmailConfirmationDialogClicked(event: any) {
    this.isShowSendEmailConfirmationPopupClicked = false;
    if (CommunicationEvents.Print === event) {
      this.emailEditorValueEvent.emit(this.currentEmailData);
      this.selectedTemplate.templateContent = this.currentEmailData.templateContent;
      this.initiateAdobeEsignProcess(this.selectedTemplate,"SendEmail");
      this.closeSendEmailEvent.emit(CommunicationEvents.Print);
    }
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
    this.isShowToEmailLoader$.next(true);
    this.isOpenDdlEmailDetails = true;
    this.selectedTemplate = event;
    this.emailContentValue = event.templateContent;
    this.emailSubject = event.emailSubject;
    this.handleEmailEditor(event);
    this.showToEmailLoader = false;
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
    const formData = new FormData();
    formData.append('documentTemplateId', emailData?.documentTemplateId ?? '');
    formData.append('requestBody', emailData?.templateContent ?? '');
    formData.append('toEmailAddress', this.selectedToEmail ?? '');
    formData.append('clientCaseEligibilityId', this.clientCaseEligibilityId ?? '');
    formData.append('clientId', this.clientId ?? '');
    formData.append('requestSubject', this.emailSubject ?? '');
    let i = 0;
    this.cerEmailAttachedFiles.forEach((file) => { 
      if(file.rawFile == undefined || file.rawFile == null){
      formData.append('AttachmentDetails['+i+'][fileName]', file.document.description);
      formData.append('AttachmentDetails['+i+'][filePath]', file.document.templatePath);
      i++;
      }else{
        formData.append('attachments', file.rawFile); 
      }
    });
    this.communicationFacade.initiateAdobeesignRequest(formData)
        .subscribe({
          next: (data: any) =>{
          if (data) {
          this.onCloseSendEmailClicked();
          this.isOpenSendEmailClicked = false;
          this.isSendEmailSuccess.emit(true);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Document has been sent for Esign..')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR,err)
        },
      });
  }

  private generateText(emailData: any, requestType: string){
    this.loaderService.show();
    this.communicationFacade.generateTextTemplate(this.clientId ?? 0, this.clientCaseEligibilityId ?? '', emailData ?? '', requestType ?? '')
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

  private saveTemplateForLater(draftTemplate: any) {
    this.loaderService.show();
    const isSaveFoLater = true;
    const formData = new FormData();
      formData.append('documentTemplateId', draftTemplate?.documentTemplateId ?? '');
      formData.append('systemCode', draftTemplate?.systemCode ?? '');
      formData.append('documentTemplateTypeCode', draftTemplate?.documentTemplateTypeCode ?? '');
      formData.append('subtypeCode', draftTemplate?.subtypeCode ?? '');
      formData.append('channelTypeCode', draftTemplate?.channelTypeCode ?? '');
      formData.append('languageCode', draftTemplate?.languageCode ?? '');
      formData.append('description', draftTemplate?.description ?? '');
      formData.append('templateContent', draftTemplate?.templateContent ?? '');
      formData.append('toEmailAddress', this.selectedToEmail ?? '');
      let i = 0;
    this.cerEmailAttachedFiles.forEach((file) => { 
      if(file.documentTemplateTypeCode != CommunicationEvents.TemplateAttachmentTypeCode){
        if(file.rawFile == undefined || file.rawFile == null){
          formData.append('savedAttachmentId', file.document.documentTemplateId);
          i++;
        }else{
          formData.append('fileData', file.rawFile); 
        }
      }
    });  
    this.communicationFacade.saveForLaterEmailTemplate(formData, isSaveFoLater)
        .subscribe({
          next: (data: any) =>{
          if (data) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Email Saved As Draft')
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
  
  cerEmailAttachments(event:any){
    this.cerEmailAttachedFiles = event; 
  }
}

