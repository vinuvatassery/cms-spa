import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, take } from 'rxjs';
import { TinValidationFacade } from '@cms/system-config/domain';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FinancialVendorProviderTabCode } from '@cms/case-management/domain';

@Component({
  selector: 'cms-pharmacy-claims-provider-info',
  templateUrl: './pharmacy-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  isEditProvider = false;
  @Input() vendorProfile$: Observable<any> | undefined;
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Input() updateProviderPanelSubject$ : Observable<any> | undefined;
  @Input() ddlStates$ : Observable<any> | undefined;
  @Input() paymentMethodCode$ : Observable<any> | undefined;
  @Output() onEditProviderProfileEvent = new EventEmitter<any>();
  specialHandling = '';
  specialHandlingCharachtersCount!: number;
  specialHandlingCounter!: string;
  specialHandlingLength = 100;
  vendorProfile: any
  isDuplicateTin = false;
  accountingNumberValidated = true;
  tinMaskFormat: string = '0 00-000000';
  duplicateTinMessage = "";
  profileForm = this.formBuilder.group({
    tin: [''],
    npiNbr:[''],
    address: this.formBuilder.group({
      vendorAddressId: [''],
      paymentMethod: [''],
      address1: ['', Validators.required],
      address2: [''],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]],
      specialHandlingDesc: [''],
      mailCode: [{ value: '', disabled: true }],
    }),
    contacts: new FormArray([])
  })
  @Input() paymentRequestId:any
  isSubmitted: boolean = false
  prefferedVendorEmails! : any[]
  prefferedVendorPhones! : any[]
  constructor(  
    private readonly changeDetectorRef: ChangeDetectorRef,
     public formBuilder: FormBuilder,
     private readonly cdr: ChangeDetectorRef,
     private route: Router,
    public activeRoute: ActivatedRoute,
    private tinValidationFacade: TinValidationFacade
    ) {

  }
  ngOnInit(): void {
    this.paymentRequestId= this.paymentRequestId ? this.paymentRequestId : this.activeRoute.snapshot.queryParams['pid'];
    this.loadVendorInfo();
    this.specialHandlingWordCount();
   }
  public formUiStyle : UIFormStyle = new UIFormStyle();
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  private specialHandlingWordCount() {
    this.specialHandlingCharachtersCount = this.specialHandling
      ? this.specialHandling.length
      : 0;
    this.specialHandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingLength}`;
  }
  editProviderClicked(){
  this.onEditProviderProfileEvent.emit()
  this.isEditProvider = !this.isEditProvider
  this.profileForm.patchValue({
    tin: this.vendorProfile.tin,
    npiNbr:this.vendorProfile.npiNbr,
    address: {
      vendorAddressId: this.vendorProfile.address.vendorAddressId,
      address1: this.vendorProfile.address.address1,
      address2: this.vendorProfile.address.address2,
      cityCode: this.vendorProfile.address.cityCode,
      stateCode: this.vendorProfile.address.stateCode,
      zip: this.vendorProfile.address.zip,
      mailCode: this.vendorProfile.address.mailCode,
      specialHandlingDesc: this.vendorProfile.address.specialHandlingDesc,
      paymentMethod: this.vendorProfile.address.paymentMethodCode,
     
    }
  });
  this.specialHandling = this.vendorProfile.address.specialHandlingDesc;
  this.specialHandlingWordCount();
  this.createContactsFormArray() 
}
createContactsFormArray() {
  let contacts =  this.profileForm.get('contacts') as FormArray
  while (contacts.length !== 0) {
    contacts.removeAt(0)
  }
  this.vendorProfile.address.contacts.forEach((contact: any, index: number) => {
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

createEmailsFormArray(contact: any): FormArray {
  let emails = new FormArray<FormGroup>([])
 
  if(contact.emails && contact.emails.length===0){
     emails.push(this.formBuilder.group({
      vendorContactEmailId: null,
      vendorContactId: contact.vendorContactId
    }));
  }
  else{
  contact.emails.forEach((email: any) => {
    return emails.push(this.formBuilder.group({
      vendorContactEmailId: email.vendorContactEmailId
    }));
  })
}
  return emails;
}

createPhonesFormArray(contact: any): FormArray {
  let phones = new FormArray<FormGroup>([])

  if(contact.phones && contact.phones.length===0){
    phones.push(this.formBuilder.group({
      phoneNbr: ['',Validators.required],
      vendorContactPhoneId: null,
      vendorContactId: contact.vendorContactId,
   }));
 }
 else{
  contact.phones.forEach((phone: any) => {
    return phones.push(this.formBuilder.group({
      phoneNbr: [phone.phoneNbr,Validators.required],
      vendorContactPhoneId: phone.vendorContactPhoneId
    }));
  })
}
  return phones;
}
  loadVendorInfo() {
    this.vendorProfile$?.subscribe((res:any) => {
      this.changeDetectorRef.markForCheck()
      this.vendorProfile = res;
      this.isEditProvider = false
      this.prefferedVendorEmails = []
      this.prefferedVendorPhones = []
      this.vendorProfile.address.contacts?.forEach((contact :any)=>{
         if(contact){
          if(contact.email &&  contact.email.length >0){
            this.prefferedVendorEmails.push(contact.emails.filter((e :any) => e.preferredFlag =='Y'))
          }
          if(contact.phones &&  contact.phones.length >0){
             this.prefferedVendorPhones.push(contact.phones.filter((e :any) => e.preferredFlag =='Y'))
          }
         }
     })   
    })

    this.getProviderPanelEvent.emit(this.paymentRequestId)
  }

  get addressForm(){
    return this.profileForm.get("address")
    }
    getEmailsArray(contact:any) :FormArray{
      return contact.get('emails') as unknown as FormArray<FormGroup>
    }
    
  getPhonesArray(contact: any):FormArray {
    return contact.get('phones') as unknown as FormArray<FormGroup>
  }
  get contactsArray(): FormArray<FormGroup> {
    return this.profileForm.get("contacts") as unknown as  FormArray<FormGroup>;
  }
  updateProfile() {
    this.isSubmitted =true;
    this.profileForm.markAllAsTouched();
    if(!this.profileForm.valid)
    {
        return;
    }
    let providerPanelDto = {
      vendorId: this.vendorProfile.vendorId,
      tin: this.profileForm?.controls['tin'].value,
      npiNbr:this.profileForm?.controls['npiNbr'].value,
      Address: {
        vendorAddressId: this.vendorProfile.address.vendorAddressId,
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
    this.updateProviderPanelSubject$?.pipe(take(1)).subscribe(res=>{       
        this.loadVendorInfo(); 
    });
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
  getPhoneArrayFormValues(phonesFormArray: FormArray) {
    let phones: any[] = []
    phonesFormArray.controls.forEach(control => {
     let phonesForm = control as unknown as FormGroup
      phones.push({
        PhoneNbr: phonesForm.controls['phoneNbr']?.value,
        VendorContactPhoneId: phonesForm.controls['vendorContactPhoneId']?.value,
        vendorContactId: phonesForm.controls['vendorContactId']?.value
      })
    })
    return phones;
  }
  getEmailArrayFormValues(emailsFormArray: FormArray) {
    let emails: any[] = []
    emailsFormArray.controls.forEach(control => {
      let emailForm = control as unknown as FormGroup
      emails.push({
        emailAddress: emailForm.controls['emailAddress']?.value,
        VendorContactEmailId: emailForm.controls['vendorContactEmailId']?.value,  
        vendorContactId: emailForm.controls['vendorContactId']?.value
      })
    })
    return emails;
  }
  onVendorProfileViewClicked() {
    const query = {
      queryParams: {
        v_id: this.vendorProfile.vendorId,
        tab_code: FinancialVendorProviderTabCode.Pharmacy
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query)
    this.closeViewProviderClicked()
  }
  restrictAccountingNumber() {
    this.isDuplicateTin = false;
    if(!this.profileForm.controls['tin'].value){
      this.accountingNumberValidated = true;
      return;
    }
    if (this.profileForm.controls['tin'].value && (parseInt(this.profileForm.controls['tin'].value.charAt(0)) == 1 || parseInt(this.profileForm.controls['tin'].value.charAt(0)) == 3)) {
      this.accountingNumberValidated = true;
    } 
    else {
      this.profileForm.controls['tin'].setErrors({ 'incorrect': true });
      this.accountingNumberValidated = false;
      this.isDuplicateTin = false;
    }
    
    if(this.profileForm.controls['tin'].value.trim().length>=9){
      this.validateTin(this.profileForm.controls['tin'].value);
    }
  }
  onSpecialHandlingValueChange(event: any): void {
    this.specialHandlingCharachtersCount = event.length;
    this.specialHandlingCounter = `${this.specialHandlingCharachtersCount}/${this.specialHandlingLength}`;
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
        this.profileForm.controls['tin'].setErrors({ 'incorrect': true });
        this.duplicateTinMessage = err.error?.error?.message ?? "";
        this.cdr.detectChanges();
        }
    });
  }
}
