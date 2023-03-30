/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunicationEvents, ContactFacade, ScreenType } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-case360-header-tools',
  templateUrl: './case360-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Case360HeaderToolsComponent {

  /* Public properties */
  isTodoDetailsOpened = false;
  screenName = ScreenType.Case360Page;
  isNewReminderOpened = false;
  isIdCardOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  isNewSMSTextOpened = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  clientId!:number;
  mailingAddress$ = this.contactFacade.mailingAddress$;
  emailAddress$ = this.contactFacade.emailAddress$;
  phoneNumbers$ = this.contactFacade.phoneNumbers$;
  public SendActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'New Letter',
      icon: 'markunread_mailbox',
      click: (): void => {
        this.onSendNewLetterClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New Email',
      icon: 'mail_outline',
      click: (): void => {
        this.onSendNewEmailClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New SMS Text',
      icon: 'comment',
      click: (): void => {
        this.onNewSMSTextClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'New ID Card',
      icon: 'call_to_action',
      click: (): void => {
        this.onIdCardClicked();
      },
    },
  ];

  /* constructor */
  constructor(private readonly contactFacade: ContactFacade, private readonly route: ActivatedRoute) {
    this.clientId = this.route.snapshot.params['id'];
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

  onTodoDetailsClosed() {
    this.isTodoDetailsOpened = false;
  }

  onTodoDetailsClicked() {
    this.isTodoDetailsOpened = true;
  }

  loadMailingAddress() {
    this.contactFacade.loadMailingAddress(this.clientId);
  }

  loadPhoneNumbers() {
    this.contactFacade.loadPhoneNumbers(this.clientId);
  }

  loadEmailAddress() {
    this.contactFacade.loadEmailAddress(this.clientId);
  }
}
