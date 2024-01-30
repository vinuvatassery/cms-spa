import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { BehaviorSubject, Observable, take } from 'rxjs';

@Component({
  selector: 'cms-refund-claims-provider-info',
  templateUrl: './refund-claims-provider-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundClaimsProviderInfoComponent {
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
  vendorProfile: any
  showAddressValidationLoader$= new BehaviorSubject(false);
  @Input() paymentMethodCode$ : Observable<any> | undefined;
  profileForm = this.formBuilder.group({
    tin: [''],
    address: this.formBuilder.group({
      vendorAddressId: [''],
      paymentMethod: [''],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]],
      specialHandlingDesc: [''],
      mailCode: [{ value: '', disabled: true }]
    }),
    contacts: new FormArray([])
  })
  isSubmitted: boolean = false
  @Input() paymentRequestId:any
  constructor(public formBuilder: FormBuilder,
    public activeRoute: ActivatedRoute,
    private route: Router,
    private readonly changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {

   this.paymentRequestId= this.paymentRequestId? this.paymentRequestId: this.activeRoute.snapshot.queryParams['pid'];
    this.loadVendorInfo()
  }

  loadVendorInfo() {
    this.vendorProfile$?.subscribe(res => {
      this.changeDetectorRef.markForCheck()
      this.vendorProfile = res;
      this.isEditProvider = false
    })

    this.getProviderPanelEvent.emit(this.paymentRequestId)
  }




  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  createEmailsFormArray(contact: any): FormArray {
    let emails = new FormArray<FormGroup>([])

    if(contact.emails && contact.emails.length>0){
    contact.emails.forEach((email: any) => {
      return emails.push(this.formBuilder.group({
        emailAddress: [email.emailAddress,Validators.required],
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


  editProviderClicked() {

    this.onEditProviderProfileEvent.emit()
    this.isEditProvider = !this.isEditProvider
    this.profileForm.patchValue({
      tin: this.vendorProfile.tin,
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
        VendorContactEmailId: emailForm.controls['vendorContactEmailId']?.value,
        vendorContactId: emailForm.controls['vendorContactId']?.value
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
        VendorContactPhoneId: phonesForm.controls['vendorContactPhoneId']?.value,
        vendorContactId: phonesForm.controls['vendorContactId']?.value
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
      vendorId: this.vendorProfile.vendorId,
      tin: this.profileForm?.controls['tin'].value,
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


  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  get financeVendorTypeCodes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  onVendorProfileViewClicked() {
    const query = {
      queryParams: {
        v_id: this.vendorProfile.vendorId,
        tab_code: FinancialVendorProviderTabCode.MedicalProvider
      },
    };
    this.closeViewProviderDetailClickedEvent.emit(true);
    this.route.navigate(['/financial-management/vendors/profile'], query)
    this.closeViewProviderClicked()
  }

}




