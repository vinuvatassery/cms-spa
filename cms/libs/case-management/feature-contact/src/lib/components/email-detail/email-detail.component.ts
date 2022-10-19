/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'case-management-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailDetailComponent {
  /** Input properties **/
  @Input() isEditValue!: boolean;

  /** Public properties **/
  isDeactivateValue!: boolean;
  isDeactivateEmailAddressPopup = true;

  /** Internal event methods **/
  onDeactivateClicked() {
    this.isDeactivateValue = true;
    this.isDeactivateEmailAddressPopup = true;
  }

  onDeactivateEmailAddressClosed() {
    this.isDeactivateEmailAddressPopup = false;
  }
}
