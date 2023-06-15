import { Component,OnInit,  Output,Input,
  EventEmitter } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder,FormControl,FormArray, FormGroup, Validators } from '@angular/forms';
import { VendorContacts,ContactFacade,ContactData,EmailTypeCode,PhoneTypeCode,PaymentsFacade,ContactsFacade } from '@cms/case-management/domain';
import { LoaderService,SnackBarNotificationType} from '@cms/shared/util-core';
@Component({
  selector: 'cms-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  styleUrls: ['./contact-address-details.component.scss'],
})
export class ContactAddressDetailsComponent implements OnInit {
  @Input() vendorId: any;
  @Output() isContactDetailPopupClose = new EventEmitter<any>();
  SpecialHandlingLength = 100;
  mailCodes:any[] =[];
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public contactDetailForm!: FormGroup;
  contactAddress = new VendorContacts();
  contact = new ContactData();
  contactForm!: FormGroup;
  isSubmitted:boolean=false;
  constructor(
    private formBuilder: FormBuilder,
    private contactFacade:ContactFacade,
    private contactsFacade:ContactsFacade,
    private readonly paymentsFacade: PaymentsFacade,
    private readonly loaderService: LoaderService){
      this.contactForm = this.formBuilder.group({
        mailcode: [this.contact.mailCode, Validators.required],
        vendorId: [this.contact.vendorId],
        vendorAddressId: [this.contact.vendorAddressId],
        vendorContacts: new FormArray([]),
      });
      const vendorContacts = this.contactForm.get('vendorContacts') as FormArray;
      let addContactForm = this.formBuilder.group({
        contactName: new FormControl(this.contactAddress.contactName, [
          Validators.required,
          Validators.maxLength(40),
        ]),
        contactDesc: new FormControl(this.contactAddress.contactDesc),
        phoneNbr: new FormControl(this.contactAddress.phoneNbr),
        faxNbr: new FormControl(this.contactAddress.faxNbr),
        emailAddress: new FormControl(this.contactAddress.emailAddress),
        emailAddressTypeCode: new FormControl(EmailTypeCode.Email),
        phoneTypeCode: new FormControl(PhoneTypeCode.Phone),
        vendorContactId: new FormControl(this.contactAddress.vendorContactId),
        vendorAddressId: new FormControl(this.contactAddress.vendorAddressId),
        vendorContactPhoneId: new FormControl(
          this.contactAddress.vendorContactPhoneId
        ),
        vendorContactEmailId: new FormControl(
          this.contactAddress.vendorContactEmailId
        ),
        jobTitle: new FormControl(this.contactAddress.jobTitle),
        vendorName: new FormControl(this.contactAddress.vendorName),
        effectiveDate: new FormControl(this.contactAddress.effectiveDate),
      });
      vendorContacts.push(addContactForm);
  }
ngOnInit(): void {
  this.contactFacade.loadMailCodes(this.vendorId);
  this.contactFacade.mailCodes$.subscribe((mailCode:any) =>{
    this.mailCodes = mailCode;
  })
    this.buildContactDetailForm();
}
  buildContactDetailForm() {
    this.contactDetailForm = this.formBuilder.group({
      mailcode : [''],
      contactName: [''],
      contactDesc: [''],
      phoneNbr: [''],
      faxNbr: [''],
      emailAddress: [''],
      
    });
  }
  onCancel(){
    this.isContactDetailPopupClose.emit(true);
  }
  
  setValidators()
  {
    this.contactDetailForm.markAllAsTouched();
    this.contactDetailForm.controls['mailcode'].setValidators([Validators.required,]);
    this.contactDetailForm.controls['mailcode'].updateValueAndValidity(); 
    this.contactDetailForm.controls['contactName'].setValidators([Validators.required,]);
    this.contactDetailForm.controls['contactName'].updateValueAndValidity();

  }
  populateContactAddress()
  { 
     this.contact.vendorContacts = [];
     this.contact.vendorId = this.vendorId;
     this.contact.mailCode = this.contactDetailForm.controls['mailcode'].value;
     this.contactAddress.contactName = this.contactDetailForm.controls['contactName'].value;
     this.contactAddress.faxNbr = this.contactDetailForm.controls['faxNbr'].value;
     this.contactAddress.phoneNbr = this.contactDetailForm.controls['phoneNbr'].value;
     this.contactAddress.contactDesc = this.contactDetailForm.controls['contactDesc'].value;
     this.contactAddress.emailAddress = this.contactDetailForm.controls['emailAddress'].value;
     this.contactAddress.emailAddressTypeCode=EmailTypeCode.Email;
     this.contactAddress.phoneTypeCode=PhoneTypeCode.Phone;
    // this.contactAddress.effectiveDate = new Date();
     this.contact.vendorContacts.push(this.contactAddress);
  }


  public save() {
    this.isSubmitted=true;3
    this.contactForm.controls['vendorId'].setValue(this.vendorId);
    const dat = this.contactForm.value;
    
    if (this.contactForm.valid) {
      this.loaderService.show();
      this.contactsFacade.saveContactAddress(this.contactForm.value).subscribe({
        next: (response: any) => {
          if (response) {
            this.contactFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Contact Address added successfully'
            );
            this.contactsFacade.loadcontacts('CO1');
            this.contactFacade.hideLoader();
            this.isContactDetailPopupClose.emit(true);
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.contactFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
        },
      });
    }
  }
  get AddContactForm(): FormArray {    
    return this.contactForm.get('vendorContacts') as FormArray;
  }
  IsContactNameValid(index: any) {    
    var contactNameIsvalid = this.AddContactForm.at(index) as FormGroup;
    return contactNameIsvalid.controls['contactName'].status == 'INVALID';
  }
  onToggleAddNewContactClick() {
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl(
        this.contactAddress.contactName,
        [Validators.required]
      ),
      contactDesc: new FormControl(this.contactAddress.contactDesc),
      phoneNbr: new FormControl(this.contactAddress.phoneNbr),
      faxNbr: new FormControl(this.contactAddress.faxNbr),
      emailAddress: new FormControl(this.contactAddress.emailAddress),
      emailAddressTypeCode: new FormControl(EmailTypeCode.Email),
      phoneTypeCode: new FormControl(PhoneTypeCode.Phone),
      vendorContactId: new FormControl(this.contactAddress.vendorContactId),
      vendorAddressId: new FormControl(this.contactAddress.vendorAddressId),
      vendorContactPhoneId: new FormControl(
        this.contactAddress.vendorContactPhoneId
      ),
      vendorContactEmailId: new FormControl(
        this.contactAddress.vendorContactEmailId
      ),
      jobTitle: new FormControl(this.contactAddress.jobTitle),
      vendorName: new FormControl(this.contactAddress.vendorName),
      effectiveDate: new FormControl(this.contactAddress.effectiveDate),
    });
    this.AddContactForm.push(addContactForm);
  }

  removeContact(i: number) {
    this.AddContactForm.removeAt(i);
  }
}
