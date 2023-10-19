import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { LovFacade } from '@cms/system-config/domain';
import { InsurancePlanFacade, HealthInsurancePolicyFacade, VendorFacade, InsuranceStatusType } from '@cms/case-management/domain';
import { SnackBarNotificationType, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { Subscription } from 'rxjs';

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



  public isaddNewInsurancePlanOpen = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  CarrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "startsWith",
  };
  isValidateForm = false;

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;

  constructor(private formBuilder: FormBuilder, private readonly lovFacade: LovFacade, private readonly insurancePlanFacade: InsurancePlanFacade,
    private changeDetector: ChangeDetectorRef, private readonly loggingService: LoggingService,
    private readonly vendorFacade: VendorFacade,
    private readonly snackbarService: NotificationSnackbarService, private insurancePolicyFacade: HealthInsurancePolicyFacade) {
    this.healthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: [''] });
    this.newhealthInsuranceForm = this.formBuilder.group({ insuranceCarrierName: [''] });

    this.newhealthInsuranceForm = this.formBuilder.group({
      caseOriginCode: ['', Validators.required],
      insuranceType: ['', Validators.required],
      startDate: ['', Validators.required],
      termDate: ['', Validators.required],
      insurancePlanName: ['', Validators.required],
      insuranceCarrierName: ['', Validators.required]
    });
  }

  dateValidator: boolean = false;

  dateValidate(event: Event) {
    this.dateValidator = false;
    const signedDate = this.newhealthInsuranceForm.controls['startDate'].value;
    const todayDate = new Date();
    if (signedDate > todayDate) {
      this.dateValidator = true;
    }
  }

  dentalInsuranceSelectedItem = 'DENTAL_INSURANCE';
  private dentalInsuranceSubscription!: Subscription;
  private subscribeDentalInsurance() {
    this.dentalInsuranceSubscription = this.insuranceTypeList$.subscribe((data: any) => {
      this.healthInsuranceForm.controls['insuranceType'].setValue(this.dentalInsuranceSelectedItem);
      // this.onHealthInsuranceTypeChanged();
      this.healthInsuranceForm.controls["insuranceType"].disable();
    });
  }

  private loadHealthInsuranceLovs() {
    this.lovFacade.getHealthInsuranceTypeLovs();
    this.lovFacade.getMedicareCoverageTypeLovs();
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
    // if (this.providerType == this.vendorTypes.MedicalProviders || this.providerType == this.vendorTypes.DentalProviders) {
    //   if (!this.clinicNameNotApplicable) {
    //     this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
    //     this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
    //   }
    //   if (!this.firstLastNameNotApplicable) {
    //     this.medicalProviderForm.controls['firstName'].setValidators([Validators.required]);
    //     this.medicalProviderForm.controls['lastName'].setValidators([Validators.required]);
    //     this.medicalProviderForm.controls['firstName'].updateValueAndValidity();
    //     this.medicalProviderForm.controls['lastName'].updateValueAndValidity();
    //   }
    // }
    // else if (this.providerType == this.vendorTypes.Manufacturers) {
    //   this.medicalProviderForm.controls['providerName']
    //     .setValidators([
    //       Validators.required, Validators.required, Validators.pattern('^[A-Za-z ]+$')
    //     ]);
    //   this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
    // }
    // else {
    //   this.medicalProviderForm.controls['providerName'].setValidators([Validators.required, Validators.maxLength(500)]);
    //   this.medicalProviderForm.controls['providerName'].updateValueAndValidity();
    // }
    // let mailCode = this.medicalProviderForm.controls['mailCode'].value;
    // this.validateMailCode()

    // if (mailCode) {
    //   this.medicalProviderForm.controls['addressLine1']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['addressLine1'].updateValueAndValidity();

    //   this.medicalProviderForm.controls['city']
    //     .setValidators([
    //       Validators.required, Validators.required, Validators.pattern('^[A-Za-z ]+$')
    //     ]);
    //   this.medicalProviderForm.controls['city'].updateValueAndValidity();

    //   this.medicalProviderForm.controls['state']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['state'].updateValueAndValidity();

    //   this.medicalProviderForm.controls['zip']
    //     .setValidators([
    //       Validators.required, Validators.required, Validators.pattern('^[A-Za-z0-9 \-]+$')
    //     ]);
    //   this.medicalProviderForm.controls['zip'].updateValueAndValidity();

    //   if (this.providerType == this.vendorTypes.Manufacturers) {
    //     this.medicalProviderForm.controls['nameOnCheck'].setValidators([
    //       Validators.nullValidator,
    //     ]);
    //     this.medicalProviderForm.controls[
    //       'nameOnCheck'
    //     ].updateValueAndValidity();

    //     this.medicalProviderForm.controls['nameOnEnvolop'].setValidators([
    //       Validators.nullValidator,
    //     ]);
    //     this.medicalProviderForm.controls[
    //       'nameOnEnvolop'
    //     ].updateValueAndValidity();
    //   }

    // }

    // if (this.providerType != this.vendorTypes.Manufacturers) {
    //   this.medicalProviderForm.controls['paymentMethod']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['paymentMethod'].updateValueAndValidity();

    // }

    // if (this.providerType == this.vendorTypes.Clinic) {
    //   this.medicalProviderForm.controls[this.clinicTypeFieldName]
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls[this.clinicTypeFieldName].updateValueAndValidity();
    // }

    // if (this.providerType == this.vendorTypes.InsuranceVendors) {

    //   this.medicalProviderForm.controls['paymentRunDate']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['paymentRunDate'].updateValueAndValidity();

    //   this.medicalProviderForm.controls['isAcceptCombinedPayment']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['isAcceptCombinedPayment'].updateValueAndValidity();

    //   this.medicalProviderForm.controls['isAcceptReports']
    //     .setValidators([
    //       Validators.required,
    //     ]);
    //   this.medicalProviderForm.controls['isAcceptReports'].updateValueAndValidity();
    // }

    // for (let index = 0; index < this.AddContactForm.length; index++) {
    //   (this.AddContactForm.controls[index] as FormGroup).controls['isCheckContactNameValid'].setValue(true);
    // }
  }

  public addNewInsurancePlanClose(): void {
    this.validateForm();
    this.isValidateForm = true;
    if (this.newhealthInsuranceForm.valid) {
      this.isaddNewInsurancePlanOpen = false;
    }

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
