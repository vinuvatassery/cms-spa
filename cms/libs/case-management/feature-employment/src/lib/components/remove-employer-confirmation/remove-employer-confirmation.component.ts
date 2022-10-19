/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-remove-employer-confirmation',
  templateUrl: './remove-employer-confirmation.component.html',
  styleUrls: ['./remove-employer-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoveEmployerConfirmationComponent {
  /** Public properties **/
  isRemoveEmployerConfirmationPopupOpened = false;

  /** Internal event methods **/
  onRemoveEmployerConfirmationClosed() {
    this.isRemoveEmployerConfirmationPopupOpened = false;
  }

  onRemoveEmployerConfirmationClicked() {
    this.isRemoveEmployerConfirmationPopupOpened = true;
  }
}
