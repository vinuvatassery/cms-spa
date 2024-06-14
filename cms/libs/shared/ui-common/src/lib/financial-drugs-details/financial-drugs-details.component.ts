import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';
import { StatusFlag } from '../enums/status-flag.enum';
import { DrugUnit } from '../enums/drug_unit_enum';
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
  @Input() manufacturers: any;
  @Input() manufacturersObs$!: Observable<any>;
  @Input() hasCreateUpdatePermission = false;
  @Input() addDrug$: any;

  @Output() close = new EventEmitter<any>();
  @Output() addDrugEvent = new EventEmitter<any>();
  @Output() loadManufacturerEvent = new EventEmitter<any>();
  drug: any;
  drugForm!: FormGroup;
  isSubmitted: boolean = false;
  ndcMaskFormat: string = "00000-0000-00"
  isLoading = false;
  tAreaCessationMaxLength = 200;
  drugNameCounter!: string;
  brandNameCounter!: string;
  drugNameCharactersCount!: number;
  brandNameCharactersCount!: number;
  deliveryMethodCodesLocal: any;
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
    this.loadManufacturer();
    this.hideLoader()
    this.drugForm.get('manufacturer')?.patchValue(this.vendorId);
    if (this.dialogTitle === "Add New" || this.dialogTitle === "Request New") {
      this.saveButtonText = this.dialogTitle;
    } else {
      this.saveButtonText = "Update";
    }

    // modify delivery methods for that results [ ML , MG , Tablet , Each ]
    this.normalizeDeliveryMethods();
    this.onDrugNameValueChange();
    this.onBrandNameValueChange();
  }

  private normalizeDeliveryMethods() {
    const orderMapping: Record<DrugUnit, number> = {
      [DrugUnit.ML]: 1, [DrugUnit.MG]: 2, [DrugUnit.TABLET]: 3, [DrugUnit.EACH]: 4,
    };

    const convertToAbbreviation = (description: string): string => ({
      "Milliliter": DrugUnit.ML,
      "Milligram": DrugUnit.MG,
    }[description] || description);
    this.deliveryMethodCodesLocal = this.deliveryMethodCodes
      .filter((item: any) => Object.values(DrugUnit).includes(item.lovCode))
      .map(({ lovCode, lovDesc, ...rest }: { lovCode: string; lovDesc: string; }) => ({ lovCode: lovCode.toUpperCase(), lovDesc: convertToAbbreviation(lovDesc), ...rest }))
      .sort((a: any, b: any) => (orderMapping[a.lovCode as DrugUnit] || 999) - (orderMapping[b.lovCode as DrugUnit] || 999));
  }

  createDrugForm() {
    this.drugForm = this.formBuilder.group({
      manufacturer: [{ value: this.drug?.manufacturer, disabled: false }],
      ndcNbr: [this.drug?.ndcNbr, [Validators.required, Validators.maxLength(13)]],
      vendorId: [this.drug?.vendorId],
      deliveryMethodCode: [this.drug?.deliveryMethodCode, Validators.required],
      drugName: [this.drug?.drugName, [Validators.required, Validators.maxLength(200)]],
      brandName: [this.drug?.brandName, [Validators.required, Validators.maxLength(200)]],
      drugType: [this.drug?.drugCategoryCode]
    });
  }

  onDrugNameValueChange(event: any = null): void {
    this.drugNameCharactersCount = event == null ? 0 : event.length;
    this.drugNameCounter = `${this.drugNameCharactersCount}/${this.tAreaCessationMaxLength}`;
  }

  onBrandNameValueChange(event: any = null): void {
    this.brandNameCharactersCount = event == null ? 0 : event.length;
    this.brandNameCounter = `${this.brandNameCharactersCount}/${this.tAreaCessationMaxLength}`;
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
      drugType: formValues.drugType || 'Not Applicable',
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
        .subscribe((addResponse: any) => {
          if (addResponse) {
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
  loadManufacturer() {
    this.showLoader();
    this.loadManufacturerEvent.emit();
    this.manufacturersObs$.subscribe({
      next:(data: any) => {
        this.manufacturers = data;
        this.cd.detectChanges();
        this.hideLoader();
      }
    });
  }
}
