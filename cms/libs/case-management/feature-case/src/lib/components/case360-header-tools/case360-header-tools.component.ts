/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy,   TemplateRef,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationEvents, ContactFacade, ScreenType } from '@cms/case-management/domain';
import { Observable, Subscription } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { StatusFlag } from '@cms/shared/ui-common';
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
  /* Public properties */ 
  screenName = ScreenType.Case360Page;
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
  private todoDetailsDialog : any;
  private newReminderDetailsDialog : any;
  private isSendNewLetterDialog : any;
  private isSendNewEmailOpenedDialog : any;
  private isNewSMSTextOpenedDialog : any;
  private isIdCardOpenedDialog : any;  
  clientHeader:any
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      id: 'new_letter',
      click: (templatename: any): void => {
        this.onSendNewLetterClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      id: 'new_email',
      isVisible: false,
      click: (templatename: any): void => {
        this.onSendNewEmailClicked(templatename);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      id: 'new_sms_text',
      isVisible: false,
      click: (templatename: any): void => {
        this.onNewSMSTextClicked(templatename);
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
    private dialogService: DialogService) {
  }
  ngOnDestroy(): void {
    this.emailSubscription$.unsubscribe();
    this.phoneNumbersSubscription$.unsubscribe();
  }

  /* Internal Methods */
  ngOnInit(): void {    
    this.initialize();
    this.loadedClientHeader.subscribe(res =>{
      this.clientHeader = res;
    })
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

  onNewSMSTextClicked(template: TemplateRef<unknown>): void {
    this.isNewSMSTextOpenedDialog = this.dialogService.open({
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    }); 
  }
  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
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

  loadMailingAddress() {
    this.contactFacade.loadMailingAddress(this.clientId);
  }

  loadPhoneNumbers() {
    this.contactFacade.loadPhoneNumbers(this.clientId);
  }

  loadEmailAddress() {
    this.contactFacade.loadEmailAddress(this.clientId, this.clientCaseEligibilityId);
  }

}
