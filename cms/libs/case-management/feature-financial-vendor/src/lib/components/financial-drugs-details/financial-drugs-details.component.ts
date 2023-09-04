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
  @Input() vendorDetails$!: Observable<any>;
  @Output() close = new EventEmitter<any>();

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
      manufacturer: [{ value: this.drug.manufacturer, disabled: false }],
      ndcNbr: [this.drug.ndcNbr, Validators.required],
      vendorId: [this.drug.vendorId],
      deliveryMethodCode: [this.drug.deliveryMethodCode, Validators.required],
      drugName: [this.drug.drugName, Validators.required],
      brandName: [this.drug.brandName, Validators.required],
      hiv: [false, this.atLeastOneDrugTypeSelected()],
      hepatitis: [false, this.atLeastOneDrugTypeSelected()],
      opportunisticInfection: [false, this.atLeastOneDrugTypeSelected()]
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

  updateDrugTypeValidity() {
    const hivSelected = this.drugForm.get('hiv')?.value;
    const hepatitisSelected = this.drugForm.get('hepatitis')?.value;
    const opportunisticInfectionSelected = this.drugForm.get('opportunisticInfection')?.value;

    const atLeastOneSelected = hivSelected || hepatitisSelected || opportunisticInfectionSelected;

    if (atLeastOneSelected) {
      this.drugForm.controls['hiv'].setErrors(null);
      this.drugForm.controls['hepatitis'].setErrors(null);
      this.drugForm.controls['opportunisticInfection'].setErrors(null);
    } else {
      this.drugForm.controls['hiv'].setErrors({ required: true });
      this.drugForm.controls['hepatitis'].setErrors({ required: true });
      this.drugForm.controls['opportunisticInfection'].setErrors({ required: true });
    }

    return atLeastOneSelected;
  }


  public Update() {
    this.isSubmitted = true;
  }

  public save() {
    this.drugForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if(res){
      this.onCancelClick();
    }
  }

  checkValidations() {
    return this.drugForm.valid;
  }

  onCancelClick() {
    this.close.emit();
  }
}
