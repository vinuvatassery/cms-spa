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
  ApprovalFacade,
  PendingApprovalGeneralFacade,
  PendingApprovalGeneralTypeCode,
  PendingApprovalPaymentFacade,
  UserRoleType,
  FinancialVendorFacade,
  ContactFacade,
  DrugsFacade,
  InsurancePlanFacade,
  ImportedClaimFacade,
} from '@cms/case-management/domain';
import {
  ReminderNotificationSnackbarService,
  ReminderSnackBarNotificationType,
  DocumentFacade,
  ApiType,
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
  sortValueGeneralAPproval = this.approvalFacade.sortValueGeneralAPproval;
  sortGeneralList = this.approvalFacade.sortGeneralList;
  sortApprovalPaymentsList =
    this.pendingApprovalPaymentFacade.sortApprovalPaymentsList;
  sortValueApprovalPaymentsApproval =
    this.pendingApprovalPaymentFacade.sortValueApprovalPaymentsApproval;
  sortImportedClaimsList = this.importedClaimFacade.sortImportedClaimsList;
  sortValueImportedClaimsAPproval =
    this.importedClaimFacade.sortValueImportedClaimsAPproval;
  exportButtonShow$ = this.documentFacade.exportButtonShow$;
  pendingApprovalPaymentsCount$ =
    this.pendingApprovalPaymentFacade.pendingApprovalPaymentsCount$;

  userLevel = UserLevel.Level1Value;
  pendingApprovalCount = 0;
  state!: State;
  approvalsGeneralLists$ =
    this.pendingApprovalGeneralFacade.approvalsGeneralList$;
  approvalsImportedClaimsLists$ =
    this.importedClaimFacade.approvalsImportedClaimsLists$;
  pendingApprovalCount$ = this.navigationMenuFacade.pendingApprovalCount$;
  approvalsPaymentsLists$ =
    this.pendingApprovalPaymentFacade.pendingApprovalGrid$;
  approvalsPaymentsMainLists$ =
    this.pendingApprovalPaymentFacade.pendingApprovalMainList$;
  pendingApprovalSubmittedSummary$ =
    this.pendingApprovalPaymentFacade.pendingApprovalSubmittedSummary$;
  pendingApprovalSubmit$ =
    this.pendingApprovalPaymentFacade.pendingApprovalSubmit$;
  batchDetailPaymentsList$ =
    this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsGrid$;
  batchDetailPaymentsCount$ =
    this.pendingApprovalPaymentFacade.pendingApprovalBatchDetailPaymentsCount$;
  approvalsExceptionCard$ =
    this.pendingApprovalGeneralFacade.approvalsGeneralExceptionCardSubjectList$;
  invoiceData$ = this.pendingApprovalGeneralFacade.invoiceData$;
  isInvoiceLoading$ = this.pendingApprovalGeneralFacade.isInvoiceLoading$;
  submitGenerealRequest$ =
    this.pendingApprovalGeneralFacade.submitGenerealRequest$;

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
  /** Constructor **/
  constructor(
    private readonly approvalFacade: ApprovalFacade,
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
    this.getUserRole();
    this.userManagementFacade.getUsersByRole(UserDefaultRoles.CACaseWorker);
    this.pendingApprovalPaymentsCount$.subscribe((response: any) => {
      if (response) {
        this.navigationMenuFacade.getAllPendingApprovalPaymentCount(
          this.userLevel
        );
      }
    });
    this.pendingApprovalCount$.subscribe((response: any) => {
      if (response) {
        this.pendingApprovalCount = response;
      } else {
        this.pendingApprovalCount = 0;
      }
      this.cd.detectChanges();
    });
    this.contactFacade.loadDdlStates();
    this.lovFacade.getHealthInsuranceTypeLovsForPlan();
  }

  loadApprovalsGeneralGrid(event: any): void {
    this.pendingApprovalGeneralFacade.loadApprovalsGeneral();
  }

  getUserRole() {
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        if (this.userManagementFacade.hasRole(UserRoleType.Level2)) {
          this.userLevel = UserLevel.Level2Value;
        } else if (this.userManagementFacade.hasRole(UserRoleType.Level1)) {
          this.userLevel = UserLevel.Level1Value;
        }
        this.navigationMenuFacade.getAllPendingApprovalPaymentCount(
          this.userLevel
        );
      }
    });
  }

  loadApprovalsPaymentsGrid(gridDataValue: any): void {
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
      this.userLevel
    );
  }

  loadImportedClaimsGrid(event: any): void {
    this.importedClaimFacade.loadImportedClaimsLists(event);
  }
  notificationTriger() {
    this.approvalFacade.NotifyShowHideSnackBar(
      ReminderSnackBarNotificationType.LIGHT,
      ' Generic reminder displays at 9AM on the day of the reminder Generic reminder displays at 9AM on the day of the reminder'
    );
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
        fileName,
        ApiType.ProductivityToolsApi
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
      zip: [''],
      contactFirstName:[''],
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
    console.log(event);
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
      contactFirstName: [''],
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
      mailCode:[''],
      paymentMethod:[''],
      acceptsCombinedPayments:[''],
      acceptsReport:[''],
      paymentRunDate:[''],
      contactFirstName: [''],
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

}
