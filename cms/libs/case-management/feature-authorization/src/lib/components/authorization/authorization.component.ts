/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** Enums **/
import { CommunicationEvents, ScreenType } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa' 
 

@Component({
  selector: 'case-management-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {
  currentDate = new Date();
 
  /** Public properties **/
  screenName = ScreenType.Authorization;
  isPrintClicked!: boolean;
  isSendEmailClicked!: boolean;
  isSendNewLetterPopupOpened = false;
  isSendNewEmailPopupOpened = false;
  isAuthorizationNoticePopupOpened = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();

  /** Internal event methods **/
  onSendNewLetterClicked() {
    this.isSendNewLetterPopupOpened = true;
  }

  onSendNewEmailClicked() {
    this.isSendNewEmailPopupOpened = true;
  }

  onCloseAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = false;
  }

  onAuthorizationNoticeClicked() {
    this.isAuthorizationNoticePopupOpened = true;
  }

  /** External event methods **/
  handleCloseSendNewEmailClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewEmailPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isSendNewEmailPopupOpened = false;
        this.isSendEmailClicked = true;
        break;
      default:
        break;
    }
  }

  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
        this.isSendNewLetterPopupOpened = false;
        break;
      case CommunicationEvents.Print:
        this.isSendNewLetterPopupOpened = false;
        this.isPrintClicked = true;
        break;
      default:
        break;
    }
  }
}
