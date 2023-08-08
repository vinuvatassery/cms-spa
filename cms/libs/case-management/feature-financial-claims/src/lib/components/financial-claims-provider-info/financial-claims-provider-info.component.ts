import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'cms-financial-claims-provider-info',
  templateUrl: './financial-claims-provider-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Input() vendorId: any
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEditProvider = false;
  vendorProfiles: any
  showAddressValidationLoader$= new BehaviorSubject(false);
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  profileForm = this.formBuilder.group({
    tin: [''],
    address: this.formBuilder.group({
      vendorAddressId: [''],
      paymentMethod: [''],
      address1: ['', Validators.required],
      address2: [''],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', Validators.required],
      specialHandling: [''],
      mailCode: [''],
      contacts: this.formBuilder.array([])
    })
  })
  isSubmitted: boolean = false
  constructor(private financialVendorFacade: FinancialVendorFacade, public formBuilder: FormBuilder
    , public lovFacade: LovFacade,
    private loaderService: LoaderService,
    public contactFacade: ContactFacade,
    private route: Router,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,) {

  }


  ngOnInit(): void {
    this.vendorProfile$.subscribe(res => {
      this.vendorProfiles = res;
    })
    this.loadVendorInfo()
  }

  loadVendorInfo() {
    this.financialVendorFacade.getProviderPanel('5449D739-5C70-446B-8269-13A862FE771F')
  }

  loadPaymentMethodCodes() {
    this.lovFacade.getPaymentMethodLov()
  }
  loadStates() {
    this.contactFacade.loadDdlStates();
  }

  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  CreateEmailsFormArray(contact: any): FormArray {

    var emails = new FormArray<FormGroup>([])

    contact.emails.forEach((email: any) => {
      return emails.push(this.formBuilder.group({
        emailAddress: [email.emailAddress,Validators.required],
        vendorContactEmailId: email.vendorContactEmailId
      }));
    })
    return emails;
  }

  createPhonesFormArray(contact: any): FormArray {
    var phones = new FormArray<FormGroup>([])
    contact.phones.forEach((phone: any) => {
      return phones.push(this.formBuilder.group({
        phoneNbr: [phone.phoneNbr,Validators.required],
        vendorContactPhoneId: phone.vendorContactPhoneId
      }));
    })
    return phones;
  }


  createContactsFormArray() {
    var contacts = this.profileForm.controls.address.controls.contacts as FormArray

    this.vendorProfiles.address.contacts.forEach((contact: any, index: number) => {

      contacts.push(this.formBuilder.group({
        contactName: contact.contactName,
        vendorContactId: contact.vendorContactId,
        emails: this.CreateEmailsFormArray(contact),
        phones: this.createPhonesFormArray(contact)
      }))
    });

  }

  phones(i: number) {
    var x = this.profileForm.controls.address.controls.contacts.controls[i].get('phones') as FormArray<FormGroup>

    return x;
  }

  emails(i: number) {
    var x = this.profileForm.controls.address.controls.contacts.controls[i].get('emails') as FormArray<FormGroup>

    return x;
  }
  editProviderClicked() {
    this.loadPaymentMethodCodes()
    this.loadStates()
    this.isEditProvider = !this.isEditProvider


    this.createContactsFormArray()
    this.profileForm.patchValue({
      tin: this.vendorProfiles.tin,
      address: {
        vendorAddressId: this.vendorProfiles.address.vendorAddressId,
        address1: this.vendorProfiles.address.address1,
        address2: this.vendorProfiles.address.address2,
        cityCode: this.vendorProfiles.address.cityCode,
        stateCode: this.vendorProfiles.address.stateCode,
        zip: this.vendorProfiles.address.zip,
        mailCode: this.vendorProfiles.address.mailCode,
        specialHandling: this.vendorProfiles.address.specialHandling,
        paymentMethod: this.vendorProfiles.address.paymentMethodCode
      }
    });

  }

  getContactArrayFormValues() {
    var contact: any[] = []
    this.profileForm.controls.address.controls.contacts.controls.forEach(control => {
      var c = control as unknown as FormGroup
      var e = c.controls['emails'] as unknown as FormArray
      var p = c.controls['phones'] as unknown as FormArray
      contact.push({
        contactName: c.controls['contactName']?.value,
        vendorContactId: c.controls['vendorContactId']?.value,
        emails: this.getEmailArrayFormValues(e),
        phones: this.getPhoneArrayFormValues(p)
      })
    });
    return contact
  }

  getEmailArrayFormValues(e: FormArray) {
    var emails: any[] = []
    e.controls.forEach(control => {
      var c = control as unknown as FormGroup
      emails.push({
        emailAddress: c.controls['emailAddress']?.value,
        VendorContactEmailId: c.controls['vendorContactEmailId']?.value
      })
    })
    return emails;
  }

  getPhoneArrayFormValues(e: FormArray) {
    var phones: any[] = []
    e.controls.forEach(control => {
      var c = control as unknown as FormGroup
      phones.push({
        PhoneNbr: c.controls['phoneNbr']?.value,
        VendorContactPhoneId: c.controls['vendorContactPhoneId']?.value
      })
    })
    return phones;
  }

  updateProfile() {
    this.isSubmitted =true;

    this.profileForm.markAllAsTouched();
    if(!this.profileForm.valid)
    {
return;
    }
    var providerPanelDto = {
      vendorId: this.vendorProfiles.vendorId,
      tin: this.profileForm?.controls['tin'].value,
      Address: {
        vendorAddressId: this.vendorProfiles.address.vendorAddressId,
        specialHandlingDesc: this.profileForm?.controls.address.controls['paymentMethod']?.value,
        paymentMethodCode: this.profileForm?.controls.address.controls['paymentMethod']?.value,
        address1: this.profileForm?.controls.address.controls['address1']?.value,
        address2: this.profileForm?.controls.address.controls['address2']?.value,
        cityCode: this.profileForm?.controls.address.controls['cityCode']?.value,
        stateCode: this.profileForm?.controls.address.controls['stateCode']?.value,
        zip: this.profileForm?.controls.address.controls['zip']?.value,
        contacts: this.getContactArrayFormValues()
      }
    
    }
  //  this.validateFeilds(providerPanelDto);
    this.loaderService.show()

    this.financialVendorFacade.updateProviderPanel(providerPanelDto).subscribe({
      next: (data) => {
        this.loaderService.hide();
        this.isEditProvider = !this.isEditProvider

        this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Provider profile Saved Successfully.")
        this.loadVendorInfo();
      },
      error: (error) => {
        this.loggingService.logException(error);
        this.loaderService.hide();
      }
    });
  }
  validateFeilds(providerPanelDto:any) {
    if(providerPanelDto.address.address1 &&
       providerPanelDto.address.city &&
        providerPanelDto.address.city &&
         providerPanelDto.address.zip){
            this.isSubmitted = true;
    }
    else{
      this.isSubmitted = false;
    }
  }


  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  get financeVendorTypeCodes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  onVendorProfileViewClicked() {
    const query = {
      queryParams: {
        v_id: this.vendorProfiles.vendorId
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query)
    this.closeViewProviderClicked()
  }

}




