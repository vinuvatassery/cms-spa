import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-unbatch-payment',
  templateUrl: './dental-premiums-unbatch-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsUnbatchPaymentComponent {
  @Output() unBatchPaymentCloseClickedEvent = new EventEmitter();
  closeUnBatchPaymentClicked() {
    this.unBatchPaymentCloseClickedEvent.emit(true);
  }
}
