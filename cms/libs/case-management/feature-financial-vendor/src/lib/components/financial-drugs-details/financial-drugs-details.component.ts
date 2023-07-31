import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ManufacturerDrugs } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService } from '@cms/shared/util-core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cms-financial-drugs-details',
  templateUrl: './financial-drugs-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsDetailsComponent implements OnInit  {
  public formUiStyle: UIFormStyle = new UIFormStyle();

  @Input() vendorId: any;
  @Input() dialogTitle: any;
  @Input() manufacturersList$!: Observable<any>;
  @Output() cancelClick = new EventEmitter<any>();

  drug= new ManufacturerDrugs();
  drugForm!: FormGroup;
  isSubmitted: boolean = false;
  deliveryMethodCodes: any[] = ["Tablet", "Capsule", "Liquid", "Injection"];

  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  constructor(
    private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef) {
      this.createDrugForm();
  }

  ngOnInit(): void {
    this.drugForm.get('manufacturer')?.patchValue(this.vendorId);
  }

  createDrugForm(){
    this.drugForm = this.formBuilder.group({
      manufacturer: [{ value: this.drug.manufacturer, disabled: true }],
      ndcNbr: [this.drug.ndcNbr, Validators.required],
      vendorId: [this.drug.vendorId],
      deliveryMethodCode: [this.drug.deliveryMethodCode, Validators.required],
      drugName: [this.drug.drugName, Validators.required],
      brandName: [this.drug.brandName, Validators.required],
      drugCategoryCode: this.formBuilder.group({
        hiv: [''],
        hepatitis: [''],
        opportunisticInfection: [''],
      }, { validators: this.atLeastOneDrugTypeSelected() }),
      includeInManufacturerRebatesFlag: [''],
    });
  }

  atLeastOneDrugTypeSelected(): ValidatorFn {
    return (formGroup: AbstractControl) => {
      const hiv = formGroup.get('hiv')?.value;
      const hepatitis = formGroup.get('hepatitis')?.value;
      const opportunisticInfection = formGroup.get('opportunisticInfection')?.value;

      if (!hiv && !hepatitis && !opportunisticInfection) {
        return { atLeastOneDrugTypeRequired: true };
      }
      else {
        if (formGroup.errors && formGroup?.errors?.["atLeastOneDrugTypeRequired"]) {
          delete formGroup?.errors?.["atLeastOneDrugTypeRequired"];
          formGroup.setErrors(Object.keys(formGroup.errors).length > 0 ? formGroup.errors : null);
        }
      }

      return null;
    };
  }

  getError(control: AbstractControl | null, errorName: string): boolean {
    return control?.hasError(errorName) ?? false;
  }

  updateDrugTypeValidity(checkboxName: string) {
    const drugCategoryCode = this.drugForm.get('drugCategoryCode');

    drugCategoryCode?.get(checkboxName)?.setValue(!drugCategoryCode.get(checkboxName)?.value);

    drugCategoryCode?.updateValueAndValidity();

    this.cd.detectChanges();
  }

  public Update() {
    this.isSubmitted = true;
  }

  public save() {
    this.checkValidations();
    this.isSubmitted = true;
  }

  validateForm() {
    this.drugForm.markAllAsTouched();
    this.drugForm.controls['includeInManufacturerRebatesFlag'].setValidators([
      Validators.required,
    ]);
    this.drugForm.controls['includeInManufacturerRebatesFlag'].updateValueAndValidity();
    this.drugForm.controls['drugCategoryCode'].setValidators(this.atLeastOneDrugTypeSelected());
    this.drugForm.controls['drugCategoryCode'].updateValueAndValidity();
  }

  checkValidations() {
    this.validateForm();
    this.cd.detectChanges();
    return this.drugForm.valid;
  }

  onCancelClick() {
    this.cancelClick.emit();
  }
}
