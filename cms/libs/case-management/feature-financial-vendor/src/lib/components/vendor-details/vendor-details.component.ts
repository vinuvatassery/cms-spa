import { Input, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { VendorFacade, ContactFacade, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDetailsComponent implements OnInit {
  @Input() providerType!: any;
  @Input() medicalProviderForm: FormGroup;

  @Output() saveProviderEventClicked = new EventEmitter<any>();

  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();

  isViewContentEditable!: boolean;
  isValidateForm: boolean = false;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodList: any[] = [];
  vendorContactList: any[] = [];


  constructor(
    private readonly formBuilder: FormBuilder,
    private vendorFacade: VendorFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly contactFacade: ContactFacade,
    private lovFacade: LovFacade
  ) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.contactFacade.loadDdlStates();
    this.getPaymentMethods();
  }

  get AddContactForm(): FormArray {
    return this.medicalProviderForm.get("newAddContactForm") as FormArray;
  }

  onToggleAddNewContactClick() {
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl('', Validators.maxLength(40)),
      description: new FormControl(),
      phoneNumber: new FormControl(),
      fax: new FormControl(),
      email: new FormControl()
    });
    this.AddContactForm.push(addContactForm);
    this.cdr.detectChanges();
  }

  removeContact(i: number) {
    this.AddContactForm.removeAt(i);
  }

  getContactControl(index: number, fieldName: string) {
    return (<FormArray>this.medicalProviderForm.get('newAddContactForm')).at(index).get(fieldName);
  }

  save() {
    this.validateForm();
    this.isValidateForm = true
    if (this.medicalProviderForm.valid) {
      let providerData = this.mappVendorProfileData();
      this.saveProviderEventClicked.next(providerData);
    }

  }

  validateForm() {
    this.medicalProviderForm.markAllAsTouched();
    var mailCode = this.medicalProviderForm.controls['mailCode'].value;
    if (mailCode) {
      this.medicalProviderForm.controls['addressLine1']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();
    }

    this.medicalProviderForm.controls['paymentMethod']
      .setValidators([
        Validators.required,
      ]);
    this.medicalProviderForm.controls['paymentMethod'].updateValueAndValidity();

  }

  getPaymentMethods() {
    this.lovFacade.getPaymentMethodLov();
    this.vendorFacade.showLoader();
    this.lovFacade.paymentMethodType$.subscribe((paymentMethod: any) => {
      if (paymentMethod) {
        this.paymentMethodList = paymentMethod;
        this.vendorFacade.hideLoader();
      }
    })
  }

  public get vendorTypes(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  mappVendorProfileData() {
    let formValues = this.medicalProviderForm.value;

    if (formValues.newAddContactForm.length > 0) {
      formValues.newAddContactForm.forEach((contact: any) => {
        if (contact.contactName != '' || contact.description != '' || contact.phoneNumber != '' || contact.email != '') {
          let vendorContact = {
            contactName: contact.contactName,
            contactDesc: contact.description,
            phoneNumber: contact.phoneNumber,
            email: contact.email,
          }
          this.vendorContactList.push(vendorContact);
        }
      })
    }
    let vendorProfileData = {
      vendorName: formValues.providerName,
      vendorTypeCode: this.providerType,
      tin: formValues.tinNumber,
      mailCode: formValues.mailCode,
      addressTypeCode: this.providerType,
      address1: formValues.addressLine1,
      address2: formValues.addressLine1,
      cityCode: formValues.city,
      stateCode: formValues.state,
      zip: formValues.zip,
      nameOnCheck: formValues.nameOnCheck,
      nameOnEnvelope: formValues.nameOnEnvolop,
      paymentMethodCode: formValues.paymentMethod,
      specialHandling: formValues.specialHandling,
      phoneTypeCode: this.providerType,
      vendorContacts:this.vendorContactList
    }
    return vendorProfileData;
  }

}
