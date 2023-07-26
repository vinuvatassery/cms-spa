import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-delete-payment',
  templateUrl: './medical-premiums-delete-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsDeletePaymentComponent {
  @Output() deletePaymentCloseClickedEvent = new EventEmitter();
  closeDeletePaymentClicked() {
    this.deletePaymentCloseClickedEvent.emit(true);
  }
}
