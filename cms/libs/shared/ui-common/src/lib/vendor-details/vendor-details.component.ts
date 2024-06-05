import { Input, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, Output, EventEmitter, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade,TinValidationFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { ConfigurationProvider, LoaderService, } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { FinancialVendorTypeCode } from '../enums/financial-vendor-type-code';
import { AddressType } from '../enums/address-type.enum';
import { StatusFlag } from '../enums/status-flag.enum';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cms-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDetailsComponent implements OnInit, OnDestroy {
  @Input() providerType!: any;
  @Input() medicalProviderForm: FormGroup;
  @Input() editVendorInfo: boolean = false;
  @Input() vendorDetails!: any;
  @Input() profileInfoTitle!: string;
  @Input() ddlStates$!: any;
  @Input() clinicVendorList$!: any;
  clinicVendorListLocal: any;
  @Input() clinicVendorLoader$!: any;
  @Input() hasCreateUpdatePermission: boolean = false;
  @Input() selectedClinicType: string = FinancialVendorTypeCode.MedicalClinic;

  // listens for event when vendor saved in page comp
  @Input() saveVendorEventSubject: Subject<any> = new Subject<any>();

  @Output() saveProviderEventClicked = new EventEmitter<any>();
  @Output() closeModalEventClicked = new EventEmitter<any>();

  @Output() updateVendorDetailsClicked = new EventEmitter<any>();
  @Output() searchClinicVendorClicked = new EventEmitter<any>();

  @Output() closeMedicalDentalProviderDialogEvent = new EventEmitter<string>();

  private readonly clinicTypeFieldName = 'clinicType';

  closeMedicalProviderDialogInParent() {
    this.closeMedicalDentalProviderDialogEvent.emit(this.providerType);
  }

  addNewClinicOpen() {
    this.closeMedicalProviderDialogInParent();
  }

  public formUiStyle: UIFormStyle = new UIFormStyle();

  isViewContentEditable!: boolean;
  isValidateForm: boolean = false;
  paymentMethodList: any[] = [];
  clinicTypes: any[] = [
    { lovCode: FinancialVendorTypeCode.MedicalClinic, lovDesc: 'Medical' },
    { lovCode: FinancialVendorTypeCode.DentalClinic, lovDesc: 'Dental' },
  ];
  paymentRunDateList: any[] = [];
  vendorContactList: any[] = [];
  clinicNameNotApplicable: boolean = false;
  firstLastNameNotApplicable: boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  tinMaskFormat: string = '0 00-0000000';
  specialhandlingCounter!: string;
  specialHandlingCharachtersCount!: number;
  specialHandlingMaxLength = 100;
  specialHandlingTextArea = '';
  selectedClinicVendorId!: any;
  mailCodeLengthError!: boolean;
  clinicSearchSubscription !: Subscription;
  specialCharAdded: boolean = false;
  accountingNumberValidated: boolean = true;
  isDuplicateTin = false;
  duplicateTinMessage = "";


  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private lovFacade: LovFacade,
    public readonly intl: IntlService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private tinValidationFacade: TinValidationFacade,
    private readonly elementRef: ElementRef,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

  searchClinic(clinicName: any) {
    this.clinicSearchSubscription?.unsubscribe();

    if (clinicName === '' || !clinicName) {
      this.clinicVendorListLocal = null;
      return;
    }
    this.clinicSearchSubscription = this.clinicVendorList$.subscribe((data: any) => {
      if (data && clinicName !== '') {
        if (this.providerType ===  FinancialVendorTypeCode.MedicalProviders) {
          this.clinicVendorListLocal = data.filter((item: any) => item.vendorTypeCode === FinancialVendorTypeCode.MedicalClinic);
        } else if (this.providerType === FinancialVendorTypeCode.HealthcareProviders) {
          this.clinicVendorListLocal = data.filter((item: any) => item.vendorTypeCode === FinancialVendorTypeCode.MedicalClinic
          || item.vendorTypeCode === FinancialVendorTypeCode.DentalClinic );
        }else if (this.providerType === FinancialVendorTypeCode.DentalProviders) {
          this.clinicVendorListLocal = data.filter((item: any) => item.vendorTypeCode === FinancialVendorTypeCode.DentalClinic);
        }
        this.clinicVendorListLocal = this.clinicVendorListLocal.filter((item: any) => item.vendorName.toLowerCase().includes(clinicName.toLowerCase()));

        this.clinicSearchSubscription?.unsubscribe();
      }
    });

    this.selectedClinicVendorId = null;
    this.searchClinicVendorClicked.emit(clinicName);
  }

  ngOnInit(): void {

    this.lovFacade.getPaymentRunDateLov();
    this.lovFacade.getPaymentMethodLov();
    if (this.editVendorInfo) {
      this.setVendorDetailFormValues();
    } else {
      this.getPaymentMethods();
      this.getPaymentRunDate();
    }

    if (this.selectedClinicType === FinancialVendorTypeCode.MedicalProviders) {
      this.medicalProviderForm.controls[this.clinicTypeFieldName].setValue(FinancialVendorTypeCode.MedicalClinic)
    } else if (this.selectedClinicType === FinancialVendorTypeCode.DentalProviders) {
      this.medicalProviderForm.controls[this.clinicTypeFieldName].setValue(FinancialVendorTypeCode.DentalClinic)
    }
  }

  ngOnDestroy() {
    this.saveVendorEventSubject.unsubscribe();
  }

  get AddContactForm(): FormArray {
    return this.medicalProviderForm.get("newAddContactForm") as FormArray;
  }

  setVendorDetailFormValues() {
    this.medicalProviderForm.controls['providerName'].setValue(this.vendorDetails.vendorName);
    this.medicalProviderForm.controls['firstName'].setValue(this.vendorDetails.firstName);
    this.medicalProviderForm.controls['lastName'].setValue(this.vendorDetails.lastName);
    this.medicalProviderForm.controls['tinNumber'].setValue(this.vendorDetails.tin);
    this.medicalProviderForm.controls['npiNbr'].setValue(this.vendorDetails.npiNbr);
    this.medicalProviderForm.controls['parentVendorId'].setValue(this.vendorDetails.parentVendorId);
    this.medicalProviderForm.controls['vendorTypeCode'].setValue(this.vendorDetails.vendorTypeCode);
    if (this.vendorDetails.preferredFlag != null) {
      let flag = this.vendorDetails.preferredFlag == 'Y' ? true : false
      this.medicalProviderForm.controls['isPreferedPharmacy'].setValue(flag);
    }
    else {
      this.medicalProviderForm.controls['isPreferedPharmacy'].setValue(this.vendorDetails.preferredFlag);
    }
  }

  fillFormData() {
    this.medicalProviderForm.controls['tinNumber'].setValue(this.vendorDetails.tin);
    this.medicalProviderForm.controls['providerName'].setValue(this.vendorDetails.vendorName);
    this.medicalProviderForm.controls['vendorId'].setValue(this.vendorDetails.vendorId);
  }

  onToggleAddNewContactClick() {
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl('', Validators.required),
      description: new FormControl(),
      phoneNumber: new FormControl(),
      fax: new FormControl(),
      email: new FormControl('', Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)),
      isPreferedContact: new FormControl(),
      isCheckContactNameValid: new FormControl(false)
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

  getContactNameValidation(index: number) {
    return (<FormArray>this.medicalProviderForm.get('newAddContactForm')).at(index).get("isCheckContactNameValid")?.value;
  }
  getEmailValidation(index: number) {
    return (<FormArray>this.medicalProviderForm.get('newAddContactForm')).at(index).get("email")?.value;
  }

  checkContactPreference(i: number) {
    for (let index = 0; index < this.AddContactForm.length; index++) {
      if (index != i) {
        (this.AddContactForm.controls[index] as FormGroup).controls['isPreferedContact'].setValue(false)
      }
    }
  }

  save() {
    this.validateForm();
    this.isValidateForm = true;
    if (this.medicalProviderForm.valid) {
      let providerData = this.mappVendorProfileData();
      this.saveProviderEventClicked.next(providerData);
    }else{
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.medicalProviderForm, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
    }
  }
        validateProvider()
        {
          if (this.providerType == this.vendorTypes.MedicalProviders || this.providerType == this.vendorTypes.DentalProviders || this.providerType == this.vendorTypes.HealthcareProviders) {
            if (!this.clinicNameNotApplicable) {
              this.medicalProviderForm.controls['parentVendorId'].setValidators([Validators.required]);
              this.medicalProviderForm.controls['parentVendorId'].updateValueAndValidity();
            }
            if (!this.firstLastNameNotApplicable) {
              this.medicalProviderForm.controls['firstName'].setValidators([Validators.required]);
              this.medicalProviderForm.controls['lastName'].setValidators([Validators.required]);
              this.medicalProviderForm.controls['firstName'].updateValueAndValidity();
              this.medicalProviderForm.controls['lastName'].updateValueAndValidity();
            }
          }
          else if (this.providerType == this.vendorTypes.Manufacturers) {
            this.medicalProviderForm.controls['mailCode'].setValidators([Validators.required, Validators.maxLength(3), Validators.minLength(3)]);      
            this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
          }
          else {
            this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
            this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
            this.medicalProviderForm.controls['city'].setValidators([Validators.pattern('^[A-Za-z ]+$')]);
            this.medicalProviderForm.controls['city'].updateValueAndValidity();
          }
        }

     validateMailCodeData()
     {
            this.medicalProviderForm.controls['addressLine1']
            .setValidators([
              Validators.required,
            ]);
          this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

          this.medicalProviderForm.controls['city']
            .setValidators([
              Validators.required, Validators.required, Validators.pattern('^[A-Za-z ]+$')
            ]);
          this.medicalProviderForm.controls['city'].updateValueAndValidity();

          this.medicalProviderForm.controls['state']
            .setValidators([
              Validators.required,
            ]);
          this.medicalProviderForm.controls['state'].updateValueAndValidity();

          this.medicalProviderForm.controls['zip']
            .setValidators([
              Validators.required, Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')
            ]);
          this.medicalProviderForm.controls['zip'].updateValueAndValidity();

          this.medicalProviderForm.controls['nameOnEnvolop'].setValidators([Validators.nullValidator,]);
          this.medicalProviderForm.controls['nameOnEnvolop'].updateValueAndValidity();

          if (this.providerType == this.vendorTypes.Manufacturers) {
            this.medicalProviderForm.controls['nameOnCheck'].setValidators([Validators.nullValidator,]);
            this.medicalProviderForm.controls['nameOnCheck'].updateValueAndValidity();
          }
          else {
            this.medicalProviderForm.controls['nameOnCheck'].setValidators([Validators.required]);
            this.medicalProviderForm.controls['nameOnCheck'].updateValueAndValidity();
          }
     }

  validateForm() {
    this.medicalProviderForm.markAllAsTouched();
     this.validateProvider()
    let mailCode = this.medicalProviderForm.controls['mailCode'].value;
    this.validateMailCode()

    let addressLine1 = this.medicalProviderForm.controls['addressLine1'].value;
    if(addressLine1) {
      this.medicalProviderForm.controls['mailCode']
          .setValidators([
              Validators.required,
          ]);
      this.medicalProviderForm.controls['mailCode'].updateValueAndValidity();
      this.mailCodeLengthError = false;
      this.cdr.detectChanges();
    }

    if (mailCode) {
      this.validateMailCodeData()
    }

    if (this.providerType != this.vendorTypes.Manufacturers && this.providerType != this.vendorTypes.InsuranceProviders) {
      this.medicalProviderForm.controls['paymentMethod']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['paymentMethod'].updateValueAndValidity();

    }

    if (this.providerType == this.vendorTypes.Clinic) {
      this.medicalProviderForm.controls[this.clinicTypeFieldName]
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls[this.clinicTypeFieldName].updateValueAndValidity();
    }

    if (this.providerType == this.vendorTypes.Clinic) {
      this.medicalProviderForm.controls[this.clinicTypeFieldName]
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls[this.clinicTypeFieldName].updateValueAndValidity();
    }

    if (this.providerType == this.vendorTypes.InsuranceVendors) {

      this.medicalProviderForm.controls['paymentRunDate']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['paymentRunDate'].updateValueAndValidity();

      this.medicalProviderForm.controls['isAcceptCombinedPayment']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['isAcceptCombinedPayment'].updateValueAndValidity();

      this.medicalProviderForm.controls['isAcceptReports']
        .setValidators([
          Validators.required,
        ]);
      this.medicalProviderForm.controls['isAcceptReports'].updateValueAndValidity();
    }

    for (let index = 0; index < this.AddContactForm.length; index++) {
      (this.AddContactForm.controls[index] as FormGroup).controls['isCheckContactNameValid'].setValue(true);
    }
  }

  validateMailCode() {
    if (this.providerType == this.vendorTypes.DentalProviders) {
      let address1 = this.medicalProviderForm.controls['addressLine1'].value;
      let city = this.medicalProviderForm.controls['city'].value;
      let state = this.medicalProviderForm.controls['state'].value;
      let zip = this.medicalProviderForm.controls['zip'].value;

      if (address1 || city || state || zip) {
        this.medicalProviderForm.controls['mailCode']
          .setValidators([
            Validators.required,
          ]);
        this.medicalProviderForm.controls['mailCode'].updateValueAndValidity();
      } else {
        this.medicalProviderForm.controls['mailCode'].clearValidators();
        this.medicalProviderForm.controls['mailCode'].updateValueAndValidity();
      }
    }
  }

  getPaymentMethods() {
    this.lovFacade.getPaymentMethodLov();
    this.loaderService.show();
    this.lovFacade.paymentMethodType$.subscribe((paymentMethod: any) => {
      if (paymentMethod) {
        this.paymentMethodList = paymentMethod;
        this.loaderService.hide();
      }
    })
  }

  getPaymentRunDate() {
    this.lovFacade.getPaymentRunDateLov();
    this.loaderService.show();
    this.lovFacade.paymentRunDates$.subscribe((paymentRunDates: any) => {
      if (paymentRunDates) {
        this.paymentRunDateList = paymentRunDates;
        this.loaderService.hide();
      }
    })
  }

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  mappVendorProfileData() {
    let formValues = this.medicalProviderForm.value;
    this.vendorContactList = [];
    if (formValues.newAddContactForm.length > 0) {
      formValues.newAddContactForm.forEach((contact: any) => {
        if (contact.contactName != '' || contact.description != '' || contact.phoneNumber != '' || contact.email != '') {
          let vendorContact = {
            contactName: contact.contactName,
            contactDesc: contact.description,
            phoneNbr: contact.phoneNumber,
            emailAddress: contact.email,
            emailAddressTypeCode: AddressType.Email,
            faxNbr: contact.fax
          }
          this.vendorContactList.push(vendorContact);
        }
      })
    }
    this.mapAddressContact(formValues);
    const vendorProfileData = this.createVendorProfileData(formValues)
    return vendorProfileData;
  }

  private specialHandlingTextAreaWordCount() {
    this.specialHandlingCharachtersCount = this.specialHandlingTextArea
      ? this.specialHandlingTextArea.length
      : 0;
    this.specialhandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingMaxLength}`;
  }

  onspecialHandlingTextAreaValueChange(event: any): void {
    this.specialHandlingCharachtersCount = event.length;
    this.specialhandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingMaxLength}`;
  }

  onClinicNameChecked() {
    if (this.clinicNameNotApplicable) {
      this.medicalProviderForm.controls['parentVendorId'].setValue(null);
      this.medicalProviderForm.controls['parentVendorId'].disable();
      this.firstLastNameNotApplicable = false;
      this.onNameChecked();
    }
    else {
      this.medicalProviderForm.controls['parentVendorId'].enable();
    }
  }

  onNameChecked() {
    if (this.firstLastNameNotApplicable) {
      this.medicalProviderForm.controls['firstName'].setValue(null);
      this.medicalProviderForm.controls['lastName'].setValue(null);
      this.medicalProviderForm.controls['firstName'].disable();
      this.medicalProviderForm.controls['lastName'].disable();
      this.clinicNameNotApplicable = false;
      this.onClinicNameChecked();
    }
    else {
      this.medicalProviderForm.controls['firstName'].enable();
      this.medicalProviderForm.controls['lastName'].enable();
    }
  }

  onSearchTemplateClick(clinicDetail: any) {
    this.selectedClinicVendorId = clinicDetail.vendorId
    this.medicalProviderForm.controls['providerName'].setValue(clinicDetail.vendorName);
  }

  isClinicNameFilterable = true;


  closeVendorModal() {
    this.closeModalEventClicked.next(null);
  }

  updateVendorDetails() {
    this.validateEditForm();
    this.isValidateForm = true;
    if (this.medicalProviderForm.valid) {
      this.loaderService.show();
      let vendorValues: any = {};
      vendorValues['vendorId'] = this.vendorDetails.vendorId;
      if(this.vendorDetails.parentVendorId){
        vendorValues['vendorName'] = this.medicalProviderForm.controls['providerName'].value;
      }      
      vendorValues['firstName'] = this.medicalProviderForm.controls['firstName'].value;
      vendorValues['lastName'] = this.medicalProviderForm.controls['lastName'].value;
      vendorValues['tin'] = this.medicalProviderForm.controls['tinNumber'].value;
      vendorValues['npiNbr'] = this.medicalProviderForm.controls['npiNbr'].value;
      vendorValues['preferredFlag'] = this.medicalProviderForm.controls['isPreferedPharmacy'].value ? 'Y' : 'N';
      this.updateVendorDetailsClicked.next(vendorValues)

    }
  }

  validateEditForm() {
    this.medicalProviderForm.markAllAsTouched();
    if (this.vendorTypes.DentalProviders == this.providerType || this.vendorTypes.MedicalProviders == this.providerType
      || this.vendorTypes.DentalClinic == this.providerType || this.vendorTypes.MedicalClinic == this.providerType) {
      if (this.vendorDetails.vendorName && this.vendorDetails.vendorTypeCode != this.vendorTypes.DentalProviders && this.vendorDetails.vendorTypeCode != this.vendorTypes.MedicalProviders) {
        this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
        this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
      }
      else {
        this.medicalProviderForm.controls['firstName'].setValidators([Validators.required]);
        this.medicalProviderForm.controls['lastName'].setValidators([Validators.required]);
        this.medicalProviderForm.controls['firstName'].updateValueAndValidity();
        this.medicalProviderForm.controls['lastName'].updateValueAndValidity();
      }
    }
    else {
      this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
      this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
    }

  }

  mapAddressContact(formValues: any) {
    this.vendorContactList = [];
    if (formValues.newAddContactForm.length > 0) {
      formValues.newAddContactForm.forEach((contact: any) => {
        if (contact.contactName != '' || contact.description != '' || contact.phoneNumber != '' || contact.email != '') {
          let vendorContact = {
            contactName: contact.contactName,
            contactDesc: contact.description,
            phoneNbr: contact.phoneNumber,
            emailAddress: contact.email,
            emailAddressTypeCode: AddressType.Email,
            faxNbr: contact.fax,
            preferredFlag: contact.isPreferedContact ? 'Y' : 'N'
          }
          this.vendorContactList.push(vendorContact);
        }
      })
    }
  }

  createVendorProfileData(formValues: any) {
    const PreferredFlagStatus = this.getPreferredFlagStatus(formValues);
    let vendorProfileData = this.initializeVendorProfileData(formValues, PreferredFlagStatus);

    this.adjustVendorTypeCode(vendorProfileData, formValues);

    return vendorProfileData;
}

private getPreferredFlagStatus(formValues: any): string | null {
    if (this.providerType === this.vendorTypes.Pharmacy) {
        return formValues.isPreferedPharmacy ? StatusFlag.Yes : StatusFlag.No;
    } else {
        return null;
    }
}

private initializeVendorProfileData(formValues: any, PreferredFlagStatus: string | null): any {
    return {
        vendorId: this.selectedClinicVendorId,
        vendorName: formValues.providerName,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        vendorTypeCode: this.providerType,
        tin: this.getValidValue(formValues.tinNumber),
        npiNbr: formValues.npiNbr,
        mailCode: formValues.mailCode,
        addressTypeCode: AddressType.Mailing,
        address1: formValues.addressLine1,
        address2: formValues.addressLine2,
        cityCode: formValues.city,
        stateCode: formValues.state,
        zip: formValues.zip,
        nameOnCheck: formValues.nameOnCheck,
        nameOnEnvelope: formValues.nameOnEnvolop,
        paymentMethodCode: formValues.paymentMethod,
        clinicType: formValues.clinicType,
        specialHandlingDesc: formValues.specialHandlingDesc,
        phoneTypeCode: AddressType.Mailing,
        vendorContacts: this.vendorContactList,
        AcceptsReportsFlag: this.getValidValue(formValues.isAcceptReports),
        AcceptsCombinedPaymentsFlag: this.getValidValue(formValues.isAcceptCombinedPayment),
        PaymentRunDateMonthly: this.getValidNumber(formValues.paymentRunDate),
        PreferredFlag: PreferredFlagStatus,
        PhysicalAddressFlag: formValues.physicalAddressFlag ? StatusFlag.Yes : StatusFlag.No,
        emailAddressTypeCode: AddressType.Mailing,
        activeFlag: this.hasCreateUpdatePermission ? StatusFlag.Yes : StatusFlag.No,
        parentVendorId: formValues.parentVendorId,
    };
}

private adjustVendorTypeCode(vendorProfileData: any, formValues: any) {
    if (this.providerType === FinancialVendorTypeCode.Clinic) {
        vendorProfileData.vendorTypeCode = formValues.clinicType === FinancialVendorTypeCode.MedicalClinic
            ? FinancialVendorTypeCode.MedicalClinic
            : FinancialVendorTypeCode.DentalClinic;
    }
    if (this.vendorTypes.HealthcareProviders === this.providerType) {
        vendorProfileData.vendorTypeCode = this.vendorTypes.MedicalProviders;
    }
}

private getValidValue(value: any): any {
    return value != null && value != '' ? value : null;
}

private getValidNumber(value: any): number | null {
    return value != null && value != '' ? Number(value) : null;
}


  onChange() {
    let mailCode = this.medicalProviderForm.controls['mailCode'].value;
    if (mailCode.length >= 0) {
      this.medicalProviderForm.controls['addressLine1']
        .setValidators([]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city']
        .setValidators([]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state']
        .setValidators([]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip']
        .setValidators([]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();

      this.medicalProviderForm.controls['nameOnCheck']
        .setValidators([]);
      this.medicalProviderForm.controls['nameOnCheck'].updateValueAndValidity();

      this.medicalProviderForm.controls['nameOnEnvolop']
        .setValidators([]);
      this.medicalProviderForm.controls['nameOnEnvolop'].updateValueAndValidity();
    }
  }

  onMailCodeChange() {
    let mailCode = this.medicalProviderForm.controls['mailCode'].value;
    if (mailCode.length > 0) {
      this.medicalProviderForm.controls['addressLine1'].setValidators([Validators.required,]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city'].setValidators([Validators.required,]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state'].setValidators([Validators.required,]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip'].setValidators([Validators.required,]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();

      this.medicalProviderForm.controls['nameOnCheck'].setValidators([Validators.required,]);
      this.medicalProviderForm.controls['nameOnCheck'].updateValueAndValidity();

    }
    else {
      this.onChange();
    }
  }

  onMailCodeKeyUp() {
    let mailCode = this.medicalProviderForm.controls['mailCode'].value;
    if (mailCode.length !== 3 && mailCode != "") {
      this.mailCodeLengthError = true;
    }
    else if (mailCode.length <= 0 || mailCode.length == 3) {
      this.mailCodeLengthError = false
    }
  }
  get medicalProviderFormControls() {
    return this.medicalProviderForm.controls as any;
  }
  onPharmacyPhysicalAddressChecked() {
    let isPharmacyPhysicalAddressChecked = this.medicalProviderForm.controls['physicalAddressFlag'].value;
    if (isPharmacyPhysicalAddressChecked) {
      this.medicalProviderForm.controls['addressLine1']
        .setValidators([Validators.required]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city']
        .setValidators([Validators.required]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state']
        .setValidators([Validators.required]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip']
        .setValidators([Validators.required]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();
    }
    else {
      this.medicalProviderForm.controls['addressLine1']
        .setValidators([]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city']
        .setValidators([]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state']
        .setValidators([]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip']
        .setValidators([]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();
    }

  }

  restrictSpecialChar(event: any) {
    const status = ((event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 8 || event.charCode == 32 ||
      (event.charCode >= 48 && event.charCode <= 57) ||
      event.charCode == 45);
    if (status) {
      this.medicalProviderForm.controls['zip'].setErrors(null);
      this.specialCharAdded = false;
    }
    else {
      this.medicalProviderForm.controls['zip'].setErrors({ 'incorrect': true });
      this.specialCharAdded = true;
    }
    return status;
  }

  restrictAccountingNumber(event: any) {
    this.isDuplicateTin = false;
    if(( (this.providerType == this.vendorTypes.Pharmacy)||
      (this.providerType==this.vendorTypes.DentalProviders)||
      (this.providerType==this.vendorTypes.MedicalProviders) ||
      (this.providerType==this.vendorTypes.InsuranceVendors)||
      (this.providerType == this.vendorTypes.Manufacturers)) &&
      this.medicalProviderForm.controls['tinNumber'].value==''){
      this.accountingNumberValidated = true;
      return;
    }
    if (this.medicalProviderForm.controls['tinNumber'].value && (parseInt(this.medicalProviderForm.controls['tinNumber'].value.charAt(0)) == 1 || parseInt(this.medicalProviderForm.controls['tinNumber'].value.charAt(0)) == 3)) {
      this.accountingNumberValidated = true;
      if(this.medicalProviderForm.controls['tinNumber'].value.trim().length>=9){
        this.validateTin(this.medicalProviderForm.controls['tinNumber'].value);
      }
    } else {
      this.medicalProviderForm.controls['tinNumber'].setErrors({ 'incorrect': true });
      this.accountingNumberValidated = false;
      this.isDuplicateTin = false;
    }
  }
  onKeyPressAllowAlphabetOnly(event:number) {
    if((event > 64 && event < 91) || (event > 96 && event < 123)||event==32)
      {
        this.medicalProviderForm.controls['city'].setErrors(null);
        return true;
      }else{
        this.medicalProviderForm.controls['city'].setErrors({ 'incorrect': true });
        return false;
      }
  }

  validateTin(tinNbr: any) {
    this.tinValidationFacade.showLoader();
    this.tinValidationFacade.validateTinNbr(tinNbr).subscribe({
      next: (response: any) => {
        if(response){
          this.isDuplicateTin = false;
        }
        this.tinValidationFacade.hideLoader();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.tinValidationFacade.hideLoader();
        this.isDuplicateTin = true;
        this.medicalProviderForm.controls['tinNumber'].setErrors({ 'incorrect': true });
        this.duplicateTinMessage = err.error?.error?.message ?? "";
        this.cdr.detectChanges();
        }
    });
  }

}
