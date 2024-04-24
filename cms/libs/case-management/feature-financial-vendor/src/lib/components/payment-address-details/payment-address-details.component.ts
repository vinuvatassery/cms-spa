import { ChangeDetectionStrategy, OnInit, Component, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressTypeCode, BillingAddressFacade, ContactFacade, FinancialVendorProviderTabCode, VendorContactsFacade } from '@cms/case-management/domain';
import { FinancialVendorTypeCode, StatusFlag } from '@cms/shared/ui-common';
import { LovFacade } from '@cms/system-config/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';
type NewType = LovFacade;

@Component({
  selector: 'cms-payment-address-details',
  templateUrl: './payment-address-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDetailsComponent implements OnInit {
  @Output() closeEvent = new EventEmitter<any>();
  @Output() editDeactivateClicked = new EventEmitter<any>();
  @Input() isEdit!: any
  @Input() billingAddress!: any
  isValidateForm: boolean = false;
  specialHandlingLength = 100;
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
  vendorAddressId: string = '';
  specialHandling = '';
  specialHandlingCharachtersCount!: number;
  specialHandlingCounter!: string;
  statusFlag : any = StatusFlag;
  specialCharAdded: boolean = false;
  @Output() paymentAddressAdded = new EventEmitter<any>();
  mailCodeLengthError: boolean=false;

  /** Constructor**/
  constructor(
    private readonly billingAddressFacade: BillingAddressFacade,
    private readonly contactFacade: ContactFacade,
    private readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly vendorContactFacade: VendorContactsFacade)
    { }

  ngOnInit(): void {
    this.vendorId = this.activatedRoute.snapshot.queryParams['v_id'];
    this.tabCode = this.activatedRoute.snapshot.queryParams['tab_code'];
    this.specialHandlingWordCount();
    this.setAddressTypeCode();
    this.loadDdlStates();
    this.loadVenderPaymentMethos();
    this.lovFacade.getVendorPaymentRunDatesLovs();
    this.buildForm();
    if (this.isEdit) {
      this.vendorAddressId = this.billingAddress.vendorAddressId;
      this.editBindData();
    }
  }

  editBindData() {
    this.paymentAddressForm.addControl('vendorAddressId', new FormControl(this.vendorAddressId, [Validators.required]))
    this.paymentAddressForm.controls['mailCode'].setValue(this.billingAddress.mailCode);
    this.paymentAddressForm.controls['nameOnCheck'].setValue(this.billingAddress.nameOnCheck);
    this.paymentAddressForm.controls['nameOnEnvelope'].setValue(this.billingAddress.nameOnEnvelope);
    this.paymentAddressForm.controls['address1'].setValue(this.billingAddress.address1);
    this.paymentAddressForm.controls['address2'].setValue(this.billingAddress.address2);
    this.paymentAddressForm.controls['cityCode'].setValue(this.billingAddress.cityCode);
    this.paymentAddressForm.controls['stateCode'].setValue(this.billingAddress.stateCode);
    this.paymentAddressForm.controls['zip'].setValue(this.billingAddress.zip);
    this.paymentAddressForm.controls['paymentMethodCode'].setValue(this.billingAddress.paymentMethodCode);
    this.paymentAddressForm.controls['paymentRunDateMonthly'].setValue(this.billingAddress.paymentRunDateMonthly?.toString());
    this.paymentAddressForm.controls['specialHandlingDesc'].setValue(this.billingAddress.specialHandlingDesc);
    if (this.tabCode === FinancialVendorProviderTabCode.InsuranceVendors) {
      this.paymentAddressForm.controls['acceptsReportsFlag'].setValue(this.billingAddress.acceptsReportsFlag);
      this.paymentAddressForm.controls['acceptsCombinedPaymentsFlag'].setValue(this.billingAddress.acceptsCombinedPaymentsFlag);
    }
    if (this.tabCode === FinancialVendorProviderTabCode.Pharmacy) {
      this.paymentAddressForm.controls['physicalAddressFlag'].setValue(this.billingAddress.physicalAddressFlag == StatusFlag.Yes?true:null);
    }
    this.cdr.detectChanges();
  }

  private specialHandlingWordCount() {
    this.specialHandlingCharachtersCount = this.specialHandling
      ? this.specialHandling.length
      : 0;
    this.specialHandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingLength}`;
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
      zip: ['',[ Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]],
      paymentMethodCode: ['', Validators.required],
      paymentRunDateMonthly: ['', Validators.required],
      specialHandlingDesc: [''],
      newAddContactForm: this.formBuilder.array([]),
    });

    this.paymentAddressForm.controls['zip']
        .setValidators([
          Validators.required,Validators.required
        ]);
      this.paymentAddressForm.controls['zip'].updateValueAndValidity();

    if (this.tabCode === FinancialVendorProviderTabCode.InsuranceVendors) {
      this.paymentAddressForm.addControl('acceptsReportsFlag', new FormControl('', [Validators.required]))
      this.paymentAddressForm.addControl('acceptsCombinedPaymentsFlag', new FormControl('', [Validators.required]))
    }
    if(this.tabCode === FinancialVendorProviderTabCode.Manufacturers)
    {
      this.paymentAddressForm.controls['paymentMethodCode'].removeValidators([Validators.required]);
    }
    if(this.tabCode !== FinancialVendorProviderTabCode.InsuranceVendors)
    {
      this.paymentAddressForm.controls['paymentRunDateMonthly'].removeValidators([Validators.required]);
      this.paymentAddressForm.controls['paymentRunDateMonthly'].setValue(null);
    }
    if(this.tabCode === FinancialVendorProviderTabCode.Pharmacy)
    {
      this.paymentAddressForm.addControl('physicalAddressFlag', new FormControl(''))
    }
  }

  get paymentAddressFormControls() {
    return this.paymentAddressForm.controls as any;
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
    this.paymentAddressForm.controls['zip']
    .setValidators([
      Validators.required, Validators.required, Validators.pattern('^[A-Za-z0-9 -]+$')
    ]);
  this.paymentAddressForm.controls['zip'].updateValueAndValidity();
    this.formIsSubmitted = true;
    this.paymentAddressForm.markAllAsTouched();
    if (this.tabCode === FinancialVendorProviderTabCode.Pharmacy)
    {
      this.paymentAddressForm.patchValue({physicalAddressFlag: this.paymentAddressForm.controls['physicalAddressFlag'].value ? StatusFlag.Yes:null});
    }
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
        this.paymentAddressAdded.emit(true)
        if (resp) {
          if (!this.isEdit) {
            this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment address added successfully!')
          }
          else
          {
            this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Payment address updated successfully!')
          }
        }
        this.billingAddressFacade.hideLoader();
        this.vendorContactFacade.loadVendorAllContacts(this.vendorId);
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
  onSpecialHandlingValueChange(event: any): void {
    this.specialHandlingCharachtersCount = event.length;
    this.specialHandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingLength}`;
  }
  deactivatePaymentAddress()
  {
    this.editDeactivateClicked.emit(this.billingAddress);
  }
  OncheckboxClick(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    if (isChecked) {
      this.paymentAddressForm.patchValue({physicalAddressFlag: true});
    } else {
      this.paymentAddressForm.patchValue({physicalAddressFlag: null});
    }
    this.cdr.detectChanges();
  }
  restrictSpecialChar(event:number) {
    return (
      (event >= 48 && event <= 57) ||
      (event > 64 && event < 91) ||
      (event > 96 && event < 123) ||
      event == 8 ||
      event == 45
    );
  }
  onKeyPress(event:number) {
    return (event > 64 &&
      event < 91) || (event > 96 && event < 123)||event==32
  }
  onMailCodeKeyUp() {
    let mailCode = this.paymentAddressForm.controls['mailCode'].value;
    if (mailCode.length !== 3 && mailCode !="") {
      this.mailCodeLengthError = true;
    }
    else if (mailCode.length <=0 || mailCode.length==3){
      this.mailCodeLengthError = false;
    }
 }

  onInputChangeNameOnCheck(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z\s]/g, ''); // Filter out non-alpha and non-space characters
    input.value = value;
    this.paymentAddressForm.controls['nameOnCheck'].patchValue(value);
  }

  onInputChangeNameOnEnvelope(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z\s]/g, ''); // Filter out non-alpha and non-space characters
    input.value = value;
    this.paymentAddressForm.controls['nameOnEnvelope'].patchValue(value);
  }

  onInputChangeCity(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^a-zA-Z\s]/g, ''); // Filter out non-alpha and non-space characters
    input.value = value;
    this.paymentAddressForm.controls['cityCode'].patchValue(value);
  }

 isAlphaNumeric(event: number) {
    return (
      //(event >= 48 && event <= 57) || // Numbers (0-9)
      (event >= 65 && event <= 90) || // Uppercase letters (A-Z)
      (event >= 97 && event <= 122) || // Lowercase letters (a-z)
      event === 32 // Space
    );
  }
 }
