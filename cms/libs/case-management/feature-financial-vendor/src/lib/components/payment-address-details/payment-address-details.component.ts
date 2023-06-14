import { ChangeDetectionStrategy, OnInit, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillingAddressFacade, ContactFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
type NewType = LovFacade;

@Component({
  selector: 'cms-payment-address-details',
  templateUrl: './payment-address-details.component.html',
  styleUrls: ['./payment-address-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDetailsComponent implements OnInit {

  SpecialHandlingLength = 100;
  ddlStates$ = this.contactFacade.ddlStates$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  paymentAddressForm!: FormGroup;
  formIsSubmitted!: boolean;
  vendorId: string = 'aee7c724-06ad-49a4-84b0-6e07e406af76';
  paymentMethodVendorlov$ = this.lovFacade.paymentMethodVendorlov$;
  /** Constructor**/
  constructor(
    private readonly billingAddressFacade: BillingAddressFacade,
    private readonly contactFacade: ContactFacade,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadDdlStates();
    this.loadVenderPaymentMethos();

  }

  private buildForm() {
    this.paymentAddressForm = this.formBuilder.group({
      vendorId: [this.vendorId],
      mailCode: ['', Validators.required],
      nameOnCheck: ['', Validators.required],
      nameOnEnvelope: ['', Validators.required],
      addressTypeCode: ['M'],
      address1: ['', Validators.required],
      address2: [''],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', Validators.required],
      paymentMethodCode: ['', Validators.required],
      paymentRunDateMonthly: ['', Validators.required],
      acceptsReportsFlag: ['', Validators.required],
      acceptsCombinedPaymentsFlag: ['', Validators.required],
      specialHandlingDesc: [''],
    });
  }

  private loadVenderPaymentMethos() {
    this.lovFacade.getVendorPaymentMethodLovs();
  }

  private loadDdlStates() {
    this.contactFacade.loadDdlStates();
  }

  submit() {
    this.formIsSubmitted = true;
    if (!this.paymentAddressForm.valid) return;
    this.billingAddressFacade.showLoader();
    this.billingAddressFacade.saveBillingAddress(this.vendorId, this.paymentAddressForm.value).subscribe({
      next: (resp) => {
        if (resp) {
          this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment Address Added Successfully')
        }
        this.billingAddressFacade.hideLoader();
      },
      error: (err) => {
        this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.billingAddressFacade.hideLoader();
      },
    });
  }

}
