import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-unbatch-payment',
  templateUrl: './financial-premiums-unbatch-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsUnbatchPaymentComponent {
  @Output() unBatchPaymentCloseClickedEvent = new EventEmitter();
  @Input() isBulkUnBatchOpened = false;
  
  closeUnBatchPaymentClicked() {
    this.unBatchPaymentCloseClickedEvent.emit(false);
  }

  UnBatchClicked() {
    this.unBatchPaymentCloseClickedEvent.emit(true);
  }
}
