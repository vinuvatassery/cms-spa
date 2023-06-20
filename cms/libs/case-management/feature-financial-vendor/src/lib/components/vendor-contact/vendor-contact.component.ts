import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-vendor-contact',
  templateUrl: './vendor-contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorContactComponent {
  @Input() from: FormGroup;
  @Input() formSubmitted!: boolean;


  public formUiStyle: UIFormStyle = new UIFormStyle();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.from = this.formBuilder.group({});
    
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
