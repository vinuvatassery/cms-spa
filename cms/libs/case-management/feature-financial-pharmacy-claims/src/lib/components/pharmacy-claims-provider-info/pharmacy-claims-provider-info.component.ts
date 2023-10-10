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
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, take } from 'rxjs';

@Component({
  selector: 'cms-pharmacy-claims-provider-info',
  templateUrl: './pharmacy-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  @Input()vendorProfile$: Observable<any> | undefined;
  @Input() paymentMethodCode$ : Observable<any> | undefined;
  @Input() ddlStates$ : Observable<any> | undefined;
  @Input() updateProviderPanelSubject$ : Observable<any> | undefined;
  @Output() updateProviderProfileEvent = new EventEmitter<any>();
  @Output() getProviderPanelEvent = new EventEmitter<any>();
  @Input() paymentRequestId:any
  isEditProvider = false;
  isSubmitted: boolean = false
  profileForm = this.formBuilder.group({
    tin: [''],
    address: this.formBuilder.group({
      vendorAddressId: [''],
      paymentMethod: [''],
      address1: ['', Validators.required],
      address2: [''],
      cityCode: ['', Validators.required],
      stateCode: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')]],
      specialHandlingDesc: [''],
      mailCode: [{ value: '', disabled: true }]
    }),
    contacts: new FormArray([])
  })
  vendorProfile:any
  constructor(public formBuilder: FormBuilder, 
    public activeRoute: ActivatedRoute,
    private route: Router,
    private readonly changeDetectorRef: ChangeDetectorRef) {
}
ngOnInit(): void {
  this.paymentRequestId= this.paymentRequestId? this.paymentRequestId: this.activeRoute.snapshot.queryParams['pid'];
   this.loadVendorInfo()
 }
  public formUiStyle : UIFormStyle = new UIFormStyle();
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
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
    onVendorProfileViewClicked() {
      const query = {
        queryParams: {
          v_id: this.vendorProfile.vendorId
        },
      };
      this.route.navigate(['/financial-management/vendors/profile'], query)
      this.closeViewProviderClicked()
    }
    loadVendorInfo() {
      this.vendorProfile$?.subscribe(res => {
        this.changeDetectorRef.markForCheck()
        this.vendorProfile = res;
        this.isEditProvider = false
      })
  
      this.getProviderPanelEvent.emit(this.paymentRequestId)
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
}
