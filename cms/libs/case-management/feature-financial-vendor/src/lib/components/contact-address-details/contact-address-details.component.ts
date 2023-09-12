import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, Input, SimpleChanges, OnChanges,
  EventEmitter
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { VendorContacts, VendorContactsFacade, Contacts, EmailAddressTypeCode, PhoneTypeCode, PaymentsFacade, ContactFacade} from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'cms-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactAddressDetailsComponent implements OnInit, OnChanges {
  @Input() vendorId: any;
  @Input() VendorContactId: any;
  @Output() isContactDetailPopupClose = new EventEmitter<any>();

  SpecialHandlingLength = 100;
  mailCodes: any[] = [];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public contactDetailForm!: FormGroup;
  contactAddress = new VendorContacts();
  contact = new Contacts();
  contactForm!: FormGroup;
  isSubmitted: boolean = false;
  isVisible: any;
  preferedContact:any;
  public sortValue = this.vendocontactsFacade.sortValue;
  public sortType = this.vendocontactsFacade.sortType;
  public pageSizes = this.vendocontactsFacade.gridPageSizes;
  public gridSkipCount = this.vendocontactsFacade.skipCount;
  public sort = this.vendocontactsFacade.sort;
  public state!: any;
  isContactAddressDeactivateShow = false
  descriptionCounter:number=500;
  filters = "";
  inputMask: any = '';
  @Output() ContactUpdated = new EventEmitter<boolean>();
  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }
  constructor(
    private formBuilder: FormBuilder,
    private contactFacade: ContactFacade,
    private vendocontactsFacade: VendorContactsFacade,
    private readonly paymentsFacade: PaymentsFacade,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef
  ) {
    this.contactForm = this.formBuilder.group({
      mailcode: [this.contact.mailCode, Validators.required],
      vendorId: [this.contact.vendorId],
      vendorAddressId: [this.contact.vendorAddressId],
      vendorContacts: new FormArray([]),
    });

  }


  ngOnInit(): void {

    this.vendocontactsFacade.mailCodes$.subscribe((mailCode: any) => {
      this.mailCodes = mailCode;
      this.cd.detectChanges();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.VendorContactId != undefined) {
      this.contactAddress = this.VendorContactId;
    } else {
      this.vendocontactsFacade.loadMailCodes(this.vendorId);
    }
    this.onToggleAddNewContactClick();
  }

  onCancel() {
    this.isContactDetailPopupClose.emit(true);
  }

  public save() {
    this.isSubmitted = true;
    this.contactForm.markAllAsTouched();
    this.contactForm.controls['vendorId'].setValue(this.vendorId);
    
    if (this.contactForm.valid) {
       this.AddContactForm.value.forEach((element:any, i: number) => {
      this.AddContactForm.at(i).patchValue({preferredFlag: element.preferredFlag?"Y":"N"})
    });
      this.loaderService.show();
      this.vendocontactsFacade.saveContactAddress(this.contactForm.value).subscribe({
        next: (response: any) => {
          if (response) {
            this.contactFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Contact  added successfully'
            );
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

  public update() {    
    this.isSubmitted = true;
    if (this.contactForm.controls['vendorContacts'].valid) {
      this.loaderService.show();
      let vendorContacts= this.contactForm.value.vendorContacts[0];
      vendorContacts.preferredFlag = vendorContacts.preferredFlag ? "Y" :"N"
      this.vendocontactsFacade.updateContactAddress(this.contactForm.value.vendorContacts[0]).subscribe({
        next: (response: any) => {
          if (response) {
            this.contactFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Contact Updated successfully'
            );
            this.ContactUpdated.emit(true);
            this.loaderService.hide();
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

  isContactNameValid(index: any) {
    let contactNameIsvalid = this.AddContactForm.at(index) as FormGroup;

    return contactNameIsvalid.controls['contactName'].status == 'INVALID';
  }
  getContactControl(index: number, fieldName: string) {
    return this.AddContactForm.at(index).get(fieldName);
  }

  onToggleAddNewContactClick() {
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl(
        this.contactAddress.contactName,
        [Validators.required]
      ),
      contactDesc: new FormControl(this.contactAddress.contactDesc),
      phoneNbr: new FormControl(this.contactAddress.phoneNbr, Validators.pattern('[0-9]+')),
      faxNbr: new FormControl(this.contactAddress.faxNbr, Validators.pattern('[0-9]+')),
      emailAddress: new FormControl(this.contactAddress.emailAddress,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)),
      emailAddressTypeCode: new FormControl(EmailAddressTypeCode.Work),
      phoneTypeCode: new FormControl(PhoneTypeCode.Work),
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
      preferredFlag: new FormControl(this.contactAddress.preferredFlag=="Y"?true:false),
    });
    this.AddContactForm.push(addContactForm);
    this.cd.detectChanges();
  }

  onDeactivateContactClick(){ 
    this.isContactAddressDeactivateShow = true;
  }

  clickCloseDeactivateContactAddress() {
    this.isContactAddressDeactivateShow = false;
  }

  onDeactiveCancel(isCancel: any) {
    if (isCancel) { 
      this.clickCloseDeactivateContactAddress()
    }
  }

  removeContact(i: number) {
    this.AddContactForm.removeAt(i);
  }

  oncheckboxClick(event: Event, index: any) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    if (isChecked) {
      this.AddContactForm.value.forEach((element:any, i: number) => {
        this.AddContactForm.at(i).patchValue({preferredFlag: false})
      });    
      this.AddContactForm.at(index).patchValue({preferredFlag: true})
      this.isVisible = true;
    } else {
      this.AddContactForm.at(index).patchValue({preferredFlag: false})
      this.isVisible = false;
    }
    this.cd.detectChanges();
  }
   onKeyPress(event:number) {
    return (event > 64 && 
      event < 91) || (event > 96 && event < 123)||event==32
  }
  onDescriptionValueChange(event: any): void {
    this.descriptionCounter = event.length;
  }
  applyMask() {
    this.inputMask = '(999) 000-0000'; 
  }
  resetMask() {
    let phoneResult = this.AddContactForm.get('phoneNbr')?.value
    if (!phoneResult) {
      this.inputMask = '';
    }
    let faxResult = this.AddContactForm.get('faxNbr')?.value
    if(faxResult){
      this.inputMask = '';
    }
  }
}
