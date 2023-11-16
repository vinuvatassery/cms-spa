import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';
import { StatusFlag } from '../enums/status-flag.enum';

@Component({
  selector: 'common-financial-drugs-details',
  templateUrl: './financial-drugs-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsDetailsComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();

  @Input() vendorId: any;
  @Input() dialogTitle: any;
  saveButtonText: any;
  @Input() vendorDetails$!: Observable<any>;
  @Input() deliveryMethodCodes: any;
  @Input() hasCreateUpdatePermission = false;
  @Input() addDrug$ : any ;

  @Output() close = new EventEmitter<any>();
  @Output() addDrugEvent = new EventEmitter<any>();

  drug : any;
  drugForm!: FormGroup;
  isSubmitted: boolean = false;
  ndcMaskFormat: string = "00000-0000-00"
  isLoading = false;

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  constructor(
    private readonly lovFacade: LovFacade,
    private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private cd: ChangeDetectorRef,
  ) {
    this.createDrugForm();
  }

  ngOnInit(): void {
    this.hideLoader()
    this.drugForm.get('manufacturer')?.patchValue(this.vendorId);
    if (this.dialogTitle === "Add New") {
      this.saveButtonText = "Add"
    } else if (this.dialogTitle === "Request New") {
      this.saveButtonText = "Request"
    } else {
      this.saveButtonText = "Update"
    }
  }

  createDrugForm() {
    this.drugForm = this.formBuilder.group({
      manufacturer: [{ value: this.drug?.manufacturer, disabled: false }],
      ndcNbr: [this.drug?.ndcNbr, [Validators.required, Validators.maxLength(13)]],
      vendorId: [this.drug?.vendorId],
      deliveryMethodCode: [this.drug?.deliveryMethodCode, Validators.required],
      drugName: [this.drug?.drugName, [Validators.required, Validators.maxLength(200)]],
      brandName: [this.drug?.brandName, [Validators.required, Validators.maxLength(200)]],
      drugType: [this.drug?.drugCategoryCode, Validators.required]
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

  public Update() {
    this.isSubmitted = true;
  }

  isValidateForm = false;

  validateForm() {
    this.drugForm.markAllAsTouched();
  }

  mapFormValues() {
    const formValues = this.drugForm.value;

    const dto = {
      manufacturerId: formValues.manufacturer,
      ndcNbr: formValues.ndcNbr,
      deliveryMethodCode: formValues.deliveryMethodCode,
      drugName: formValues.drugName,
      brandName: formValues.brandName,
      drugType: formValues.drugType,
      activeFlag: this.hasCreateUpdatePermission ? StatusFlag.Yes : StatusFlag.No,
    };
    return dto;
  }

  public save() {
    this.drugForm.markAllAsTouched();
    const res = this.checkValidations();
    this.isSubmitted = true;
    if (!res) {
      return;
    }

    this.validateForm();
    this.isValidateForm = true;

    if (this.drugForm.valid) {
      let finalData = this.mapFormValues();
      this.showLoader();
       this.addDrugEvent.emit(finalData)
      this.addDrug$
      .subscribe((addResponse: any) =>
      {
        if(addResponse)
        {      
          this.onCancelClick();
          let notificationMessage = addResponse.message;
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.drugForm.reset();
          this.isValidateForm = false;
          this.cd.detectChanges();
        }
  
      })     
    }
  }

  checkValidations() {
    return this.drugForm.valid;
  }

  onCancelClick() {
    this.close.emit();
  }
}
