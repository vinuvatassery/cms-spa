import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-delete-payment',
  templateUrl: './financial-premiums-delete-payment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsDeletePaymentComponent {
  /* Input Properties */
  @Input() paymentId!: any;

  /* Output Properties */
  @Output() deletePaymentEvent = new EventEmitter();
  @Output() deletePaymentCloseClickedEvent = new EventEmitter();

  /* Public Methods */
  closeDeletePaymentClicked() {
    this.deletePaymentCloseClickedEvent.emit(true);
  }

  deletePremiumPayment(){
    this.deletePaymentEvent.emit(this.paymentId);
  }
}
