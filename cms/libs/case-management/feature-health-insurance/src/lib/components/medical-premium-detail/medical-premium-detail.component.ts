/** Angular **/
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import {
  ClientDocument,
  ClientDocumentFacade,
  HealthInsuranceFacade,
  HealthInsurancePolicyFacade,
  healthInsurancePolicy,
  CarrierContactInfo,
  InsurancePlanFacade,
  YesNoFlag,
  StatusFlag,
  HealthInsurancePlan,
  PartBMedicareType,
  PartAMedicareType,
  WorkflowFacade,
  FamilyAndDependentFacade
} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray, ValidationErrors } from '@angular/forms';
import { Lov, LovFacade, LovType } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import { Subscription, first } from 'rxjs';
import { LoaderService, SnackBarNotificationType, ConfigurationProvider,LoggingService,NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SsnPipe, PhonePipe } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit, OnChanges, OnDestroy {
  currentDate = new Date();
  buttonText: string = 'Add';
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  RelationshipLovs$ = this.lovFacade.lovRelationShip$;
  proofOfPremiumFiles: any;
  copyOfSummaryFiles: any;
  copyOfInsuranceCardFiles: any;
  copyOfMedicareCardFiles : any
  lengthRestrictForty = 40;
  isaddNewInsurancePlanOpen: boolean = false;
  public uploadRemoveUrl = 'removeUrl';
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;
  @Input() healthInsuranceForm: FormGroup;
  public uploadFileSizeLimit =this.configurationProvider.appSettings.uploadFileSizeLimit;

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
  carrierContactInfo = new CarrierContactInfo();
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
  metalLevelDefaultValue: any = {};
  insurancePlanNameDefaultValue: string | null = null;
  insuranceEndDateValid: boolean = true;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  relationshipDescriptionList: any = [];
  relationshipList: any = [];
  sessionId: any;
  cICTypeCode: string = "";
  pOPTypeCode: string = "";
  cOSTypeCode: string = "";
  isInsuranceFileUploaded: boolean = true;
  isProofFileUploaded: boolean = true;
  isSummaryFileUploaded: boolean = true;
  isMedicareCardFileUploaded : boolean = true
  documentSizeValidator=false;
  proofOfPremiumExceedsFileSizeLimit=false;
  summaryFilesExceedsFileSizeLimit=false;
  insuranceCardFilesExceedsFileSizeLimit=false;
  medicareCardFilesExceedsFileSizeLimit=false;
  insuranceStartDateIslessthanEndDate: boolean = true;
  insuranceEndDateIsgreaterthanStartDate: boolean=false;
  endDateMin!:Date;

  get othersCoveredOnPlan(): FormArray {
    return this.healthInsuranceForm.get("othersCoveredOnPlan") as FormArray;
  }

  get newOthersCoveredOnPlan(): FormArray {
    return this.healthInsuranceForm.get("newOthersCoveredOnPlan") as FormArray;
  }

  /** Constructor **/
  constructor(
    private readonly healthFacade: HealthInsuranceFacade,
    private formBuilder: FormBuilder,
    private lovFacade: LovFacade,
    private insurancePlanFacade: InsurancePlanFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private familyAndDependentFacade: FamilyAndDependentFacade,
    private route: ActivatedRoute,
    private workflowFacade: WorkflowFacade,
    private readonly loaderService: LoaderService,
    private changeDetector: ChangeDetectorRef,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    private readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
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
    this.loadRelationshipLov();
    this.disableEnableRadio();
    this.loadHealthInsuranceProofCodes();
    this.healthInsuranceForm.controls["insuranceIdNumber"].valueChanges.subscribe(selectedValue => {
      if (this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].value) {
        this.healthInsuranceForm.controls['paymentIdNbr'].setValue(selectedValue);
      }
    });
  }
  ngOnChanges() {
  }
  ngOnDestroy(): void {
    (this.healthInsuranceForm.controls['othersCoveredOnPlan'] as FormArray).clear();
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadLovs() {
    this.lovFacade.getPremiumFrequencyLovs();
    this.lovFacade.getInsuranceTypeLovs();
    this.lovFacade.getMedicareCoverageTypeLovs();
    this.lovFacade.getRelationShipsLovs();
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

  private loadRelationshipLov() {
    this.RelationshipLovs$.subscribe((data: any) => {
      if (!Array.isArray(data)) return;
      this.relationshipList = data;
      this.relationshipDescriptionList = data.map((x: any) => x.lovDesc);
    });
  }

  private loadHealthInsuranceProofCodes() {
    this.lovFacade.getLovsbyParent(LovType.HEALTHINSURANCEPROOF, 'HI');
    this.lovFacade.ovcascade$.subscribe((resp: Array<Lov>) => {
      resp.forEach((x: Lov) => {
        if (x.lovCode == 'CIC') {
          this.cICTypeCode = x.lovCode;
        }
        else if (x.lovCode == 'POP') {
          this.pOPTypeCode = x.lovCode;
        }
        else if (x.lovCode == 'CSB') {
          this.cOSTypeCode = x.lovCode;
        }
      });
    })
  }

  private loadClientDependents() {
    this.familyAndDependentFacade.clientDependents$.subscribe((data: any) => {
      if (!!data) {
        data.forEach((person: any) => {
          person.enrolledInInsuranceFlag = person.enrolledInInsuranceFlag == StatusFlag.Yes ? true : false;
        });
        let personsGroup = !!data ? data.map((person: any) => this.formBuilder.group(person)) : [];
        let personForm = this.formBuilder.array(personsGroup);
        this.healthInsuranceForm.setControl('othersCoveredOnPlan', personForm);
      }
    });
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
        this.resetForm();
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
      healthInsurancePolicy.startDate != null ? new Date(healthInsurancePolicy.startDate) : null
    );

    this.healthInsuranceForm.controls['insuranceEndDate'].setValue(

      healthInsurancePolicy.endDate != null ? new Date(healthInsurancePolicy.endDate) : null

    );
    this.healthInsuranceForm.controls['insuranceIdNumber'].setValue(
      healthInsurancePolicy.insuranceIdNbr
    );
    this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
      healthInsurancePolicy.insuranceCarrierId
    );
    if (healthInsurancePolicy.insuranceCarrierId)
    {
      this.insuranceCarrierNameChange(
        healthInsurancePolicy.insuranceCarrierId as string
      );
    }
    this.healthInsuranceForm.controls['insurancePlanName'].setValue(
      healthInsurancePolicy.insurancePlanId
    );
    this.insurancePlanNameDefaultValue = healthInsurancePolicy.insurancePlanId;
    const metalLevel = { lovCode: healthInsurancePolicy.metalLevelCode };
    this.metalLevelDefaultValue = metalLevel;
    this.healthInsuranceForm.controls['metalLevel'].setValue(metalLevel);
    if(this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan)
    {
      let aptcCode=healthInsurancePolicy.aptcCode?.trim();
      this.healthInsuranceForm.controls['aptcFlag'].setValue(aptcCode);
    }
    this.healthInsuranceForm.controls['aptcMonthlyAmt'].setValue(
      healthInsurancePolicy.aptcMonthlyAmt
    );
    this.healthInsuranceForm.controls['groupPlanType'].setValue(
      healthInsurancePolicy.insuranceGroupPlanTypeCode
    );
    this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
      healthInsurancePolicy.careassistPayingPremiumFlag
    );
    if (healthInsurancePolicy.careassistPayingPremiumFlag === StatusFlag.Yes) {

      this.healthInsuranceForm.controls['premiumPaidThruDate'].setValue(
        healthInsurancePolicy.premiumPaidThruDate != null ? new Date(healthInsurancePolicy.premiumPaidThruDate) : null
      );

      this.healthInsuranceForm.controls['nextPremiumDueDate'].setValue(
        healthInsurancePolicy.nextPremiumDueDate != null ? new Date(healthInsurancePolicy.nextPremiumDueDate) : null
      );

      this.healthInsuranceForm.controls['premiumFrequencyCode'].setValue(
        healthInsurancePolicy.premiumFrequencyCode
      );
      this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].setValue(
        healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.Yes ? true : healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.No ? false : null
      );
      if (healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.Yes) {
        this.sameAsInsuranceIdFlag = true;
      }
      else {
        this.sameAsInsuranceIdFlag = false;
      }
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(
        healthInsurancePolicy.paymentIdNbr
      );
      this.healthInsuranceForm.controls['premiumAmt'].setValue(
        healthInsurancePolicy.premiumAmt
      );
    }
    else if(healthInsurancePolicy.careassistPayingPremiumFlag === StatusFlag.No){
      this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
        StatusFlag.No
      );
    }
    else
    {
      this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
        null
      );
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.Medicare) {
      this.healthInsuranceForm.controls['medicareCoverageTypeCode'].setValue(healthInsurancePolicy.medicareCoverageTypeCode);
      this.onMedicareCoverageTypeChanged();
      this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].setValue(
        healthInsurancePolicy.medicareBeneficiaryIdNbr
      );

      this.healthInsuranceForm.controls['medicarePartAStartDate'].setValue(
        healthInsurancePolicy.medicarePartAStartDate != null ? new Date(healthInsurancePolicy.medicarePartAStartDate) : null
      );

      this.healthInsuranceForm.controls['medicarePartBStartDate'].setValue(
        healthInsurancePolicy.medicarePartBStartDate != null ? new Date(healthInsurancePolicy.medicarePartBStartDate) : null
      );
      this.healthInsuranceForm.controls['onLisFlag'].setValue(
        healthInsurancePolicy.onLisFlag
      );

      this.healthInsuranceForm.controls['onQmbFlag'].setValue(
        healthInsurancePolicy.onQmbFlag === StatusFlag.Yes ? true : healthInsurancePolicy.onQmbFlag === StatusFlag.No ? false : null
      );
      if(this.medicareInsuranceInfoCheck)
      {
        this.insuranceCarrierNameChange(
          healthInsurancePolicy.insuranceCarrierId as string
        );
      }
    }
    if (this.medicareInsuranceInfoCheck || this.ddlInsuranceType === HealthInsurancePlan.GroupInsurancePlan) {
      this.healthInsuranceForm.controls['insuranceStartDate'].setValue(
        healthInsurancePolicy.startDate != null ? new Date(healthInsurancePolicy.startDate) : null
      );
      this.healthInsuranceForm.controls['insuranceEndDate'].setValue(
        healthInsurancePolicy.endDate != null ? new Date(healthInsurancePolicy.endDate) : null
      );
      this.healthInsuranceForm.controls['insuranceIdNumber'].setValue(
        healthInsurancePolicy.insuranceIdNbr
      );
      // this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
      //   healthInsurancePolicy.insuranceCarrierId
      // );

      this.healthInsuranceForm.controls['insurancePlanName'].setValue(
        healthInsurancePolicy.insurancePlanId
      );
      this.insurancePlanNameDefaultValue = healthInsurancePolicy.insurancePlanId;
      const metalLevel = { lovCode: healthInsurancePolicy.metalLevelCode };
      this.metalLevelDefaultValue = metalLevel;
      this.healthInsuranceForm.controls['metalLevel'].setValue(metalLevel);
      this.healthInsuranceForm.controls['aptcMonthlyAmt'].setValue(
        healthInsurancePolicy.aptcMonthlyAmt
      );
    }
    // if (healthInsurancePolicy.isClientPolicyHolderFlag == StatusFlag.No) {
    this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].setValue(
      healthInsurancePolicy.isClientPolicyHolderFlag
    );
    //}
    // else {
    //   this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].setValue(
    //     StatusFlag.Yes
    //   );
    // }
    this.healthInsuranceForm.controls['policyHolderFirstName'].setValue(
      healthInsurancePolicy.policyHolderFirstName
    )
    this.healthInsuranceForm.controls['policyHolderLastName'].setValue(
      healthInsurancePolicy.policyHolderLastName
    )
    this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].setValue(
      healthInsurancePolicy.othersCoveredOnPlanFlag
    );
    healthInsurancePolicy.othersCoveredOnPlan?.forEach((person: any) => {
      person.enrolledInInsuranceFlag = person.enrolledInInsuranceFlag == StatusFlag.Yes ? true : false;
    })
    let personsGroup = !!healthInsurancePolicy.othersCoveredOnPlan ? healthInsurancePolicy.othersCoveredOnPlan.map(pe => this.formBuilder.group(pe)) : [];
    let personForm = this.formBuilder.array(personsGroup);
    this.healthInsuranceForm.setControl('othersCoveredOnPlan', personForm);
    this.healthInsuranceForm.setControl('newOthersCoveredOnPlan', this.formBuilder.array([]));
    if (!!healthInsurancePolicy.copyOfInsuranceCardFileName) {
      this.copyOfInsuranceCardFiles = [{
        name: healthInsurancePolicy.copyOfInsuranceCardFileName,
        src: healthInsurancePolicy.copyOfInsuranceCardFilePath,
        uid: healthInsurancePolicy.copyOfInsuranceCardFileId,
        size: healthInsurancePolicy.copyOfInsuranceCardFileSize,
        documentTypeCode: healthInsurancePolicy.copyOfInsuranceCardFileTypeCode,
        documentId: healthInsurancePolicy.copyOfInsuranceCardFileId
      }];
    }
    if (!!healthInsurancePolicy.proofOfPremiumFileName) {
      this.proofOfPremiumFiles = [{
        name: healthInsurancePolicy.proofOfPremiumFileName,
        src: healthInsurancePolicy.proofOfPremiumFilePath,
        uid: healthInsurancePolicy.proofOfPremiumFileId,
        size: healthInsurancePolicy.proofOfPremiumFileSize,
        documentTypeCode: healthInsurancePolicy.proofOfPremiumFileTypeCode,
        documentId: healthInsurancePolicy.proofOfPremiumFileId
      }];
    }
    if (!!healthInsurancePolicy.copyOfSummaryFileName) {
      this.copyOfSummaryFiles = [{
        name: healthInsurancePolicy.copyOfSummaryFileName,
        src: healthInsurancePolicy.copyOfSummaryFilePath,
        uid: healthInsurancePolicy.copyOfSummaryFileId,
        size: healthInsurancePolicy.copyOfSummaryFileSize,
        documentTypeCode: healthInsurancePolicy.copyOfSummaryFileTypeCode,
        documentId: healthInsurancePolicy.copyOfSummaryFileId
      }];
    }
    if (!!healthInsurancePolicy.medicareCardFileName) {
      this.copyOfMedicareCardFiles = [{
        name: healthInsurancePolicy.medicareCardFileName,
        src: healthInsurancePolicy.medicareCardFilePath,
        uid: healthInsurancePolicy.medicareCardFileId,
        size: healthInsurancePolicy.medicareCardFileSize,
        documentTypeCode: healthInsurancePolicy.medicareCardFileTypeCode,
        documentId: healthInsurancePolicy.medicareCardFileId
      }];
    }
    this.disableEnableRadio();
  }

  updateEnrollStatus(event: any, i: number) {
    this.othersCoveredOnPlan.controls[i].patchValue({ 'enrolledInInsuranceFlag': event.target.checked ? true : false });
  }

  private conditionsInsideView() {
    //this.ddlInsuranceType = this.insuranceType;
    this.isOpenDdl = true;
  }

  private validateForm() {
    if(this.healthInsuranceForm.controls['insuranceEndDate'].valid){
      this.insuranceEndDateIsgreaterthanStartDate = true;
    }
    this.isSummaryFileUploaded = true;
    this.isProofFileUploaded = true;
    this.isInsuranceFileUploaded = true;
    this.isMedicareCardFileUploaded = true;
    const QualifiedHealthPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
      'aptcFlag',
      'metalLevel',
    ];
    const CobraPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceCarrierName',
      'insurancePlanName',
    ];
    const OffExchangePlanRequiredFields: Array<string> = [
      'insuranceStartDate',
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
    const HelpWithPremiumRequiredFields: Array<string> =
      ['nextPremiumDueDate', 'premiumAmt', 'premiumFrequencyCode', 'paymentIdNbr'];
    const MedicarePlanRequiredFields: Array<string> = [
      'medicareBeneficiaryIdNbr',
      'medicareCoverageTypeCode',
      'onLisFlag']
    this.healthInsuranceForm.markAllAsTouched();
    if (this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan) {
      QualifiedHealthPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
      if (this.healthInsuranceForm.controls['aptcFlag'].value === 'YES') {
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
      if(this.healthInsuranceForm.controls['insuranceEndDate'].value === null){
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors({ 'incorrect': true });
      }
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.OffExchangePlan) {
      OffExchangePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
      if(this.healthInsuranceForm.controls['insuranceEndDate'].value === null){
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors({ 'incorrect': true });
      }
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.Veterans) {
      this.medicareInsuranceInfoCheck = false;
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
    if (this.ddlInsuranceType !== HealthInsurancePlan.OregonHealthPlan
      && this.ddlInsuranceType !== HealthInsurancePlan.Veterans
      && this.medicareInsuranceInfoCheck) {
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].setValidators([Validators.required]);
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].updateValueAndValidity();
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        HelpWithPremiumRequiredFields.forEach((key: string) => {
          this.healthInsuranceForm.controls[key].setValidators([Validators.required]);
          this.healthInsuranceForm.controls[key].updateValueAndValidity();
        });
      }
    }
    if (this.ddlInsuranceType === HealthInsurancePlan.Medicare) {
      MedicarePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });

      if (this.partAStartDateCheck) {
        this.healthInsuranceForm.controls['medicarePartAStartDate'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['medicarePartAStartDate'].updateValueAndValidity();
      }
      if (this.partBDtartDateCheck) {
        this.healthInsuranceForm.controls['medicarePartBStartDate'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['medicarePartBStartDate'].updateValueAndValidity();
      }
    }
    if (this.ddlInsuranceType !== this.InsurancePlanTypes.OregonHealthPlan && this.ddlInsuranceType !== this.InsurancePlanTypes.Veterans
      && this.ddlInsuranceType !== this.InsurancePlanTypes.Cobra  && this.medicareInsuranceInfoCheck
      && this.ddlInsuranceType !== this.InsurancePlanTypes.GroupInsurancePlan) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value == 'Y') {
        this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].updateValueAndValidity();
        this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].updateValueAndValidity();
      }
    }
    if (this.ddlInsuranceType !== this.InsurancePlanTypes.OregonHealthPlan
      && this.ddlInsuranceType !== this.InsurancePlanTypes.Veterans
      && this.ddlInsuranceType !== this.InsurancePlanTypes.GroupInsurancePlan
      && this.ddlInsuranceType !== this.InsurancePlanTypes.Cobra 
      && this.ddlInsuranceType !== this.InsurancePlanTypes.Medicare) {
      if (this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].value == 'Y') {
        if (this.healthInsuranceForm.value.othersCoveredOnPlan.length == 0) {
          this.healthInsuranceForm.controls['newOthersCoveredOnPlan'].setValidators([
            Validators.required,
          ]);
          this.healthInsuranceForm.controls['newOthersCoveredOnPlan'].updateValueAndValidity();
        }
      }
      if(this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value == 'Y' 
      || this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value == 'N'){
        this.healthInsuranceForm.controls['policyHolderFirstName'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['policyHolderFirstName'].updateValueAndValidity();
        this.healthInsuranceForm.controls['policyHolderLastName'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['policyHolderLastName'].updateValueAndValidity();
      }
      else{
        this.healthInsuranceForm.controls['policyHolderFirstName'].setValidators(null);
        this.healthInsuranceForm.controls['policyHolderFirstName'].updateValueAndValidity();
        this.healthInsuranceForm.controls['policyHolderLastName'].setValidators(null);
        this.healthInsuranceForm.controls['policyHolderLastName'].updateValueAndValidity();
      }
    }
    if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value == StatusFlag.Yes && this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value == StatusFlag.Yes
    && this.ddlInsuranceType === this.InsurancePlanTypes.Medicare && this.medicareInsuranceInfoCheck ) {
      this.healthInsuranceForm.controls['policyHolderFirstName'].setValidators([
        Validators.required,
      ]);
      this.healthInsuranceForm.controls['policyHolderFirstName'].updateValueAndValidity();
      this.healthInsuranceForm.controls['policyHolderLastName'].setValidators([
        Validators.required,
      ]);
      this.healthInsuranceForm.controls['policyHolderLastName'].updateValueAndValidity();
    }
    if (this.ddlInsuranceType !== this.InsurancePlanTypes.OregonHealthPlan && this.ddlInsuranceType !== this.InsurancePlanTypes.Veterans) {
      if(this.medicareInsuranceInfoCheck)
      {
        this.isInsuranceFileUploaded = (this.copyOfInsuranceCardFiles?.length > 0 && !!this.copyOfInsuranceCardFiles[0].name) ? true : false;
        if(!this.isInsuranceFileUploaded){
          this.insuranceCardFilesExceedsFileSizeLimit =false;
        }
      }
      if (this.healthInsuranceForm.value.careassistPayingPremiumFlag == 'Y'
        && this.ddlInsuranceType !== this.InsurancePlanTypes.Cobra
        && this.ddlInsuranceType !== this.InsurancePlanTypes.GroupInsurancePlan) {
        this.isProofFileUploaded = (this.proofOfPremiumFiles?.length > 0 && !!this.proofOfPremiumFiles[0].name) ? true : false;
        if(!this.isProofFileUploaded){
          this.proofOfPremiumExceedsFileSizeLimit = false;
        }
      }
      if(this.ddlInsuranceType === this.InsurancePlanTypes.Cobra || this.ddlInsuranceType === this.InsurancePlanTypes.GroupInsurancePlan){
        this.isSummaryFileUploaded = (this.copyOfSummaryFiles?.length > 0 && !!this.copyOfSummaryFiles[0].name) ? true : false;
        if(!this.isSummaryFileUploaded){
          this.summaryFilesExceedsFileSizeLimit = false;
        }
      }
      if (this.ddlInsuranceType === this.InsurancePlanTypes.Medicare && this.healthInsuranceForm.value.onLisFlag == StatusFlag.Yes)
      {
        this.isMedicareCardFileUploaded = (this.copyOfMedicareCardFiles?.length > 0 && !!this.copyOfMedicareCardFiles[0].name) ? true : false;
        if(!this.isMedicareCardFileUploaded){
          this.medicareCardFilesExceedsFileSizeLimit = false;
        }
      }

    }
  }

  private resetValidators() {
    Object.keys(this.healthInsuranceForm.controls).forEach((key: string) => {
        this.healthInsuranceForm.controls[key].removeValidators(Validators.required);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
    });
  }
  private resetData() {      
    this.handleFileRemoved(this.copyOfMedicareCardFiles,'medicareCard');
    this.handleFileRemoved(this.copyOfInsuranceCardFiles,'copyInsurance');
    this.handleFileRemoved(this.copyOfInsuranceCardFiles,'summary');
    this.handleFileRemoved(this.proofOfPremiumFiles,'proof');
    if (this.healthInsuranceForm.controls !== null && Object.keys(this.healthInsuranceForm.controls).length > 0) {
      Object.keys(this.healthInsuranceForm.controls).forEach((key: string) => {
        if (key !== 'insuranceType' && key !== 'clientInsurancePolicyId' && key !== "othersCoveredOnPlan" && key !== "newOthersCoveredOnPlan") {
          this.healthInsuranceForm.controls[key].setValue(null);
          this.healthInsuranceForm.controls[key].updateValueAndValidity();
        }
      });

    }
    this.isSummaryFileUploaded = true;
    this.isProofFileUploaded = true;
    this.isInsuranceFileUploaded = true;
    this.isMedicareCardFileUploaded = true;
  }

  private populateInsurancePolicy() {
    {
      this.healthInsurancePolicy = new healthInsurancePolicy();
      this.healthInsurancePolicy.clientId = this.clientId;
      this.healthInsurancePolicy.clientCaseEligibilityId =this.clientCaseEligibilityId;
      this.healthInsurancePolicy.activeFlag = StatusFlag.Yes;
      this.healthInsurancePolicy.healthInsuranceTypeCode = this.ddlInsuranceType;

      /* these field will be removed when the columns are allwed null from the database */
      this.healthInsurancePolicy.premiumFrequencyCode = "";
      this.healthInsurancePolicy.oonDrugs = "";
      this.healthInsurancePolicy.oonPharmacy = "";
      this.healthInsurancePolicy.clientMaximumId = 'C8D095E5-5C5B-44A3-A6BA-379282AC1BFF';
      /* End for default values */

      if (this.ddlInsuranceType === HealthInsurancePlan.Veterans) return;
      this.healthInsurancePolicy.insuranceCarrierId = this.healthInsuranceForm.controls['insuranceCarrierName'].value;
      this.healthInsurancePolicy.insurancePlanId =
        this.healthInsuranceForm.controls['insurancePlanName'].value;
      this.healthInsurancePolicy.insuranceIdNbr =
        this.healthInsuranceForm.controls['insuranceIdNumber'].value;
      this.healthInsurancePolicy.insuranceGroupPlanTypeCode = this.healthInsuranceForm.controls['groupPlanType'].value;

      this.healthInsurancePolicy.metalLevelCode =
        this.healthInsuranceForm.controls['metalLevel'].value?.lovCode;
      if (this.healthInsuranceForm.controls['insuranceStartDate'].value !== null) {
        this.healthInsurancePolicy.startDate = new Date(this.intl.formatDate(this.healthInsuranceForm.controls['insuranceStartDate'].value, this.dateFormat));
      }
      else {
        this.healthInsurancePolicy.startDate = null
      }

      if (this.healthInsuranceForm.controls['insuranceEndDate'].value !== null) {
        this.healthInsurancePolicy.endDate = new Date(this.intl.formatDate(this.healthInsuranceForm.controls['insuranceEndDate'].value, this.dateFormat));
      }
      else {
        this.healthInsurancePolicy.endDate = null;
      }
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === StatusFlag.Yes) {
        this.healthInsurancePolicy.careassistPayingPremiumFlag = StatusFlag.Yes;
        this.healthInsurancePolicy.premiumPaidThruDate =
          this.healthInsuranceForm.controls["premiumPaidThruDate"].value === null ? null :
            new Date(this.intl.formatDate(this.healthInsuranceForm.controls['premiumPaidThruDate'].value, this.dateFormat));

        this.healthInsurancePolicy.premiumFrequencyCode = this.healthInsuranceForm.controls["premiumFrequencyCode"].value;
        this.healthInsurancePolicy.nextPremiumDueDate = this.healthInsuranceForm.controls["nextPremiumDueDate"].value === null ? null :
          new Date(this.intl.formatDate(this.healthInsuranceForm.controls['nextPremiumDueDate'].value, this.dateFormat));

        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value === true ? StatusFlag.Yes : this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value === false ? StatusFlag.No : null;
        this.healthInsurancePolicy.paymentIdNbr = this.healthInsuranceForm.controls["paymentIdNbr"].value;
        this.healthInsurancePolicy.premiumAmt = this.healthInsuranceForm.controls["premiumAmt"].value;
      }
      else if(this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === StatusFlag.No){
        this.healthInsurancePolicy.careassistPayingPremiumFlag = StatusFlag.No;
      }
      else
      {
        this.healthInsurancePolicy.careassistPayingPremiumFlag = null;
      }
      if(this.healthInsuranceForm.controls['aptcFlag'].value)
      {
        this.healthInsurancePolicy.aptcCode = this.healthInsuranceForm.controls['aptcFlag'].value.trim();
      }
      if (
        this.healthInsuranceForm.controls['aptcFlag'].value === 'NO'
      ) {
        this.healthInsurancePolicy.aptcNotTakingFlag = this.healthInsuranceForm.controls['aptcFlag'].value;
      } else if(this.healthInsurancePolicy.aptcCode==='YES'){
        this.healthInsurancePolicy.aptcMonthlyAmt = this.healthInsuranceForm.controls['aptcMonthlyAmt'].value
      }
      this.healthInsurancePolicy.isClientPolicyHolderFlag = null;
      this.healthInsurancePolicy.medicareBeneficiaryIdNbr = this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].value;
      this.healthInsurancePolicy.medicareCoverageTypeCode = this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value;
      if (this.healthInsuranceForm.controls['medicarePartAStartDate'].value !== null) {

        this.healthInsurancePolicy.medicarePartAStartDate = new Date(this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartAStartDate'].value, this.dateFormat));
      }
      else {
        this.healthInsurancePolicy.medicarePartAStartDate = null;
      }
      if (this.healthInsuranceForm.controls['medicarePartBStartDate'].value !== null) {
        this.healthInsurancePolicy.medicarePartBStartDate = new Date(this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartBStartDate'].value, this.dateFormat));
      }
      else {
        this.healthInsurancePolicy.medicarePartBStartDate = null;
      }
      if (this.healthInsuranceForm.controls['onQmbFlag'].value === true) {
        this.healthInsurancePolicy.onQmbFlag = StatusFlag.Yes;
      }
      else if (this.healthInsuranceForm.controls['onQmbFlag'].value === false) {
        this.healthInsurancePolicy.onQmbFlag = StatusFlag.No;
      }
      else {
        this.healthInsurancePolicy.onQmbFlag = null;
      }

      if (
        this.healthInsuranceForm.controls['onLisFlag'].value !== StatusFlag.Yes
      ) {
        this.healthInsurancePolicy.onLisFlag = this.healthInsuranceForm.controls['onLisFlag'].value;
      } else {
        this.healthInsurancePolicy.onLisFlag = StatusFlag.Yes;
      }
      (this.healthInsurancePolicy.paymentGroupNumber = 0),
        (this.healthInsurancePolicy.oonException = 0),
        (this.healthInsurancePolicy.oonStartDate = new Date());
      this.healthInsurancePolicy.oonEndDate = new Date();
      this.healthInsurancePolicy.oonPharmacy = 'string';
      this.healthInsurancePolicy.oonDrugs = 'string';
      this.healthInsurancePolicy.othersCoveredOnPlanFlag = this.healthInsuranceForm.value.othersCoveredOnPlanFlag;
      this.healthInsurancePolicy.othersCoveredOnPlan = this.healthInsuranceForm.value.othersCoveredOnPlan;
      if (this.healthInsuranceForm.value.newOthersCoveredOnPlan.length > 0) {
        this.healthInsuranceForm.value.newOthersCoveredOnPlan.forEach((x: any) => {
          x.relationshipCode = this.relationshipList.filter(
            (y: any) => y.lovDesc == x.relationshipDescription)[0].lovCode;
        });
        this.healthInsurancePolicy.othersCoveredOnPlan.push(...this.healthInsuranceForm.value.newOthersCoveredOnPlan);
      }
      this.healthInsuranceForm.value.othersCoveredOnPlan.forEach((person: any) => {
        person.enrolledInInsuranceFlag = !!person.enrolledInInsuranceFlag ? StatusFlag.Yes : StatusFlag.No;
      })
      this.healthInsurancePolicy.isClientPolicyHolderFlag = this.healthInsuranceForm.value.isClientPolicyHolderFlag;
      this.healthInsurancePolicy.policyHolderFirstName = this.healthInsuranceForm.value.policyHolderFirstName;
      this.healthInsurancePolicy.policyHolderLastName = this.healthInsuranceForm.value.policyHolderLastName;

      if (this.copyOfInsuranceCardFiles?.length > 0 && this.copyOfInsuranceCardFiles[0].uid == "") {
        this.healthInsurancePolicy.copyOfInsuranceCardFile = this.copyOfInsuranceCardFiles[0].document.rawFile;
        this.healthInsurancePolicy.copyOfInsuranceCardFileName = this.copyOfInsuranceCardFiles[0].name;
        this.healthInsurancePolicy.copyOfInsuranceCardFileSize = this.copyOfInsuranceCardFiles[0].size;
        this.healthInsurancePolicy.copyOfInsuranceCardFileTypeCode = this.cICTypeCode;
        this.healthInsurancePolicy.copyOfInsuranceCardFileId = this.copyOfInsuranceCardFiles[0].uid;
      }
      else if (this.copyOfInsuranceCardFiles?.length > 0 && this.copyOfInsuranceCardFiles[0].uid != "") {
        this.healthInsurancePolicy.copyOfInsuranceCardFile = this.healthInsurancePolicyCopy.copyOfInsuranceCardFile;
        this.healthInsurancePolicy.copyOfInsuranceCardFileName = this.healthInsurancePolicyCopy.copyOfInsuranceCardFileName;
        this.healthInsurancePolicy.copyOfInsuranceCardFileSize = this.healthInsurancePolicyCopy.copyOfInsuranceCardFileSize;
        this.healthInsurancePolicy.copyOfInsuranceCardFileTypeCode = this.cICTypeCode;
        this.healthInsurancePolicy.copyOfInsuranceCardFileId = this.healthInsurancePolicyCopy.copyOfInsuranceCardFileId;
      }
      if (this.proofOfPremiumFiles?.length > 0 && this.proofOfPremiumFiles[0].uid == "") {
        this.healthInsurancePolicy.proofOfPremiumFile = this.proofOfPremiumFiles[0].document.rawFile;
        this.healthInsurancePolicy.proofOfPremiumFileName = this.proofOfPremiumFiles[0].name;
        this.healthInsurancePolicy.proofOfPremiumFileSize = this.proofOfPremiumFiles[0].size;
        this.healthInsurancePolicy.proofOfPremiumFileTypeCode = this.pOPTypeCode;
        this.healthInsurancePolicy.proofOfPremiumFileId = this.proofOfPremiumFiles[0].uid;
      }
      else if (this.proofOfPremiumFiles?.length > 0 && this.proofOfPremiumFiles[0].uid != "") {
        this.healthInsurancePolicy.proofOfPremiumFile = this.healthInsurancePolicyCopy.proofOfPremiumFile;
        this.healthInsurancePolicy.proofOfPremiumFileName = this.healthInsurancePolicyCopy.proofOfPremiumFileName;
        this.healthInsurancePolicy.proofOfPremiumFileSize = this.healthInsurancePolicyCopy.proofOfPremiumFileSize;
        this.healthInsurancePolicy.proofOfPremiumFileTypeCode = this.pOPTypeCode;
        this.healthInsurancePolicy.proofOfPremiumFileId = this.healthInsurancePolicyCopy.proofOfPremiumFileId;
      }
      if (this.copyOfSummaryFiles?.length > 0 && this.copyOfSummaryFiles[0].uid == "") {
        this.healthInsurancePolicy.copyOfSummaryFile = this.copyOfSummaryFiles[0].document.rawFile;
        this.healthInsurancePolicy.copyOfSummaryFileName = this.copyOfSummaryFiles[0].name;
        this.healthInsurancePolicy.copyOfSummaryFileSize = this.copyOfSummaryFiles[0].size;
        this.healthInsurancePolicy.copyOfSummaryFileTypeCode = this.cOSTypeCode;
        this.healthInsurancePolicy.copyOfSummaryFileId = this.copyOfSummaryFiles[0].uid;
      }
      else if (this.copyOfSummaryFiles?.length > 0 && this.copyOfSummaryFiles[0].uid != "") {
        this.healthInsurancePolicy.copyOfSummaryFile = this.healthInsurancePolicyCopy.copyOfSummaryFile;
        this.healthInsurancePolicy.copyOfSummaryFileName = this.healthInsurancePolicyCopy.copyOfSummaryFileName;
        this.healthInsurancePolicy.copyOfSummaryFileSize = this.healthInsurancePolicyCopy.copyOfSummaryFileSize;
        this.healthInsurancePolicy.copyOfSummaryFileTypeCode = this.cOSTypeCode;
        this.healthInsurancePolicy.copyOfSummaryFileId = this.healthInsurancePolicyCopy.copyOfSummaryFileId;
      }

      if (this.copyOfMedicareCardFiles?.length > 0 && this.copyOfMedicareCardFiles[0].uid == "") {
        this.healthInsurancePolicy.medicareCardFile = this.copyOfMedicareCardFiles[0].document.rawFile;
        this.healthInsurancePolicy.medicareCardFileName = this.copyOfMedicareCardFiles[0].name;
        this.healthInsurancePolicy.medicareCardFileSize = this.copyOfMedicareCardFiles[0].size;
        this.healthInsurancePolicy.medicareCardFileTypeCode = 'CMC';
        this.healthInsurancePolicy.medicareCardFileId = this.copyOfMedicareCardFiles[0].uid;
      }
      else if (this.copyOfMedicareCardFiles?.length > 0 && this.copyOfMedicareCardFiles[0].uid != "") {
        this.healthInsurancePolicy.medicareCardFile = this.healthInsurancePolicyCopy.medicareCardFile;
        this.healthInsurancePolicy.medicareCardFileName = this.healthInsurancePolicyCopy.medicareCardFileName;
        this.healthInsurancePolicy.medicareCardFileSize = this.healthInsurancePolicyCopy.medicareCardFileSize;
        this.healthInsurancePolicy.medicareCardFileTypeCode = 'CMC';
        this.healthInsurancePolicy.medicareCardFileId = this.healthInsurancePolicyCopy.copyOfSummaryFileId;
      }
      if(!this.medicareInsuranceInfoCheck && this.ddlInsuranceType === HealthInsurancePlan.Medicare )
      {
        this.healthInsurancePolicy.careassistPayingPremiumFlag = null;
        this.healthInsurancePolicy.premiumPaidThruDate = null
        this.healthInsurancePolicy.premiumFrequencyCode = null;
        this.healthInsurancePolicy.nextPremiumDueDate = null
        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = null;
        this.healthInsurancePolicy.paymentIdNbr = null;
        this.healthInsurancePolicy.premiumAmt = null;
        this.healthInsurancePolicy.insuranceCarrierId = null;
        this.healthInsurancePolicy.insurancePlanId = null;
        this.healthInsurancePolicy.insuranceIdNbr = null;
        this.healthInsurancePolicy.startDate = null;
        this.healthInsurancePolicy.endDate = null;
        this.healthInsurancePolicy.othersCoveredOnPlanFlag = null;
        this.healthInsurancePolicy.isClientPolicyHolderFlag = null;
        this.healthInsurancePolicy.policyHolderFirstName = null;
        this.healthInsurancePolicy.policyHolderLastName = null;
      }
    }
  }
  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.resetData();
    this.resetValidators();
    this.ddlInsuranceType =
      this.healthInsuranceForm.controls['insuranceType'].value;
    this.isOpenDdl = true;
    if (this.ddlInsuranceType === HealthInsurancePlan.Medicare) {
      this.medicareInsuranceInfoCheck = false;
    }
    else {
      this.medicareInsuranceInfoCheck = true;
    }
    if((this.ddlInsuranceType === this.InsurancePlanTypes.QualifiedHealthPlan
      || this.ddlInsuranceType === this.InsurancePlanTypes.OffExchangePlan) 
      && (this.dialogTitle === 'Add')) {
        this.familyAndDependentFacade.loadClientDependents(this.clientId);
        this.loadClientDependents();
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
    let personForm = this.formBuilder.group({
      relationshipDescription: new FormControl(''),
      relationshipCode: new FormControl(''),
      firstName: new FormControl('', Validators.maxLength(40)),
      lastName: new FormControl('', Validators.maxLength(40)),
      dob: new FormControl(),
      enrolledInInsuranceFlag: new FormControl(true),
    });
    this.newOthersCoveredOnPlan.push(personForm);
  }

  removePerson(i: number) {
    this.newOthersCoveredOnPlan.removeAt(i);
  }

  getPersonControl(index: number, fieldName: string) {
    return (<FormArray>this.healthInsuranceForm.get('newOthersCoveredOnPlan')).at(index).get(fieldName);
  }

  insuranceCarrierNameData(data: any) {
    if (this.isEdit) {
      this.healthInsuranceForm.controls['insuranceCarrierName'].setValue(
        this.healthInsurancePolicyCopy.insuranceCarrierId
      );
    }
  }
  onSameAsInsuranceIdValueChange(event: Event) {
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
        this.loaderService.hide();
        if (err) {
          this.insurancePolicyFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
          this.insurancePolicyFacade.hideLoader();
        }
      },
    });
  }
  onMedicareCoverageTypeChanged() {
    if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("P") || this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("M")) {
      this.medicareInsuranceInfoCheck = true;
    }
    else {
      this.medicareInsuranceInfoCheck = false;
    }
    const PartAenum = Object.keys(PartAMedicareType)
    if (PartAenum.includes(this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value)) {
      this.partAStartDateCheck = true;
    }
    else {
      this.partAStartDateCheck = false;
    }
    const PartBenum = Object.keys(PartBMedicareType)
    if (PartBenum.includes(this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value)) {
      this.partBDtartDateCheck = true;
    }
    else {
      this.partBDtartDateCheck = false;
    }
  }
  save() {
    this.validateForm();
    if (this.healthInsuranceForm.valid && this.isInsuranceFileUploaded && this.isProofFileUploaded && this.isSummaryFileUploaded && this.isMedicareCardFileUploaded) {
      this.populateInsurancePolicy();
      this.insurancePolicyFacade.showLoader();
      if (this.isEdit) {
        this.healthInsurancePolicy.clientInsurancePolicyId =
          this.healthInsuranceForm.controls['clientInsurancePolicyId'].value;
        this.healthInsurancePolicy.creationTime = this.healthInsurancePolicyCopy.creationTime;
        this.insurancePolicyFacade
          .updateHealthInsurancePolicy(this.healthInsurancePolicy)
          .subscribe(
            (data: any) => {
              this.insurancePolicyFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Insurance plan updated successfully.'
              );
              this.onModalCloseClicked();
              this.insurancePolicyFacade.hideLoader();
            },
            (error: any) => {
              if (error) {
                this.insurancePolicyFacade.showHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error
                );
                this.insurancePolicyFacade.hideLoader();
              }
            }
          );
      } else {
        this.healthInsurancePolicy.creationTime = new Date();
        this.insurancePolicyFacade
          .saveHealthInsurancePolicy(this.healthInsurancePolicy)
          .subscribe(
            (data: any) => {
              this.insurancePolicyFacade.showHideSnackBar(
                SnackBarNotificationType.SUCCESS,
                'Insurance plan updated successfully.'
              );
              this.onModalCloseClicked();
              this.insurancePolicyFacade.hideLoader();
            },
            (error: any) => {
              if (error) {
                this.insurancePolicyFacade.showHideSnackBar(
                  SnackBarNotificationType.ERROR,
                  error
                );
                this.insurancePolicyFacade.hideLoader();
              }
            }
          );
      }
    }
  }

  onDeleteClick() {
    this.isDeleteClicked.next(true);
  }

  disableEnableRadio() {
    if (this.isViewContentEditable) {
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].disable();
      this.healthInsuranceForm.controls["groupPlanType"].disable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].disable();
      this.healthInsuranceForm.controls["onQmbFlag"].disable();
      this.healthInsuranceForm.controls["onLisFlag"].disable();
      this.healthInsuranceForm.controls["othersCoveredOnPlanFlag"].disable();
      this.healthInsuranceForm.controls["othersCoveredOnPlan"].disable();
      this.healthInsuranceForm.controls["isClientPolicyHolderFlag"].disable();
    }
    else {
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].enable();
      this.healthInsuranceForm.controls["groupPlanType"].enable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].enable();
      this.healthInsuranceForm.controls["onQmbFlag"].enable();
      this.healthInsuranceForm.controls["onLisFlag"].enable();
      this.healthInsuranceForm.controls["othersCoveredOnPlanFlag"].enable();
      this.healthInsuranceForm.controls["othersCoveredOnPlan"].enable();
      this.healthInsuranceForm.controls["isClientPolicyHolderFlag"].enable();
    }
  }

  startDateOnChange() {
    if(this.healthInsuranceForm.controls['insuranceEndDate'].value !== null){
      this.endDateOnChange();
    }
  }
  changeMinDate(){
    this.endDateMin = this.healthInsuranceForm.controls['insuranceStartDate'].value;
  }

  endDateOnChange() {
    this.insuranceEndDateIsgreaterthanStartDate = true;
    if (this.healthInsuranceForm.controls['insuranceStartDate'].value === null) {
      this.snackbarService.errorSnackBar('Insurance Start Date required.');
      this.healthInsuranceForm.controls['insuranceEndDate'].setValue(null);
      return;
     }
    else if( this.healthInsuranceForm.controls['insuranceEndDate'].value !== null){
      var startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['insuranceStartDate'].value
        )
      );
        var endDate = this.intl.parseDate(
          Intl.DateTimeFormat('en-US').format(
            this.healthInsuranceForm.controls['insuranceEndDate'].value
          )
        );
      
      if (startDate > endDate) {
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors({ 'incorrect': true });
        this.insuranceEndDateIsgreaterthanStartDate = false;
      }
      else{
        this.insuranceEndDateIsgreaterthanStartDate = true;       
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors(null);       
        this.endDateMin = this.healthInsuranceForm.controls['insuranceStartDate'].value;
      }
    }
  }
  endDateValueChange(date:Date){
    this.insuranceEndDateIsgreaterthanStartDate = false;

  }
  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

  public handleFileSelected(event: any, fileType: string) {
    this.documentSizeValidator=false;
    if (fileType == 'proof') {
      this.proofOfPremiumExceedsFileSizeLimit=false;
      this.proofOfPremiumFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isProofFileUploaded = true;
      if (this.proofOfPremiumFiles[0].size>this.uploadFileSizeLimit)
      {
        this.handleFileRemoved(this.proofOfPremiumFiles,'proof');
        this.proofOfPremiumExceedsFileSizeLimit=true;
      }
    }
    else if (fileType == 'summary') {
      this.summaryFilesExceedsFileSizeLimit=false;
      this.copyOfSummaryFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isSummaryFileUploaded = true;
      if (this.copyOfSummaryFiles[0].size>this.uploadFileSizeLimit)
      {
        this.handleFileRemoved(this.copyOfInsuranceCardFiles,'summary');
        this.summaryFilesExceedsFileSizeLimit=true;       
      }
    }
    else if (fileType == 'copyInsurance') {
      this.insuranceCardFilesExceedsFileSizeLimit=false;
      this.copyOfInsuranceCardFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isInsuranceFileUploaded = true;
      if (this.copyOfInsuranceCardFiles[0].size>this.uploadFileSizeLimit)
      {       
        this.handleFileRemoved(this.copyOfInsuranceCardFiles,'copyInsurance');
        this.insuranceCardFilesExceedsFileSizeLimit=true;
      }
    }
    else if (fileType == 'medicareCard') {
      this.medicareCardFilesExceedsFileSizeLimit=false;
      this.copyOfMedicareCardFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isMedicareCardFileUploaded = true;
      if (this.copyOfMedicareCardFiles[0].size>this.uploadFileSizeLimit)
      {
        this.handleFileRemoved(this.copyOfMedicareCardFiles,'medicareCard');
        this.medicareCardFilesExceedsFileSizeLimit=true;
      }
    }
  }

  public handleFileRemoved(files: any, fileType: string) {
    if (files?.length > 0 && !!files[0].uid) {
      this.insurancePolicyFacade.showLoader();
      this.clientDocumentFacade.removeDocument(files[0].uid ?? '').subscribe({
        next: (response) => {
          if (response === true) {
            this.snackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, "Document Removed Successfully!");
            if (fileType == 'proof') {
              this.proofOfPremiumFiles = [];
              this.isProofFileUploaded = false;
            }
            else if (fileType == 'summary') {
              this.copyOfSummaryFiles = [];
              this.isSummaryFileUploaded = false;
            }
            else if (fileType == 'copyInsurance') {
              this.copyOfInsuranceCardFiles = [];
              this.isInsuranceFileUploaded = false;
            }
            else if (fileType == 'medicareCard') {
              this.copyOfMedicareCardFiles = [];
              this.isMedicareCardFileUploaded = false;
            }
          }
          this.insurancePolicyFacade.hideLoader();
        },
        error: (err) => {
          this.loggingService.logException(err);
          this.insurancePolicyFacade.hideLoader();
        },
      });
    }
    else {
      if (fileType == 'proof') {
        this.proofOfPremiumFiles = [];
        this.isProofFileUploaded = false;
      }
      else if (fileType == 'summary') {
        this.copyOfSummaryFiles = [];
        this.isSummaryFileUploaded = false;
      }
      else if (fileType == 'copyInsurance') {
        this.copyOfInsuranceCardFiles = [];
        this.isInsuranceFileUploaded = false;
      }
      else if (fileType == 'medicareCard') {
        this.copyOfMedicareCardFiles = [];
        this.isMedicareCardFileUploaded = false;
      }
    }
  }

  viewOrDownloadFile(type: string, clientDocumentId: string, documentName: string) {
    if (clientDocumentId && clientDocumentId != '' && (this.isEditViewPopup || this.isEdit)) {
      this.loaderService.show()
      this.clientDocumentFacade.getClientDocumentsViewDownload(clientDocumentId).subscribe((data: any) => {
        const fileUrl = window.URL.createObjectURL(data);
        if (type === 'download') {
          const downloadLink = document.createElement('a');
          downloadLink.href = fileUrl;
          downloadLink.download = documentName;
          downloadLink.click();
        } else {
          window.open(fileUrl, "_blank");
        }
        this.loaderService.hide();
      }, (error) => {
        this.loaderService.hide();
        this.healthFacade.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
      })
    }
  }
}
