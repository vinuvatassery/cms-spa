import { ChangeDetectionStrategy, OnInit, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BillingAddressFacade, ContactFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';
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
  vendorId: string = '';
  tabCode: string = '';
  addressTypeCode: string = '';
  paymentMethodVendorlov$ = this.lovFacade.paymentMethodVendorlov$;
  paymentRunDatelov$ = this.lovFacade.paymentRunDatelov$;
  /** Constructor**/
  constructor(
    private readonly billingAddressFacade: BillingAddressFacade,
    private readonly contactFacade: ContactFacade,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.vendorId = this.activatedRoute.snapshot.queryParams['v_id'];
    this.tabCode = this.activatedRoute.snapshot.queryParams['tab_code'];
    this.setAddressTypeCode();
    this.loadDdlStates();
    this.loadVenderPaymentMethos();
    this.lovFacade.getVendorPaymentRunDatesLovs();
    this.buildForm();

  }

  private buildForm() {
    this.paymentAddressForm = this.formBuilder.group({
      vendorId: [this.vendorId],
      mailCode: ['', Validators.required],
      nameOnCheck: ['', Validators.required],
      nameOnEnvelope: ['', Validators.required],
      addressTypeCode: [this.addressTypeCode],
      address1: ['', Validators.required],
      address2: [''],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', Validators.required],
      paymentMethodCode: ['', Validators.required],
      specialHandlingDesc: [''],
      newAddContactForm: this.formBuilder.array([]),
    });

    this.paymentAddressForm.addControl('paymentRunDateMonthly',new FormControl('', [Validators.required]))
    this.paymentAddressForm.addControl('acceptsReportsFlag',new FormControl(''))
    this.paymentAddressForm.addControl('acceptsCombinedPaymentsFlag',new FormControl(''))
    // paymentRunDateMonthly: ['', Validators.required],
    //   acceptsReportsFlag: ['', Validators.required],
    //   acceptsCombinedPaymentsFlag: ['', Validators.required],
  }
  private setAddressTypeCode() {
    switch (this.tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        this.addressTypeCode = FinancialVendorTypeCode.Manufacturers;
        break;
      case FinancialVendorProviderTabCode.InsuranceVendors:
        this.addressTypeCode = FinancialVendorTypeCode.InsuranceVendors;
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.addressTypeCode = FinancialVendorTypeCode.Pharmacy;
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.addressTypeCode = FinancialVendorTypeCode.DentalProviders;
        break;
      case FinancialVendorProviderTabCode.MedicalProvider:
        this.addressTypeCode = FinancialVendorTypeCode.MedicalProviders;
        break;
      default:
        this.addressTypeCode = '';
        break;
    }

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
