import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { LovFacade, UserManagementFacade } from '@cms/system-config/domain';
import { InsurancePlanFacade, HealthInsurancePolicyFacade, VendorFacade, InsuranceStatusType } from '@cms/case-management/domain';
import { SnackBarNotificationType, LoggingService, NotificationSnackbarService, LoaderService } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-medical-premium-detail-insurance-plan-name',
  templateUrl: './medical-premium-detail-insurance-plan-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailInsurancePlanNameComponent {
  @Input() healthInsuranceForm: FormGroup;
  newhealthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insurancePlans: any;

  @Output() insuranceCarrierNameChange = new EventEmitter<any>();
  @Output() insuranceCarrierNameData = new EventEmitter<any>();

  insurancePlansLoader: boolean = true;
  insurancePlan: Array<any> = [];

  public isLoading = false;
  carrierNames: any = [];

  startDateValidator: boolean = false;
  termDateValidator: boolean = false;

  public isaddNewInsurancePlanOpen = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  CarrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };
  isValidateForm = false;

  dentalInsuranceSelectedItem = 'DENTAL_INSURANCE';
  hasInsurancePlanCreateUpdatePermission = false;

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;

  constructor(private formBuilder: FormBuilder, private readonly lovFacade: LovFacade, private readonly insurancePlanFacade: InsurancePlanFacade,
    private changeDetector: ChangeDetectorRef, private readonly loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly vendorFacade: VendorFacade,
    private readonly insuranceFacade: InsurancePlanFacade,
    private readonly cdr: ChangeDetectorRef,
    private userManagementFacade: UserManagementFacade,
    private readonly snackbarService: NotificationSnackbarService, private insurancePolicyFacade: HealthInsurancePolicyFacade) {
    this.healthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: [''] });

    this.newhealthInsuranceForm = this.formBuilder.group({
      insuranceCarrierName: ['', Validators.required],
      insurancePlanName: ['', Validators.required],
      insuranceType: ['', Validators.required],
      startDate: ['', Validators.required],
      termDate: [''],
      canPayForMedicationFlag: [false],
      dentalPlanFlag: [false],
    });
  }


  onHealthInsuranceTypeChanged() {
    var selectedType = this.newhealthInsuranceForm.controls['insuranceType'].value;
    if (selectedType == "QUALIFIED_HEALTH_PLAN") {
      this.newhealthInsuranceForm.controls['termDate']
        .setValidators([
          Validators.required, Validators.required]);
    } else {
      this.newhealthInsuranceForm.controls['termDate'].clearValidators();
    }
    this.newhealthInsuranceForm.controls['termDate'].updateValueAndValidity();
  }

  dateValidate(event: Event) {
    this.startDateValidator = false;
    this.termDateValidator = false;
    const startDate = this.newhealthInsuranceForm.controls['startDate'].value;
    const termDate = this.newhealthInsuranceForm.controls['termDate'].value;
    if (termDate) {
      if (startDate > termDate) {
        this.startDateValidator = true;
      }
      if (termDate < startDate) {
        this.termDateValidator = true;
      }
    }
  }

  private sortCarrier(data: any) {
    this.carrierNames = data.sort((a: any, b: any) => {
      if (a.vendorName > b.vendorName) return 1;
      return (b.vendorName > a.vendorName) ? -1 : 0;
    });
  }

  public insuranceCarrierNameChangeValue(value: string): void {
    this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    this.insuranceCarrierNameChange.emit(value);
  }

  ngOnInit(): void {
    this.loadInsuranceCarrierName(InsuranceStatusType.healthInsurance);
    this.loadInsurancePlans();
    this.hasInsurancePlanCreateUpdatePermission = this.userManagementFacade.hasPermission(['Insurance_Plan_Create_Update']);
  }

  private loadInsuranceCarrierName(type: string) {
    this.isLoading = true;
    this.vendorFacade.loadAllVendors(type).subscribe({
      next: (data: any) => {
        if (!Array.isArray(data)) return;
        this.sortCarrier(data);
        this.insuranceCarrierNameData.emit(this.carrierNames);
        this.isLoading = false;
        this.insurancePlanFacade.planLoaderSubject.next(false);
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  validateForm() {
    this.newhealthInsuranceForm.markAllAsTouched();
  }

  //@Input()
  hasCreateUpdatePermission: boolean = false;

  mapFormValues() {
    const formValues = this.newhealthInsuranceForm.value;
    const hasCreateUpdatePermission = this.hasCreateUpdatePermission === true;

    const dto = {
      insuranceProviderId: formValues.insuranceCarrierName,
      insurancePlanName: formValues.insurancePlanName,
      healthInsuranceTypeCode: formValues.insuranceType,
      startDate: formValues.startDate,
      termDate: formValues.termDate,
      canPayForMedicationFlag: formValues.canPayForMedicationFlag ? StatusFlag.Yes : StatusFlag.No,
      dentalPlanFlag: formValues.dentalPlanFlag ? StatusFlag.Yes : StatusFlag.No,
      activeFlag: hasCreateUpdatePermission ? StatusFlag.Yes : StatusFlag.No,
    };

    return dto;
  }

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  public addNewInsurancePlanClose(): void {
    this.validateForm();
    this.isValidateForm = true;

    if (this.newhealthInsuranceForm.valid) {
      var finalData = this.mapFormValues();
      this.insuranceFacade.addPlan(finalData);
      this.showLoader();

      this.insuranceFacade.addPlan(finalData).subscribe({
        next: (response: any) => {
          var notificationMessage = "Insurance plan added successfully";
          this.InsurancePlanClose();
          this.lovFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
          this.hideLoader();
          this.newhealthInsuranceForm.reset();
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

  InsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

  private loadInsurancePlans() {
    this.insurancePlanFacade.planLoaderChange$.subscribe((data) => {
      this.insurancePlansLoader = data;
      this.changeDetector.detectChanges();
    })
    this.insurancePlanFacade.planNameChange$.subscribe({
      next: (data: any) => {
        this.insurancePlansLoader = false;
        this.insurancePlans = data;
        this.changeDetector.detectChanges();
      },
      error: (err) => {
        this.insurancePlansLoader = false;
        this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
        this.changeDetector.detectChanges();
      }
    });
  }
}
