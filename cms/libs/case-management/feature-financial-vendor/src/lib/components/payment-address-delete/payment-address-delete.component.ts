import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BillingAddressFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-payment-address-delete',
  templateUrl: './payment-address-delete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDeleteComponent {
  @Input() addressId: any;
  @Output() closeDeletePaymentAddress = new EventEmitter<boolean>();

  constructor(private readonly billingAddressFacade: BillingAddressFacade, private readonly cdr: ChangeDetectorRef) {}

  deletePaymentAddress(): void {
    this.cdr.detectChanges();
    this.billingAddressFacade.deleteAddress(this.addressId).subscribe({
      next: (response) => {
        if (response) {
          this.onCloseDeletePaymentAddressClicked(true);
        } else {
          this.onCloseDeletePaymentAddressClicked(false);
        }
      },
      error: (error) => {
        this.onCloseDeletePaymentAddressClicked(false);
      }
    });
  }

  onCloseDeletePaymentAddressClicked(isSuccess: boolean): void {
    this.closeDeletePaymentAddress.emit(isSuccess);
  }
}
