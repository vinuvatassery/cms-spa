import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  CommunicationEvents,
  ContactFacade,
  ScreenType,
} from '@cms/case-management/domain';
@Component({
  selector: 'cms-vendor-header-tools',
  templateUrl: './vendor-header-tools.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorHeaderToolsComponent {
  SpecialHandlingLength = 100;
  isTodoDetailsOpened = false;
  screenName = ScreenType.VendorProfilePage;
  isNewReminderOpened = false;
  isSendNewLetterOpened = false;
  isSendNewEmailOpened = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

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
  ];
  handleSendNewEmailClosed(event: any) {
    this.isSendNewEmailOpened = false;
  }

  handleSendNewLetterClosed(event: any) {
    this.isSendNewLetterOpened = false;
  }

  onSendNewLetterClicked() {
    this.isSendNewLetterOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailOpened = true;
  }

  onNewReminderClosed() {
    this.isNewReminderOpened = false;
  }

  onNewReminderClicked() {
    this.isNewReminderOpened = true;
  }

  onTodoDetailsClosed() {
    this.isTodoDetailsOpened = false;
  }

  onTodoDetailsClicked() {
    this.isTodoDetailsOpened = true;
  }
}
