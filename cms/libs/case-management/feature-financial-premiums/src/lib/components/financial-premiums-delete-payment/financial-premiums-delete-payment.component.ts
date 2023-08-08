import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-delete-payment',
  templateUrl: './financial-premiums-delete-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsDeletePaymentComponent {
  @Output() deletePaymentCloseClickedEvent = new EventEmitter();
  closeDeletePaymentClicked() {
    this.deletePaymentCloseClickedEvent.emit(true);
  }
}
