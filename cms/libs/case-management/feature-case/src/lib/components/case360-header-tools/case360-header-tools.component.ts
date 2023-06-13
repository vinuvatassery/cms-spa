/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy,   TemplateRef,} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationEvents, ContactFacade, ScreenType } from '@cms/case-management/domain';
import { Subscription } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
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
  /* Public properties */ 
  screenName = ScreenType.Case360Page;
  isNewReminderOpened = false;
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
  public sendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      isVisible: true,
      click: (): void => {
        this.onSendNewLetterClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      isVisible: false,
      click: (): void => {
        this.onSendNewEmailClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      isVisible: false,
      click: (): void => {
        this.onNewSMSTextClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      isVisible: true,
      click: (): void => {
        this.onIdCardClicked();
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
      this.sendActions[1].isVisible = email?.length > 0;
      this.refreshButtonList();
    });
  }

  private addPhoneNumbersSubscription() {
    this.phoneNumbersSubscription$ = this.phoneNumbers$
      .subscribe((phone: any) => {
        this.sendActions[2].isVisible = phone?.length > 0;
        this.refreshButtonList();
      });
  }

  private refreshButtonList() {
    this.buttonList = this.sendActions?.filter((action: any) => action.isVisible === true);
  }

  /* Internal Methods */
  onSendNewLetterClicked() {
    this.isSendNewLetterOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailOpened = true;
  }

  onNewSMSTextClicked() {
    this.isNewSMSTextOpened = true;
  }

  onIdCardClosed() {
    this.isIdCardOpened = false;
  }

  onIdCardClicked() {
    this.isIdCardOpened = true;
  }
  onNewReminderClosed() {
    this.isNewReminderOpened = false;
  }

  onNewReminderClicked() {
    this.isNewReminderOpened = true;
  }
  handleSendNewEmailClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewEmailOpened = false;
    }
  }

  handleNewSMSTextClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isNewSMSTextOpened = false;
    }
  }

  handleSendNewLetterClosed(value: CommunicationEvents) {
    if (value === CommunicationEvents.Close) {
      this.isSendNewLetterOpened = false;
    }
  }

  handleIdCardClosed() {
    this.isIdCardOpened = false;
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
