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
import { FormControl, Validators } from '@angular/forms';
/** Internal Libraries **/
import { CommunicationEvents, CommunicationFacade, WorkflowFacade, EsignFacade, CommunicationEventTypeCode, WorkflowTypeCode, VendorContactsFacade, ScreenType, EntityTypeCode, EventGroupCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FabBadgeFacade, FabEntityTypeCode, UserDataService } from '@cms/system-config/domain';

/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
import { Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  @Input() entityType!: any;
  @Input() isCerForm!: any;
  @Input() communicationEmailTypeCode!: any;
  @Input() notificationGroup!: any;
  @Input() clientCaseId!: string;
  @Input() isContinueDraftClicked!: boolean;
  @Input() isNewNotificationClicked!: boolean;
  @Input() notificationDraftId!: string;
  @Input() templateLoadType!: string;
  @Input() informationalText!: string;
  @Input() templateHeader !: string;
  @Input() triggerFrom !: string;
  @Input() loginUserEmail!: any;
  @Input() confirmPopupHeader!: string;
  @Input() confirmationModelText!: string;
  @Input() saveForLaterHeadterText!: string;
  @Input() saveForLaterModelText!: string;
  @Input() emailSubject!: string;
  @Input() caseManagerEmail!: any;

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
  ddlMailCodes: any[] = [];
  selectedMailCode: any;
  selectedMailCodeId: any;
  emails: any[] = [];
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
  selectedToEmails: any = [];
  ccEmail: Array<string> = [];
  selectedCCEmail: any = [];
  defaultCCEmail: any = [];
  defaultBCCEmail: any = [];
  bccEmail: Array<string> = [];
  selectedBccEmail: any = [];
  showToEmailLoader: boolean = false;
  caseEligibilityId!: any;
  cerEmailAttachedFiles: any[] = [];
  userSelectedAttachment: any[] = [];
  clientAndVendorAttachedFiles: any[] = [];
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
  selectedTemplateContent !: any;
  updatedTemplateContent !: any;
  currentTemplate!: any;
  templateDrpDisable: boolean = false;
  cancelDisplay: boolean = true;
  loadTemplate$ = this.communicationFacade.loadTemplate$;
  isToEmailMissing: boolean = false;
  isEmailSubjectMissing: boolean = false;
  isContentMissing: boolean = false;
  isMailCodeMissing: boolean = false;
  isFormValid: boolean = true;
  variableName!: string;
  typeName!: string;
  subjectMax = 200;
  vendorMailCodesubscription!: Subscription;
  userDataSubscription!: Subscription;
  snackBarMessage:any;
  // caseManagerEmail: any = null;
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
    private readonly workflowFacade: WorkflowFacade,
    private readonly userDataService: UserDataService,
    private readonly esignFacade: EsignFacade,
    private dialogService: DialogService,
    private readonly router: Router,
    private readonly vendorContactFacade: VendorContactsFacade,
    private readonly fabBadgeFacade: FabBadgeFacade,
    private readonly sanitizer: DomSanitizer) { }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.loadInitialData.emit();
    this.updateOpenSendEmailFlag();
    this.addSubscriptions();
    if (this.templateLoadType === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.templateLoadType === CommunicationEventTypeCode.CerAuthorizationEmail) {
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
    if (this.entityType == EntityTypeCode.Vendor) {
      this.variableName = 'Vendor';
      this.typeName = 'VENDOR_VARIABLE'
    }
    if (this.entityType == EntityTypeCode.Client) {
      this.variableName = 'Client';
      this.typeName = 'CLIENT_VARIABLE'
    }
    if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
      this.getCCEmailList(this.entityId, this.loginUserId);
    }
  }

  addSubscriptions() {
    this.vendorMailCodesubscription = this.vendorContactFacade.mailCodes$.subscribe((resp: any[]) => {
      this.ddlMailCodes = resp.filter((address: any) => address.activeFlag === "Y");
      if (this.selectedMailCodeId) {
        this.selectedMailCode = this.ddlMailCodes.find((address: any) => address.vendorAddressId == this.selectedMailCodeId);
        this.selectedMailCodeId = null;
        this.ref.detectChanges();
      }
    });
  }

  loadMailingAddress() {
    if (this.entityType == EntityTypeCode.Vendor) {
      this.vendorContactFacade.loadMailCodes(this.entityId);
    }
  }

  handleDdlMailCodesChange(mailCode: any) {
    this.showToEmailLoader = true;
    this.selectedMailCode = mailCode;
    this.emails = this.selectedToEmails = [];
    this.vendorContactFacade.loadcontacts(mailCode?.vendorAddressId, 0, 999999, 'EmailAddress', 'ASC', JSON.stringify([{
      filters: [
        { field: 'ActiveFlag', operator: 'eq', value: 'Y' }
      ]
    }])).subscribe(resp => {
      this.emails = resp.items?.map((item: any) => item.emailAddress).filter((email: any) => email && this.isValidEmail(email)) as string[];
      this.selectedToEmails = this.emails;
      this.showToEmailLoader = false;
      this.ref.detectChanges();
    });
    if(this.selectedToEmails){
      this.isToEmailMissing = false;
    }
    this.isMailCodeMissing = false;
    this.isFormValid = true;
    this.ref.detectChanges();
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  handleEmailsChanged(values: any) {
    if (values.length > 0) {
      const removedItem = this.selectedToEmails.find((item: any) => !values.includes(item?.email?.trim()));
      //get invalid email
      const inValidEmail = values.filter((email: any) => Validators.email(new FormControl(email.trim())));
      if (inValidEmail.length > 0 && removedItem == null) {
        this.showHideSnackBar(SnackBarNotificationType.WARNING, 'Invalid Email not allowed.');
      }
      const validEmails = values.filter((email: any) => !Validators.email(new FormControl(email.trim())));
      this.selectedToEmails = validEmails;
      if (this.selectedToEmails?.length > 0) {
        this.isToEmailMissing = false;
        this.isFormValid = true;
      }
    }
    this.ngDirtyInValid();
  }

  handleSubjectChanged(subject: any) {
    this.emailSubject = subject;
    if (this.emailSubject) {
      this.isEmailSubjectMissing = false;
      this.isFormValid = true;
    }

    this.ngDirtyInValid();
  }

  getProfileName() {
    if (this.templateLoadType.includes('CLIENT')) return 'client';
    else if (this.templateLoadType.includes('VENDOR')) return 'vendor';
    else return this.templateLoadType;
  }

  loadClientAndVendorDraftEmailTemplates() {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.entityType, this.templateLoadType, this.communicationEmailTypeCode ?? '')
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
    this.vendorMailCodesubscription?.unsubscribe();
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
    if (this.templateLoadType == undefined)
      return;
    this.loaderService.show();
    if (this.templateLoadType === null || this.templateLoadType === undefined || this.templateLoadType === '') {
      this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
    }
    this.communicationFacade.loadEmailTemplates(this.notificationGroup, this.templateLoadType, this.communicationEmailTypeCode ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.ddlTemplates = data;
            const defaultOption = this.ddlTemplates.find((option: any) => option.description === 'Draft Custom Email');
            const otherOptions = this.ddlTemplates.filter((option: any) => option.description !== 'Draft Custom Email');
            this.currentTemplate = this.ddlTemplates.filter((x: any) => x.templateTypeCode === this.communicationEmailTypeCode)
            if (this.currentTemplate.length > 0) {
              this.documentTemplate = { 'description': this.currentTemplate[0].description, 'documentTemplateId': this.currentTemplate[0].documentTemplateId };
              this.handleDdlEmailValueChange(this.currentTemplate[0]);
            }
            if (this.communicationEmailTypeCode === CommunicationEventTypeCode.PendingNoticeEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.RejectionNoticeEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.ApprovalNoticeEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.DisenrollmentNoticeEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.RestrictedNoticeEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail
              || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
              this.templateDrpDisable = true;
              this.cancelDisplay = false;
            }
            this.sortDropdownValues(defaultOption, otherOptions);
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

  sortDropdownValues(defaultOption: any, otherOptions: any) {
    // Sort the rest alphabetically and numerically
    const sortedOptions = otherOptions.sort((a: any, b: any) => {
      const isANumeric = !isNaN(Number(a.description.charAt(0))); // Check if option a starts with a number
      const isBNumeric = !isNaN(Number(b.description.charAt(0))); // Check if option b starts with a number

      // If both are alphabetic or both are numeric, sort them using localeCompare
      if ((isANumeric && isBNumeric) || (!isANumeric && !isBNumeric)) {
        return a.description?.localeCompare(b.description);
      }
      // If option a starts with a number and option b does not, put option b first
      else if (isANumeric && !isBNumeric) {
        return 1;
      }
      // If option b starts with a number and option a does not, put option a first
      else {
        return -1;
      }
    });
    // Combine lists
    this.ddlTemplates = [defaultOption, ...sortedOptions];
  }

  private loadDraftEsignRequest() {
    this.loaderService.show();
    this.esignFacade.loadDraftEsignRequestByClinetId(this.entityId ?? '', this.clientCaseEligibilityId ?? '', this.loginUserId)
      .subscribe({
        next: (data: any) => {
          if (data.length > 0) {
            this.ddlTemplates = data;
            this.handleDdlEmailValueChange(this.ddlTemplates[0]);
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
      if (this.isFormValid) {
      this.isShowSaveForLaterPopupClicked = false;
      this.isOpenSendEmailClicked = true;
      this.selectedTemplate.toEmailAddress = this.selectedToEmails;
      if (!this.selectedTemplate.documentTemplateId) {
        this.selectedTemplate.documentTemplateId = this.selectedTemplate.notificationTemplateId;
      }
      if (this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
        this.saveDraftEsignRequest(this.selectedTemplate);
      }
      if (this.templateLoadType === CommunicationEventTypeCode.ClientEmail || this.templateLoadType === CommunicationEventTypeCode.VendorEmail) {
        this.saveClientAndVendorNotificationForLater(this.selectedTemplate);
      }
    }
  }

  saveClientAndVendorNotificationForLater(draftTemplate: any) {
    this.loaderService.show();
    const emailData = this.getEmailPayload(draftTemplate);
    let {templateTypeCode, eventGroupCode } = this.getApiTemplateTypeCode();
    emailData.templateTypeCode = templateTypeCode;
    const emailFormData = this.communicationFacade.createFormDataForEmail(emailData);
    emailFormData.append('description', draftTemplate.description ?? '');
    emailFormData.append('vendorAddressId', this.selectedMailCode?.vendorAddressId ?? '');
    emailFormData.append('selectedMailCode', this.selectedMailCode?.mailCode ?? '');
    this.communicationFacade.saveClientAndVendorNotificationForLater(emailFormData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Email Saved As Draft');
            if(this.entityId && this.entityType == FabEntityTypeCode.Client){
              this.fabBadgeFacade.reloadFabMenu(this.entityId, FabEntityTypeCode.Client);
            }
          }
          this.loaderService.hide();
          this.navigateConditionally();
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
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    if (this.selectedToEmails === undefined || this.selectedToEmails === '' || this.selectedToEmails?.length === 0) {
      this.isToEmailMissing = true;
      this.isFormValid = false;
      this.onCloseSaveForLaterClicked();
    }
    if (this.emailSubject === undefined || this.emailSubject === '') {
      this.isEmailSubjectMissing = true;
      this.isFormValid = false;
      this.onCloseSaveForLaterClicked();
    }
    if (this.selectedTemplate.templateContent === undefined || this.selectedTemplate.templateContent === '' || this.selectedTemplate.templateContent === "" || this.selectedTemplate.templateContent.trim() === '<p></p>') {
      this.isContentMissing = true;
      this.isFormValid = false;
      this.onCloseSaveForLaterClicked();
    }


    if (this.notificationGroup === ScreenType.VendorProfile) {
      if (this.selectedMailCode?.mailCode === undefined || this.selectedMailCode?.mailCode === '') {
        this.isMailCodeMissing = true;
        this.isFormValid = false;
        this.onCloseSaveForLaterClicked();
      }
    }
    if(this.isFormValid){
      this.isShowSaveForLaterPopupClicked = true;
    }
    this.ngDirtyInValid();

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
        if (this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail) {
          this.initiateAdobeEsignProcess(this.selectedTemplate);
        } else {
          this.initiateSendEmailProcess(this.selectedTemplate);
        }
    }
  }

  private getSelectedEmails(emailList: any, emailType: string) {
    const emailRecipients: any = [];
    emailList?.forEach((recipient: any) => {
      let defaultItem: any;
      if (emailType == "CC") {
        defaultItem = this.defaultCCEmail.find((item: any) => recipient.includes(item?.email?.trim()));
      } else {
        defaultItem = this.defaultBCCEmail.find((item: any) => recipient.includes(item?.email?.trim()));
      }
      if (defaultItem != null) {
        emailRecipients.push(defaultItem)
      } else {
        const newCCReciepent = {
          email: recipient,
          isDefault: false
        };
        emailRecipients.push(newCCReciepent)
      }
    });
    return emailRecipients;
  }

  private getEmailPayload(selectedTemplate: any, templateTypeCode: string = '', eventGroupCode: string = '') {
    return {
      templateTypeCode: templateTypeCode,
      eventGroupCode: eventGroupCode,
      subject: this.emailSubject,
      toEmail: this.selectedToEmails,
      ccEmail: this.getSelectedEmails(this.selectedCCEmail, "CC"),
      bccEmail: this.isBCCDropdownVisible ? null : this.getSelectedEmails(this.selectedBccEmail, "BCC"),
      eligibilityId: this.clientCaseEligibilityId,
      entity: this.entityType,
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
    let {templateTypeCode, eventGroupCode } = this.getApiTemplateTypeCode();
    const emailData = this.getEmailPayload(selectedTemplate, templateTypeCode, eventGroupCode);
    const emailFormData = this.communicationFacade.createFormDataForEmail(emailData);
    emailFormData.append('description', this.emailSubject ?? selectedTemplate.description);
    emailFormData.append('mailCode', this.selectedMailCode?.mailCode ?? '');
    this.communicationFacade.initiateSendEmailRequest(emailFormData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, data?.message);
            this.onCloseSendEmailClicked();
          }
          this.ref.detectChanges();
          this.loaderService.hide();
          this.navigateConditionally();
        },
        error: (err: any) => {
          this.loaderService.hide();
          this.isSendEmailSuccess.emit(false);
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  navigateConditionally() {
    if (this.triggerFrom !== ScreenType.ClientProfile) {
      switch (this.communicationEmailTypeCode) {
        case CommunicationEventTypeCode.PendingNoticeEmail:
        case CommunicationEventTypeCode.RejectionNoticeEmail:
          this.router.navigate([`/case-management/cases/`]);
          break;
        case CommunicationEventTypeCode.ApprovalNoticeEmail:
        case CommunicationEventTypeCode.DisenrollmentNoticeEmail:
          this.router.navigate([`/case-management/cases/case360/${this.entityId}`]);
          break;
      }
    }
  }

  getApiTemplateTypeCode(): { templateTypeCode: string, eventGroupCode: string } {
    let templateTypeCode = '';
    let eventGroupCode = '';
    switch (this.communicationEmailTypeCode) {
      case CommunicationEventTypeCode.PendingNoticeEmail:
        if (this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview) {
          templateTypeCode = CommunicationEventTypeCode.CerPendingEmailSent;
          eventGroupCode = EventGroupCode.CER;
        }
        else {
          templateTypeCode = CommunicationEventTypeCode.PendingEmailSent;
          eventGroupCode = EventGroupCode.Application;
        }
        break;
      case CommunicationEventTypeCode.RejectionNoticeEmail:
        templateTypeCode = CommunicationEventTypeCode.RejectionEmailSent;
        eventGroupCode = EventGroupCode.Application;
        break;
      case CommunicationEventTypeCode.ApprovalNoticeEmail:
        if (this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview) {
          templateTypeCode = CommunicationEventTypeCode.CerApprovalEmailSent;
          eventGroupCode = EventGroupCode.CER;
        }
        else {
          templateTypeCode = CommunicationEventTypeCode.ApprovalEmailSent;
          eventGroupCode = EventGroupCode.Application;
        }
        break;
      case CommunicationEventTypeCode.DisenrollmentNoticeEmail:
        templateTypeCode = CommunicationEventTypeCode.DisenrollmentEmailSent;
        eventGroupCode = EventGroupCode.CER; // need to change to client profile
        break;
      case CommunicationEventTypeCode.VendorEmail:
        templateTypeCode = CommunicationEventTypeCode.VendorEmailSent;
        eventGroupCode = EventGroupCode.Financial;
        break;
      case 'CLIENT_EMAIL':
        templateTypeCode = CommunicationEventTypeCode.ClientEmailSent;
        eventGroupCode = EventGroupCode.ClientProfile;
        break;
        case CommunicationEventTypeCode.ApplicationAuthorizationEmail:
          templateTypeCode = CommunicationEventTypeCode.ApplicationAuthorizationEmailSent;
          eventGroupCode = EventGroupCode.Application;
          break;
        case CommunicationEventTypeCode.CerAuthorizationEmail:
          templateTypeCode = CommunicationEventTypeCode.CerAuthorizationEmailSent;
          eventGroupCode = EventGroupCode.CER;
          break;
        case CommunicationEventTypeCode.RestrictedNoticeEmail:
          templateTypeCode = CommunicationEventTypeCode.RestrictedEmailSent;
          eventGroupCode = EventGroupCode.CER;
          break;
    }
    return { templateTypeCode, eventGroupCode };
  }

  onSendEmailConfirmationClicked() {
    this.selectedTemplate.templateContent = this.updatedTemplateContent;
    if (this.selectedToEmails === undefined || this.selectedToEmails === '' || this.selectedToEmails?.length === 0) {
      this.isToEmailMissing = true;
      this.isFormValid = false;
      this.onSendEmailDailougeConfirmationClicked();
    }
    if (this.emailSubject === undefined || this.emailSubject === '') {
      this.isEmailSubjectMissing = true;
      this.isFormValid = false;
      this.onSendEmailDailougeConfirmationClicked();
    }
    if (this.selectedTemplate.templateContent === undefined || this.selectedTemplate.templateContent === '' || this.selectedTemplate.templateContent === "" || this.selectedTemplate.templateContent.trim() === '<p></p>') {
      this.isContentMissing = true;
      this.isFormValid = false;
      this.onCloseSaveForLaterClicked();
    }
    if (this.notificationGroup === ScreenType.VendorProfile) {
      if (this.selectedMailCode === undefined || this.selectedMailCode === '') {
        this.isMailCodeMissing = true;
        this.isFormValid = false;
        this.onCloseSaveForLaterClicked();
      }
    }
    if (this.isFormValid) {
      this.isOpenSendEmailClicked = true;
      this.isShowPreviewEmailPopupClicked = false;
      this.isShowSendEmailConfirmationPopupClicked = true;
    }
    this.ngDirtyInValid();
  }

  onCloseSendEmailClicked() {
    this.closeSendEmailEvent.emit(CommunicationEvents.Close);
  }

  onClosePreviewEmail() {
    this.isShowPreviewEmailPopupClicked = false;
  }
  /** External event methods **/
  handleDdlEmailValueChange(event: any) {
    this.isToEmailMissing = false;
    this.isEmailSubjectMissing = false;
    this.isContentMissing = false;
    this.handleconfirmPopupHeader(event.templateTypeCode);
    if (this.notificationGroup === ScreenType.VendorProfile)
    {
    this.isMailCodeMissing = false;
    }
    if (this.triggerFrom === ScreenType.ClientProfile || this.triggerFrom === ScreenType.VendorProfile) {
      this.communicationEmailTypeCode = event.templateTypeCode;
    }
    this.selectedTemplate = event;
    if ((this.communicationEmailTypeCode === CommunicationEventTypeCode.PendingNoticeEmail
      || this.communicationEmailTypeCode === CommunicationEventTypeCode.RejectionNoticeEmail
      || this.communicationEmailTypeCode === CommunicationEventTypeCode.ApprovalNoticeEmail
      || this.communicationEmailTypeCode === CommunicationEventTypeCode.DisenrollmentNoticeEmail)
      && (this.triggerFrom === WorkflowTypeCode.NewCase || this.triggerFrom === WorkflowTypeCode.CaseEligibilityReview)) {

      this.communicationFacade.loadDraftNotificationRequest(this.entityId, this.entityType, this.templateLoadType, this.communicationEmailTypeCode).subscribe((response: any) => {
        if (response.length > 0) {
          this.setDraftedTemplate(response[0])
          this.ref.detectChanges();
        }
        else {
          this.loadNewTemplate(event);
        }
      });
    } else if ((event.subTypeCode === CommunicationEventTypeCode.VendorEmail || event.subTypeCode === CommunicationEventTypeCode.ClientEmail) && (this.triggerFrom == ScreenType.VendorProfile || this.triggerFrom == ScreenType.ClientProfile)) {
      this.setDraftedTemplate(event);
    }
    else {
      this.loadNewTemplate(event);
    }
    this.ngDirtyInValid();
  }

  handleconfirmPopupHeader(event: any){
    switch(event){
      case CommunicationEventTypeCode.PendingNoticeEmail:
        this.confirmPopupHeader = 'Send Pending Email';
        this.snackBarMessage = 'Pending Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = 'Send Pending Email Later?';
        this.saveForLaterModelText="You must send the Pending Email within 14 Days";
        break;
      case CommunicationEventTypeCode.RejectionNoticeEmail:
        this.confirmPopupHeader = 'Send Rejection Email';
        this.snackBarMessage = 'Rejection Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = 'Send Rejection Email Later?';
        this.saveForLaterModelText="You must send the Rejection Email within 14 Days";
        break;
      case CommunicationEventTypeCode.ApprovalNoticeEmail:
        this.confirmPopupHeader = 'Send Approval Email';
        this.snackBarMessage = 'Approval Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = 'Send Approval Email Later?';
        this.saveForLaterModelText="You must send the Approval Email within 14 Days";
        break;
      case CommunicationEventTypeCode.DisenrollmentNoticeEmail:
        this.confirmPopupHeader = 'Send Disenrollment Email';
        this.snackBarMessage = 'Disenrollment Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = 'Send Disenrollment Email Later?';
        this.saveForLaterModelText="You must send the Disenrollment Email within 2 Days";
        break;
      case CommunicationEventTypeCode.RestrictedNoticeEmail:
        this.confirmPopupHeader = 'Send Restricted Email';
        this.snackBarMessage = 'Restricted Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = 'Send Restricted Email Later?';
        this.saveForLaterModelText="To pick up where you left off, click \"New Email\" from the client's profile";
        break;
      default:
        this.confirmPopupHeader = 'Send Email';
        this.snackBarMessage = 'Email Sent! An event has been logged.';
        this.saveForLaterHeadterText = "Email Draft Saved";
        this.saveForLaterModelText="To pick up where you left off, click \"New Email\" from the client's profile";
        break;
    }
  }

  loadNewTemplate(event: any) {
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
              this.emailSubject = data.description;
              this.loadMailingAddress();
              this.isClearEmails = true;
              this.isShowToEmailLoader$.next(true);
              this.isOpenDdlEmailDetails = true;
              this.selectedToEmails = [];
              this.getToEmail(this.toEmail);
              this.selectedToEmails = this.emails;
              if (data.description === 'Draft Custom Email') {
                this.emailSubject = '';
              } else {
                if (!this.emailSubject) {
                  this.emailSubject = data.description;
                }
              }
              if (data?.bccEmail?.length > 0) {
                this.bccEmail.push(data.bcc?.map((item: any) => item.email));
                this.isBCCDropdownVisible = false;
              }
              this.showToEmailLoader = false;
              this.getLoginUserCcEmail(this.loginUserEmail);
              if(this.communicationEmailTypeCode === CommunicationEventTypeCode.RestrictedNoticeEmail){
                this.getLoginUserCcEmail(this.caseManagerEmail);
              }
              this.ref.detectChanges();
              this.loaderService.hide();
            }
          },
          error: (err: any) => {
            this.loaderService.hide();
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          },
        });
    }
    else {
      this.setDraftedTemplate(event);
    }
  }

  setDraftedTemplate(event: any) {
    if (this.triggerFrom == ScreenType.VendorProfile || this.triggerFrom == ScreenType.ClientProfile) {
      this.communicationEmailTypeCode = event.subTypeCode;
    }
    if (event.subTypeCode === this.communicationEmailTypeCode || this.communicationEmailTypeCode === CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode === CommunicationEventTypeCode.CerAuthorizationEmail) {
      this.selectedTemplateId = event.notificationTemplateId;
      this.selectedTemplate = event;
      this.selectedTemplateContent = event.templateContent == undefined ? event.requestBody : event.templateContent;
      this.updatedTemplateContent = event.templateContent == undefined ? event.requestBody : event.templateContent;
      this.isClearEmails = true;
      this.isShowToEmailLoader$.next(true);
      this.isOpenDdlEmailDetails = true;
      this.selectedMailCodeId = event.vendorAddressId;
      this.selectedToEmails = [];
      this.getToEmail(event.to);
      this.selectedToEmails = this.emails;

      this.emailSubject = event?.requestSubject ?? event.description;
      this.defaultBCCEmail = event.bcc;
      if (event?.bcc?.length > 0) {
        this.isBCCDropdownVisible = false;
        event?.bcc?.forEach((email: any) => {
           if (!this.selectedBccEmail?.includes(email?.email?.trim())) {
             this.selectedBccEmail?.push(email?.email);
             this.bccEmail?.push(email?.email);
           }
         });
      }
      this.showToEmailLoader = false;
      this.documentTemplate = {
        'description': event.description ?? event?.requestSubject,
        'documentTemplateId': event.notificationTemplateId
      };
      this.selectedMailCode = {
        'mailCode': event?.selectedMailCode,
      };
      this.getLoginUserCcEmail(this.loginUserEmail);
      if(this.communicationEmailTypeCode === CommunicationEventTypeCode.RestrictedNoticeEmail){
        this.getLoginUserCcEmail(this.caseManagerEmail);
      }
      this.selectedTemplate.notificationDraftId = event.notificationDraftId;
      this.ref.detectChanges();
    }
    else {
      this.selectedTemplate.notificationDraftId = event.notificationDraftId;
    }
  }

  
  getToEmail(to: any) {
    if(to?.length > 0){
    for (let email of to) {
    if (email && email.trim() !== "" && (this.selectedToEmails.filter((x: any) => x === email).length === 0) && this.isValidEmail(email)) {
          this.emails.push(email?.trim());
        }
      }
    }
  }

  getLoginUserCcEmail(loginUserEmail: any) {
    if (loginUserEmail) {
      if (this.ccEmail == undefined) {
        const email = [];
        email.push(loginUserEmail?.email);
        this.ccEmail = email;
      } else {
        let emailExists = this.ccEmail?.includes(loginUserEmail?.email?.trim());
        if (!emailExists) {
          this.ccEmail?.push(loginUserEmail?.email);
        }
      }
      if (this.selectedCCEmail == undefined) {
        const email = [];
        email.push(loginUserEmail?.email);
        this.selectedCCEmail = email;
      } else {
        let emailExists = this.selectedCCEmail?.includes(loginUserEmail?.email?.trim());
        if (!emailExists) {
          this.selectedCCEmail?.push(loginUserEmail?.email);
        }
      }
      if (this.defaultCCEmail == undefined) {
        const email = [];
        email.push(loginUserEmail);
        this.defaultCCEmail = email;
      } else {
        let emailExists = this.defaultCCEmail?.includes(loginUserEmail?.email?.trim());
        if (!emailExists) {
          this.defaultCCEmail.push(loginUserEmail);
        }
      }
    }
  }

  openNewEmailClicked() {
    this.loaderService.show();
    this.communicationFacade.deleteNotificationDraft(this.notificationDraftId)
      .subscribe({
        next: (data: any) => {
          if (!!data === true) {
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
    this.selectedToEmails = event[0].email;
  }

  private initiateAdobeEsignProcess(emailData: any) {
    this.loaderService.show();
    let {templateTypeCode, eventGroupCode } = this.getApiTemplateTypeCode();
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmails, this.clientCaseEligibilityId, this.entityId, this.emailSubject, this.loginUserId, this.selectedCCEmail, this.selectedBccEmail, this.isSaveForLater, templateTypeCode, eventGroupCode);
    let formData = this.esignFacade.prepareAdobeEsingData(esignRequestFormdata, emailData, this.cerEmailAttachedFiles);
    this.esignFacade.initiateAdobeesignRequest(formData, emailData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.isSendEmailSuccess.emit(true);
            this.closeSendEmailEvent.emit(CommunicationEvents.Print);
            this.onCloseSendEmailClicked();
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Email Sent! An event has been logged.')
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
    let formData = this.communicationFacade.preparePreviewModelData(emailData, this.entityType, this.selectedMailCode?.mailCode);
    this.communicationFacade.generateTextTemplate(this.entityId ?? 0, this.clientCaseEligibilityId ?? '', formData ?? '', requestType ?? '')
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.currentEmailData =  data;
            this.emailContentValue =  this.getSanitizedHtml(this.currentEmailData);
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
  private getSanitizedHtml(currentEmailData: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(currentEmailData);
  }
  private saveDraftEsignRequest(draftTemplate: any) {
    this.loaderService.show();
    this.isSaveForLater = true;
    let {templateTypeCode, eventGroupCode } = this.getApiTemplateTypeCode();
    let esignRequestFormdata = this.esignFacade.prepareDraftAdobeEsignFormData(this.selectedToEmails, this.clientCaseEligibilityId, this.entityId, this.emailSubject, this.loginUserId, this.selectedCCEmail, this.selectedBccEmail, this.isSaveForLater, templateTypeCode, eventGroupCode);
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
    let isFileExists = false;
    if (this.communicationEmailTypeCode == CommunicationEventTypeCode.ApplicationAuthorizationEmail || this.communicationEmailTypeCode == CommunicationEventTypeCode.CerAuthorizationEmail) {
      if (event.length > 0) {
        this.cerEmailAttachedFiles = event;
      } else {
        if (event.documentTemplateId) {
          isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.description);
          if (!isFileExists || isFileExists === undefined) {
            this.cerEmailAttachedFiles?.push(event);
          }
        }
        if (event.clientDocumentId) {
          isFileExists = this.cerEmailAttachedFiles?.some((item: any) => item.name === event?.documentName);
          if (!isFileExists || isFileExists === undefined) {
            this.cerEmailAttachedFiles?.push(event);
          }
        }
      }
      this.attachmentCount = this.cerEmailAttachedFiles?.length;
    } else {
      if (event.length > 0) {
        this.clientAndVendorAttachedFiles = event;
      } else {
        if (event.documentTemplateId) {
          isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.name);
          if (!isFileExists || isFileExists === undefined) {
            this.clientAndVendorAttachedFiles?.push(event);
          }
        }
        if (event.clientDocumentId) {
          isFileExists = this.clientAndVendorAttachedFiles?.some((item: any) => item.name === event?.documentName);
          if (!isFileExists || isFileExists === undefined) {
            this.clientAndVendorAttachedFiles?.push(event);
          }
        }
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
           let cc = data?.map((item: any) => item.email?.trim());
           cc?.forEach((email: any) => {
              if (!this.selectedCCEmail?.includes(email?.trim())) {
                this.selectedCCEmail?.push(email);
              }
            });
            this.ccEmail = this.selectedCCEmail;
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

  editorValueChange(event: any) {
    this.updatedTemplateContent = event;
    if(!(this.updatedTemplateContent  === undefined) || !(this.updatedTemplateContent === '') || !(this.updatedTemplateContent === "") || !(this.updatedTemplateContent.trim() === '<p></p>')){
      this.isContentMissing = false;
    }
    this.ref.detectChanges();
  }

  contentValidateEvent(event: boolean) {
    this.isFormValid = event;
  }

  ngDirtyInValid() {
    if (this.isToEmailMissing) {
      document.getElementById('toEmailAddress')?.classList.remove('ng-valid');
      document.getElementById('toEmailAddress')?.classList.add('ng-invalid');
      document.getElementById('toEmailAddress')?.classList.add('ng-dirty');
    }
    else {
      document.getElementById('toEmailAddress')?.classList.remove('ng-invalid');
      document.getElementById('toEmailAddress')?.classList.remove('ng-dirty');
      document.getElementById('toEmailAddress')?.classList.add('ng-valid');
    }

    if (this.isEmailSubjectMissing) {
      document.getElementById('subject')?.classList.remove('ng-valid');
      document.getElementById('subject')?.classList.add('ng-invalid');
      document.getElementById('subject')?.classList.add('ng-dirty');
    }
    else {
      document.getElementById('subject')?.classList.remove('ng-invalid');
      document.getElementById('subject')?.classList.remove('ng-dirty');
      document.getElementById('subject')?.classList.add('ng-valid');
    }

    if (this.isMailCodeMissing) {
      document.getElementById('mailCode')?.classList.remove('ng-valid');
      document.getElementById('mailCode')?.classList.add('ng-invalid');
      document.getElementById('mailCode')?.classList.add('ng-dirty');
    }
    else {
      document.getElementById('mailCode')?.classList.remove('ng-invalid');
      document.getElementById('mailCode')?.classList.remove('ng-dirty');
      document.getElementById('mailCode')?.classList.add('ng-valid');
    }
  }

}

