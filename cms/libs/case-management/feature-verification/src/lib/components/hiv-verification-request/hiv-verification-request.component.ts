/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-hiv-verification-request',
  templateUrl: './hiv-verification-request.component.html',
  styleUrls: ['./hiv-verification-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HivVerificationRequestComponent {
  /** Input properties **/
  @Input() data!: string;

  /** Public properties **/
  isSendRequest = false;
  isResendRequest = false;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Internal event methods **/
  onSendRequestClicked() {
    this.isSendRequest = true;
  }

  onResendRequestClicked() {
    this.isResendRequest = true;
  }
}
