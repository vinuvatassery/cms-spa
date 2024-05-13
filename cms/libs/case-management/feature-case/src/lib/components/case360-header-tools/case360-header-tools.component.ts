/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy,   TemplateRef, ChangeDetectorRef, ViewChild, EventEmitter, Output,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaseStatusCode, CommunicationEventTypeCode, CommunicationEvents, CommunicationFacade, ContactFacade, EntityTypeCode, ScreenType, WorkflowFacade } from '@cms/case-management/domain';
import { Observable, Subscription, first } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-case360-header-tools',
  templateUrl: './case360-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderToolsComponent implements OnInit, OnDestroy {
  /* Input properties */
  @Input() clientCaseEligibilityId: any
  @Input() clientId: any
  @Input() loadedClientHeader!: Observable<any>;
  @Input() clientCaseId: any;
  @Output() onNewReminderClickedEvent = new EventEmitter()
  /* Public properties */
  @ViewChild('notificationDraftEmailDialog', { read: TemplateRef })
  notificationDraftEmailDialog!: TemplateRef<any>;
  @ViewChild('sendLetterDialog', { read: TemplateRef })
  sendLetterDialog!: TemplateRef<any>;
  @ViewChild('sendNewEmailDialog', { read: TemplateRef })
  sendNewEmailDialog!: TemplateRef<any>;
  @ViewChild('sendTextMessageDialog', { read: TemplateRef })
  sendTextMessageDialog!: TemplateRef<any>;
  @ViewChild('viewTemplateDialog', { read: TemplateRef })
  viewTemplateDialog!: TemplateRef<any>;
  screenName = ScreenType.ClientProfile;
  emailScreenName = ScreenType.Case360PageEmail;
  letterScreenName = ScreenType.Case360PageLetter;
  smsScreenName = ScreenType.Case360PageSMS;
  smsNotificationGroup = ScreenType.Case360PageSMS;
  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  mailingAddress$ = this.contactFacade.mailingAddress$;
  emailAddress$ = this.contactFacade.emailAddress$;
  phoneNumbers$ = this.contactFacade.phoneNumbers$;
  emailSubscription$ = new Subscription();
  phoneNumbersSubscription$ = new Subscription();
  reloadSubscription$ = new Subscription();
  emailLetterSubscription !: Subscription;
  buttonList!: any[];
  isFirstLoad = false;
  isNewNotificationClicked: boolean = false;
  isContinueDraftClicked: boolean = false;
  emailCommunicationTypeCode : any;
  letterCommunicationTypeCode : any;
  smsCommunicationTypeCode : any;
  notificationGroup!: string;
  toEmail: Array<string> = [];
  currentCommunicationTypeCode!: string;
  selectedTemplateName!: TemplateRef<unknown>;
  notificationDraftId!: string;
  draftDropdownCheck: boolean = false;
  templateLoadType!:any;
  informationalText!:any;
  templateHeader!:any;
  confirmPopupHeader:any;
  saveForLaterHeadterText:any;
  saveForLaterModelText:any;
  confirmationModelText:any;
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  private isSendNewLetterDialog : any;
  private isPreviewTemplateDialog : any;
  private isSendNewEmailOpenedDialog : any;
  private isNewSMSTextOpenedDialog : any;
  private isIdCardOpenedDialog : any;
  private isDraftNotificationOpenedDialog: any;
  paperless$ = this.contactFacade.paperless$;
  clientHeader:any
  paperlessFlag:any;
  emailSubject:any;
  loginUserEmail: any;
  caseManagerEmail: any;
  entityType= EntityTypeCode.Client;
  triggerFrom= ScreenType.ClientProfile;
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      id: 'new_letter',
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
        this.draftDropdownCheck = true;
        this.selectedTemplateName = templatename;
        this.letterCommunicationTypeCode = '';
        this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
        this.currentCommunicationTypeCode = CommunicationEventTypeCode.LetterTypeCode;
        this.notificationGroup = CommunicationEventTypeCode.LETTER;
        this.informationalText = "Select an existing template or draft a custom letter."
        this.templateHeader = 'Send New Letter';
        this.saveForLaterHeadterText = "Letter Draft Saved";
        this.saveForLaterModelText="To pick up where you left off, click \"New Letter\" from the client's profile";
        this.confirmPopupHeader = 'Send Letter to Print?';
        this.confirmationModelText="This action cannot be undone.";
        this.notificationDraftCheck(this.clientId,this.templateLoadType, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      id: 'new_email',
      isVisible: false,
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
        this.draftDropdownCheck = true;
        this.selectedTemplateName = templatename;
        this.emailCommunicationTypeCode = '';
        this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
        this.currentCommunicationTypeCode = CommunicationEventTypeCode.EmailTypeCode;
        this.notificationGroup = CommunicationEventTypeCode.EMAIL;
        this.informationalText = "Select an existing template or draft a custom email."
        this.templateHeader = 'Send New Email';
        this.saveForLaterHeadterText = "Email Draft Saved";
        this.saveForLaterModelText="To pick up where you left off, click \"New Email\" from the client's profile";
        this.confirmPopupHeader = 'Send Email?';
        this.confirmationModelText="This action cannot be undone.";
        this.notificationDraftCheck(this.clientId,this.templateLoadType , this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      id: 'new_sms_text',
      isVisible: false,
      click: (templatename: any): void => {
        if(this.draftDropdownCheck === false){
        this.draftDropdownCheck = true;
        this.selectedTemplateName = templatename;
        this.templateLoadType = CommunicationEventTypeCode.ClientSMS;
        this.currentCommunicationTypeCode = CommunicationEventTypeCode.SmsTypeCode;
        this.smsCommunicationTypeCode = '';
        this.notificationGroup = CommunicationEventTypeCode.SMS;
        this.informationalText = "Select an existing template or draft custom text messages"
        this.templateHeader = 'Send New SMS Text';
        this.saveForLaterHeadterText = "Sms Draft Saved";
        this.saveForLaterModelText="To pick up where you left off, click ''New SMS Text'' from the clients profile";
        this.confirmPopupHeader = 'Send Sms?';
        this.confirmationModelText="This action cannot be undone.";
        this.notificationDraftCheck(this.clientId,this.templateLoadType, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      id:'new_id_card',
      isVisible: true,
      click: (templatename: any): void => {
        this.onIdCardClicked(templatename);
      },
    },
  ];

  /* constructor */
  constructor(private readonly contactFacade: ContactFacade, private readonly route: ActivatedRoute,
    private dialogService: DialogService, private readonly communicationFacade: CommunicationFacade,
    private readonly loaderService: LoaderService, private readonly loggingService: LoggingService,
    private readonly ref: ChangeDetectorRef,private readonly workflowFacade: WorkflowFacade,
    private readonly userDataService: UserDataService,) {
  }
  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
    this.phoneNumbersSubscription$.unsubscribe();
    this.emailLetterSubscription.unsubscribe();
  }

  /* Internal Methods */
  ngOnInit(): void {
    this.getLoggedInUserProfile();
    this.getAssignedCaseManagerDetails();
    this.initialize();
    this.loadedClientHeader.subscribe(res => {
      this.clientHeader = res;
    })

  }

  private loadPaperLessStatus() {
    this.paperless$
      ?.pipe(first((emailData: any) => emailData?.paperlessFlag != null))
      .subscribe((emailData: any) => {
        if (emailData?.paperlessFlag) {
          this.paperlessFlag = emailData?.paperlessFlag;
        }
      });

      this.contactFacade.loadClientPaperLessStatus(this.clientId,this.clientCaseEligibilityId);
  }
  private initialize() {
    this.emailLetterSubscriptionInitializer();
    this.loadPaperLessStatus();
    this.loadPhoneNumbers();
    this.addEmailSubscription();
    this.loadEmailAddress();
    this.addPhoneNumbersSubscription();
    this.refreshButtonList();
  }

  private emailLetterSubscriptionInitializer(){
    this.emailLetterSubscription = this.workflowFacade.sendEmailLetterClicked$.subscribe(response => {
      if (response) {
        if (this.workflowFacade.caseStatus.toLowerCase() === CaseStatusCode.disenrolled.toLowerCase()) {
          if (this.paperlessFlag === StatusFlag.Yes) {
            this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
            this.emailCommunicationTypeCode = CommunicationEventTypeCode.DisenrollmentNoticeEmail;
            this.informationalText = "If there is an issue with this email template, please contact your Administrator. Make edits as needed, then click ''Send Email'' once the email is complete."
            this.templateHeader = 'Send Disenrollment Email';
            this.emailSubject = "CAREAssist Disenrollment Notice";
            this.confirmPopupHeader = 'Send Disenrollment email to print?';
            this.saveForLaterHeadterText = "Send Disenrollment Email Later?";
            this.saveForLaterModelText="You must send the Disenrollment Email within 2 Days";
            this.confirmationModelText="This action cannot be undone. If applicable, the client will also receive a notification via SMS text, and/or through their online portal.";

            this.notificationDraftCheck(this.clientId, this.templateLoadType,this.emailCommunicationTypeCode, this.notificationDraftEmailDialog, this.sendNewEmailDialog);
          }
          else {
            this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
            this.letterCommunicationTypeCode = CommunicationEventTypeCode.DisenrollmentNoticeLetter;
            this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click ''Send to Print'' once the letter is complete."
            this.templateHeader = 'Send Disenrollment Letter';
            this.emailSubject = '';
            this.confirmPopupHeader = 'Send Disenrollment letter to print?';
            this.saveForLaterHeadterText = "Send Disenrollment Letter Later?";
            this.saveForLaterModelText="You must send the  Disenrollment Letter within 2 Days";
            this.confirmationModelText="This action cannot be undone. If applicable, the client will also receive a notification via email, SMS text, and/or through their online portal.";
            this.notificationDraftCheck(this.clientId, this.templateLoadType,this.letterCommunicationTypeCode, this.notificationDraftEmailDialog, this.sendLetterDialog);
          }
          this.ref.detectChanges();
        }
        if (this.workflowFacade.caseStatus.toLowerCase() === CaseStatusCode.restricted.toLowerCase()) {
          if (this.paperlessFlag === StatusFlag.Yes) {
            this.templateLoadType = CommunicationEventTypeCode.ClientEmail;
            this.notificationGroup = CommunicationEventTypeCode.EMAIL;
            this.emailCommunicationTypeCode = CommunicationEventTypeCode.RestrictedNoticeEmail;
            this.currentCommunicationTypeCode = CommunicationEventTypeCode.RestrictedNoticeEmail;
            this.informationalText = "If there is an issue with this email template, please contact your Administrator. Make edits as needed, then click "+'"Send Email"'+" once the email is complete."
            this.templateHeader = 'Send Restricted Email';
            this.emailSubject = "CAREAssist Restricted Notice";
            this.confirmPopupHeader = 'Send Restricted email to print?';
            this.saveForLaterHeadterText = "Send Restricted Email Later?";
            this.saveForLaterModelText="To pick up where you left off, click New Emai from the client's profile";
            this.confirmationModelText="This action cannot be undone. If applicable, the client will also receive a notification via SMS text, and/or through their online portal.";

            this.notificationDraftCheck(this.clientId, this.templateLoadType,this.emailCommunicationTypeCode, this.notificationDraftEmailDialog, this.sendNewEmailDialog);
          }
          else {
            this.templateLoadType = CommunicationEventTypeCode.ClientLetter;
            this.notificationGroup = CommunicationEventTypeCode.LETTER;
            this.letterCommunicationTypeCode = CommunicationEventTypeCode.RestrictedNoticeLetter;
            this.currentCommunicationTypeCode = CommunicationEventTypeCode.RestrictedNoticeLetter;
            this.informationalText = "If there is an issue with this letter template, please contact your Administrator. Make edits as needed, then click "+'"Send to Print"'+" once the letter is complete."
            this.templateHeader = 'Send Restricted Letter';
            this.emailSubject = '';
            this.confirmPopupHeader = 'Send Restricted letter to print?';
            this.saveForLaterHeadterText = "Send Restricted Letter Later?";
            this.saveForLaterModelText="To pick up where you left off, click New Letter from the client's profile";
            this.confirmationModelText="This action cannot be undone. If applicable, the client will also receive a notification via email, SMS text, and/or through their online portal.";
            this.notificationDraftCheck(this.clientId, this.templateLoadType,this.letterCommunicationTypeCode, this.notificationDraftEmailDialog, this.sendLetterDialog);
          }
          this.ref.detectChanges();
        }
      }
    })
  }

  private addEmailSubscription() {
    this.emailSubscription$ = this.emailAddress$.subscribe((email: any) => {
      const isEmailOk = email.filter((x:any)=>x.detailMsgFlag === StatusFlag.Yes)?.length > 0;
      this.sendActions[1].isVisible = isEmailOk;
      this.refreshButtonList();
      // Iterate over the list and push emails based on a condition
      if(isEmailOk){
      email.forEach((item: any) => {
        if (item.detailMsgFlag === StatusFlag.Yes && item.paperlessFlag === StatusFlag.Yes) {
          let emailExists = this.toEmail?.includes(item.email.trim());
          if(!emailExists){
          this.toEmail.push(item.email.trim());
          }
        }
      });
    }
    });
  }

  private addPhoneNumbersSubscription() {
    this.phoneNumbersSubscription$ = this.phoneNumbers$
      .subscribe((phone: any) => {
        const smsOkPhoneExist = phone.filter((phone:any) => phone.smsTextConsentFlag === StatusFlag.Yes)?.length > 0;
        this.sendActions[2].isVisible = smsOkPhoneExist;
        this.refreshButtonList();
      });
  }

  private refreshButtonList() {
    this.buttonList = this.sendActions?.filter((action: any) => action.isVisible === true);
  }

  /* Internal Methods */

  onSendNewLetterClicked(template: TemplateRef<unknown>): void {
    this.isSendNewLetterDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np'
    });
  }
  handleSendNewLetterClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.draftDropdownCheck = false;
      this.isSendNewLetterDialog.close(value);
      this.isSendNewLetterOpened = false;
    }
  }
  onSendNewEmailClicked(template: TemplateRef<unknown>): void {
    this.isSendNewEmailOpenedDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np',
    });
  }

  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.draftDropdownCheck = false;
      this.isSendNewEmailOpened = false;
      this.isSendNewEmailOpenedDialog.close();
    }
  }

  onDraftNotificationExistsConfirmation(notificationDraftEmailDialog: TemplateRef<unknown>): void {
    this.isDraftNotificationOpenedDialog = this.dialogService.open({
      content: notificationDraftEmailDialog,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }

  onDraftNotificationCloseClicked(result: any) {
    if (result) {
      this.draftDropdownCheck = false;
      this.isDraftNotificationOpenedDialog.close();
    }
  }

  onNewSMSTextClicked(template: TemplateRef<unknown>): void {
    this.isNewSMSTextOpenedDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np',
    });
  }

  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.draftDropdownCheck = false;
      this.isNewSMSTextOpenedDialog.close();
      this.isNewSMSTextOpened = false;
    }
  }

  onIdCardClicked(template: TemplateRef<unknown>): void {
    this.isIdCardOpenedDialog = this.dialogService.open({
      title: 'Send New ID Card',
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  handleIdCardClosed(result: any) {
    if(result){
      this.isIdCardOpened = false;
      this.isIdCardOpenedDialog.close();
    }
  }

  onNewReminderClosed() {
      this.newReminderDetailsDialog.close()
    }

  onNewReminderClicked(): void {
   this.onNewReminderClickedEvent.emit()
  }

  onTodoDetailsClosed(result: any) {
    if(result){
      this.todoDetailsDialog.close();
    }
  }

  onTodoDetailsClicked( template: TemplateRef<unknown>): void {
    this.todoDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }


  handlePreviewTemplateClosed(result: any) {
    if (result) {
      this.isPreviewTemplateDialog.close(result);

    }
  }
  onPreviewTemplateClicked(template: TemplateRef<unknown>): void {
    this.isPreviewTemplateDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xl just_start app-c-modal-np',
    });
  }


  notificationDraftCheck(clientId: any, typeCode: string, subTypeCode:string, notificationDraftEmailDialog: TemplateRef<unknown>, templateName: TemplateRef<unknown>) {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(clientId, this.entityType, typeCode, '')
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          for (let template of data){
            this.notificationDraftId = template.notificationDraftId;
           }
          if(subTypeCode == CommunicationEventTypeCode.EmailTypeCode){
            this.notificationGroup = CommunicationEventTypeCode.EMAIL;
          }
          if(subTypeCode == CommunicationEventTypeCode.LetterTypeCode){
            this.notificationGroup = CommunicationEventTypeCode.LETTER;
          }
          if(subTypeCode === CommunicationEventTypeCode.SmsTypeCode){
            this.notificationGroup = CommunicationEventTypeCode.SMS;
          }
          this.onDraftNotificationExistsConfirmation(notificationDraftEmailDialog);
          this.ref.detectChanges();
        }else{
          this.loadNotificationTemplates(subTypeCode, templateName);
        }
      this.loaderService.hide();
    },
    error: (err: any) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.contactFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  loadNotificationTemplates(subTypeCode: string, templateName: TemplateRef<unknown>) {
    if(subTypeCode == CommunicationEventTypeCode.EmailTypeCode || subTypeCode == CommunicationEventTypeCode.DisenrollmentNoticeEmail || subTypeCode == CommunicationEventTypeCode.RestrictedNoticeEmail){
      templateName = this.sendNewEmailDialog;
      this.onSendNewEmailClicked(templateName);
    }
    if(subTypeCode == CommunicationEventTypeCode.LetterTypeCode || subTypeCode == CommunicationEventTypeCode.DisenrollmentNoticeLetter || subTypeCode == CommunicationEventTypeCode.RestrictedNoticeLetter){
      templateName = this.sendLetterDialog;
      this.onSendNewLetterClicked(templateName);
    }
    if(subTypeCode === CommunicationEventTypeCode.SmsTypeCode){
      templateName = this.sendTextMessageDialog;
      this.onNewSMSTextClicked(templateName);
    }
  }

  loadMailingAddress() {
    this.contactFacade.loadMailingAddress(this.clientId);
  }

  loadPhoneNumbers() {
    this.contactFacade.loadPhoneNumbers(this.clientId);
  }

  loadEmailAddress() {
    this.contactFacade.loadEmailAddress(this.clientId, this.clientCaseEligibilityId);
  }

  onNewNotificationClicked(){
    this.isNewNotificationClicked = true;
    this.isContinueDraftClicked = false;
    this.onDraftNotificationCloseClicked(CommunicationEvents.Close);
    this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.selectedTemplateName);
  }

  onContinueDraftClicked(){
    this.isContinueDraftClicked = true;
    this.isNewNotificationClicked = false;
    this.onDraftNotificationCloseClicked(CommunicationEvents.Close);
    this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.sendNewEmailDialog);
  }

  getLoggedInUserProfile(){
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile:any)=>{
      if(profile?.length>0){
       if(profile[0]?.email){
        const ccEmail ={
          email: profile[0]?.email,
          isDefault: true
        };
          this.loginUserEmail = ccEmail;
       }
      }
    });
    this.loaderService.hide();
  }

  getAssignedCaseManagerDetails() {
    this.loaderService.show();
    this.contactFacade.lodAssignedCaseManager(this.clientId, this.clientCaseId)
      .subscribe({
        next: (caseManager: any) => {
          if(caseManager !== null && caseManager?.email !== null){
            const ccEmail ={
              email: caseManager.email,
              isDefault: true
            };
            this.caseManagerEmail = ccEmail;
          }
        },
        error: (err) => {
          this.loggingService.logException(err);
          this.loaderService.hide();
        },
      });
    this.loaderService.hide();
  }

}
