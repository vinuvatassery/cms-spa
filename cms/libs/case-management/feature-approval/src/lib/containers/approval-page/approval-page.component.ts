/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
/** Facades **/
import {
  PendingApprovalGeneralFacade,
  PendingApprovalGeneralTypeCode,
  PendingApprovalPaymentFacade,
  FinancialVendorFacade,
  ContactFacade,
  DrugsFacade,
  InsurancePlanFacade,
  ImportedClaimFacade,
  CaseManagerFacade,
  ApprovalLimitPermissionCode,
  PendingApprovalPaymentTypeCode,
} from '@cms/case-management/domain';
import {
  ReminderNotificationSnackbarService,
  DocumentFacade,
} from '@cms/shared/util-core';
import {
  NavigationMenuFacade,
  UserManagementFacade,
  UserDataService,
  UserDefaultRoles,
  UserLevel,
  LovFacade
} from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'productivity-tools-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalPageComponent implements OnInit {
  /** Public properties **/

  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  commonReminderSnackbar$ = this.reminderNotificationSnackbarService.snackbar$;
  sortType = this.pendingApprovalGeneralFacade.sortType;
  pageSizes = this.pendingApprovalGeneralFacade.gridPageSizes;
  gridSkipCount = this.pendingApprovalGeneralFacade.skipCount;
  dataExportParameters!: any;

  sortValue = this.pendingApprovalGeneralFacade.sortValue;
  sort = this.pendingApprovalGeneralFacade.sort;
  sortValueGeneralAPproval = this.caseManagerFacade.sortValueGeneralAPproval;
  sortGeneralList = this.caseManagerFacade.sortGeneralList;
  sortApprovalPaymentsList = this.pendingApprovalPaymentFacade.sortApprovalPaymentsList;
  sortValueApprovalPaymentsApproval = this.pendingApprovalPaymentFacade.sortValueApprovalPaymentsApproval;
  sortImportedClaimsList = this.importedClaimFacade.sortImportedClaimsList;
  sortValueImportedClaimsApproval = this.importedClaimFacade.sortValueImportedClaimsApproval;
  sortTypeImportedClaim = this.importedClaimFacade.sortType;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  importedClaimsCount$ = this.importedClaimFacade.importedClaimsCount$;

  userLevel = UserLevel.Level1Value;
  pendingApprovalPaymentCount! : any;
  pendingApprovalGeneralCount = 0;
  pendingApprovalImportedClaimCount = 0;
  state!: State;
  approvalsGeneralLists$ = this.pendingApprovalGeneralFacade.approvalsGeneralList$;
  approvalsImportedClaimsLists$ = this.importedClaimFacade.approvalsImportedClaimsLists$;
  pendingApprovalPaymentCount$ = this.navigationMenuFacade.pendingApprovalPaymentCount$;
  pendingApprovalGeneralCount$ = this.navigationMenuFacade.pendingApprovalGeneralCount$;
  pendingApprovalImportedClaimCount$ = this.navigationMenuFacade.pendingApprovalImportedClaimCount$;
  approvalsPaymentsLists$ = this.pendingApprovalPaymentFacade.pendingApprovalGrid$;
  approvalsPaymentsMainLists$ = this.pendingApprovalPaymentFacade.pendingApprovalMainList$;
  pendingApprovalSubmittedSummary$ = this.pendingApprovalPaymentFacade.pendingApprovalSubmittedSummary$;
  pendingApprovalSubmit$ = this.pendingApprovalPaymentFacade.pendingApprovalSubmit$;
  batchDetailPaymentsList$ = this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsGrid$;
  batchDetailPaymentsCount$ = this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsCount$;
  approvalsExceptionCard$ = this.pendingApprovalGeneralFacade.approvalsGeneralExceptionCardSubjectList$;
  invoiceData$ = this.pendingApprovalGeneralFacade.invoiceData$;
  isInvoiceLoading$ = this.pendingApprovalGeneralFacade.isInvoiceLoading$;
  submitGenerealRequest$ = this.pendingApprovalGeneralFacade.submitGenerealRequest$;
  possibleMatchData$ = this.importedClaimFacade.possibleMatchData$;
  submitImportedClaims$ = this.importedClaimFacade.submitImportedClaims$;
  savePossibleMatchData$ = this.importedClaimFacade.savePossibleMatchData$;
  approvalPaymentProfilePhoto$ = this.pendingApprovalPaymentFacade.approvalPaymentProfilePhotoSubject

  providerDetailsDialog: any;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  paymentRequestId!: any;
  usersByRole$ = this.userManagementFacade.usersByRole$;
  selectedMasterDetail$ = this.financialVendorFacade.selectedVendor$;
  clinicVendorList$ = this.financialVendorFacade.clinicVendorList$;
  ddlStates$ = this.contactFacade.ddlStates$;
  healthCareForm!: FormGroup;
  clinicVendorLoader$ = this.financialVendorFacade.clinicVendorLoader$;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  drugForm!:  FormGroup;
  insurancePlanForm!: FormGroup;
  insuranceTypelovForPlan$ = this.lovFacade.insuranceTypelovForPlan$;
  pharmacyForm!: FormGroup;
  insuranceVendorForm: FormGroup;
  insuranceProviderForm: FormGroup;
  deliveryMethodLov$ = this.lovFacade.deliveryMethodLov$;
  permissionLevels:any[]=[];
  /** Constructor **/
  constructor(
    private readonly caseManagerFacade: CaseManagerFacade,
    private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
    private pendingApprovalPaymentFacade: PendingApprovalPaymentFacade,
    private userManagementFacade: UserManagementFacade,
    private navigationMenuFacade: NavigationMenuFacade,
    private documentFacade: DocumentFacade,
    private readonly userDataService: UserDataService,
    private readonly pendingApprovalGeneralFacade: PendingApprovalGeneralFacade,
    private readonly cd: ChangeDetectorRef,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private contactFacade: ContactFacade,
    private formBuilder: FormBuilder,
    private readonly importedClaimFacade:ImportedClaimFacade,
    public lovFacade: LovFacade,
    private dialogService: DialogService,
    private drugService: DrugsFacade,
    private insurancePlanFacade : InsurancePlanFacade
  ) {
    this.healthCareForm = this.formBuilder.group({});
    this.drugForm = this.formBuilder.group({});
    this.insurancePlanForm = this.formBuilder.group({});
    this.pharmacyForm = this.formBuilder.group({});
    this.insuranceVendorForm = this.formBuilder.group({});
    this.insuranceProviderForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.loadPendingApprovalPaymentLevel();
    this.userManagementFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
    this.loadTabCount();
    this.contactFacade.loadDdlStates();
    this.lovFacade.getHealthInsuranceTypeLovsForPlan();
    this.lovFacade.getDeliveryMethodLovs();
    this.loadPendingApprovalGeneralCount();
    this.loadPendingApprovalImportedClaimCount();
    this.loadPendingApprovalPaymentCount();
  }

  loadPendingApprovalGeneralCount()
  {
    this.submitGenerealRequest$.subscribe((response: any) => {
      if (response) {
        this.navigationMenuFacade.getPendingApprovalGeneralCount();
      }
      this.cd.detectChanges();
    });
  }

  loadPendingApprovalImportedClaimCount()
  {
    this.importedClaimsCount$.subscribe((response: any) => {
      if (response) {
        this.navigationMenuFacade.getPendingApprovalImportedClaimCount();
      }
      this.cd.detectChanges();
    });
  }

  loadPendingApprovalPaymentCount()
  {
    this.pendingApprovalSubmit$.subscribe((response: any) => {
      if (response) {
        this.navigationMenuFacade.getPendingApprovalPaymentCount(
          this.permissionLevels
        );
      }
      this.cd.detectChanges();
    });
  }
  permissionServiceAndLevelArray:any[]=[];

  loadTabCount(){
    this.loadPendingApprovalPaymentLevel();
    this.navigationMenuFacade.getPendingApprovalGeneralCount();
    this.navigationMenuFacade.getPendingApprovalImportedClaimCount();
    this.pendingApprovalPaymentCount$.subscribe((response: any) => {
      if (response) {
        this.pendingApprovalPaymentCount = response;
      }
      this.cd.detectChanges();
    });
    
    this.cd.detectChanges();

    this.pendingApprovalGeneralCount$.subscribe((response: any) => {
      if (response) {
        this.pendingApprovalGeneralCount = response;
      }
      this.cd.detectChanges();
    });

    this.pendingApprovalImportedClaimCount$.subscribe((response: any) => {
      if (response) {
        this.pendingApprovalImportedClaimCount = response;
      }
      this.cd.detectChanges();
    });
  }

  loadApprovalsGeneralGrid(event: any): void {
    this.pendingApprovalGeneralFacade.loadApprovalsGeneral();
  }
  
  loadPendingApprovalPaymentLevel() {
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.permissionLevels=[];
        this.pendingApprovalPaymentCount = 0;
        let level = this.setPermissionLevel(ApprovalLimitPermissionCode.InsurancePremiumPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.InsurancePremium,level);       

        level = this.setPermissionLevel(ApprovalLimitPermissionCode.MedicalClaimPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.TpaClaim,level);

        level = this.setPermissionLevel(ApprovalLimitPermissionCode.PharmacyPermissionCode);
        this.addItemToArray(PendingApprovalPaymentTypeCode.PharmacyClaim,level);

        this.navigationMenuFacade.getPendingApprovalPaymentCount(
          this.permissionLevels
        );
      }
    });
  }
  
  addItemToArray(serviceTypeCode:string,level:number)
  {
    let object = {
      serviceTypeCode : serviceTypeCode,
      level : level
    };
    this.permissionLevels.push(object);
  }
  setPermissionLevel(ifPermission : any)
  {
    if(this.userManagementFacade.hasPermission([ifPermission]))
    {
      return UserLevel.Level1Value;
    }
    let maxApprovalAmount = this.userManagementFacade.getUserMaxApprovalAmount(ifPermission);
    if(maxApprovalAmount != undefined && maxApprovalAmount > 0)
    {
      return UserLevel.Level1Value;
    }
    else
    {
      return UserLevel.Level2Value;
    }
  }

  loadApprovalsPaymentsGrid(gridDataValue: any): void {
    this.userLevel = gridDataValue.level;
    if (
      !gridDataValue.selectedPaymentType ||
      gridDataValue.selectedPaymentType.length == 0
    ) {
      return;
    }
    this.dataExportParameters = gridDataValue;
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentGrid(
      gridDataValue,
      gridDataValue.selectedPaymentType,
      gridDataValue.level
    );
  }

  loadImportedClaimsGrid(gridDataValue: any): void {
    this.dataExportParameters = gridDataValue;
    this.navigationMenuFacade.getPendingApprovalImportedClaimCount();
    this.importedClaimFacade.loadImportedClaimsLists(gridDataValue);
  }
 
  loadApprovalsPaymentsMain(gridDataValue: any): void {
    if (
      !gridDataValue.selectedPaymentType ||
      gridDataValue.selectedPaymentType.length == 0
    ) {
      return;
    }
    this.pendingApprovalPaymentFacade.getPendingApprovalPaymentMainList(
      gridDataValue,
      gridDataValue.selectedPaymentType,
      this.userLevel
    );
  }

  loadBatchDetailPaymentsGrid(gridDataValue: any): void {
    if (!gridDataValue.batchId || gridDataValue.batchId.length == 0) {
      return;
    }
    this.pendingApprovalPaymentFacade.getPendingApprovalBatchDetailPaymentsGrid(
      gridDataValue,
      gridDataValue.batchId,
      gridDataValue.selectedPaymentType
    );
  }

  loadSubmittedSummary(events: any): void {
    this.pendingApprovalPaymentFacade.loadSubmittedSummary(events);
  }
  submitData(events: any) {
    this.pendingApprovalPaymentFacade.submitForApproval(events);
  }

  exportPendingApprovalGridData() {
    const data = this.dataExportParameters;
    if (data) {
      const filter = JSON.stringify(data?.gridDataRefinerValue.filter);

      const approvalPageAndSortedRequest = {
        SortType: data?.gridDataRefinerValue.sortType,
        Sorting: data?.gridDataRefinerValue.sortColumn,
        SkipCount: data?.gridDataRefinerValue.skipcount,
        MaxResultCount: data?.gridDataRefinerValue.maxResultCount,
        Filter: filter,
      };
      let fileName =
        data.selectedPaymentType[0].toUpperCase() +
        data.selectedPaymentType.substr(1).toLowerCase() +
        '_approvals';

      this.documentFacade.getExportFile(
        approvalPageAndSortedRequest,
        `payment-batches?serviceType=${data.selectedPaymentType}&level=${this.userLevel}`,
        fileName
      );
    }
  }

  exportImportedClaimsGridData() {
    const data = this.dataExportParameters;
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const approvalPageAndSortedRequest = {
        SortType: data?.sortType,
        Sorting: data?.sort,
        SkipCount: data?.skipCount,
        MaxResultCount: data?.pageSize,
        Filter: filter,
      };
      let fileName = 'imported_claim_approvals';

      this.documentFacade.getExportFile(
        approvalPageAndSortedRequest,
        `imported-claims`,
        fileName
      );
    }
  }

  loadCasereassignmentExpanedInfoParentEvent(approvalId: any) {
    this.pendingApprovalGeneralFacade.loadCasereassignmentExpandedInfo(
      approvalId
    );
  }

  submitGeneralRequests(requests: any) {
    this.pendingApprovalGeneralFacade.submitGeneralRequests(requests);
  }

  getMasterDetails(userObject: any) {
    if (
      userObject.subTypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      userObject.subTypeCode ===
        PendingApprovalGeneralTypeCode.DentalProvider ||
      userObject.subTypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      userObject.subTypeCode ===
        PendingApprovalGeneralTypeCode.MedicalProvider ||
      userObject.subTypeCode ===
        PendingApprovalGeneralTypeCode.InsuranceProvider ||
      userObject.subTypeCode ===
        PendingApprovalGeneralTypeCode.InsuranceVendor ||
      userObject.subTypeCode === PendingApprovalGeneralTypeCode.Pharmacy
    ) {
      this.financialVendorFacade.getVendorDetails(userObject.approvalEntityId, false);
       this.selectedMasterDetail$ = this.financialVendorFacade.selectedVendor$;
    } else if (
      userObject.subTypeCode === PendingApprovalGeneralTypeCode.Drug ||
      userObject.subTypeCode === PendingApprovalGeneralTypeCode.InsurancePlan
    ) {
      this.pendingApprovalGeneralFacade.getMasterDetails(
        userObject.approvalEntityId,
        userObject.subTypeCode
      );
      this.selectedMasterDetail$ =
        this.pendingApprovalGeneralFacade.selectedMasterDetail$;

    }
  }

  buildVendorForm() {
    let form = this.formBuilder.group({
      providerName: [''],
      firstName: [''],
      lastName: [],
      tinNumber: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: ['',Validators.pattern('^[A-Za-z0-9 \-]+$')],
      contactName:[''],
      contactPhone:[''],
      contactFax:[''],
      contactEmail:['',Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]
    });
    this.healthCareForm = form;
  }

  editClicked(subTypeCode : any){
    if(subTypeCode == PendingApprovalGeneralTypeCode.DentalClinic ||
      subTypeCode == PendingApprovalGeneralTypeCode.MedicalClinic ||
      subTypeCode ==  PendingApprovalGeneralTypeCode.DentalProvider ||
      subTypeCode ==  PendingApprovalGeneralTypeCode.MedicalProvider)
    {
      this.buildVendorForm();
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.Drug)
    {
      this.buildDrugForm();
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.buildInsurancePlanForm();
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.Pharmacy) {
      this.buildPharmacyForm();
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.InsuranceVendor) {
      this.buildInsuranceVendorForm();
    } else if (subTypeCode == PendingApprovalGeneralTypeCode.InsuranceProvider) {
      this.buildInsuranceProviderForm();
    }
  }

  searchClinicVendorClicked(clientName: any) {
    this.financialVendorFacade.searchClinicVendor(clientName);
  }

  updateMasterDetailsClicked(event: any){
    if(event.subTypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.Pharmacy ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceVendor ||
      event.subTypeCode === PendingApprovalGeneralTypeCode.InsuranceProvider) {
        this.financialVendorFacade.updateVendorProfile(event.form);
      } else if (event.subTypeCode === PendingApprovalGeneralTypeCode.Drug) {
        this.drugService.updateDrugVendor(event.form);
    } else if (event.subTypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.insurancePlanFacade.updateInsurancePlan(event.form);
    }
  }

  onProviderNameClick(event: any) {
    this.paymentRequestId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event);
  }

  updateProviderProfile(event: any) {
    this.financialVendorFacade.updateProviderPanel(event);
  }

  onEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }

  buildDrugForm() {
    let form = this.formBuilder.group({
      providerName: [''],
      drugName:[''],
      brandName :[''],
      ndcCode : [''],
      drugType: [''],
      deliveryMethod : ['']
    })
    this.drugForm = form;
  }

  buildInsurancePlanForm() {
    let form = this.formBuilder.group({
      providerName: [''],
      termDate: [''],
      startDate: [''],
      dentalPlanFlag: [''],
      canPayForMedicationFlag: [''],
      healthInsuranceTypeCode: [''],
      insurancePlanName: ['']
    })
    this.insurancePlanForm = form
  }

  buildPharmacyForm() {
    let form = this.formBuilder.group({
      pharmacyName : [''],
      tin:[''],
      npi:[''],
      preferredPharmacy: [''],
      mailCode:[''],
      paymentMethod:[''],
      contactName: [''],
      contactLastName:[''],
      contactPhone: [''],
      contactFax:[''],
      contactEmail:['',Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]
    });
    this.pharmacyForm = form;
  }

  buildInsuranceVendorForm() {
    let form = this.formBuilder.group({
      vendorName:[''],
      nameOnCheck:[''],
      nameOnEnvelop:[''],
      tin:[''],
      addressline1:[''],
      addressline2:[''],
      city:[''],
      state:[''],
      zip:[''],
      mailCode:[''],
      paymentMethod:[''],
      acceptsCombinedPayments:[''],
      acceptsReport:[''],
      paymentRunDate:[''],
      contactName: [''],
      contactLastName:[''],
      contactPhone: [''],
      contactFax:[''],
      contactEmail:['',Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,60}$/)]
    });
    this.insuranceVendorForm = form;
  }

  buildInsuranceProviderForm() {
    let form = this.formBuilder.group({
      providerName : ['']
    });
    this.insuranceProviderForm = form;
  }

  submitImportedClaims(claims : any)
  {
    this.importedClaimFacade.submitImportedClaims(claims);
  }

  loadPossibleMatch(event: any)
  {
    this.importedClaimFacade.loadPossibleMatch(event);
  }

  savePossibleMatch(event:any)
  {
    this.importedClaimFacade.savePossibleMatch(event);
  }
  updateClientPolicy(importedclaimDto: any){
    this.importedClaimFacade.updateClientPolicy(importedclaimDto);
  }

  addAnException(exceptionObject : any){
    this.importedClaimFacade.makeExceptionForExceedBenefits(exceptionObject);
  }
}
