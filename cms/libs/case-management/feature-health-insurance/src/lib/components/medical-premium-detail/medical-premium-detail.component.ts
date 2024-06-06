/** Angular **/
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  HealthInsurancePolicyFacade,
  HealthInsurancePolicy,
  CarrierContactInfo,
  InsurancePlanFacade,
  HealthInsurancePlan,
  DependentTypeCode,
  PriorityCode,
  InsuranceStatusType,
  FinancialVendorFacade,
  InsuranceTypeCode,
  MedicareCoverageType
} from '@cms/case-management/domain';
import { FinancialVendorTypeCode, StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Lov, LovFacade, LovType, UserManagementFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService, NotificationSource } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  currentDate = new Date();
  buttonText: string = 'Add';
  clientCaseId: any;

  proofOfPremiumFiles: any;
  copyOfSummaryFiles: any;
  copyOfInsuranceCardFiles: any;
  copyOfMedicareCardFiles: any
  lengthRestrictForty = 40;
  isaddNewInsurancePlanOpen: boolean = false;
  specialCharAdded: boolean = false;
  documentTypeCode!: string;
  public uploadRemoveUrl = 'removeUrl';
  public uploadFileRestrictions: UploadFileRistrictionOptions = new UploadFileRistrictionOptions();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uploadFileSizeLimit = this.configurationProvider.appSettings.uploadFileSizeLimit;
  btnDisabled = false;
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;
  @Input() healthInsuranceForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() medicalHealthPlansCount: any;
  @Input() insuranceStatus: any;
  @Input() isPaymentDone: any;
  @Input() insuranceTypeList$: any;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();
  @Output() isDeleteClicked = new EventEmitter<any>();
  @Output() isAddEditClicked = new EventEmitter<any>();
  @Output() isAddPriority = new EventEmitter<any>();
  @Output() getPoliciesEventEmitter = new EventEmitter<any>();

  hasInsurancePlanCreateUpdatePermission: boolean = false;

  /** Private properties **/
  private editViewSubscription!: Subscription;
  private dentalInsuranceSubscription!: Subscription;
  private policySubscription!: Subscription;

  /** Public properties **/
  sameAsInsuranceIdFlag = false;
  partAStartDateCheck = false;
  partBDtartDateCheck = false;
  medicareInsuranceInfoCheck = true;
  isInsuranceTypeLoading = true;
  carrierContactInfo = new CarrierContactInfo();
  medicareCoverageTypeList$ = this.lovFacade.medicareCoverageType$;
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.insurancePolicyFacade.ddlMedicalHealthPalnPremiumFrequecy$;
  ddlInsuranceType!: string;
  InsurancePlanTypes: typeof HealthInsurancePlan = HealthInsurancePlan;
  isEditViewPopup!: boolean;
  isReviewPopup!: boolean;
  isCopyPopup!: boolean;
  isEdit!: boolean;
  isDeleteEnabled!: boolean;
  isSubmitted: boolean = false;
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  removedPersons: any = [];
  isOpenDdl = false;
  insurancePlans: Array<any> = [];
  insurancePlansLoader: boolean = false;
  healthInsurancePolicy!: HealthInsurancePolicy;
  healthInsurancePolicyCopy!: HealthInsurancePolicy;
  metalLevelDefaultValue: any = {};
  insurancePlanNameDefaultValue: string | null = null;
  insuranceEndDateValid: boolean = true;
  dateFormat = this.configurationProvider.appSettings.dateFormat;

  relationshipList: any = [];
  sessionId: any;
  cICTypeCode: string = "";
  pOPTypeCode: string = "";
  cOSTypeCode: string = "";
  medicareTypeCode: string = "";
  isInsuranceFileUploaded: boolean = true;
  isProofFileUploaded: boolean = true;
  isSummaryFileUploaded: boolean = true;
  isMedicareCardFileUploaded: boolean = true
  documentSizeValidator = false;
  proofOfPremiumExceedsFileSizeLimit = false;
  summaryFilesExceedsFileSizeLimit = false;
  insuranceCardFilesExceedsFileSizeLimit = false;
  medicareCardFilesExceedsFileSizeLimit = false;
  insuranceStartDateIslessthanEndDate: boolean = true;
  insuranceEndDateIsgreaterthanStartDate: boolean = false;
  endDateMin!: Date;
  medicareEndDateMin!:Date;
  dentalInsuranceSelectedItem = 'DENTAL_INSURANCE';
  selectedClaimType = FinancialVendorTypeCode.MedicalProviders;
  insuranceTypeCode = InsuranceTypeCode.Medical;

  /** Constructor **/
  constructor(
    private readonly elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private lovFacade: LovFacade,
    private insurancePlanFacade: InsurancePlanFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private changeDetector: ChangeDetectorRef,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private financialVendorFacade: FinancialVendorFacade,
    private userManagementFacade: UserManagementFacade,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.validateFormMode();
    this.getPolicySubscription();
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
      this.insuranceTypeCode = InsuranceTypeCode.Dental;
      this.selectedClaimType = FinancialVendorTypeCode.DentalProviders;
    }
    else {
       this.loadHealthInsuranceLovs();
    }
    this.viewSelection();

    this.disableEnableRadio();
    this.loadHealthInsuranceProofCodes();
    this.healthInsuranceForm.controls["insuranceIdNumber"].valueChanges.subscribe(selectedValue => {
      if (this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].value) {
        this.healthInsuranceForm.controls['paymentIdNbr'].setValue(selectedValue);
      }
    });
    this.isInsuranceTypeLoading = false;

    this.hasInsurancePlanCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Insurance_Plan_Create_Update']);
  }
 
  ngOnDestroy(): void {
    if (this.editViewSubscription !== undefined) {
      this.editViewSubscription.unsubscribe();
    }
    if (this.dentalInsuranceSubscription !== undefined) {
      this.dentalInsuranceSubscription.unsubscribe();
    }
    this.policySubscription.unsubscribe();
  }

  ngAfterViewInit() {
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
      this.healthInsuranceForm.controls['insuranceType'].setValue(this.dentalInsuranceSelectedItem);
      this.onHealthInsuranceTypeChanged();
      this.healthInsuranceForm.controls["insuranceType"].disable();
      this.changeDetector.detectChanges();
    }
  }

  /** Private methods **/

  private loadHealthInsuranceLovs() {
    this.lovFacade.getHealthInsuranceTypeLovsForPlan();
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
  private viewSelection() {
    this.isToggleNewPerson = false;
    switch (this.dialogTitle) {
      case 'View':
        this.isEditViewPopup = true;
        this.isViewContentEditable = true;
        this.isReviewPopup = false;
        this.isCopyPopup = false;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      case 'Add':
        this.isEdit = false;
        this.buttonText = 'Add';
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        this.isReviewPopup = false;
        this.isCopyPopup = false;
        this.resetForm();
        break;
      case 'Edit':
        this.isEdit = true;
        this.buttonText = 'Update';
        this.isDeleteEnabled = true;
        this.isViewContentEditable = false;
        this.isReviewPopup = false;
        this.isCopyPopup = false;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      case 'Review':
        this.isEdit = true;
        this.buttonText = 'Save';
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        this.isReviewPopup = true;
        this.isCopyPopup = false;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      case 'Copy':
        this.isEdit = true;
        this.buttonText = 'Save';
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        this.isReviewPopup = false;
        this.isCopyPopup = true;
        this.resetForm();
        this.loadHealthInsurancePolicy();
        break;
      default:
        break;
    }
  }

  loadHealthInsurancePolicy() {
    this.editViewSubscription = this.insurancePolicyFacade.healthInsurancePolicy$.subscribe((data: any) => {
      this.healthInsurancePolicyCopy = data;
      if (data.insuranceVendorAddressId != null) {
        this.financialVendorFacade.searchProvidorsById(data.insuranceVendorAddressId);
      }
      this.bindValues(data);
    });
  }

  bindValues(healthInsurancePolicy: HealthInsurancePolicy) {
    this.healthInsuranceForm.controls['clientInsurancePolicyId'].setValue(
      healthInsurancePolicy.clientInsurancePolicyId
    );
    this.healthInsuranceForm.controls['insuranceType'].setValue(
      healthInsurancePolicy.healthInsuranceTypeCode
    );
    this.onHealthInsuranceTypeChanged();

    if (!this.isCopyPopup) {
      this.healthInsuranceForm.controls['insuranceStartDate'].setValue(
        healthInsurancePolicy.insuranceStartDate != null ? new Date(healthInsurancePolicy.insuranceStartDate) : null
      );

      this.healthInsuranceForm.controls['insuranceEndDate'].setValue(

        healthInsurancePolicy.insuranceEndDate != null ? new Date(healthInsurancePolicy.insuranceEndDate) : null

      );
    }
    this.healthInsuranceForm.controls['insuranceIdNumber'].setValue(
      healthInsurancePolicy.insuranceIdNbr
    );
    this.healthInsuranceForm.controls['insuranceProviderName'].setValue(
      healthInsurancePolicy.insuranceVendorId
    );

    if (healthInsurancePolicy.insuranceVendorId) {
      this.insuranceCarrierNameChange(healthInsurancePolicy.insuranceVendorId);
    }
    this.healthInsuranceForm.controls['insurancePlanName'].setValue(
      healthInsurancePolicy.insurancePlanId
    );
    this.insurancePlanNameDefaultValue = healthInsurancePolicy.insurancePlanId;
    const metalLevel = { lovCode: healthInsurancePolicy.metalLevelCode };
    this.metalLevelDefaultValue = metalLevel;
    this.healthInsuranceForm.controls['metalLevel'].setValue(metalLevel);
    if (this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan) {
      let aptcCode = healthInsurancePolicy.aptcCode?.trim();
      this.healthInsuranceForm.controls['aptcFlag'].setValue(aptcCode);
    }
    this.healthInsuranceForm.controls['aptcMonthlyAmt'].setValue(
      healthInsurancePolicy.aptcMonthlyAmt
    );
    this.healthInsuranceForm.controls['groupPlanType'].setValue(
      healthInsurancePolicy.insuranceGroupPlanTypeCode
    );
    this.healthInsuranceForm.controls['insuranceGroupId'].setValue(
      healthInsurancePolicy.insuranceGroupId
    );
    this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
      healthInsurancePolicy.careassistPayingPremiumFlag
    );
    this.healthInsuranceForm.controls['insuranceVendorAddressId'].setValue(
      healthInsurancePolicy.insuranceVendorAddressId
    );
    this.bindMedicare(healthInsurancePolicy);

  }

  private bindMedicare(healthInsurancePolicy: HealthInsurancePolicy) {
    if (healthInsurancePolicy.careassistPayingPremiumFlag === StatusFlag.Yes) {
      this.bindPremiumDetails(healthInsurancePolicy);
    }
    else if (healthInsurancePolicy.careassistPayingPremiumFlag === StatusFlag.No) {
      this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].setValue(
        StatusFlag.No
      );
    }
    else {
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

      this.healthInsuranceForm.controls['medicareEndDate'].setValue(
        healthInsurancePolicy.medicareEndDate != null ? new Date(healthInsurancePolicy.medicareEndDate) : null
      );

      this.healthInsuranceForm.controls['onLisFlag'].setValue(
        healthInsurancePolicy.onLisFlag
      );

      this.healthInsuranceForm.controls['onQmbFlag'].setValue(
        healthInsurancePolicy.onQmbFlag
      );

    }
    this.healthInsuranceForm.controls['insuranceVendorAddressId'].setValue(
      healthInsurancePolicy.insuranceVendorAddressId
    );
    this.bindInsurance(healthInsurancePolicy);
  }

  private bindPremiumDetails(healthInsurancePolicy: HealthInsurancePolicy) {

    this.healthInsuranceForm.controls['premiumPaidThruDate'].setValue(
      healthInsurancePolicy.premiumPaidThruDate != null ? new Date(healthInsurancePolicy.premiumPaidThruDate) : null
    );

    this.healthInsuranceForm.controls['nextPremiumDueDate'].setValue(
      healthInsurancePolicy.nextPremiumDueDate != null ? new Date(healthInsurancePolicy.nextPremiumDueDate) : null
    );

    this.healthInsuranceForm.controls['premiumFrequencyCode'].setValue(
      healthInsurancePolicy.premiumFrequencyCode
    );

    if (healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.Yes) {
      this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].setValue(true);
    }
    else if (healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag === StatusFlag.No) {
      this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].setValue(false);
    }
    else {
      this.healthInsuranceForm.controls['paymentIdNbrSameAsInsuranceIdNbrFlag'].setValue(null);
    }

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
    this.healthInsuranceForm.controls['insuranceVendorAddressId'].setValue(
      healthInsurancePolicy.insuranceVendorAddressId
    );
    this.healthInsuranceForm.controls['insuranceTypeCode'].setValue(
      healthInsurancePolicy.insuranceTypeCode
    );
    this.healthInsuranceForm.controls['vendorAddressId'].setValue(
      healthInsurancePolicy.insuranceVendorAddressId
    );
  }

  private bindInsurance(healthInsurancePolicy: HealthInsurancePolicy) {
    if (this.medicareInsuranceInfoCheck || this.ddlInsuranceType === HealthInsurancePlan.GroupInsurancePlan) {
      if (!this.isCopyPopup) {
        this.healthInsuranceForm.controls['insuranceStartDate'].setValue(
          healthInsurancePolicy.insuranceStartDate != null ? new Date(healthInsurancePolicy.insuranceStartDate) : null
        );
        this.healthInsuranceForm.controls['insuranceEndDate'].setValue(
          healthInsurancePolicy.insuranceEndDate != null ? new Date(healthInsurancePolicy.insuranceEndDate) : null
        );
      }
      this.healthInsuranceForm.controls['insuranceIdNumber'].setValue(
        healthInsurancePolicy.insuranceIdNbr
      );

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

    this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].setValue(
      healthInsurancePolicy.isClientPolicyHolderFlag
    );

    this.healthInsuranceForm.controls['policyHolderFirstName'].setValue(
      healthInsurancePolicy.policyHolderFirstName
    )
    this.healthInsuranceForm.controls['policyHolderLastName'].setValue(
      healthInsurancePolicy.policyHolderLastName
    )
    this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].setValue(
      healthInsurancePolicy.othersCoveredOnPlanFlag
    );
    this.setDependentsForm(healthInsurancePolicy);
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

  private setDependentsForm(healthInsurancePolicy: HealthInsurancePolicy) {
    healthInsurancePolicy.othersCoveredOnPlan?.forEach((person: any) => {
      person.enrolledInInsuranceFlag = person.enrolledInInsuranceFlag == StatusFlag.Yes ? true : false;
    })
    let dependents = healthInsurancePolicy.othersCoveredOnPlan.filter((dep: any) => dep.relationshipTypeCode == 'D');
    this.healthInsuranceForm.controls['othersCoveredOnPlanSaved'].setValue(
      dependents
    );
    let healthDependents = healthInsurancePolicy.othersCoveredOnPlan.filter((dep: any) => dep.relationshipTypeCode == 'HEALTH');
    healthDependents.forEach((el: any) => {
      el.dob = new Date(el.dob);
    });
    let healthGroup = !!healthDependents ? healthDependents.map(pe => this.formBuilder.group(pe)) : [];
    let healthForm = this.formBuilder.array(healthGroup);
    this.healthInsuranceForm.setControl('newOthersCoveredOnPlan', healthForm);
  }



  restrictSpecialChar(event: any) {
    const status = ((event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 8 || event.charCode == 32 ||
      (event.charCode >= 48 && event.charCode <= 57) ||
      event.charCode == 45);
    if (status) {
      this.healthInsuranceForm.controls['insuranceIdNumber'].setErrors(null);
      this.specialCharAdded = false;
    }
    else {
      this.healthInsuranceForm.controls['insuranceIdNumber'].setErrors({ 'incorrect': true });
      this.specialCharAdded = true;
    }
    return status;
  }

  get othersCoveredOnPlanNew(): FormArray {
    return this.healthInsuranceForm.get("newOthersCoveredOnPlan") as FormArray;
  }

  getPersonControl(index: number, fieldName: string) {
    return (<FormArray>this.healthInsuranceForm.get('newOthersCoveredOnPlan')).at(index).get(fieldName);
  }
  private validateForm() {
    this.healthInsuranceForm.markAllAsTouched();
    this.resetValidators()
    this.isSummaryFileUploaded = true;
    this.isProofFileUploaded = true;
    this.isInsuranceFileUploaded = true;
    const oregonPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
    ];

    const careassistPayingRequiredFields: Array<string> = [
      'nextPremiumDueDate',
      'premiumAmt',
      'premiumFrequencyCode',
      'paymentIdNbr',
      'insuranceVendorAddressId',
      'isClientPolicyHolderFlag',
      'othersCoveredOnPlanFlag'

    ];
    const policyHolderRequiredFields: Array<string> = [
      'policyHolderFirstName',
      'policyHolderLastName',
    ];

    if (this.ddlInsuranceType === HealthInsurancePlan.OregonHealthPlan) {
      oregonPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
    this.validateQualifiedHealthPlan(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateOffExchangePlan(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateGroupInsurancePlan(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateCobra(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateMedicare(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateDental(careassistPayingRequiredFields, policyHolderRequiredFields);
    this.validateFileSize();
    if (this.ddlInsuranceType === this.InsurancePlanTypes.GroupInsurancePlan || this.ddlInsuranceType === HealthInsurancePlan.Cobra) {
      this.isSummaryFileUploaded = (this.copyOfSummaryFiles?.length > 0 && !!this.copyOfSummaryFiles[0].name) ? true : false;
      if (!this.isSummaryFileUploaded) {
        this.summaryFilesExceedsFileSizeLimit = false;
      }
    }

    this.validateOthersCoveredOnPlan();
    this.validateReview();
  }

  private validateReview() {
    if (this.isReviewPopup && this.ddlInsuranceType != HealthInsurancePlan.Veterans && this.ddlInsuranceType != HealthInsurancePlan.Medicare) {
      this.healthInsuranceForm.controls['insuranceEndDate'].setValidators([Validators.required]);
      this.healthInsuranceForm.controls['insuranceEndDate'].updateValueAndValidity();
    }
  }
  private validateFileSize() {
    const isMedicare = (this.ddlInsuranceType === HealthInsurancePlan.Medicare && this.medicareInsuranceInfoCheck);
    const isCopyOfInsuranceRequired = this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan
      || this.ddlInsuranceType === HealthInsurancePlan.OffExchangePlan
      || this.ddlInsuranceType === HealthInsurancePlan.GroupInsurancePlan
      || this.ddlInsuranceType === HealthInsurancePlan.Cobra
      || isMedicare
      || this.ddlInsuranceType === HealthInsurancePlan.DentalInsurance;

    if (isCopyOfInsuranceRequired) {
      this.checkFileSize();
    }
  }

  private checkFileSize() {
    this.isInsuranceFileUploaded = (this.copyOfInsuranceCardFiles?.length > 0 && !!this.copyOfInsuranceCardFiles[0].name) ? true : false;
    if (!this.isInsuranceFileUploaded) {
      this.insuranceCardFilesExceedsFileSizeLimit = false;
    }

    if (this.healthInsuranceForm.value.careassistPayingPremiumFlag == 'Y') {
      this.isProofFileUploaded = (this.proofOfPremiumFiles?.length > 0 && !!this.proofOfPremiumFiles[0].name) ? true : false;
      if (!this.isProofFileUploaded) {
        this.proofOfPremiumExceedsFileSizeLimit = false;
      }
    }
  }

  private validateOthersCoveredOnPlan() {
    const othersCoveredOnPlanRequiredFields: Array<string> = [
      'relationshipCode',
      'firstName',
      'lastName',
      'dob',
      'relationshipSubTypeCode'
    ];
    if (this.healthInsuranceForm.controls['othersCoveredOnPlanFlag'].value === 'Y') {
      if (this.othersCoveredOnPlanNew.controls.length > 0) {
        for (let index = 0; index < this.othersCoveredOnPlanNew.controls.length; index++) {
          othersCoveredOnPlanRequiredFields.forEach((key: any) => {
            this.getPersonControl(index, key)?.setValidators([
              Validators.required,
            ]);
            this.getPersonControl(index, key)?.updateValueAndValidity();
          });

        }

      }
      const othersCoveredOnPlanSelected = this.healthInsuranceForm.value.othersCoveredOnPlan.filter((x: any) => x.enrolledInInsuranceFlag === true);
      if (this.othersCoveredOnPlanNew.controls.length === 0 && othersCoveredOnPlanSelected.length === 0) {
        this.healthInsuranceForm.controls['othersCoveredOnPlanSelection'].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls['othersCoveredOnPlanSelection'].updateValueAndValidity();
      }
    }
  }

  private validateMedicare(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const medicarePlanRequiredFields: Array<string> = [
      'medicareBeneficiaryIdNbr',
      'medicareCoverageTypeCode',
      'onLisFlag',
    ];

    if (this.ddlInsuranceType === HealthInsurancePlan.Medicare) {

      if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value?.includes('A') === true) {
        medicarePlanRequiredFields.push('medicarePartAStartDate');
      }
      if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value?.includes('B') === true) {
        medicarePlanRequiredFields.push('medicarePartBStartDate');
      }
      if(this.healthInsuranceForm.controls['onLisFlag'].value === StatusFlag.Yes)
      {
        this.isMedicareCardFileUploaded = (this.copyOfMedicareCardFiles?.length > 0 && !!this.copyOfMedicareCardFiles[0].name) ? true : false;
        if (!this.isMedicareCardFileUploaded) {
          this.medicareCardFilesExceedsFileSizeLimit = false;
        }
      }
      this.medicareInsInfoCheck(medicarePlanRequiredFields, careassistPayingRequiredFields, policyHolderRequiredFields);

      medicarePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
  }

  private medicareInsInfoCheck(medicarePlanRequiredFields: any, careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const medicareInsuranceRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'careassistPayingPremiumFlag',
    ];
    if (this.medicareInsuranceInfoCheck) {
      medicarePlanRequiredFields.push(...medicareInsuranceRequiredFields);
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        const index = careassistPayingRequiredFields.indexOf('nextPremiumDueDate');
        if (index > -1) {
          careassistPayingRequiredFields.splice(index, 1);
        }
        medicarePlanRequiredFields.push(...careassistPayingRequiredFields);

        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          medicarePlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }
    }
  }
  private validateDental(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const dentalPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'careassistPayingPremiumFlag'
    ];
    if (this.ddlInsuranceType === HealthInsurancePlan.DentalInsurance) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        dentalPlanRequiredFields.push(...careassistPayingRequiredFields);
        dentalPlanRequiredFields.push('premiumPaidThruDate');
        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          dentalPlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }

      dentalPlanRequiredFields.forEach((key: string) => {
        if (key.trim() === 'insuranceEndDate') {
          if (!this.healthInsuranceForm.controls['insuranceEndDate'].valid) {
            this.insuranceEndDateIsgreaterthanStartDate = false;
          }
          else {
            this.insuranceEndDateIsgreaterthanStartDate = true;
            this.healthInsuranceForm.controls[key].setValidators([
              Validators.required,
            ]);
            this.healthInsuranceForm.controls[key].updateValueAndValidity();
          }

        }
        else {
          this.healthInsuranceForm.controls[key].setValidators([
            Validators.required,
          ]);
          this.healthInsuranceForm.controls[key].updateValueAndValidity();
        }
      });
    }
  }

  private validateCobra(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const cobraPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceEndDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'careassistPayingPremiumFlag'
    ];
    if (this.ddlInsuranceType === HealthInsurancePlan.Cobra) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        cobraPlanRequiredFields.push(...careassistPayingRequiredFields);
        cobraPlanRequiredFields.push('premiumPaidThruDate');
        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          cobraPlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }

      cobraPlanRequiredFields.forEach((key: string) => {
        if (key.trim() === 'insuranceEndDate') {
          if (!this.healthInsuranceForm.controls['insuranceEndDate'].valid) {
            this.insuranceEndDateIsgreaterthanStartDate = false;
          }
          else {
            this.insuranceEndDateIsgreaterthanStartDate = true;
            this.healthInsuranceForm.controls[key].setValidators([
              Validators.required,
            ]);
            this.healthInsuranceForm.controls[key].updateValueAndValidity();
          }

        }
        else {
          this.healthInsuranceForm.controls[key].setValidators([
            Validators.required,
          ]);
          this.healthInsuranceForm.controls[key].updateValueAndValidity();
        }
      });
    }
  }

  private validateGroupInsurancePlan(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const groupPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'groupPlanType',
      'insuranceGroupId',
      'careassistPayingPremiumFlag'
    ];
    if (this.ddlInsuranceType === HealthInsurancePlan.GroupInsurancePlan) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        groupPlanRequiredFields.push(...careassistPayingRequiredFields);
        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          groupPlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }

      groupPlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
  }

  private validateOffExchangePlan(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const offExchangePlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'metalLevel',
      'careassistPayingPremiumFlag'
    ];
    if (this.ddlInsuranceType === HealthInsurancePlan.OffExchangePlan) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        offExchangePlanRequiredFields.push(...careassistPayingRequiredFields);
        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          offExchangePlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }
      offExchangePlanRequiredFields.forEach((key: string) => {
        this.healthInsuranceForm.controls[key].setValidators([
          Validators.required,
        ]);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      });
    }
  }

  private validateQualifiedHealthPlan(careassistPayingRequiredFields: any, policyHolderRequiredFields: any) {
    const qualifiedHealthPlanRequiredFields: Array<string> = [
      'insuranceStartDate',
      'insuranceIdNumber',
      'insuranceProviderName',
      'insurancePlanName',
      'aptcFlag',
      'metalLevel',
      'careassistPayingPremiumFlag'
    ];

    if (this.ddlInsuranceType === HealthInsurancePlan.QualifiedHealthPlan) {
      if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === 'Y') {
        qualifiedHealthPlanRequiredFields.push(...careassistPayingRequiredFields);
        if (this.healthInsuranceForm.controls['isClientPolicyHolderFlag'].value === 'N') {
          qualifiedHealthPlanRequiredFields.push(...policyHolderRequiredFields);
        }
      }

      qualifiedHealthPlanRequiredFields.forEach((key: string) => {
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
  }

  private resetValidators() {
    Object.keys(this.healthInsuranceForm.controls).forEach((key: string) => {
      if (!(key === 'insuranceEndDate' && !this.insuranceEndDateIsgreaterthanStartDate)) {
        this.healthInsuranceForm.controls[key].removeValidators(Validators.required);
        this.healthInsuranceForm.controls[key].updateValueAndValidity();
      }
    });
  }
  private resetData() {
    this.copyOfMedicareCardFiles = null;
    this.copyOfInsuranceCardFiles = null;
    this.copyOfInsuranceCardFiles = null
    this.proofOfPremiumFiles = null;
    this.handleFileRemoved(this.copyOfMedicareCardFiles, 'medicareCard');
    this.handleFileRemoved(this.copyOfInsuranceCardFiles, 'copyInsurance');
    this.handleFileRemoved(this.copyOfInsuranceCardFiles, 'summary');
    this.handleFileRemoved(this.proofOfPremiumFiles, 'proof');
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
      this.healthInsurancePolicy = new HealthInsurancePolicy();
      this.healthInsurancePolicy.insuranceTypeCode = this.insuranceTypeCode;
      this.healthInsurancePolicy.clientId = this.clientId;
      this.healthInsurancePolicy.clientCaseEligibilityId = this.caseEligibilityId;
      this.healthInsurancePolicy.activeFlag = StatusFlag.Yes;
      this.healthInsurancePolicy.healthInsuranceTypeCode = this.ddlInsuranceType;
      if (this.medicalHealthPlansCount === 0) {
        this.healthInsurancePolicy.priorityCode = PriorityCode.Primary;
      }
      /* these field will be removed when the columns are allwed null from the database */
      this.healthInsurancePolicy.premiumFrequencyCode = "";
      this.healthInsurancePolicy.oonDrugs = "";
      this.healthInsurancePolicy.oonPharmacy = "";
      this.healthInsurancePolicy.clientMaximumId = '';
      /* End for default values */

      if (this.ddlInsuranceType === HealthInsurancePlan.Veterans) {
        this.healthInsurancePolicy.isCerReview = this.isReviewPopup;
        return;
      }
      if (this.ddlInsuranceType === HealthInsurancePlan.Veterans) {
        this.healthInsurancePolicy.isCerReview = this.isReviewPopup;
        return;
      }
      this.healthInsurancePolicy.insuranceVendorId = this.healthInsuranceForm.controls['insuranceProviderName'].value;
      this.healthInsurancePolicy.insurancePlanId =
        this.healthInsuranceForm.controls['insurancePlanName'].value;
      this.healthInsurancePolicy.insuranceIdNbr =
        this.healthInsuranceForm.controls['insuranceIdNumber'].value;
      this.healthInsurancePolicy.insuranceGroupPlanTypeCode = this.healthInsuranceForm.controls['groupPlanType'].value;
      this.healthInsurancePolicy.insuranceGroupId = this.healthInsuranceForm.controls['insuranceGroupId'].value;
      this.healthInsurancePolicy.metalLevelCode =
        this.healthInsuranceForm.controls['metalLevel'].value === null ? null : this.healthInsuranceForm.controls['metalLevel'].value?.lovCode;
      if (this.healthInsuranceForm.controls['insuranceStartDate'].value !== null) {
        this.healthInsurancePolicy.insuranceStartDate = this.intl.formatDate(this.healthInsuranceForm.controls['insuranceStartDate'].value, this.dateFormat);
      }
      else {
        this.healthInsurancePolicy.insuranceStartDate = null
      }
      if (this.healthInsuranceForm.controls['insuranceEndDate'].value !== null) {
        this.healthInsurancePolicy.insuranceEndDate = this.intl.formatDate(this.healthInsuranceForm.controls['insuranceEndDate'].value, this.dateFormat);
      }
      else {
        this.healthInsurancePolicy.insuranceEndDate = null;
      }
      this.setValuesBasedOnCareAssistPayingPremium();
      this.setValuesMedicare();

      if (
        this.healthInsuranceForm.controls['onLisFlag'].value !== StatusFlag.Yes
      ) {
        this.healthInsurancePolicy.onLisFlag = this.healthInsuranceForm.controls['onLisFlag'].value;
      } else {
        this.healthInsurancePolicy.onLisFlag = StatusFlag.Yes;
      }
      this.initializeHealthInsurancePolicy();

    }
  }

  private initializeHealthInsurancePolicy() {
    this.healthInsurancePolicy.paymentGroupNumber = 0;
    this.healthInsurancePolicy.oonException = 0;
    this.healthInsurancePolicy.oonStartDate = this.intl.formatDate(new Date(), this.dateFormat);
    this.healthInsurancePolicy.oonEndDate = this.intl.formatDate(new Date(), this.dateFormat);
    this.healthInsurancePolicy.oonPharmacy = null;
    this.healthInsurancePolicy.oonDrugs = null;
    this.healthInsurancePolicy.othersCoveredOnPlanFlag = this.healthInsuranceForm.value.othersCoveredOnPlanFlag;
    this.healthInsurancePolicy.othersCoveredOnPlan = [];
    const othersCoveredOnPlanSelected = this.healthInsuranceForm.value.othersCoveredOnPlan.filter((x: any) => x.enrolledInInsuranceFlag === true);
    this.healthInsurancePolicy.othersCoveredOnPlan = JSON.parse(JSON.stringify(othersCoveredOnPlanSelected));
    this.healthInsurancePolicy.othersCoveredOnPlan.forEach((person: any) => {
      person.enrolledInInsuranceFlag = StatusFlag.Yes;
    });
    this.healthInsuranceForm.value.newOthersCoveredOnPlan.forEach((x: any) => {
      x.relationshipTypeCode = DependentTypeCode.Health;
      x.enrolledInInsuranceFlag = StatusFlag.Yes;
      x.clientCaseEligibilityId = this.caseEligibilityId;
      x.clientId = this.clientId;
      x.dob = x?.dob.toLocaleDateString();
      this.healthInsurancePolicy.othersCoveredOnPlan.push(x);
    });
    this.healthInsurancePolicy.isClientPolicyHolderFlag = this.healthInsuranceForm.value.isClientPolicyHolderFlag;
    this.healthInsurancePolicy.policyHolderFirstName = this.healthInsuranceForm.value.policyHolderFirstName;
    this.healthInsurancePolicy.policyHolderLastName = this.healthInsuranceForm.value.policyHolderLastName;

    this.setCopyOfInsuranceCardFiles();
    this.setProofOfPremiumFiles();
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
      this.healthInsurancePolicy.medicareCardFileTypeCode = this.medicareTypeCode;
      this.healthInsurancePolicy.medicareCardFileId = this.copyOfMedicareCardFiles[0].uid;
    }
    else if (this.copyOfMedicareCardFiles?.length > 0 && this.copyOfMedicareCardFiles[0].uid != "") {
      this.healthInsurancePolicy.medicareCardFile = this.healthInsurancePolicyCopy.medicareCardFile;
      this.healthInsurancePolicy.medicareCardFileName = this.healthInsurancePolicyCopy.medicareCardFileName;
      this.healthInsurancePolicy.medicareCardFileSize = this.healthInsurancePolicyCopy.medicareCardFileSize;
      this.healthInsurancePolicy.medicareCardFileTypeCode = 'CMC';
      this.healthInsurancePolicy.medicareCardFileId = this.healthInsurancePolicyCopy.copyOfSummaryFileId;
    }
    if (!this.medicareInsuranceInfoCheck && this.ddlInsuranceType === HealthInsurancePlan.Medicare) {
      this.healthInsurancePolicy.careassistPayingPremiumFlag = null;
      this.healthInsurancePolicy.premiumPaidThruDate = null
      this.healthInsurancePolicy.premiumFrequencyCode = null;
      this.healthInsurancePolicy.nextPremiumDueDate = null
      this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = null;
      this.healthInsurancePolicy.paymentIdNbr = null;
      this.healthInsurancePolicy.premiumAmt = null;
      this.healthInsurancePolicy.insuranceVendorId = null;
      this.healthInsurancePolicy.insurancePlanId = null;
      this.healthInsurancePolicy.insuranceIdNbr = null;
      this.healthInsurancePolicy.insuranceStartDate = null;
      this.healthInsurancePolicy.insuranceEndDate = null;
      this.healthInsurancePolicy.othersCoveredOnPlanFlag = null;
      this.healthInsurancePolicy.isClientPolicyHolderFlag = null;
      this.healthInsurancePolicy.policyHolderFirstName = null;
      this.healthInsurancePolicy.policyHolderLastName = null;
      this.healthInsurancePolicy.insuranceVendorAddressId = null;
    }
    this.healthInsurancePolicy.isCerReview = this.isReviewPopup;
  }

  private setCopyOfInsuranceCardFiles() {
    if (this.copyOfInsuranceCardFiles?.length > 0 && this.copyOfInsuranceCardFiles[0].uid == "") {
      this.healthInsurancePolicy.copyOfInsuranceCardFile = this.copyOfInsuranceCardFiles[0].document.rawFile;
      this.healthInsurancePolicy.copyOfInsuranceCardFileName = this.copyOfInsuranceCardFiles[0].name;
      this.healthInsurancePolicy.copyOfInsuranceCardFileSize = this.copyOfInsuranceCardFiles[0].size;
      this.healthInsurancePolicy.copyOfInsuranceCardFileTypeCode = this.cICTypeCode;
      this.healthInsurancePolicy.copyOfInsuranceCardFileId = this.healthInsurancePolicyCopy?.copyOfInsuranceCardFileId;
    }
    else if (this.copyOfInsuranceCardFiles?.length > 0 && this.copyOfInsuranceCardFiles[0].uid != "") {
      this.healthInsurancePolicy.copyOfInsuranceCardFile = this.healthInsurancePolicyCopy.copyOfInsuranceCardFile;
      this.healthInsurancePolicy.copyOfInsuranceCardFileName = this.healthInsurancePolicyCopy.copyOfInsuranceCardFileName;
      this.healthInsurancePolicy.copyOfInsuranceCardFileSize = this.healthInsurancePolicyCopy.copyOfInsuranceCardFileSize;
      this.healthInsurancePolicy.copyOfInsuranceCardFileTypeCode = this.cICTypeCode;
      this.healthInsurancePolicy.copyOfInsuranceCardFileId = this.healthInsurancePolicyCopy?.copyOfInsuranceCardFileId;
    }
  }

  private setProofOfPremiumFiles() {
    if (this.proofOfPremiumFiles?.length > 0 && this.proofOfPremiumFiles[0].uid == "") {
      this.healthInsurancePolicy.proofOfPremiumFile = this.proofOfPremiumFiles[0].document.rawFile;
      this.healthInsurancePolicy.proofOfPremiumFileName = this.proofOfPremiumFiles[0].name;
      this.healthInsurancePolicy.proofOfPremiumFileSize = this.proofOfPremiumFiles[0].size;
      this.healthInsurancePolicy.proofOfPremiumFileTypeCode = this.pOPTypeCode;
      this.healthInsurancePolicy.proofOfPremiumFileId = this.healthInsurancePolicyCopy?.proofOfPremiumFileId;
    }
    else if (this.proofOfPremiumFiles?.length > 0 && this.proofOfPremiumFiles[0].uid != "") {
      this.healthInsurancePolicy.proofOfPremiumFile = this.healthInsurancePolicyCopy.proofOfPremiumFile;
      this.healthInsurancePolicy.proofOfPremiumFileName = this.healthInsurancePolicyCopy.proofOfPremiumFileName;
      this.healthInsurancePolicy.proofOfPremiumFileSize = this.healthInsurancePolicyCopy.proofOfPremiumFileSize;
      this.healthInsurancePolicy.proofOfPremiumFileTypeCode = this.pOPTypeCode;
      this.healthInsurancePolicy.proofOfPremiumFileId = this.healthInsurancePolicyCopy?.proofOfPremiumFileId;
    }
  }

  private setValuesMedicare() {
    if (this.healthInsuranceForm.controls['aptcFlag'].value) {
      this.healthInsurancePolicy.aptcCode = this.healthInsuranceForm.controls['aptcFlag'].value.trim();
    }

    if (this.healthInsuranceForm.controls['aptcFlag'].value === 'NO') {
      this.healthInsurancePolicy.aptcNotTakingFlag = this.healthInsuranceForm.controls['aptcFlag'].value;
    } else if (this.healthInsurancePolicy.aptcCode === 'YES') {
      this.healthInsurancePolicy.aptcMonthlyAmt = this.healthInsuranceForm.controls['aptcMonthlyAmt'].value
    }
    this.healthInsurancePolicy.isClientPolicyHolderFlag = null;
    this.healthInsurancePolicy.medicareBeneficiaryIdNbr = this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].value;
    this.healthInsurancePolicy.medicareCoverageTypeCode = this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value;
    if(!this.medicareInsuranceInfoCheck && this.healthInsuranceForm.controls['medicareEndDate'].value !== null){
      this.healthInsurancePolicy.medicareEndDate = this.intl.formatDate(this.healthInsuranceForm.controls['medicareEndDate'].value, this.dateFormat);
    }
    else {
      this.healthInsurancePolicy.medicareEndDate = null;
    }
    if (this.healthInsuranceForm.controls['medicarePartAStartDate'].value !== null) {

      this.healthInsurancePolicy.medicarePartAStartDate = this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartAStartDate'].value, this.dateFormat);
    }
    else {
      this.healthInsurancePolicy.medicarePartAStartDate = null;
    }
    if (this.healthInsuranceForm.controls['medicarePartBStartDate'].value !== null) {
      this.healthInsurancePolicy.medicarePartBStartDate = this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartBStartDate'].value, this.dateFormat);
    }
    else {
      this.healthInsurancePolicy.medicarePartBStartDate = null;
    }

    if (
      this.healthInsuranceForm.controls['onQmbFlag'].value !== StatusFlag.Yes
    ) {
      this.healthInsurancePolicy.onQmbFlag = this.healthInsuranceForm.controls['onQmbFlag'].value;
    } else {
      this.healthInsurancePolicy.onQmbFlag = StatusFlag.Yes;
    }
  }

  private setValuesBasedOnCareAssistPayingPremium() {
    if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === StatusFlag.Yes) {
      this.healthInsurancePolicy.careassistPayingPremiumFlag = StatusFlag.Yes;
      this.healthInsurancePolicy.premiumPaidThruDate =
        this.healthInsuranceForm.controls["premiumPaidThruDate"].value === null ? null :
          this.intl.formatDate(this.healthInsuranceForm.controls['premiumPaidThruDate'].value, this.dateFormat);

      this.healthInsurancePolicy.premiumFrequencyCode = this.healthInsuranceForm.controls["premiumFrequencyCode"].value;
      this.healthInsurancePolicy.nextPremiumDueDate = this.healthInsuranceForm.controls["nextPremiumDueDate"].value === null ? null :
        this.intl.formatDate(this.healthInsuranceForm.controls['nextPremiumDueDate'].value, this.dateFormat);

      if (this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value ?? false) {
        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = StatusFlag.Yes
      }
      else if (!(this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].value)) {
        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = StatusFlag.No
      }
      else {
        this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag = null;
      }

      this.healthInsurancePolicy.paymentIdNbr = this.healthInsuranceForm.controls["paymentIdNbr"].value;
      this.healthInsurancePolicy.premiumAmt = this.healthInsuranceForm.controls["premiumAmt"].value;
    }
    else if (this.healthInsuranceForm.controls['careassistPayingPremiumFlag'].value === StatusFlag.No) {
      this.healthInsurancePolicy.careassistPayingPremiumFlag = StatusFlag.No;
    }
    else {
      this.healthInsurancePolicy.careassistPayingPremiumFlag = null;
    }
    this.healthInsurancePolicy.insuranceVendorAddressId = this.healthInsuranceForm.controls["insuranceVendorAddressId"].value;

  }

  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.insuranceEndDateIsgreaterthanStartDate = true;
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
    (this.healthInsuranceForm.controls['newOthersCoveredOnPlan'] as FormArray).clear();

    if(this.healthInsuranceForm.controls['insuranceType'].value === HealthInsurancePlan.Cobra){
      this.healthInsuranceForm.controls['insuranceEndDate'].setValue(this.getCurrentYearEndDate());
    }
  }

  getCurrentYearEndDate(): Date {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const nextYear = currentYear + 1;

    // Setting the date to December 31st of the current year
    const endOfYearDate = new Date(nextYear, 0, 0);

    return endOfYearDate;
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
    this.editRedirect.next('edit');
    this.disableEnableRadio();
  }
  insuranceCarrierNameData(data: any) {
    if (this.isEdit) {
      this.healthInsuranceForm.controls['insuranceProviderName'].setValue(
        this.healthInsurancePolicyCopy.insuranceVendorId
      );
    }
  }
  insuranceCarrierNameChange(value: string) {
    if (value == null) {
      return;
    }
    let insuranceType = null;
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
      insuranceType = InsuranceStatusType.dentalInsurance;
    }
    else {
      insuranceType = InsuranceStatusType.healthInsurance;
    }

    this.insurancePlanFacade.planLoaderSubject.next(true);
    this.insurancePlans = [];
    this.insurancePlanFacade.loadInsurancePlanByProviderId(value, insuranceType).subscribe({
      next: (data: any) => {
        this.insurancePlanFacade.planNameChangeSubject.next(data);
      },
      error: (err) => {
        this.insurancePlanFacade.planLoaderSubject.next(false);
        this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    });
  }
  onMedicareCoverageTypeChanged() {
    if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("P") || this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("M")) {
      this.medicareInsuranceInfoCheck = true;
    }
    else {
      this.medicareInsuranceInfoCheck = false;
    }
    this.medicareEndDateOnChange();
  }
  save() {
    this.validateForm();
     if (this.healthInsuranceForm.valid && this.isInsuranceFileUploaded && this.isProofFileUploaded && this.isSummaryFileUploaded && this.isMedicareCardFileUploaded) {
      this.insurancePolicyFacade.showLoader(); 
      this.getPoliciesEventEmitter.next(true);    
    }
  }

  getPolicySubscription() {
    this.policySubscription = this.insurancePolicyFacade.currentEligibilityPolicies$.subscribe((policies: any) => {
      if (this.isEdit && !this.isCopyPopup) {
        policies = policies.filter((x: any) => x.clientInsurancePolicyId !== this.healthInsuranceForm.controls['clientInsurancePolicyId'].value);
      }
      let policyAlreadyExist = this.policyExistCheck(policies);

      let primaryAlreadyExist = this.primaryExistCheck(policies);

      if (policyAlreadyExist) {
        this.insurancePolicyFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          'This Plan already exists.', NotificationSource.UI
        );
        this.insurancePolicyFacade.hideLoader();
      }
      else if(primaryAlreadyExist){
        this.insurancePolicyFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          'Primary insurance already exists.', NotificationSource.UI
        );
        this.insurancePolicyFacade.hideLoader();
      }
      else {
        this.savePolicy();
      }
    });
  }

  savePolicy() {
    this.populateInsurancePolicy();    
    this.btnDisabled = true;
    if (this.isCopyPopup) {
      this.SaveCopiedInsurancePolicy();
    }
    else if (this.isEdit) {
      this.healthInsurancePolicy.clientInsurancePolicyId =
        this.healthInsuranceForm.controls['clientInsurancePolicyId'].value;
      this.healthInsurancePolicy.creationTime = this.healthInsurancePolicyCopy.creationTime;
      this.insurancePolicyFacade
        .updateHealthInsurancePolicy(this.healthInsurancePolicy)
        .subscribe({
          next: (data: any) => {
            this.insurancePolicyFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Insurance Policy has been added successfully'
            );
            this.onModalCloseClicked();
            this.insurancePolicyFacade.hideLoader();
            this.isAddEditClicked.next(true);
            this.isAddPriority.next(false);
          },
          error: (error: any) => {
            if (error) {
              this.btnDisabled = false;
              this.insurancePolicyFacade.showHideSnackBar(
                SnackBarNotificationType.ERROR,
                error
              );
              this.insurancePolicyFacade.hideLoader();
            }
          }
        });
    } else {

      this.insurancePolicyFacade
        .saveHealthInsurancePolicy(this.healthInsurancePolicy)
        .subscribe({
          next: (data: any) => {
            this.insurancePolicyFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Insurance Policy has been added successfully'
            );
            this.onModalCloseClicked();
            this.insurancePolicyFacade.hideLoader();
            this.isAddEditClicked.next(true);
            this.isAddPriority.next(true)
          },
          error: (error: any) => {
            if (error) {
              this.btnDisabled = false;
              this.insurancePolicyFacade.showHideSnackBar(
                SnackBarNotificationType.ERROR,
                error
              );
              this.insurancePolicyFacade.hideLoader();
            }
          }
        });
    }
  }

  policyExistCheck(policies:any): boolean {
    let policyAlreadyExist = false;
    policies.forEach((policy: any) => {
      if (this.healthInsuranceForm.controls['insuranceType'].value === HealthInsurancePlan.Veterans &&
        this.healthInsuranceForm.controls['insuranceType'].value == policy.healthInsuranceTypeCode) {
        policyAlreadyExist = true;
      }
      if (this.healthInsuranceForm.controls['insuranceType'].value === HealthInsurancePlan.Medicare &&
        this.healthInsuranceForm.controls['insuranceType'].value == policy.healthInsuranceTypeCode &&
        [MedicareCoverageType.A, MedicareCoverageType.B, MedicareCoverageType.AB]
          .includes(this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value)) {
        let currentMedicarePartAStartDate = this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartAStartDate'].value, this.dateFormat);
        let currentMedicarePartBStartDate = this.intl.formatDate(this.healthInsuranceForm.controls['medicarePartBStartDate'].value, this.dateFormat);
        let extMedicarePartAStartDate = this.intl.formatDate(new Date(policy.medicarePartAStartDate), this.dateFormat);
        let extMedicarePartBStartDate = this.intl.formatDate(new Date(policy.medicarePartBStartDate), this.dateFormat);
        if (currentMedicarePartAStartDate === extMedicarePartAStartDate &&
          currentMedicarePartBStartDate === extMedicarePartBStartDate &&
          this.healthInsuranceForm.controls['medicareBeneficiaryIdNbr'].value === policy.medicareBeneficiaryIdNumber) {
          policyAlreadyExist = true;
        }
      }
      else if (this.healthInsuranceForm.controls['insuranceType'].value == policy.healthInsuranceTypeCode
        && policy.insurancePlanId === this.healthInsuranceForm.controls['insurancePlanName'].value
        && policy.insuranceIdNumber === this.healthInsuranceForm.controls['insuranceIdNumber'].value) {
        let startDate = this.intl.formatDate(this.healthInsuranceForm.controls['insuranceStartDate'].value, this.dateFormat);
        let endDate = this.intl.formatDate(this.healthInsuranceForm.controls['insuranceEndDate'].value, this.dateFormat);
        let policyStartDate = this.intl.formatDate(new Date(policy.startDate), this.dateFormat);
        let policyEndDate = this.intl.formatDate(new Date(policy.endDate), this.dateFormat);
        if (this.dateRangeOverlaps(new Date(policyStartDate), new Date(policyEndDate), new Date(startDate), new Date(endDate))) {
          policyAlreadyExist = true;
        }
      }
    });
    return policyAlreadyExist
  }

  dateRangeOverlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    if (aEnd === null && bEnd === null && aStart === bStart) return true;
    if (aEnd === null && aStart >= bStart && aStart <= bEnd) return true;
    if (bEnd === null && bStart >= aStart && bStart <= aEnd) return true;
    if (aStart <= bStart && bStart <= aEnd) return true;
    if (aStart <= bEnd && bEnd <= aEnd) return true;
    if (bStart < aStart && aEnd < bEnd) return true;
    return false;
  }

  primaryExistCheck(policies: any): boolean {
    let policyOverlap = false;
    if (this.isEdit) {
      let endDateField = 'insuranceEndDate';
      if (this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "A" || this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "B" || this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "AB") {
        endDateField = 'medicareEndDate'
      }
      let policyExist = policies.filter((x: any) => x.priorityCode == PriorityCode.Primary);
      if (this.healthInsuranceForm.controls[endDateField].value == null) {        
        if (policyExist.length > 0) {
          return true;
        }
        else {
          policyOverlap = false;
        }
      }
      else {
        let startDateField = 'insuranceStartDate';
        if (this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "A" || this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "AB") {
          startDateField = 'medicarePartAStartDate'
        }
        if (this.healthInsuranceForm.controls['medicareCoverageTypeCode']?.value === "B") {
          startDateField = 'medicarePartBStartDate'
        }
        let startDate = this.intl.formatDate(this.healthInsuranceForm.controls[startDateField].value, this.dateFormat);
        let endDate = this.intl.formatDate(this.healthInsuranceForm.controls[endDateField].value, this.dateFormat);
        policyExist.forEach((policy: any) => {
          let policyStartDate = this.intl.formatDate(new Date(policy.startDate), this.dateFormat);
          let policyEndDate = this.intl.formatDate(new Date(policy.endDate), this.dateFormat);
          if (policy.endDate == null) {
            policyOverlap = true;
          }
          else {
            let policyOverlapped = this.dateRangeOverlaps(new Date(policyStartDate), new Date(policyEndDate), new Date(startDate), new Date(endDate));
            if (policyOverlapped) {
              policyOverlap = policyOverlapped;
            }
          }
        });
        return policyOverlap;
      }
      return policyOverlap;
    }
    return policyOverlap;

  }

  private SaveCopiedInsurancePolicy() {
    this.healthInsurancePolicy.clientInsurancePolicyId = this.healthInsuranceForm.controls['clientInsurancePolicyId'].value;
    this.insurancePolicyFacade.copyHealthInsurancePolicy(this.healthInsurancePolicy.clientInsurancePolicyId, this.healthInsurancePolicy)
      .subscribe({
        next: (data: any) => {
          this.insurancePolicyFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Insurance plan copied successfully.'
          );
          this.onModalCloseClicked();
          this.insurancePolicyFacade.hideLoader();
          this.isAddEditClicked.next(true);
          this.isAddPriority.next(true);
        },
        error: (error: any) => {
          if (error) {
            this.btnDisabled = false;
            this.insurancePolicyFacade.showHideSnackBar(
              SnackBarNotificationType.ERROR,
              error
            );
            this.insurancePolicyFacade.hideLoader();
          }
        }
      });;
  }

  onDeleteClick() {
    this.isDeleteClicked.next(true);
  }

  disableEnableRadio() {
    if (this.isViewContentEditable) {
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].disable();
      this.healthInsuranceForm.controls["groupPlanType"].disable();
      this.healthInsuranceForm.controls["insuranceGroupId"].disable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].disable();
      this.healthInsuranceForm.controls["onQmbFlag"].disable();
      this.healthInsuranceForm.controls["onLisFlag"].disable();
      this.healthInsuranceForm.controls["othersCoveredOnPlanFlag"].disable();
      this.healthInsuranceForm.controls["othersCoveredOnPlan"].disable();
      this.healthInsuranceForm.controls["isClientPolicyHolderFlag"].disable();
      this.healthInsuranceForm.controls["insuranceType"].disable();
      this.healthInsuranceForm.controls["insuranceStartDate"].disable();
      this.healthInsuranceForm.controls["insuranceEndDate"].disable();
      this.healthInsuranceForm.controls["insuranceIdNumber"].disable();
      this.healthInsuranceForm.controls["insuranceProviderName"].disable()
      this.healthInsuranceForm.controls["insurancePlanName"].disable();
      this.healthInsuranceForm.controls["metalLevel"].disable();
      this.healthInsuranceForm.controls["medicareBeneficiaryIdNbr"].disable();
      this.healthInsuranceForm.controls["medicareCoverageTypeCode"].disable();
      this.healthInsuranceForm.controls["medicarePartAStartDate"].disable();
      this.healthInsuranceForm.controls["medicareEndDate"].disable();
      this.healthInsuranceForm.controls["medicarePartBStartDate"].disable();
      this.healthInsuranceForm.controls["onQmbFlag"].disable();
      this.healthInsuranceForm.controls["premiumPaidThruDate"].disable();
      this.healthInsuranceForm.controls["nextPremiumDueDate"].disable();
      this.healthInsuranceForm.controls["premiumAmt"].disable();
      this.healthInsuranceForm.controls["premiumFrequencyCode"].disable();
      this.healthInsuranceForm.controls["paymentIdNbr"].disable();
      this.healthInsuranceForm.controls["policyHolderFirstName"].disable();
      this.healthInsuranceForm.controls["policyHolderLastName"].disable();
      this.healthInsuranceForm.controls['newOthersCoveredOnPlan'].disable();
      this.healthInsuranceForm.controls["insuranceVendorAddressId"].disable();
    }
    else {
      this.healthInsuranceForm.controls["careassistPayingPremiumFlag"].enable();
      this.healthInsuranceForm.controls["groupPlanType"].enable();
      this.healthInsuranceForm.controls["insuranceGroupId"].enable();
      this.healthInsuranceForm.controls["paymentIdNbrSameAsInsuranceIdNbrFlag"].enable();
      this.healthInsuranceForm.controls["onQmbFlag"].enable();
      this.healthInsuranceForm.controls["onLisFlag"].enable();
      this.healthInsuranceForm.controls["othersCoveredOnPlanFlag"].enable();
      this.healthInsuranceForm.controls["othersCoveredOnPlan"].enable();
      this.healthInsuranceForm.controls["isClientPolicyHolderFlag"].enable();
      if (this.isEdit) {
        this.healthInsuranceForm.controls["insuranceType"].disable();
      }
      else {
        this.healthInsuranceForm.controls["insuranceType"].enable();
      }
      this.healthInsuranceForm.controls["insuranceStartDate"].enable();
      this.healthInsuranceForm.controls["insuranceEndDate"].enable();
      this.healthInsuranceForm.controls["insuranceIdNumber"].enable();
      this.healthInsuranceForm.controls["insuranceProviderName"].enable();
      this.healthInsuranceForm.controls["insurancePlanName"].enable();
      this.healthInsuranceForm.controls["metalLevel"].enable();
      this.healthInsuranceForm.controls["medicareBeneficiaryIdNbr"].enable()
      this.healthInsuranceForm.controls["medicareCoverageTypeCode"].enable();
      this.healthInsuranceForm.controls["medicarePartAStartDate"].enable()
      this.healthInsuranceForm.controls["medicareEndDate"].enable();
      this.healthInsuranceForm.controls["medicarePartBStartDate"].enable();
      this.healthInsuranceForm.controls["onQmbFlag"].enable();
      this.healthInsuranceForm.controls["premiumPaidThruDate"].enable();
      this.healthInsuranceForm.controls["nextPremiumDueDate"].enable();
      this.healthInsuranceForm.controls["premiumAmt"].enable();
      this.healthInsuranceForm.controls["premiumFrequencyCode"].enable();
      this.healthInsuranceForm.controls["paymentIdNbr"].enable();
      if (this.sameAsInsuranceIdFlag) {
        this.healthInsuranceForm.controls["paymentIdNbr"].disable();

      }
      else {
        this.healthInsuranceForm.controls["paymentIdNbr"].enable();
      }
      this.healthInsuranceForm.controls["policyHolderFirstName"].enable();
      this.healthInsuranceForm.controls["policyHolderLastName"].enable();
      this.healthInsuranceForm.controls['newOthersCoveredOnPlan'].enable();
      this.healthInsuranceForm.controls["insuranceVendorAddressId"].enable();
    }
  }

  startDateOnChange() {
    if (this.healthInsuranceForm.controls['insuranceEndDate'].value !== null) {
      this.endDateOnChange();
    }
  }
  changeMinDate() {
    this.endDateMin = this.healthInsuranceForm.controls['insuranceStartDate'].value;
  }

  endDateOnChange() {
    this.insuranceEndDateIsgreaterthanStartDate = true;
    if (this.healthInsuranceForm.controls['insuranceStartDate'].value === null) {
      this.healthInsuranceForm.controls['insuranceStartDate'].markAllAsTouched();
      this.healthInsuranceForm.controls['insuranceStartDate'].setValidators([Validators.required]);
      this.healthInsuranceForm.controls['insuranceStartDate'].updateValueAndValidity();
      this.healthInsuranceForm.controls['insuranceEndDate'].setErrors({ 'incorrect': true });
      this.insuranceEndDateIsgreaterthanStartDate = false;
    }
    else if (this.healthInsuranceForm.controls['insuranceEndDate'].value !== null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['insuranceStartDate'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['insuranceEndDate'].value
        )
      );

      if (startDate > endDate) {
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors({ 'incorrect': true });
        this.insuranceEndDateIsgreaterthanStartDate = false;
      }
      else {
        this.insuranceEndDateIsgreaterthanStartDate = true;
        this.healthInsuranceForm.controls['insuranceEndDate'].setErrors(null);
        this.endDateMin = this.healthInsuranceForm.controls['insuranceStartDate'].value;
      }
    }
  } 

  endDateValueChange(date: Date) {
    this.insuranceEndDateIsgreaterthanStartDate = false;

  }
  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }

  medicareEndDateOnChange() {
    let dateToConsider = '';
    if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("A") && this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("B")) {
      dateToConsider = 'medicarePartAStartDate'
    }
    else if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("A")) {
      dateToConsider = 'medicarePartAStartDate';

    }
    else if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("B")) {
      dateToConsider = 'medicarePartBStartDate';
    }

    if (this.healthInsuranceForm.controls[dateToConsider].value != null && this.healthInsuranceForm.controls['medicareEndDate'].value != null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls[dateToConsider].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.healthInsuranceForm.controls['medicareEndDate'].value
        )
      );

      if (startDate > endDate) {
        this.healthInsuranceForm.controls['medicareEndDate'].setErrors({ 'incorrect': true });
      }
      else {
        this.healthInsuranceForm.controls['medicareEndDate'].setErrors(null);
        this.changeMedicareMinDate();
      }
    }
    else{
      this.healthInsuranceForm.controls['medicareEndDate'].setErrors(null);
    }
    this.changeDetector.detectChanges();
  }

  medicareStartDateOnChange() {
    if (this.healthInsuranceForm.controls['medicareEndDate'].value !== null) {
      this.medicareEndDateOnChange();
    }
  }

  changeMedicareMinDate() {
    if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("A") && this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("B")) {
      this.medicareEndDateMin = this.healthInsuranceForm.controls['medicarePartAStartDate'].value;
    }
    else if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("A")) {
      this.medicareEndDateMin = this.healthInsuranceForm.controls['medicarePartAStartDate'].value;

    }
    else if (this.healthInsuranceForm.controls['medicareCoverageTypeCode'].value.includes("B")) {
      this.medicareEndDateMin = this.healthInsuranceForm.controls['medicarePartBStartDate'].value;
    }
  }

  public handleFileSelected(event: any, fileType: string) {
    this.documentSizeValidator = false;
    if (fileType == 'proof') {
      this.proofOfPremiumFiles = null;
      this.proofOfPremiumExceedsFileSizeLimit = false;
      this.proofOfPremiumFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isProofFileUploaded = true;
      if (this.proofOfPremiumFiles[0].size > this.uploadFileSizeLimit) {
        this.handleFileRemoved(this.proofOfPremiumFiles, 'proof');
        this.proofOfPremiumExceedsFileSizeLimit = true;
      }
    }
    else if (fileType == 'summary') {
      this.copyOfSummaryFiles = null;
      this.summaryFilesExceedsFileSizeLimit = false;
      this.copyOfSummaryFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isSummaryFileUploaded = true;
      if (this.copyOfSummaryFiles[0].size > this.uploadFileSizeLimit) {
        this.handleFileRemoved(this.copyOfInsuranceCardFiles, 'summary');
        this.summaryFilesExceedsFileSizeLimit = true;
      }
    }
    else if (fileType == 'copyInsurance') {
      this.copyOfInsuranceCardFiles = null;
      this.insuranceCardFilesExceedsFileSizeLimit = false;
      this.copyOfInsuranceCardFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isInsuranceFileUploaded = true;
      if (this.copyOfInsuranceCardFiles[0].size > this.uploadFileSizeLimit) {
        this.handleFileRemoved(this.copyOfInsuranceCardFiles, 'copyInsurance');
        this.insuranceCardFilesExceedsFileSizeLimit = true;
      }
    }
    else if (fileType == 'medicareCard') {
      this.copyOfMedicareCardFiles = null;
      this.medicareCardFilesExceedsFileSizeLimit = false;
      this.copyOfMedicareCardFiles = [{
        document: event.files[0],
        size: event.files[0].size,
        name: event.files[0].name,
        uid: ''
      }];
      this.isMedicareCardFileUploaded = true;
      if (this.copyOfMedicareCardFiles[0].size > this.uploadFileSizeLimit) {
        this.handleFileRemoved(this.copyOfMedicareCardFiles, 'medicareCard');
        this.medicareCardFilesExceedsFileSizeLimit = true;
      }
    }
  }

          processFile(files: any,fileType :string)
          {
            this.insurancePolicyFacade.showLoader();
            this.clientDocumentFacade.removeDocument(files?.files[0]?.uid ?? '').subscribe({
              next: (response) => {
                if (response === true) {
                  this.onFileRemove(fileType);
                }
                this.insurancePolicyFacade.hideLoader();
              },
              error: (err) => {
                this.loggingService.logException(err);
                this.insurancePolicyFacade.hideLoader();
              },
            });
          }

     processNonFile(fileType: string, resetId?: boolean)
     {
      if (fileType == 'proof') {
        this.proofOfPremiumFiles = [];
        this.isProofFileUploaded = false;
        if(this.healthInsurancePolicyCopy&&resetId)
        this.healthInsurancePolicyCopy.proofOfPremiumFileId = '';
      }
      else if (fileType == 'summary') {
        this.copyOfSummaryFiles = [];
        this.isSummaryFileUploaded = false;
      }
      else if (fileType == 'copyInsurance') {
        this.copyOfInsuranceCardFiles = [];
        this.isInsuranceFileUploaded = false;
        if(this.healthInsurancePolicyCopy&&resetId)
        this.healthInsurancePolicyCopy.copyOfInsuranceCardFileId = '';
      }
      else if (fileType == 'medicareCard') {
        this.copyOfMedicareCardFiles = [];
        this.isMedicareCardFileUploaded = false;
      }
     }

      public handleFileRemoved(files: any, fileType: string, resetId?: boolean) {
        if (files?.files?.length > 0 && !!files?.files[0]?.uid) {
            this.processFile(files,fileType)
        }
        else {
              this.processNonFile(fileType,resetId)
        }
      }



  handleTypeCodeEvent(e: any) {
    this.cICTypeCode = e;
  }
  handleSummaryTypeCodeEvent(e: any) {
    this.cOSTypeCode = e;
  }
  handleMedicareTypeCodeEvent(e: any) {
    this.medicareTypeCode = e;
  }
  handleProofTypeCodeEvent(e: any) {
    this.pOPTypeCode = e;
  }

  private onFileRemove(fileType: string) {
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
}
