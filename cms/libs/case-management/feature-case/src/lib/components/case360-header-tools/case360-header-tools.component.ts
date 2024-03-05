/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy,   TemplateRef, ChangeDetectorRef, ViewChild,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationEventTypeCode, CommunicationEvents, CommunicationFacade, ContactFacade, ScreenType } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
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
  @Input() loadedClientHeader: any;
  @Input() clientCaseId: any;
  /* Public properties */ 
  @ViewChild('notificationDraftEmailDialog', { read: TemplateRef })
  notificationDraftEmailDialog!: TemplateRef<any>;
  @ViewChild('sendLetterDialog', { read: TemplateRef })
  sendLetterDialog!: TemplateRef<any>;
  @ViewChild('sendNewEmailDialog', { read: TemplateRef })
  sendNewEmailDialog!: TemplateRef<any>;
  @ViewChild('sendTextMessageDialog', { read: TemplateRef })
  sendTextMessageDialog!: TemplateRef<any>;
  screenName = ScreenType.ClientProfile;
  emailScreenName = ScreenType.Case360PageEmail; 
  letterScreenName = ScreenType.Case360PageLetter; 
  smsScreenName = ScreenType.Case360PageSMS; 
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
  buttonList!: any[];
  isFirstLoad = false;
  isNewNotificationClicked: boolean = false;
  isContinueDraftClicked: boolean = false;
  emailCommunicationEmailTypeCode = CommunicationEventTypeCode.ClientEmail;
  letterCommunicationEmailTypeCode = CommunicationEventTypeCode.ClientLetter;
  smsCommunicationEmailTypeCode = CommunicationEventTypeCode.ClientSMS;
  notificationGroup!: string;
  toEmail: Array<string> = [];
  currentCommunicationTypeCode!: string;
  selectedTemplateName!: TemplateRef<unknown>;
  notificationDraftId!: string;
  draftDropdownCheck: boolean = false;
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  private isNewSMSTextOpenedDialog : any;
  private isIdCardOpenedDialog : any;  
  private isDraftNotificationOpenedDialog: any;
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
        this.currentCommunicationTypeCode = this.letterCommunicationEmailTypeCode;
        this.notificationDraftCheck(this.clientId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
        this.currentCommunicationTypeCode = this.emailCommunicationEmailTypeCode;
        this.notificationDraftCheck(this.clientId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
        this.currentCommunicationTypeCode = this.emailCommunicationEmailTypeCode;
        this.notificationDraftCheck(this.clientId, this.currentCommunicationTypeCode, this.notificationDraftEmailDialog, templatename);
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
    private readonly ref: ChangeDetectorRef,) {
  }
  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
    this.phoneNumbersSubscription$.unsubscribe();
  }

  /* Internal Methods */
  ngOnInit(): void {    
    this.initialize();
  }

  private initialize() {
    this.loadPhoneNumbers();
    this.loadEmailAddress();
    this.addEmailSubscription();
    this.addPhoneNumbersSubscription();
    this.refreshButtonList();
  }

  private addEmailSubscription() {
    this.emailSubscription$ = this.emailAddress$.subscribe((email: any) => {
      const isEmailOk = email.filter((email:any) => email.detailMsgFlag === StatusFlag.Yes && email.paperlessFlag === StatusFlag.Yes)?.length > 0;
      this.sendActions[1].isVisible = isEmailOk;
      this.refreshButtonList();
      // Iterate over the list and push emails based on a condition
      if(isEmailOk){
      email.forEach((item: any) => {
        if (item.detailMsgFlag === StatusFlag.Yes && item.paperlessFlag === StatusFlag.Yes) {
          this.toEmail.push(item.email.trim());
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
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
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
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    }); 
  }

  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewEmailOpened = false;
      this.isSendNewEmailOpenedDialog.close();
    }
  }

  onDraftNotificationExistsConfirmation(notificationDraftEmailDialog: TemplateRef<unknown>): void {
    this.isDraftNotificationOpenedDialog = this.dialogService.open({
      content: notificationDraftEmailDialog, 
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
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
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
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

  onNewReminderClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    }); 
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

  notificationDraftCheck(clientId: any, typeCode: string, notificationDraftEmailDialog: TemplateRef<unknown>, templateName: TemplateRef<unknown>) {
    this.loaderService.show();
    this.communicationFacade.loadDraftNotificationRequest(clientId, typeCode)
    .subscribe({
      next: (data: any) =>{
        if (data?.length > 0) {
          for (let template of data){
            this.notificationDraftId = template.notifcationDraftId;
           }
          if(typeCode == CommunicationEventTypeCode.ClientEmail){
            this.notificationGroup = CommunicationEventTypeCode.EMAIL;
          }
          if(typeCode == CommunicationEventTypeCode.ClientLetter){
            this.notificationGroup = CommunicationEventTypeCode.LETTER;
          }
          if(typeCode === CommunicationEventTypeCode.ClientSMS){
            this.notificationGroup = CommunicationEventTypeCode.SMS;
          }
          this.onDraftNotificationExistsConfirmation(notificationDraftEmailDialog);
          this.ref.detectChanges();
        }else{
          this.loadNotificationTemplates(this.currentCommunicationTypeCode, templateName);
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

  loadNotificationTemplates(typeCode: string, templateName: TemplateRef<unknown>) {
    if(typeCode == CommunicationEventTypeCode.ClientEmail){
      templateName = this.sendNewEmailDialog;
      this.onSendNewEmailClicked(templateName);
    }
    if(typeCode == CommunicationEventTypeCode.ClientLetter){
      templateName = this.sendLetterDialog;
      this.onSendNewLetterClicked(templateName);
    }
    if(typeCode === CommunicationEventTypeCode.ClientSMS){
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
    this.onDraftNotificationCloseClicked('Close');
    this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.selectedTemplateName);
  }

  onContinueDraftClicked(){
    this.isContinueDraftClicked = true;
    this.isNewNotificationClicked = false;
    this.onDraftNotificationCloseClicked('Close');
    this.loadNotificationTemplates(this.currentCommunicationTypeCode, this.sendNewEmailDialog);
  }
}
