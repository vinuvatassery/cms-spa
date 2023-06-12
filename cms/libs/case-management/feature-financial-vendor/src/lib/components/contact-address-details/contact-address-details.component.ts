import { Component,OnInit,  Output,
  EventEmitter } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactAddress,ContactFacade } from '@cms/case-management/domain';
import { LoaderService,LoggingService,SnackBarNotificationType} from '@cms/shared/util-core';
@Component({
  selector: 'cms-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  styleUrls: ['./contact-address-details.component.scss'],
})
export class ContactAddressDetailsComponent implements OnInit {
  @Output() isContactDetailPopupClose = new EventEmitter<any>();
  SpecialHandlingLength = 100;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  public contactDetailForm!: FormGroup;
  contactAddress = new ContactAddress();

  constructor(
    private formBuilder: FormBuilder,
    private contactFacade:ContactFacade,
    private readonly loaderService: LoaderService){

  }
ngOnInit(): void {
    this.buildContactDetailForm();
}
  buildContactDetailForm() {
    this.contactDetailForm = this.formBuilder.group({
      mailCode: ['', Validators.required],
      name: ['',Validators.required],
      description: [''],
      phone: [''],
      fax: [''],
      email: ['']
    });
  }
  onCancel(){
    this.isContactDetailPopupClose.emit(true);
  }
  
  setValidators()
  {
    this.contactDetailForm.markAllAsTouched();
    this.contactDetailForm.controls['mailCode'].setValidators([Validators.required,]);
    this.contactDetailForm.controls['mailCode'].updateValueAndValidity();
    this.contactDetailForm.controls['name'].setValidators([Validators.required,]);
    this.contactDetailForm.controls['name'].updateValueAndValidity();

  }
  populateContactAddress()
  {
     this.contactAddress.mailCode = this.contactDetailForm.controls['mailCode'].value;
     this.contactAddress.name = this.contactDetailForm.controls['name'].value;
     this.contactAddress.fax = this.contactDetailForm.controls['fax'].value;
     this.contactAddress.phone = this.contactDetailForm.controls['phone'].value;
     this.contactAddress.description = this.contactDetailForm.controls['description'].value;
     this.contactAddress.email = this.contactDetailForm.controls['email'].value;
    
  }
  
  public save (){
    this.setValidators()
      if (this.contactDetailForm.valid) {
        this.loaderService.show();
        this.populateContactAddress();
      this.contactFacade
        .saveContactAddress(this.contactAddress).subscribe({
          next: (response: any) =>{
            if(response)
            { 
             this.contactFacade.showHideSnackBar(
               SnackBarNotificationType.SUCCESS,
               'Client Reminder added successfully'
             );
             this.contactFacade.hideLoader();
             this.isContactDetailPopupClose.emit();
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
