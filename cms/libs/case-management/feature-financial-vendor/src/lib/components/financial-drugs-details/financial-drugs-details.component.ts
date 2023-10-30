import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ManufacturerDrugs, VendorFacade, VendorInsurancePlanFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Observable } from 'rxjs';
import { DrugFacade } from '../../../../../domain/src/lib/application/drug.facade copy';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-financial-drugs-details',
  templateUrl: './financial-drugs-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialDrugsDetailsComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();

  @Input() vendorId: any;
  @Input() dialogTitle: any;
  saveButtonText: any;
  @Input() vendorDetails$!: Observable<any>;
  @Output() close = new EventEmitter<any>();

  drug = new ManufacturerDrugs();
  drugForm!: FormGroup;
  isSubmitted: boolean = false;
  deliveryMethodCodes: any[] = ["Tablet", "Capsule", "Liquid", "Injection"];
  ndcMaskFormat: string = "00000-0000-00"

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    private readonly vendorFacade: VendorFacade,
    private formBuilder: FormBuilder,
    private readonly loaderService: LoaderService,
    private readonly drugFacade: DrugFacade,
    private cd: ChangeDetectorRef) {
    this.createDrugForm();
  }

  ngOnInit(): void {
    this.drugForm.get('manufacturer')?.patchValue(this.vendorId);
    if (this.dialogTitle === "Add New") {
      this.saveButtonText = "Add"
    } else if (this.dialogTitle === "Request New") {
      this.saveButtonText = "Request"
    } else {
      this.saveButtonText = "Update"
    }

    this.loadManufacturer("MANUFACTURERS")
  }
  //
  vendors: any;
  isLoading = false;
  private loadManufacturer(type: string) {
    this.isLoading = true;
    this.vendorFacade.loadAllVendors(type).subscribe({
      next: (data: any) => {
        if (!Array.isArray(data)) return;
        this.vendors = data;
        //alert(JSON.stringify(data))
        //this.sortCarrier(data);
        //this.insuranceCarrierNameData.emit(this.carrierNames);
        this.isLoading = false;
        //this.insurancePlanFacade.planLoaderSubject.next(false);
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  createDrugForm() {
    this.drugForm = this.formBuilder.group({
      manufacturer: [{ value: this.drug.manufacturer, disabled: false }],
      ndcNbr: [this.drug.ndcNbr, [Validators.required, Validators.maxLength(13)]],
      vendorId: [this.drug.vendorId],
      deliveryMethodCode: [this.drug.deliveryMethodCode, Validators.required],
      drugName: [this.drug.drugName, [Validators.required, Validators.maxLength(200)]],
      brandName: [this.drug.brandName, [Validators.required, Validators.maxLength(200)]],
      drugType: [this.drug.drugCategoryCode, Validators.required]
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

  hasCreateUpdatePermission = false;
  isValidateForm = false;

  validateForm() {
    this.drugForm.markAllAsTouched();
  }

  mapFormValues() {
    const formValues = this.drugForm.value;
    // const hasCreateUpdatePermission = this.hasCreateUpdatePermission === true;

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
      var finalData = this.mapFormValues();
      this.showLoader();

      this.drugFacade.addDrug(finalData).subscribe({
        next: (response: any) => {
          this.onCancelClick();
          var notificationMessage = response.message;
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.drugForm.reset();
          this.isValidateForm = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.hideLoader();
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
    }
  }

  checkValidations() {
    return this.drugForm.valid;
  }

  onCancelClick() {
    this.close.emit();
  }
}
