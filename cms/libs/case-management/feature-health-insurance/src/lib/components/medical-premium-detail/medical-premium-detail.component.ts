/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import {
  HealthInsuranceFacade,
  HealthInsurancePolicyFacade,
  healthInsurancePolicy,
  CarrierContactInfo,
  YesNoFlag,
  StatusFlag,
  HealthInsurancePlan,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import {
  InsurancePlanFacade,
  WorkflowFacade,
} from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit, OnChanges {
  currentDate = new Date();
  buttonText: string = 'Add';
  public isaddNewInsuranceProviderOpen = false;
  public isaddNewInsurancePlanOpen = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;
  @Input() healthInsuranceForm: FormGroup;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();
  @Output() isDeleteClicked = new EventEmitter<any>();

  /** Private properties **/
  private loadSessionSubscription!: Subscription;

  /** Public properties **/
  ddlMedicalHealthInsurancePlans$ =
    this.healthFacade.ddlMedicalHealthInsurancePlans$;
  carrierContactInfo = new CarrierContactInfo();

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;

  ddlMedicalHealthPlanMetalLevel$ =
    this.healthFacade.ddlMedicalHealthPlanMetalLevel$;
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.healthFacade.ddlMedicalHealthPalnPremiumFrequecy$;
  ddlInsuranceType!: string;
  InsurancePlanTypes: typeof HealthInsurancePlan = HealthInsurancePlan;
  isEditViewPopup!: boolean;
  isEdit!: boolean;
  isDeleteEnabled!: boolean;
  isSubmitted: boolean = false;
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  isOpenDdl = false;
  insurancePlans: Array<any> = [];
  healthInsurancePolicy!: healthInsurancePolicy;
  healthInsurancePolicyCopy!: healthInsurancePolicy;
  clientCaseId!: any;
  clientCaseEligibilityId!: any;
  sessionId!: any;
  clientId!: any;
  metalLevelDefaultValue: any = {};
  insurancePlanNameDefaultValue: string | null = null;

  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private formBuilder: FormBuilder,
    private lovFacade: LovFacade,
    private insurancePlanFacade: InsurancePlanFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private readonly loaderService: LoaderService,
    private changeDetector: ChangeDetectorRef,
    public intl: IntlService
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.validateFormMode();
    this.loadSessionData();
    this.loadLovs();
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
  }
  ngOnChanges() { }
  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadLovs() {
    this.lovFacade.getInsuranceTypeLovs();
  }
  private validateFormMode() {
    if (this.dialogTitle === 'Add' || this.dialogTitle === 'View') {
      this.resetForm();
      this.resetValidators();
    }
  }
  resetForm() {
    this.healthInsuranceForm.reset();
    this.healthInsuranceForm.updateValueAndValidity();
  }
  private loadDdlMedicalHealthInsurancePlans() {
    this.healthFacade.loadDdlMedicalHealthInsurancePlans();
  }
  private loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (
          session !== null &&
          session !== undefined &&
          session.sessionData !== undefined
        ) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(
            session.sessionData
          ).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
        }
      });
  }
  private loadDdlMedicalHealthPlanMetalLevel() {
    this.healthFacade.loadDdlMedicalHealthPlanMetalLevel();
  }

  private loadDdlMedicalHealthPalnPremiumFrequecy() {
    this.healthFacade.loadDdlMedicalHealthPalnPremiumFrequecy();
  }

  private viewSelection() {
    this.isToggleNewPerson = false;
    switch (this.dialogTitle) {
      case 'View':
        this.isEditViewPopup = true;
        this.conditionsInsideView();
        this.isViewContentEditable = true;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      case 'Add':
        this.isEdit = false;
        this.buttonText = 'Add';
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        break;
      case 'Edit':
        this.isEdit = true;
        this.buttonText = 'Update';
        this.isDeleteEnabled = true;
        this.isViewContentEditable = false;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      default:
        break;
    }
  }

  loadHealthInsurancePolicy() {
    this.insurancePolicyFacade.healthInsurancePolicy$.subscribe((data: any) => {
      this.healthInsurancePolicyCopy = data;
      this.bindValues(data);
    });
  }

  bindValues(healthInsurancePolicy: healthInsurancePolicy) {
    this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(
      healthInsurancePolicy.clientInsurancePolicyId
    );
    this.healthInsuranceForm.controls['insuranceType'].setValue(
      healthInsurancePolicy.healthInsuranceTypeCode
    );
    this.onHealthInsuranceTypeChanged();
    this.healthInsuranceForm.controls['insuranceStartDate'].setValue(
      new Date(healthInsurancePolicy.startDate)
    );
    this.healthInsuranceForm.controls['insuranceEndDate'].setValue(
      new Date(healthInsurancePolicy.endDate)
    );
    this.healthInsuranceForm.controls['insuranceIdNumber'].setValue(
      healthInsurancePolicy.insuranceIdNbr
    );
    this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
      healthInsurancePolicy.insuranceCarrierId
    );
    this.insuranceCarrierNameChange(
      healthInsurancePolicy.insuranceCarrierId as string
    );
    this.healthInsuranceForm.controls['insurancePlanName'].setValue(
      healthInsurancePolicy.insurancePlanId
    );
    this.insurancePlanNameDefaultValue = healthInsurancePolicy.insurancePlanId;
    const metalLevel = { lovCode: healthInsurancePolicy.metalLevelCode };
    this.metalLevelDefaultValue = metalLevel;
    this.healthInsuranceForm.controls['metalLevel'].setValue(metalLevel);
    this.healthInsuranceForm.controls['aptcFlag'].setValue(
      healthInsurancePolicy.aptcFlag
    );
    this.healthInsuranceForm.controls['aptcMonthlyAmt'].setValue(
      healthInsurancePolicy.aptcMonthlyAmt
    );
    this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
      healthInsurancePolicy.careassistPayingPremiumFlag
    );
    this.disableEnableRadio();
  }

  private conditionsInsideView() {
    //this.ddlInsuranceType = this.insuranceType;
    this.isOpenDdl = true;
  }

  private validateForm() {
    const QualifiedHealthPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceEndDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
      'aptcFlag',
      'metalLevel',
    ];
    const CobraPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceEndDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
    ];
    const OffExchangePlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceEndDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
    ];
    const OregonPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
    ];
    // const CobraPlanRequiredFields: Array<string> = [
    //   'insuranceStartDate',
    //   'insuranceEndDate',
    //   'insuranceIdNumber',
    //   'insuranceCarrierName',
    //   'insurancePlanName',
    // ];
    this.resetValidators();
    this.healthInsuranceForm.updateValueAndValidity();
    if (this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan) {
      QualifiedHealthPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
      if (this.healthInsuranceForm.controls['aptcFlag'].value === 'Y') {
        this.healthInsuranceForm.controls['aptcMonthlyAmt'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[
          'aptcMonthlyAmt'
        ].updateValueAndValidity();
      }
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.Cobra) {
      CobraPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.OffExchangePlan) {
      OffExchangePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.OregonHealthPlan) {
      OregonPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
    if (
      this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan ||
      this.ddlInsuranceType === HealthInsurancePlan.OffExchangePlan
    ) {
      this.healthInsuranceForm.controls['metalLevel'].setValidators([
        Validators.required,
      ]);
      this.healthInsuranceForm.controls['metalLevel'].updateValueAndValidity();
    }
  }
  private resetValidators() {
    Object.keys(this.healthInsuranceForm.controls).forEach((key: string) => {
      this.healthInsuranceForm.controls[key].clearValidators();
      this.healthInsuranceForm.controls[key].updateValueAndValidity();
    });
  }

  private populateInsurancePolicy() {
    {
      this.healthInsurancePolicy = new healthInsurancePolicy();
      this.healthInsurancePolicy.clientId = this.clientId;
      this.healthInsurancePolicy.clientCaseEligibilityId =this.clientCaseEligibilityId;
      if(this.ddlInsuranceType===this.InsurancePlanTypes.Veterans) return;

      this.healthInsurancePolicy.insuranceCarrierId =this.healthInsuranceForm.controls['insuranceCarrierName'].value;
      
      this.healthInsurancePolicy.insurancePlanId =
        this.healthInsuranceForm.controls['insurancePlanName'].value;
      this.healthInsurancePolicy.clientMaximumId =
        'C8D095E5-5C5B-44A3-A6BA-379282AC1BFF';
      this.healthInsurancePolicy.healthInsuranceTypeCode =
        this.ddlInsuranceType;
      this.healthInsurancePolicy.insuranceIdNbr =
        this.healthInsuranceForm.controls['insuranceIdNumber'].value;
      this.healthInsurancePolicy.insuranceGroupPlanTypeCode = null;
      this.healthInsurancePolicy.priorityCode = 'p';
      this.healthInsurancePolicy.policyHolderFirstName = null;
      this.healthInsurancePolicy.policyHolderLastName = null;
      this.healthInsurancePolicy.metalLevelCode =
        this.healthInsuranceForm.controls['metalLevel'].value?.lovCode;
      (this.healthInsurancePolicy.premiumAmt = 0),
        (this.healthInsurancePolicy.startDate = this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['insuranceStartDate'].value
          )
        ));
      this.healthInsurancePolicy.endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['insuranceEndDate'].value
        )
      );
      this.healthInsurancePolicy.careassistPayingPremiumFlag = this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value;
      this.healthInsurancePolicy.premiumPaidThruDate = new Date();
      this.healthInsurancePolicy.premiumFrequencyCode = 'string';
      this.healthInsurancePolicy.nextPremiumDueDate = new Date();
      this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = null;
      this.healthInsurancePolicy.paymentIdNbr = 'string';
      if (
        this.healthInsuranceForm.controls['aptcFlag'].value !== StatusFlag.Yes
      ) {
        this.healthInsurancePolicy.aptcNotTakingFlag =this.healthInsuranceForm.controls['aptcFlag'].value;
      }else{
        this.healthInsurancePolicy.aptcFlag =StatusFlag.Yes;
        this.healthInsurancePolicy.aptcMonthlyAmt =this.healthInsuranceForm.controls['aptcMonthlyAmt'].value
      }
      
      
        
      this.healthInsurancePolicy.isClientPolicyHolderFlag = null;
      this.healthInsurancePolicy.medicareBeneficiaryIdNbr = 'string';
      this.healthInsurancePolicy.medicareCoverageTypeCode = 'string';
      this.healthInsurancePolicy.medicarePartAStartDate = new Date();
      this.healthInsurancePolicy.medicarePartBStartDate = new Date();
      this.healthInsurancePolicy.onQmbFlag = null;
      this.healthInsurancePolicy.onLisFlag = null;
      (this.healthInsurancePolicy.paymentGroupNumber = 0),
        (this.healthInsurancePolicy.insuranceFirstName = 'string');
      this.healthInsurancePolicy.insuranceLastName = 'string';
      (this.healthInsurancePolicy.oonException = 0),
        (this.healthInsurancePolicy.oonStartDate = new Date());
      this.healthInsurancePolicy.oonEndDate = new Date();
      this.healthInsurancePolicy.oonPharmacy = 'string';
      this.healthInsurancePolicy.oonDrugs = 'string';
      this.healthInsurancePolicy.concurrencyStamp = 'string';
      this.healthInsurancePolicy.activeFlag = StatusFlag.Yes;
    }
  }
  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.ddlInsuranceType =
      this.healthInsuranceForm.controls['insuranceType'].value;
    this.isOpenDdl = true;
  }

  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }
  onRedirectModalClicked() {
    this.isViewContentEditable = false;
    this.isEditViewPopup = false;
    this.isDeleteEnabled = true;
    this.isEdit = true;
    this.buttonText = 'Update';
    this.disableEnableRadio();
  }
  onToggleNewPersonClicked() {
    this.isToggleNewPerson = !this.isToggleNewPerson;
  }

  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.isaddNewInsuranceProviderOpen = true;
  }

  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }
  insuranceCarrierNameData(data: any) {
    if (this.isEdit) {
      this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
        this.healthInsurancePolicyCopy.insuranceCarrierId
      );
    }
  }
  insuranceCarrierNameChange(value: string) {
    this.insurancePlans = [];
    this.healthInsuranceForm.controls['insurancePlanName'].setValue('');
    if (value === undefined) return;
    this.insurancePlanFacade
      .loadInsurancePlanByProviderId(value)
      .subscribe((data: any) => {
        if (!Array.isArray(data)) return;
        this.insurancePlans = data;

        if (this.isEdit && data.length > 0) {
          this.healthInsuranceForm.controls['insurancePlanName'].setValue(
            this.insurancePlanNameDefaultValue
          );
        }
      });
    this.loaderService.show();
    this.insurancePolicyFacade.getCarrierContactInfo(value).subscribe({
      next: (data) => {
        this.carrierContactInfo = data;
        this.changeDetector.detectChanges();
        this.loaderService.hide();
      },
      error: (err) => {
        //this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  save() {
    this.isSubmitted = true;
    this.validateForm();
    if (this.healthInsuranceForm.valid) {
      this.populateInsurancePolicy();
      this.insurancePolicyFacade.ShowLoader();
      if (this.isEdit) {
        this.healthInsurancePolicy.clientInsurancePolicyId =
          this.healthInsuranceForm.controls['clientInsurancePolicyId'].value;
        this.healthInsurancePolicy.creationTime = this.healthInsurancePolicyCopy.creationTime;
        this.insurancePolicyFacade
          .updateHealthInsurancePolicy(this.healthInsurancePolicy)
          .subscribe(
            (data: any) => {
              this.insurancePolicyFacade.ShowHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Insurance plan updated successfully.'
              );
              this.onModalCloseClicked();
            },
            (error: any) => {
              if (error) {
                this.insurancePolicyFacade.ShowHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error?.error?.error
                );
              }
            }
          );
      } else {
        this.insurancePolicyFacade
          .saveHealthInsurancePolicy(this.healthInsurancePolicy)
          .subscribe(
            (data: any) => {
              this.insurancePolicyFacade.ShowHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Insurance plan updated successfully.'
              );
              this.onModalCloseClicked();
            },
            (error: any) => {
              if (error) {
                this.insurancePolicyFacade.ShowHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error?.error?.error
                );
              }
            }
          );
      }
    }
  }

  onDeleteClick() {
    this.isDeleteClicked.next(true);
  }

  disableEnableRadio(){
    if(this.isViewContentEditable){
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].disable();
    }
    else{
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].enable();
    }
  }
}
