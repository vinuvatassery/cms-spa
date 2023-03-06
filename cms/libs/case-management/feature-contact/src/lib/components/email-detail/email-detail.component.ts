/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'case-management-email-detail',
  templateUrl: './email-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDetailComponent {
  /** Input properties **/
  @Input() isEditValue!: boolean;

  /** Public properties **/
  isDeactivateValue!: boolean;
  isDeactivateEmailAddressPopup = true;
  public formUiStyle : UIFormStyle = new UIFormStyle();

  /** Internal event methods **/
  onDeactivateClicked() {
    this.isDeactivateValue = true;
    this.isDeactivateEmailAddressPopup = true;
  }

  onDeactivateEmailAddressClosed() {
    this.isDeactivateEmailAddressPopup = false;
  }
}
