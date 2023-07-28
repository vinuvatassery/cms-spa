import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-unbatch-payment',
  templateUrl: './medical-premiums-unbatch-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsUnbatchPaymentComponent {
  @Output() unBatchPaymentCloseClickedEvent = new EventEmitter();
  closeUnBatchPaymentClicked() {
    this.unBatchPaymentCloseClickedEvent.emit(true);
  }
}
