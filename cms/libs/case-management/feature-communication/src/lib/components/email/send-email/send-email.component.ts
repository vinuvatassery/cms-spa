/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, EsignFacade, CommunicationEventTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserDataService } from '@cms/system-config/domain';

/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';

@Component({
  selector: 'case-management-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendEmailComponent implements OnInit, OnDestroy {
  /** Input properties **/
  @Input() paperlessFlag!: any
  @Input() ddlEmails$!: Observable<any>;
  @Input() toEmail: Array<string> = [];
  @Input() clientCaseEligibilityId!: any;
  @Input() entityId!: any;
  @Input() isCerForm!: any;
  @Input() communicationEmailTypeCode!: any;
  @Input() notificationGroup!: any;
  @Input() clientCaseId!: string;
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;
  @Input() notificationDraftId!: string;

  /** Output properties  **/
  @Output() closeSendEmailEvent = new EventEmitter<CommunicationEvents>();
  @Output() loadInitialData = new EventEmitter();
  @Output() cerEmailContentEvent = new EventEmitter<any>();
  @Output() editorValue = new EventEmitter<any>();
  @Output() isSendEmailSuccess = new EventEmitter<boolean>();

  /** Public properties **/
  @ViewChild('notificationDraftDialogTemplate', { read: TemplateRef })
  notificationDraftDialogTemplate!: TemplateRef<any>;
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
  isClearEmails = false;
  selectedTemplate!: any;
  templateData: any = [];
  templateName: any = [];
  currentEmailData: any;
  showEmailPreview: boolean = false;
  previewEmailContent!: any;
  prevClientCaseEligibilityId!: string;
  cerAuthorizationEmailTypeCode!: string;
  selectedToEmail: any = [];
  selectedEmail: any = [];
  ccEmail: Array<string> = [];
  selectedCCEmail: any = [];
  defaultCCEmail: any = [];
  defaultBCCEmail: any = [];
  bccEmail: Array<string> = [];
  selectedBccEmail: any = [];
  showToEmailLoader: boolean = true;
  caseEligibilityId!: any;
  cerEmailAttachedFiles: any[] = [];
  userSelectedAttachment: any[] = [];
  clientAndVendorAttachedFiles: any[] = [];
  @Input() emailSubject!: string;
  existingFile: any = [];
  loginUserId!: any;
  isSaveForLater: boolean = false;
  isButtonsVisible: boolean = true;
  isCCDropdownVisible: boolean = true;
  isBCCDropdownVisible: boolean = true;
  attachmentCount: number = 0;
  draftNotificationRemoveDialogService = false;
  selectedTemplateId!: any;
  documentTemplate!: any;
  selectedTemplateContent !:any;
  updatedTemplateContent !: any;
  /** Private properties **/

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);


  /** Constructor **/
  constructor(private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly workflowFacade: WorkflowFacade,
    private formBuilder: FormBuilder,
    private readonly userDataService: UserDataService,
    private readonly esignFacade: EsignFacade,
    private dialogService: DialogService,) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.updateOpenSendEmailFlag();
      if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
        this.loadDraftEsignRequest();
      }
      else {
        if (this.isContinueDraftClicked) {
          this.loadClientAndVendorDraftEmailTemplates();
        } else if (this.isNewNotificationClicked) {
          this.openNewEmailClicked();
        } else {
          this.loadEmailTemplates();
        }
      }
  }

  loadClientAndVendorDraftEmailTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.communicationEmailTypeCode)
      .subscribe({
        next: (data: any) => {
          if (data?.length > 0) {
            this.ddlTemplates = data;
            this.handleDdlEmailValueChange(data[0]);
            this.ref.detectChanges();
          } else {
            this.loadEmailTemplates();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  private updateOpenSendEmailFlag() {
    if (this.notificationGroup) {
      this.isOpenSendEmailClicked = true;
    } else {
      this.isOpenSendEmailClicked = false;
    }
  }

  private loadEmailTemplates() {
    if (this.communicationEmailTypeCode == undefined)
      return;
    this.loaderService.show();
    this.communicationFacade.loadEmailTemplates(this.notificationGroup, this.communicationEmailTypeCode ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.ddlTemplates = data;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  private loadDraftEsignRequest() {
    this.loaderService.show();
    this.esignFacade.loadDraftEsignRequestByClinetId(this.entityId ?? '', this.clientCaseEligibilityId ?? '', this.loginUserId)
      .subscribe({
        next: (data: any) => {
          if (data.length > 0) {
            this.ddlTemplates = data;
            for (let template of this.ddlTemplates) {
              template.description = template.requestSubject;
              template.documentTemplateId = template.esignRequestId;
            }
            this.ref.detectChanges();
          } else {
            this.loadEmailTemplates();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  /** Internal event methods **/
  onSaveForLaterTemplateClicked() {
    this.isShowSaveForLaterPopupClicked = false;
    this.isOpenSendEmailClicked = true;
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    this.selectedTemplate.toEmailAddress = this.selectedToEmail;
    if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
      this.saveDraftEsignRequest(this.selectedTemplate);
    } else {
      this.saveClientAndVendorNotificationForLater(this.selectedTemplate);
    }
  }

  saveClientAndVendorNotificationForLater(draftTemplate: any) {
    this.loaderService.show();
    const emailData = this.getEmailPayload(draftTemplate);
    const emailFormData = this.communicationFacade.createFormDataForEmail(emailData);
    this.communicationFacade.saveClientAndVendorNotificationForLater(emailFormData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Email Saved As Draft');
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  onCloseSaveForLaterClicked() {
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

  onSendEmailDailougeConfirmationClicked() {
    this.isShowSendEmailConfirmationPopupClicked = false;
  }

  onPreviewEmailClicked() {
    this.isShowPreviewEmailPopupClicked = true;
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    this.generateText(this.selectedTemplate, CommunicationEvents.Preview);
  }

  onSendEmailConfirmationDialogClicked(event: any) {
    this.isShowSendEmailConfirmationPopupClicked = false;
    if (CommunicationEvents.Print === event) {
      this.selectedTemplate.templateContent = this.updatedTemplateContent;
      if (this.communicationEmailTypeCode == CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode == CommunicationEventTypeCode.CerAuthorizationEmail) {
        this.initiateAdobeEsignProcess(this.selectedTemplate, CommunicationEvents.SendEmail);
      } else {
        this.initiateSendEmailProcess(this.selectedTemplate);
      }
    }
  }

  private getSelectedEmails(emailList: any, emailType: string){
    const emailRecipients:any=[];
     emailList.forEach((recipient:any) => {
      let defaultItem: any;
      if(emailType=="CC"){
         defaultItem = this.defaultCCEmail.find((item: any) => recipient.includes(item?.email?.trim()));
      }else{
        defaultItem = this.defaultBCCEmail.find((item: any) => recipient.includes(item?.email?.trim()));
      }
      if(defaultItem!=null){
        emailRecipients.push(defaultItem)
      }else{
        const newCCReciepent={
          email:recipient,
          isDefault:false
        };
        emailRecipients.push(newCCReciepent)
      }
    });
    return emailRecipients;
  }

  private getEmailPayload(selectedTemplate: any) {

    return {
      subject: this.emailSubject,
      toEmail: this.selectedToEmail,
      ccEmail: this.getSelectedEmails(this.selectedCCEmail,"CC"),
      bccEmail: this.isBCCDropdownVisible ? null : this.getSelectedEmails(this.selectedCCEmail,"BCC"),
      eligibilityId: this.clientCaseEligibilityId,
      entity: this.notificationGroup,
      entityId: this.entityId,
      caseId: this.clientCaseId,
      userId: this.loginUserId,
      emailData: selectedTemplate,
      clientAndVendorEmailAttachedFiles: this.clientAndVendorAttachedFiles
    };
  }

  initiateSendEmailProcess(selectedTemplate: any) {
    this.loaderService.show();
     if (!this.selectedTemplate.documentTemplateId) {
      this.selectedTemplate.documentTemplateId = this.selectedTemplate.notificationTemplateId
    }
    const emailData = this.getEmailPayload(selectedTemplate);
    const emailFormData = this.communicationFacade.createFormDataForEmail(emailData);
    this.communicationFacade.initiateSendEmailRequest(emailFormData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, data?.message) //'Email Sent! Event Logged.'
            this.onCloseSendEmailClicked();
          }
          this.ref.detectChanges();
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
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

  onClosePreviewEmail() {
    this.isShowPreviewEmailPopupClicked = false;
  }
  /** External event methods **/
  handleDdlEmailValueChange(event: any) {
    this.selectedTemplate = event;
    if (event.documentTemplateId && !event.esignRequestId) {
      this.loaderService.show();
      this.communicationFacade.loadTemplateById(event.documentTemplateId)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.selectedTemplate = data;
              this.emailContentValue = data.templateContent;
              this.selectedTemplateContent = data.templateContent;
              this.updatedTemplateContent = data.templateContent;
              this.isClearEmails = true;
              this.isShowToEmailLoader$.next(true);
              this.isOpenDdlEmailDetails = true;
              this.selectedEmail = [];
              this.selectedEmail.push(this.toEmail[0]?.trim());
              this.selectedToEmail = this.selectedEmail;
              this.emailSubject = data.description;
              const ccEmails = data.cc?.map((item: any)=> item.email);
              this.ccEmail = ccEmails;
              if (data?.bccEmail?.length > 0) {
                this.bccEmail.push(data.bcc?.map((item: any)=> item.email));
                this.isBCCDropdownVisible = false;
              }
              this.selectedCCEmail = this.ccEmail;
              this.defaultCCEmail = data.cc;
              this.showToEmailLoader = false;
              if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail  || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
                this.getCCEmailList(this.entityId, this.loginUserId);
              }
              this.ref.detectChanges();
            }
            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
    }
    else {
      this.selectedTemplateId = event.notificationTemplateId;
      this.selectedTemplate = event;
      this.selectedTemplateContent = event.templateContent == undefined? event.requestBody : event.templateContent;
      this.updatedTemplateContent = event.templateContent == undefined? event.requestBody : event.templateContent;
      this.isClearEmails = true;
      this.isShowToEmailLoader$.next(true);
      this.isOpenDdlEmailDetails = true;
      this.selectedEmail = [];
      this.selectedEmail = event.to;
      this.selectedToEmail = this.selectedEmail;
      this.emailSubject = event.description;
      this.defaultCCEmail = event.cc;
      this.defaultBCCEmail = event.bcc;
      this.selectedCCEmail = event.cc?.map((item: any)=> item.email);
      if (event?.bccEmail?.length > 0) {
        this.bccEmail = this.selectedBccEmail = event.bcc;
        this.isBCCDropdownVisible = false;
      }
      this.showToEmailLoader = false;
      this.documentTemplate = {
        'description': event.description,
        'documentTemplateId': event.notificationTemplateId
      };
      this.ref.detectChanges();
    }
  }

  openNewEmailClicked() {
    this.loaderService.show();
    this.communicationFacade.deleteNotificationDraft(this.notificationDraftId)
      .subscribe({
        next: (data: any) => {
          if (data === true) {
            this.loadEmailTemplates();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  closeDraftDailogCloseClicked() {
    this.draftNotificationRemoveDialogService = true;;
  }

  onEmailChange(event: any) {
    this.selectedToEmail = event[0].email;
  }

  private initiateAdobeEsignProcess(emailData: any, requestType: string) {
    this.loaderService.show();
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.entityId, this.emailSubject, this.loginUserId, this.ccEmail, this.selectedBccEmail, this.isSaveForLater);
    let formData = this.esignFacade.prepareAdobeEsingData(esignRequestFormdata, emailData, this.cerEmailAttachedFiles);
    this.esignFacade.initiateAdobeesignRequest(formData, emailData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isSendEmailSuccess.emit(true);
            this.closeSendEmailEvent.emit(CommunicationEvents.Print);
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Document has been sent for Esign..')
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  private generateText(letterData: any, requestType: CommunicationEvents) {
    if (this.communicationEmailTypeCode != CommunicationEventTypeCode.CerAuthorizationLetter) {
      this.generateClientTextTemplate(letterData, requestType);
    } else {
      this.entityId = this.workflowFacade.clientId ?? 0;
      this.clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId ?? '';
    }
  }

  private generateClientTextTemplate(emailData: any, requestType: string) {
    this.loaderService.show();
    let formData = this.communicationFacade.preparePreviewModelData(emailData);
    this.communicationFacade.generateTextTemplate(this.entityId ?? 0, this.clientCaseEligibilityId ?? '', formData ?? '', requestType ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.currentEmailData = data;
            this.emailContentValue = this.currentEmailData;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  private saveDraftEsignRequest(draftTemplate: any) {
    this.loaderService.show();
    this.isSaveForLater = true;
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmail, this.clientCaseEligibilityId, this.entityId, this.emailSubject, this.loginUserId, this.selectedCCEmail, this.selectedBccEmail, this.isSaveForLater);
    let draftEsignRequest = this.esignFacade.prepareDraftAdobeEsignRequest(esignRequestFormdata, draftTemplate, this.cerEmailAttachedFiles);
    if (draftTemplate?.esignRequestId == undefined || draftTemplate?.esignRequestId == null) {
      this.esignFacade.saveDraftEsignRequest(draftEsignRequest)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.onCloseSendEmailClicked();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Email Saved As Draft');
            }
            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.isOpenSendEmailClicked = true;
            this.loggingService.logException(err);
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
    } else {
      this.esignFacade.updateEmailTemplateForLater(draftEsignRequest)
        .subscribe({
          next: (data: any) => {
            if (data) {
              this.onCloseSendEmailClicked();
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Email Saved As Draft');
            }
            this.loaderService.hide();
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.isOpenSendEmailClicked = true;
            this.loggingService.logException(err);
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
    }
  }

  cerEmailAttachments(event: any) {
    if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
      const isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.document?.documentName)
      if(!isFileExists)
      {
      this.cerEmailAttachedFiles?.push(event);
      }
      this.attachmentCount = this.cerEmailAttachedFiles?.length;
    } else {
      const isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.document?.documentName)
      if(!isFileExists)
      {
      this.clientAndVendorAttachedFiles?.push(event);
      }
      this.attachmentCount = this.clientAndVendorAttachedFiles?.length;
    }
  }

  getLoggedInUserProfile() {
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loginUserId = profile[0]?.loginUserId;
      }
    })
    this.loaderService.hide();
  }

  getCCEmailList(clientId: number, loginUserId: string) {
    this.loaderService.show();
    this.communicationFacade.getCCList(clientId ?? 0, loginUserId ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.ccEmail = data;
            this.selectedCCEmail = data?.map((item: any)=> item.email);
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isOpenSendEmailClicked = true;
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  onBccEmailClicked() {
    this.isBCCDropdownVisible = !this.isBCCDropdownVisible;
  }

  onCCValueChange(values: any) {
    const removedItem = this.defaultCCEmail.find((item: any) => !values.includes(item?.email?.trim()));
    if (removedItem != null && removedItem.isDefault) {
      values.push(removedItem?.email.trim());
      this.showHideSnackBar(SnackBarNotificationType.WARNING, 'Default CC could not be removed.');
    }
    //get invalid email
    const inValidEmail = values.filter((email: any) => Validators.email(new FormControl(email.trim())));
    if (inValidEmail.length > 0 && removedItem == null) {
      this.showHideSnackBar(SnackBarNotificationType.WARNING, 'Invalid Email not allowed.');
    }
    const validEmails = values.filter((email: any) => !Validators.email(new FormControl(email.trim())));
    this.selectedCCEmail = validEmails;
  }
  onBCCValueChange(values: any) {
    //get invalid email
    const inValidEmail = values.filter((email: any) => Validators.email(new FormControl(email)));
    if (inValidEmail.length > 0) {
      this.showHideSnackBar(SnackBarNotificationType.WARNING, 'Invalid Email not allowed.');
    }
    const validEmails = values.filter((email: any) => !Validators.email(new FormControl(email)));
    this.selectedBccEmail = validEmails;
  }

  editorValueChange(event: any){
        this.updatedTemplateContent = event;
  }
}

