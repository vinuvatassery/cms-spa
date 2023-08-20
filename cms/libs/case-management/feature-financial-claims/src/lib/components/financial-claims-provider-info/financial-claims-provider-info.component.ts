import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialVendorProviderTabCode, FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-claims-provider-info',
  templateUrl: './financial-claims-provider-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
 
  @Input()
  vendorProfile$: Observable<any> | undefined;
  @Input() updateProviderPanelSubject$ : Observable<any> | undefined;
  @Input() ddlStates$ : Observable<any> | undefined;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isEditProvider = false;
  vendorProfiles: any
  showAddressValidationLoader$= new BehaviorSubject(false);
  @Input() paymentMethodCode$ : Observable<any> | undefined;
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
      specialHandlingDesc: [''],
      mailCode: ['']
    }),
    contacts: new FormArray([])
  })
  isSubmitted: boolean = false
  paymentRequestId:any
  constructor(public formBuilder: FormBuilder, 
    public activeRoute: ActivatedRoute,
    private route: Router) {

  }

  ngOnInit(): void {
   this.paymentRequestId= this.activeRoute.snapshot.queryParams['iid'];
    this.loadVendorInfo()
  }

  loadVendorInfo() {
    this.vendorProfile$?.subscribe(res => {
      if(res){
      this.vendorProfiles = res;
      }else{
        this.closeViewProviderClicked()
      }
    })

    this.getProviderPanelEvent.emit(this.paymentRequestId)
  }




  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  createEmailsFormArray(contact: any): FormArray {
    let emails = new FormArray<FormGroup>([])
    contact.emails.forEach((email: any) => {
      return emails.push(this.formBuilder.group({
        emailAddress: [email.emailAddress,Validators.required],
        vendorContactEmailId: email.vendorContactEmailId
      }));
    })
    return emails;
  }

  createPhonesFormArray(contact: any): FormArray {
    let phones = new FormArray<FormGroup>([])
    contact.phones.forEach((phone: any) => {
      return phones.push(this.formBuilder.group({
        phoneNbr: [phone.phoneNbr,Validators.required],
        vendorContactPhoneId: phone.vendorContactPhoneId
      }));
    })
    return phones;
  }

  createContactsFormArray() {
    const contacts =  this.profileForm.get('contacts') as FormArray
    this.vendorProfiles.address.contacts.forEach((contact: any, index: number) => {
       contacts.push(
        this.formBuilder.group({
          contactName: [contact.contactName,Validators.required],
          vendorContactId: contact.vendorContactId,
          emails: this.createEmailsFormArray(contact),
          phones: this.createPhonesFormArray(contact)
        }));
    });
    return contacts;
  }


  editProviderClicked() {

    this.onEditProviderProfileEvent.emit()
    this.isEditProvider = !this.isEditProvider
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
        specialHandlingDesc: this.vendorProfiles.address.specialHandlingDesc,
        paymentMethod: this.vendorProfiles.address.paymentMethodCode,
      
      }
    });
    this.createContactsFormArray() 
  }

  get addressForm(){
  return this.profileForm.get("address")
  }

  get contactsArray(): FormArray<FormGroup> {
    return this.profileForm.get("contacts") as unknown as  FormArray<FormGroup>;
  }


  getPhonesArray(contact: any):FormArray {
    return contact.get('phones') as unknown as FormArray<FormGroup>
  }

  getEmailsArray(contact:any) :FormArray{
    return contact.get('emails') as unknown as FormArray<FormGroup>
  }

  getContactArrayFormValues() {
    let contact: any[] = []
    this.profileForm.controls.contacts.controls.forEach(control => {
      let contactForm = control as unknown as FormGroup
      let emailsFormArray = contactForm.controls['emails'] as unknown as FormArray
      let phonesFormArray = contactForm.controls['phones'] as unknown as FormArray
      contact.push({
        contactName: contactForm.controls['contactName']?.value,
        vendorContactId: contactForm.controls['vendorContactId']?.value,
        emails: this.getEmailArrayFormValues(emailsFormArray),
        phones: this.getPhoneArrayFormValues(phonesFormArray)
      })
    });
    return contact
  }

  getEmailArrayFormValues(emailsFormArray: FormArray) {
    let emails: any[] = []
    emailsFormArray.controls.forEach(control => {
      let emailForm = control as unknown as FormGroup
      emails.push({
        emailAddress: emailForm.controls['emailAddress']?.value,
        VendorContactEmailId: emailForm.controls['vendorContactEmailId']?.value
      })
    })
    return emails;
  }

  getPhoneArrayFormValues(phonesFormArray: FormArray) {
    let phones: any[] = []
    phonesFormArray.controls.forEach(control => {
     let phonesForm = control as unknown as FormGroup
      phones.push({
        PhoneNbr: phonesForm.controls['phoneNbr']?.value,
        VendorContactPhoneId: phonesForm.controls['vendorContactPhoneId']?.value
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
    let providerPanelDto = {
      vendorId: this.vendorProfiles.vendorId,
      tin: this.profileForm?.controls['tin'].value,
      Address: {
        vendorAddressId: this.vendorProfiles.address.vendorAddressId,
        specialHandlingDesc: this.profileForm?.controls.address.controls['specialHandlingDesc']?.value,
        paymentMethodCode: this.profileForm?.controls.address.controls['paymentMethod']?.value,
        address1: this.profileForm?.controls.address.controls['address1']?.value,
        address2: this.profileForm?.controls.address.controls['address2']?.value,
        cityCode: this.profileForm?.controls.address.controls['cityCode']?.value,
        stateCode: this.profileForm?.controls.address.controls['stateCode']?.value,
        zip: this.profileForm?.controls.address.controls['zip']?.value,
        contacts: this.getContactArrayFormValues()
      }    
    }
    this.updateProviderProfileEvent.emit(providerPanelDto)
    this.updateProviderPanelSubject$?.subscribe(res=>{    
    if(res){
        this.isEditProvider = !this.isEditProvider
        this.loadVendorInfo();
      }else{
        this.closeViewProviderClicked()
      }      
    });
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




