import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-delete-payment',
  templateUrl: './dental-premiums-delete-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsDeletePaymentComponent {
  @Output() deletePaymentCloseClickedEvent = new EventEmitter();
  closeDeletePaymentClicked() {
    this.deletePaymentCloseClickedEvent.emit(true);
  }
}
