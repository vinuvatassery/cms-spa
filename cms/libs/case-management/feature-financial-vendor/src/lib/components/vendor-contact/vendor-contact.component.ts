import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BillingAddressFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'cms-vendor-contact',
  templateUrl: './vendor-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorContactComponent {
  @Input() from: FormGroup;
  @Input() formSubmitted!: boolean;
  @Input() isEdit!: boolean;
  @Input() vendorAddressId: any;


  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly billingAddressFacade: BillingAddressFacade,
  ) {
    this.from = this.formBuilder.group({});

  }


  

  ngOnInit(): void {
   
    if (this.isEdit) {
      this.getContacts(this.vendorAddressId);
    }

  }

  getContacts(vendorAddressId: any) {
    this.billingAddressFacade.showLoader();
    this.billingAddressFacade.getPaymentsAddressContacts(vendorAddressId).subscribe({
      next: (resp) => {
        resp.forEach((item:any) => {
          let addContactForm = this.formBuilder.group({
            contactName: new FormControl(item.contactName, Validators.required),
            description: new FormControl(item.contactDesc),
            phoneNumber: new FormControl(item.vendorContactPhone[0]?.phoneNbr),
            fax: new FormControl(item.vendorContactPhone[0]?.faxNbr),
            email: new FormControl(item.vendorContactEmail[0]?.emailAddress)
          });

          this.AddContactForm.push(addContactForm);
          this.cdr.detectChanges();
        });

        this.billingAddressFacade.hideLoader();
        
      },
      error: (err) => {
        this.billingAddressFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.billingAddressFacade.hideLoader();
      },
    });
  }

  getContactControl(index: number, fieldName: string) {
    return (<FormArray>this.from.get('newAddContactForm')).at(index).get(fieldName);
  }

  get AddContactForm(): FormArray {
    return this.from.get("newAddContactForm") as FormArray;
  }

  onToggleAddNewContactClick() {
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl('', Validators.required),
      description: new FormControl(),
      phoneNumber: new FormControl(),
      fax: new FormControl(),
      email: new FormControl()
    });
    this.AddContactForm.push(addContactForm);
    this.cdr.detectChanges();
  }

  removeContact(i: number) {
    this.AddContactForm.removeAt(i);
  }
}
