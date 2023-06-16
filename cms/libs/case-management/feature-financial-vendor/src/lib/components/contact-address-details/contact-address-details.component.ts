import {
  Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, Input, SimpleChanges, OnChanges,
  EventEmitter
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormBuilder, FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { VendorContacts, ContactFacade, Contacts, EmailTypeCode, PhoneTypeCode, PaymentsFacade, ContactsFacade } from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'cms-contact-address-details',
  templateUrl: './contact-address-details.component.html',
  styleUrls: ['./contact-address-details.component.scss'],
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
  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }
  constructor(
    private formBuilder: FormBuilder,
    private contactFacade: ContactFacade,
    private contactsFacade: ContactsFacade,
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

    this.contactsFacade.mailCodes$.subscribe((mailCode: any) => {
      this.mailCodes = mailCode;
      this.cd.detectChanges();
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.VendorContactId != undefined) {
      this.contactAddress = this.VendorContactId;
    } else {
      this.contactsFacade.loadMailCodes(this.vendorId);
    }
    this.onToggleAddNewContactClick();
  }

  onCancel() {
    this.isContactDetailPopupClose.emit(true);
  }

  public save() {
    this.isSubmitted = true;
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
            this.contactsFacade.loadcontacts(this.contactAddress.vendorAddressId ?? "");
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

  public Update() {
    this.isSubmitted = true;
    if (this.contactForm.controls['vendorContacts'].valid) {
      this.loaderService.show();
      this.contactsFacade.updateContactAddress(this.contactForm.value.vendorContacts[0]).subscribe({
        next: (response: any) => {
          if (response) {
            this.contactFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Contact Address Updated successfully'
            );
            this.contactsFacade.loadcontacts(this.contactAddress.vendorAddressId ?? "");
            this.loaderService.hide();
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
    this.cd.detectChanges();
  }

  removeContact(i: number) {
    this.AddContactForm.removeAt(i);
  }
}
