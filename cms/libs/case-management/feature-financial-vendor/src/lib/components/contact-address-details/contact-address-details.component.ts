import { Component,OnInit,  Output,Input,
  EventEmitter } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendorContacts,ContactFacade,ContactData,EmailTypeCode,PhoneTypeCode } from '@cms/case-management/domain';
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

  constructor(
    private formBuilder: FormBuilder,
    private contactFacade:ContactFacade,
    private readonly loaderService: LoaderService){

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
      emailAddress: ['']
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
     this.contact.vendorContacts.push(this.contactAddress);
  }

  public save (){
    this.setValidators()
      if (this.contactDetailForm.valid) {
        this.loaderService.show();
        this.populateContactAddress();
      this.contactFacade
        .saveContactAddress(this.contact).subscribe({
          next: (response: any) =>{
            if(response)
            { 
             this.contactFacade.showHideSnackBar(
               SnackBarNotificationType.SUCCESS,
               'Contact Address added successfully'
             );
             this.contactFacade.hideLoader();
             this.isContactDetailPopupClose.emit(true);
            }
           },
           error: (error: any) => {
             this.loaderService.hide();
             this.contactFacade.showHideSnackBar(
               SnackBarNotificationType.ERROR,
               error)
           }
        }
       
        );
      }
    
   
  }
}
