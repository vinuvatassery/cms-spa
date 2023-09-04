import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { BillingAddressFacade, VendorContactsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-payment-address-deactivate',
  templateUrl: './payment-address-deactivate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDeactivateComponent {
  @Input() addressId: any;
  @Input() vendorId: any;
  @Output() closeDeactivatePaymentAddress = new EventEmitter<boolean>();


  constructor(private readonly vendorContactFacade: VendorContactsFacade, private readonly billingAddressFacade: BillingAddressFacade, private readonly cdr: ChangeDetectorRef) {}

  deactivatePaymentAddress(): void {
    this.cdr.detectChanges();
    this.billingAddressFacade.deactivateAddress(this.addressId).subscribe({
      next: (response) => {
        if (response) {
          this.onCloseDeactivatePaymentAddressClicked(true);
        } else {
          this.onCloseDeactivatePaymentAddressClicked(false);
        }
        this.vendorContactFacade.loadVendorAllContacts(this.vendorId);
      },
      error: (error) => {
        this.onCloseDeactivatePaymentAddressClicked(false);
      }
    });
  }

  onCloseDeactivatePaymentAddressClicked(isSuccess: boolean): void {
    this.closeDeactivatePaymentAddress.emit(isSuccess);
  }
}
