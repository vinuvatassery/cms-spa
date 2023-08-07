import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-unbatch-payment',
  templateUrl: './financial-premiums-unbatch-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsUnbatchPaymentComponent {
  @Output() unBatchPaymentCloseClickedEvent = new EventEmitter();
  closeUnBatchPaymentClicked() {
    this.unBatchPaymentCloseClickedEvent.emit(true);
  }
}
