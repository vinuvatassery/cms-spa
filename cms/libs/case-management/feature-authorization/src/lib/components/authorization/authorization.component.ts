/** Angular **/
import { Component, ChangeDetectionStrategy, OnInit, Input, OnDestroy,   TemplateRef } from '@angular/core';
/** Enums **/
import { CommunicationEvents, ScreenType } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'  
import { DialogService } from '@progress/kendo-angular-dialog';

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
  isAuthorizationNoticePopupOpened = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isCerForm = false;
  private isSendLetterOpenedDialog : any;
  private isSendEmailOpenedDialog : any;
  /** Internal event methods **/
  
  /* constructor */
  constructor(private dialogService: DialogService) {}

  onSendNewLetterClicked(template: TemplateRef<unknown>): void {
    this.isSendLetterOpenedDialog = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    }); 
  }

  onSendNewEmailClicked(template: TemplateRef<unknown>): void {
    this.isSendEmailOpenedDialog = this.dialogService.open({ 
      content: template, 
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np'
    }); 
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
        this.isSendEmailOpenedDialog.close(event);
        break;
      case CommunicationEvents.Print: 
        this.isSendEmailClicked = true;
        break;
      default:
        break;
    }
  }

  handleCloseSendNewLetterClicked(event: CommunicationEvents) {
    switch (event) {
      case CommunicationEvents.Close:
     
        this.isSendLetterOpenedDialog.close(event);
        break;
      case CommunicationEvents.Print: 
        this.isPrintClicked = true;
        break;
      default:
        break;
    }
  }
}
