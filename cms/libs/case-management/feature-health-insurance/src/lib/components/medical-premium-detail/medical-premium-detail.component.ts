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
  PartBMedicareType,
  PartAMedicareType
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
import { SsnPipe, PhonePipe } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit, OnChanges {
  currentDate = new Date();
  buttonText: string = 'Add';

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
  sameAsInsuranceIdFlag = false;
  partAStartDateCheck = false;
  partBDtartDateCheck = false;
  medicareInsuranceInfoCheck = true;
  ddlMedicalHealthInsurancePlans$ =
  this.healthFacade.ddlMedicalHealthInsurancePlans$;
  carrierContactInfo= new CarrierContactInfo();

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  medicareCoverageTypeList$ = this.lovFacade.medicareCoverageType$;

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
  insuranceEndDateValid:boolean = true;

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
    this.validateFormMode();
    this.loadSessionData();
    this.loadLovs();
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
    this.disableEnableRadio();
    this.healthInsuranceForm.controls["insuranceIdNumber"].valueChanges.subscribe(selectedValue => {

      if(this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].value)
      {
        this.healthInsuranceForm.controls['paymentIdNbr'].setValue(selectedValue);
      }

    })
  }
  ngOnChanges() {
  }
  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadLovs() {
    this.lovFacade.getPremiumFrequencyLovs();
    this.lovFacade.getInsuranceTypeLovs();
    this.lovFacade.getMedicareCoverageTypeLovs();
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

      healthInsurancePolicy.startDate != null ? new Date(healthInsurancePolicy.startDate): null

    );

    this.healthInsuranceForm.controls['insuranceEndDate'].setValue(

      healthInsurancePolicy.endDate != null ? new Date(healthInsurancePolicy.endDate): null

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
    this.healthInsuranceForm.controls['groupPlanType'].setValue(
      healthInsurancePolicy.insuranceGroupPlanTypeCode
    );
    if( healthInsurancePolicy.careassistPayingPremiumFlag === StatusFlag.Yes)
    {
      this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
        healthInsurancePolicy.careassistPayingPremiumFlag
      );
      this.healthInsuranceForm.controls['premiumPaidThruDate'].setValue(
        healthInsurancePolicy.premiumPaidThruDate != null? new Date(healthInsurancePolicy.premiumPaidThruDate): null
      );

        this.healthInsuranceForm.controls['nextPremiumDueDate'].setValue(
          healthInsurancePolicy.nextPremiumDueDate != null? new Date(healthInsurancePolicy.nextPremiumDueDate): null
        );

      this.healthInsuranceForm.controls['premiumFrequencyCode'].setValue(
        healthInsurancePolicy.premiumFrequencyCode
      );
      this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].setValue(
        healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.Yes ? true: healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.No? false:null
      );
      if(healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.Yes)
      {
        this.sameAsInsuranceIdFlag = true;
      }
      else
      {
        this.sameAsInsuranceIdFlag = false;
      }
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(
        healthInsurancePolicy.paymentIdNbr
      );
      this.healthInsuranceForm.controls['premiumAmt'].setValue(
        healthInsurancePolicy.premiumAmt
      );
    }
    else{
      this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
        StatusFlag.No
      );
    }
    if(this.ddlInsuranceType === HealthInsurancePlan.Medicare)
    {
      this.healthInsuranceForm.controls['medicareCoverageTypeCode'].setValue(healthInsurancePolicy.medicareCoverageTypeCode);
      this.onMedicareCoverageTypeChanged();
      this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].setValue(
        healthInsurancePolicy.medicareBeneficiaryIdNbr
      );

      this.healthInsuranceForm.controls['medicarePartAStartDate'].setValue(
        healthInsurancePolicy.medicarePartAStartDate != null ? new Date(healthInsurancePolicy.medicarePartAStartDate): null
      );

      this.healthInsuranceForm.controls['medicarePartBStartDate'].setValue(
        healthInsurancePolicy.medicarePartBStartDate != null ? new Date(healthInsurancePolicy.medicarePartBStartDate): null
      );
      this.healthInsuranceForm.controls['onLisFlag'].setValue(
        healthInsurancePolicy.onLisFlag
      );

      this.healthInsuranceForm.controls['onQmbFlag'].setValue(
        healthInsurancePolicy.onQmbFlag === StatusFlag.Yes? true :  healthInsurancePolicy.onQmbFlag === StatusFlag.No ? false: null
      );
    }
    if(this.medicareInsuranceInfoCheck)
    {
      this.healthInsuranceForm.controls['insuranceStartDate'].setValue(
        healthInsurancePolicy.startDate != null ? new Date(healthInsurancePolicy.startDate): null
      );
      this.healthInsuranceForm.controls['insuranceEndDate'].setValue(
        healthInsurancePolicy.endDate != null ? new Date(healthInsurancePolicy.endDate): null
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
    }
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
    const GroupPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
      'groupPlanType',
      'careassistPayingPremiumFlag'
    ];
    const HelpWithPremiumRequiredFields:Array<string> =
    ['nextPremiumDueDate','premiumAmt','premiumFrequencyCode','paymentIdNbr'];
    const MedicarePlanRequiredFields:Array<string> = [
      'medicareBeneficiaryIdNbr',
      'medicareCoverageTypeCode',
      'onLisFlag']
    this.resetValidators();
    this.healthInsuranceForm.markAllAsTouched();
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
    if (this.ddlInsuranceType === HealthInsurancePlan.GroupInsurancePlan) {
      GroupPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
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
    if(this.ddlInsuranceType === HealthInsurancePlan.Veterans){
      this.medicareInsuranceInfoCheck=false;
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.OregonHealthPlan || this.medicareInsuranceInfoCheck) {
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
    if(this.ddlInsuranceType !== HealthInsurancePlan.OregonHealthPlan && this.ddlInsuranceType !== HealthInsurancePlan.Veterans && this.ddlInsuranceType !== HealthInsurancePlan.QualifiedHealthPlan && this.ddlInsuranceType !== HealthInsurancePlan.OffExchangePlan && this.medicareInsuranceInfoCheck)
      {
        this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].setValidators([Validators.required]);
          this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].updateValueAndValidity();
        if(this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y')
        {
          HelpWithPremiumRequiredFields.forEach((key:string) => {
            this.healthInsuranceForm.controls[key].setValidators([Validators.required]);
            this.healthInsuranceForm.controls[key].updateValueAndValidity();
          });
        }
      }
      if(this.ddlInsuranceType === HealthInsurancePlan.Medicare)
    {
      MedicarePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });

      if(this.partAStartDateCheck)
      {
        this.healthInsuranceForm.controls['medicarePartAStartDate'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['medicarePartAStartDate'].updateValueAndValidity();
      }
      if(this.partBDtartDateCheck)
      {
        this.healthInsuranceForm.controls['medicarePartBStartDate'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['medicarePartBStartDate'].updateValueAndValidity();
      }
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
      this.healthInsurancePolicy.priorityCode = 'p';
      this.healthInsurancePolicy.activeFlag = StatusFlag.Yes;
      this.healthInsurancePolicy.healthInsuranceTypeCode = this.ddlInsuranceType;

      /* these field will be removed when the columns are allwed null from the database */ 
      this.healthInsurancePolicy.premiumFrequencyCode="";
      this.healthInsurancePolicy.insuranceFirstName="";
      this.healthInsurancePolicy.insuranceLastName="";
      this.healthInsurancePolicy.oonDrugs="";
      this.healthInsurancePolicy.oonPharmacy="";
      this.healthInsurancePolicy.clientMaximumId ='C8D095E5-5C5B-44A3-A6BA-379282AC1BFF';
      /* End for default values */

      if(this.ddlInsuranceType===HealthInsurancePlan.Veterans) return;
      this.healthInsurancePolicy.insuranceCarrierId =this.healthInsuranceForm.controls['insuranceCarrierName'].value;

      this.healthInsurancePolicy.insurancePlanId =
        this.healthInsuranceForm.controls['insurancePlanName'].value;
      


      this.healthInsurancePolicy.insuranceIdNbr =
        this.healthInsuranceForm.controls['insuranceIdNumber'].value;
      this.healthInsurancePolicy.insuranceGroupPlanTypeCode = this.healthInsuranceForm.controls['groupPlanType'].value;

      this.healthInsurancePolicy.policyHolderFirstName = null;
      this.healthInsurancePolicy.policyHolderLastName = null;
      this.healthInsurancePolicy.metalLevelCode =
        this.healthInsuranceForm.controls['metalLevel'].value?.lovCode;
        if( this.healthInsuranceForm.controls['insuranceStartDate'].value !== null)
      {
        (this.healthInsurancePolicy.startDate = this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['insuranceStartDate'].value
          )
        ));
      }
      else
      {
        this.healthInsurancePolicy.startDate = null
      }

        if(this.healthInsuranceForm.controls['insuranceEndDate'].value !== null)
        {
        this.healthInsurancePolicy.endDate = this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['insuranceEndDate'].value
          )
        );
        }
        else
        {
          this.healthInsurancePolicy.endDate = null;
        }
        if(this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === StatusFlag.Yes)
      {
        this.healthInsurancePolicy.careassistPayingPremiumFlag= StatusFlag.Yes;
        this.healthInsurancePolicy.premiumPaidThruDate= this.healthInsuranceForm.controls["premiumPaidThruDate"].value === null? null : new Date(this.healthInsuranceForm.controls["premiumPaidThruDate"].value);
        this.healthInsurancePolicy.premiumFrequencyCode= this.healthInsuranceForm.controls["premiumFrequencyCode"].value;
        this.healthInsurancePolicy.nextPremiumDueDate = new Date(this.healthInsuranceForm.controls["nextPremiumDueDate"].value);
        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value === true ? StatusFlag.Yes : this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value === false? StatusFlag.No : null;
        this.healthInsurancePolicy.paymentIdNbr = this.healthInsuranceForm.controls["paymentIdNbr"].value;
        this.healthInsurancePolicy.premiumAmt= this.healthInsuranceForm.controls["premiumAmt"].value;
      }
      else
      {
        this.healthInsurancePolicy.careassistPayingPremiumFlag=this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value;
      }
      if (
        this.healthInsuranceForm.controls['aptcFlag'].value !== StatusFlag.Yes
      ) {
        this.healthInsurancePolicy.aptcNotTakingFlag =this.healthInsuranceForm.controls['aptcFlag'].value;
      }else{
        this.healthInsurancePolicy.aptcFlag =StatusFlag.Yes;
        this.healthInsurancePolicy.aptcMonthlyAmt =this.healthInsuranceForm.controls['aptcMonthlyAmt'].value
      }



      this.healthInsurancePolicy.isClientPolicyHolderFlag = null;

      this.healthInsurancePolicy.medicareBeneficiaryIdNbr = this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].value;
      this.healthInsurancePolicy.medicareCoverageTypeCode = this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value;
      if(this.healthInsuranceForm.controls['medicarePartAStartDate'].value !== null)
      {
        (this.healthInsurancePolicy.medicarePartAStartDate = this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['medicarePartAStartDate'].value
          )
        ));
      }
      else
      {
        this.healthInsurancePolicy.medicarePartAStartDate = null;
      }
      if(this.healthInsuranceForm.controls['medicarePartBStartDate'].value !== null)
      {
        (this.healthInsurancePolicy.medicarePartBStartDate =this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['medicarePartBStartDate'].value
          )
        ));
      }
      else
      {
        this.healthInsurancePolicy.medicarePartBStartDate = null;
      }
      if( this.healthInsuranceForm.controls['onQmbFlag'].value === true)
      {
        this.healthInsurancePolicy.onQmbFlag = StatusFlag.Yes;
      }
      else if (this.healthInsuranceForm.controls['onQmbFlag'].value === false)
      {
        this.healthInsurancePolicy.onQmbFlag = StatusFlag.No;
      }
      else
      {
        this.healthInsurancePolicy.onQmbFlag = null;
      }

      if (
        this.healthInsuranceForm.controls['onLisFlag'].value !== StatusFlag.Yes
      ) {
        this.healthInsurancePolicy.onLisFlag =this.healthInsuranceForm.controls['onLisFlag'].value;
      }else{
        this.healthInsurancePolicy.onLisFlag =StatusFlag.Yes;
      }
      (this.healthInsurancePolicy.paymentGroupNumber = 0),
        (this.healthInsurancePolicy.insuranceFirstName = 'string');
      this.healthInsurancePolicy.insuranceLastName = 'string';
      (this.healthInsurancePolicy.oonException = 0),
        (this.healthInsurancePolicy.oonStartDate = new Date());
      this.healthInsurancePolicy.oonEndDate = new Date();
      this.healthInsurancePolicy.oonPharmacy = 'string';
      this.healthInsurancePolicy.oonDrugs = 'string';
      this.healthInsurancePolicy.concurrencyStamp = 'string';

    }
  }
  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.ddlInsuranceType =
      this.healthInsuranceForm.controls['insuranceType'].value;
    this.isOpenDdl = true;
    if (this.ddlInsuranceType === HealthInsurancePlan.Medicare)
    {
      this.medicareInsuranceInfoCheck = false;
    }
    else
    {
      this.medicareInsuranceInfoCheck = true;
    }
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




  insuranceCarrierNameData(data: any) {
    if (this.isEdit) {
      this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
        this.healthInsurancePolicyCopy.insuranceCarrierId
      );
    }
  }
  onSameAsInsuranceIdValueChange(event: Event)
  {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.sameAsInsuranceIdFlag = true;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(this.healthInsuranceForm.controls['insuranceIdNumber'].value);
    }
    else {
      this.sameAsInsuranceIdFlag = false;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(null);
      //this.healthInsuranceForm.controls['paymentIdNbr'].enable();
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
  onMedicareCoverageTypeChanged()
  {
    if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("P") || this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("M"))
    {
      this.medicareInsuranceInfoCheck = true;
    }
    else
    {
      this.medicareInsuranceInfoCheck = false;
    }
    const PartAenum = Object.keys(PartAMedicareType)
    if(PartAenum.includes(this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value))
    {
      this.partAStartDateCheck = true;
    }
    else
    {
      this.partAStartDateCheck = false;
    }
    const PartBenum = Object.keys(PartBMedicareType)
    if(PartBenum.includes(this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value))
    {
      this.partBDtartDateCheck = true;
    }
    else
    {
      this.partBDtartDateCheck = false;
    }
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
        this.healthInsurancePolicy.creationTime =this.healthInsurancePolicyCopy.creationTime;
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
                  error
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
                  error
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
      this.healthInsuranceForm.controls["groupPlanType"].disable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].disable();
      this.healthInsuranceForm.controls["onQmbFlag"].disable();
      this.healthInsuranceForm.controls["onLisFlag"].disable();
    }
    else{
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].enable();
      this.healthInsuranceForm.controls["groupPlanType"].enable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].enable();
      this.healthInsuranceForm.controls["onQmbFlag"].enable();
      this.healthInsuranceForm.controls["onLisFlag"].enable();
    }
  }
   startDateOnChange(startDate:Date){
    if( this.healthInsuranceForm.controls['insuranceEndDate'].value !==null){
      var endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['insuranceEndDate'].value
        )
      );
     if (startDate > endDate) {
         this.healthInsuranceForm.controls['insuranceEndDate'].setValue(null);
       }

    }
  }

}
