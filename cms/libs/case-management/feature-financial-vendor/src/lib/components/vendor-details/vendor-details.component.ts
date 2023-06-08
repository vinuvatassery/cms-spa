import { Input, ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { VendorFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorDetailsComponent implements OnInit {
  @Input() isMedicalProvider: boolean = false;
  @Input() medicalProviderForm: FormGroup;

  SpecialHandlingLength = 100;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  
  isViewContentEditable!: boolean;
  isValidateForm: boolean = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private vendorFacade: VendorFacade,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
  }

  get newAddContactForm() : FormArray{
    return this.medicalProviderForm.get("newAddContactForm") as FormArray;
  }

  onToggleAddNewContactClick(){
    let addContactForm = this.formBuilder.group({
      contactName: new FormControl('', Validators.maxLength(40)),
      description: new FormControl(),
      phoneNumber: new FormControl(),
      fax: new FormControl(),
      email: new FormControl()
    });
    this.newAddContactForm.push(addContactForm);
    this.cdr.detectChanges();
  }

  removeContact(i: number) {
    this.newAddContactForm.removeAt(i);
  }

  getContactControl(index: number, fieldName: string) {
    return (<FormArray>this.medicalProviderForm.get('newAddContactForm')).at(index).get(fieldName);
  }

  save() {
    this.validateForm();
    this.isValidateForm = true
    this.vendorFacade.showLoader();
  }

  validateForm() {
    this.medicalProviderForm.markAllAsTouched();
    var mailCode = this.medicalProviderForm.controls['mailCode'].value;
    if(mailCode) {
      this.medicalProviderForm.controls['addressLine1']
      .setValidators([
        Validators.required,
      ]);
      this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

      this.medicalProviderForm.controls['city']
      .setValidators([
        Validators.required,
      ]);
      this.medicalProviderForm.controls['city'].updateValueAndValidity();

      this.medicalProviderForm.controls['state']
      .setValidators([
        Validators.required,
      ]);
      this.medicalProviderForm.controls['state'].updateValueAndValidity();

      this.medicalProviderForm.controls['zip']
      .setValidators([
        Validators.required,
      ]);
      this.medicalProviderForm.controls['zip'].updateValueAndValidity();      
    }
    
  }
}
