import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BillingAddressFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-payment-address-deactivate',
  templateUrl: './payment-address-deactivate.component.html',
  styleUrls: ['./payment-address-deactivate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDeactivateComponent {
  @Input() addressId: any;
  @Output() closeDeactivatePaymentAddress = new EventEmitter<boolean>();


  constructor(private readonly billingAddressFacade: BillingAddressFacade, private readonly cdr: ChangeDetectorRef) {}

  deactivatePaymentAddress(): void {
    this.cdr.detectChanges();
    this.billingAddressFacade.deactivateAddress(this.addressId).subscribe(
      (response) => {
        if (response) {
          this.onCloseDeactivatePaymentAddressClicked(true);
        } else {
          this.onCloseDeactivatePaymentAddressClicked(false);
        }
      },
      (error) => {
        console.log(error);
        this.onCloseDeactivatePaymentAddressClicked(false);
      }
    );
  }

  onCloseDeactivatePaymentAddressClicked(isSuccess: boolean): void {
    this.closeDeactivatePaymentAddress.emit(isSuccess);
  }
}
