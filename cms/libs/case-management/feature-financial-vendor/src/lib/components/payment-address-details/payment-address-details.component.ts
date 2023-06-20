import { ChangeDetectionStrategy, OnInit, Component, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressType, AddressTypeCode, BillingAddressFacade, ContactFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode } from '@cms/case-management/domain';
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
  @Output() closeEvent = new EventEmitter<any>();
  @Input() isEdit!: any
  @Input() billingAddress!: any
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
  financialVendorProviderTabCode: any = FinancialVendorProviderTabCode;
  /** Constructor**/
  constructor(
    private readonly billingAddressFacade: BillingAddressFacade,
    private readonly contactFacade: ContactFacade,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.vendorId = this.activatedRoute.snapshot.queryParams['v_id'];
    this.tabCode = this.activatedRoute.snapshot.queryParams['tab_code'];
    this.setAddressTypeCode();
    this.loadDdlStates();
    this.loadVenderPaymentMethos();
    this.lovFacade.getVendorPaymentRunDatesLovs();
    this.buildForm();

    if (this.isEdit) {
      this.paymentAddressForm.addControl('vendorAddressId', new FormControl(this.billingAddress.vendorAddressId, [Validators.required]))
      this.paymentAddressForm.controls['mailCode'].setValue(this.billingAddress.mailCode);
      this.paymentAddressForm.controls['nameOnCheck'].setValue(this.billingAddress.nameOnCheck);
      this.paymentAddressForm.controls['nameOnEnvelope'].setValue(this.billingAddress.nameOnEnvelope);
      this.paymentAddressForm.controls['address1'].setValue(this.billingAddress.address1);
      this.paymentAddressForm.controls['address2'].setValue(this.billingAddress.address2);
      this.paymentAddressForm.controls['cityCode'].setValue(this.billingAddress.cityCode);
      this.paymentAddressForm.controls['stateCode'].setValue(this.billingAddress.stateCode);
      this.paymentAddressForm.controls['zip'].setValue(this.billingAddress.zip);
      this.paymentAddressForm.controls['paymentMethodCode'].setValue(this.billingAddress.paymentMethodCode);
      this.paymentAddressForm.controls['specialHandlingDesc'].setValue(this.billingAddress.specialHandlingDesc);
      if (this.tabCode === FinancialVendorProviderTabCode.InsuranceVendors) {
        this.paymentAddressForm.controls['acceptsReportsFlag'].setValue(this.billingAddress.acceptsReportsFlag);
        this.paymentAddressForm.controls['acceptsCombinedPaymentsFlag'].setValue(this.billingAddress.acceptsCombinedPaymentsFlag);
      }
      this.getContacts(this.billingAddress.vendorAddressId);
    }

  }

  get AddContactForm(): FormArray {
    return this.paymentAddressForm.get("newAddContactForm") as FormArray;
  }
  getContacts(vendorAddressId: any) {
    this.billingAddressFacade.showLoader();
    this.billingAddressFacade.getPaymentsAddressContacts(vendorAddressId).subscribe({
      next: (resp) => {
        console.log(resp)

        resp.forEach((item:any) => {
          let addContactForm = this.formBuilder.group({
            contactName: new FormControl(item.contactName, Validators.required),
            description: new FormControl(item.contactDesc),
            phoneNumber: new FormControl(item.vendorContactPhone[0]?.phoneNbr),
            fax: new FormControl(item.vendorContactPhone[0]?.faxNbr),
            email: new FormControl(item.vendorContactEmail[0]?.emailAddress)
          });

          this.AddContactForm.push(addContactForm);
          this.cdr.detectChanges();
        });

        this.billingAddressFacade.hideLoader();
        
      },
      error: (err) => {
        this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.billingAddressFacade.hideLoader();
      },
    });
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
      paymentRunDateMonthly: ['', Validators.required],
      specialHandlingDesc: [''],
      newAddContactForm: this.formBuilder.array([]),
    });

    if (this.tabCode === FinancialVendorProviderTabCode.InsuranceVendors) {
      this.paymentAddressForm.addControl('acceptsReportsFlag', new FormControl('', [Validators.required]))
      this.paymentAddressForm.addControl('acceptsCombinedPaymentsFlag', new FormControl('', [Validators.required]))
    }
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

  closeModal(value: any) {
    this.closeEvent.emit(value);
  }

  submit() {
    this.formIsSubmitted = true;
    if (!this.paymentAddressForm.valid) return;

    let formValues = this.paymentAddressForm.value;
    if (formValues.newAddContactForm.length > 0) {
      formValues.VendorContact = [];
      formValues.newAddContactForm.forEach((contact: any) => {
        let vendorContact = {
          contactName: contact.contactName,
          contactDesc: contact.description,
          VendorContactEmail: [{ EmailAddress: contact.email, EmailAddressTypeCode: AddressTypeCode.Mail }],
          VendorContactPhone: [{ PhoneNbr: contact.phoneNumber, FaxNbr: contact.fax, PhoneTypeCode: AddressTypeCode.Mail }]

        }
        formValues.VendorContact.push(vendorContact);
      })
    }
    this.billingAddressFacade.showLoader();
    this.addUpdateBillingAddress(this.vendorId, formValues).subscribe({
      next: (resp) => {
        if (resp) {
          this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment Address Added Successfully')
        }
        this.billingAddressFacade.hideLoader();
        this.closeModal('saved');
      },
      error: (err) => {
        this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.billingAddressFacade.hideLoader();
      },
    });
  }

  addUpdateBillingAddress(vendorId: any, formValues: any) {
    if (this.isEdit) {
      return this.billingAddressFacade.updateBillingAddress(this.vendorId, formValues);
    }
    return this.billingAddressFacade.saveBillingAddress(this.vendorId, formValues);
  }

}
