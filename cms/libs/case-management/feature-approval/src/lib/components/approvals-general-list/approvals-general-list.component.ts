/** Angular **/
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Observable, Subject, Subscription } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { InsurancePlanFacade, PendingApprovalGeneralTypeCode } from '@cms/case-management/domain';
import {
  UserDataService,
  UserManagementFacade,
} from '@cms/system-config/domain';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'productivity-tools-approvals-general-list',
  templateUrl: './approvals-general-list.component.html',
})
export class ApprovalsGeneralListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('submitRequestModalDialog', { read: TemplateRef })
  submitRequestModalDialog!: TemplateRef<any>;

  loginUserId!: any;
  isPanelExpanded = false;
  ifApproveOrDeny: any;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalGeneralGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() gridSkipCount: any;
  @Input() approvalsGeneralLists$: any;
  @Input() clientsSubjects$: any;
  @Input() casereassignmentExpandedInfo$: any;
  @Input() submitGenerealRequest$: any;
  @Input() drugForm!:  FormGroup;
  @Input() insurancePlanForm! : FormGroup;
  @Input() insuranceTypelovForPlan$:any;
  @Input() pharmacyForm!:FormGroup;
  @Input() insuranceVendorForm!:FormGroup;
  @Input() insuranceProviderForm!:FormGroup;
  @Output() loadApprovalsGeneralGridEvent = new EventEmitter<any>();
  @Output() loadCasereassignmentExpanedInfoParentEvent = new EventEmitter<any>();
  @Output() submitGeneralRequestsEvent = new EventEmitter<any>();
  @Input() clinicVendorLoader$!: Observable<any>;
  @Output() onVendorClickedEvent = new EventEmitter<any>();
  submitGenerealRequestSubscription! : Subscription;
  approvalsGeneralListsSubscription! : Subscription;
  pendingApprovalGeneralTypeCode: any;
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isSubmitGeneralRequest = false;
  tAreaCessationMaxLength: any = 200;
  approveStatus: string = 'APPROVED';
  denyStatus: string = 'DENIED';
  sendbackNotesRequireMessage: string = 'Reason for Denial is required.';
  approvalsPaymentsGridPagedResult: any = [];
  approvalsPaymentsGridUpdatedResult: any = [];
  hasDisabledSubmit: boolean = true;
  pageValidationMessage: any = null;
  caseReassignmentsCount = 0;
  exceptionsCount = 0;
  listManagementItemsCount = 0;
  gridApprovalGeneralDataSubject = new Subject<any>();
  gridApprovalGeneralBatchData$ =
    this.gridApprovalGeneralDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private editListITemsDialog: any;
  private submitRequestDialogService: any;

  approvalId!: number;
  selectedIndex: any;
  @ViewChild('editListItemDialogModal') editModalTemplate!: TemplateRef<any>;
  @Input() usersByRole$: any;
  @Output() getMasterDetailsEvent = new EventEmitter<any>();
  @Input() selectedMasterDetail$: any;
  selectedSubtypeCode: any;
  @Input() clinicVendorList$:any;
  @Input() ddlStates$ : any;
  @Output() editClickedEvent = new EventEmitter<any>();
  @Input() healthCareForm!: FormGroup;
  @Output() searchClinicVendorClicked = new EventEmitter<any>();
  @Output() updateMasterDetailsClickedEvent = new EventEmitter<any>();
  selectedMasterData!:any;
  selectedMasterDetailSubscription! : Subscription;
  currentlyExpandedPanelId: any;
  @Input() deliveryMethodLov$! : any;
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  /** Constructor **/
  constructor(
    private route: Router,
    private dialogService: DialogService,
    private readonly cd: ChangeDetectorRef,
    private readonly userDataService: UserDataService,
    private readonly loginUserFacade: UserManagementFacade,
    private readonly insurancePlanFacade: InsurancePlanFacade
  ) {}

  ngOnInit(): void {
    this.getMasterData();
    this.loadApprovalGeneralListGrid();
    this.pendingApprovalGeneralTypeCode = PendingApprovalGeneralTypeCode;
    this.getLoggedInUserProfile();
    this.subscribeToSubmitGeneralRequest();
  }

  subscribeToSubmitGeneralRequest(){
    this.submitGenerealRequestSubscription = this.submitGenerealRequest$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.onCloseSubmitGeneralRequestClicked();
        this.loadApprovalGeneralListGrid();
      }
    });
  }

  private getMasterData() {
    this.selectedMasterDetailSubscription = this.selectedMasterDetail$.subscribe((value: any) => {
      this.selectedMasterData = value
    });
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: 0,
      sort: this.sort,
    };
  }

  private loadApprovalGeneralListGrid(): void {
    this.loadApprovalGeneral(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadApprovalGeneral(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isApprovalGeneralGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadApprovalsGeneralGridEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batch',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
    stateData.filter = this.filterData;
    this.dataStateChange(stateData);
  }

  defaultGridState() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadApprovalGeneralListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadApprovalGeneralListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.approvalsGeneralListsSubscription = this.approvalsGeneralLists$.subscribe((response: any) => {
      if (response.length > 0) {
        this.approvalsPaymentsGridPagedResult = response.map((item: any) => ({
          ...item,
          sendBackNotesInValidMsg: '',
          sendBackNotesInValid: false,
          isExpanded: false,
        }));
        this.tAreaVariablesInitiation(this.approvalsPaymentsGridPagedResult);
        this.isApprovalGeneralGridLoaderShow = false;
        this.gridApprovalGeneralDataSubject.next(
          this.approvalsPaymentsGridPagedResult
        );
        if (response?.total >= 0 || response?.total === -1) {
          this.isApprovalGeneralGridLoaderShow = false;
        }
        this.cd.detectChanges();
      } else {
        this.approvalsPaymentsGridPagedResult = response;
        this.isApprovalGeneralGridLoaderShow = false;
        this.cd.detectChanges();
      }
    });
    this.isApprovalGeneralGridLoaderShow = false;
    this.cd.detectChanges();
  }

  public onPanelExpand(item: any): void {
    if (
      item.approvalTypeCode ===
      PendingApprovalGeneralTypeCode.MasterList
    ) {
      const userObject = {
        approvalEntityId: item.approvalEntityId,
        subTypeCode: item.subTypeCode,
      };
      this.currentlyExpandedPanelId = item.approvalEntityId;
      this.selectedSubtypeCode = item.subTypeCode;
      this.getMasterDetailsEvent.emit(userObject);
      this.isPanelExpanded = true;
      this.cd.detectChanges();
    }
  }

  approveOrDeny(index: any, result: any) {
    this.selectedIndex = index;
    this.ifApproveOrDeny = result;
  }

  onEditListItemsDetailClicked(template: TemplateRef<unknown>): void {
    this.editListITemsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onSubmitClicked(template: TemplateRef<unknown>): void {
    this.submitRequestDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseEditListItemsDetailClicked() {
    this.editListITemsDialog.close();
  }

  getTitle(approvalTypeCode: string, subTypeCode: string) {
    switch (approvalTypeCode) {
      case PendingApprovalGeneralTypeCode.ClaimException:
        return 'Request to Exceed Max Benefits';
      case PendingApprovalGeneralTypeCode.CaseReassignment:
        return 'Request for Case Re-Assignment';
      case PendingApprovalGeneralTypeCode.MasterList:
        return this.getMasterlistTitle(subTypeCode);
    }
    return null;
  }
  openEditModal(event: any) {
    if (event) {
      this.selectedMasterData = event.vendorData;
      this.editClickedEvent.emit(event.subTypeCode);
      this.onEditListItemsDetailClicked(this.editModalTemplate);
    }
  }

  getMasterlistTitle(subTypeCode: string) {
    switch (subTypeCode) {
      case PendingApprovalGeneralTypeCode.DentalClinic:
        return 'Request to add new Dental Clinics to the list';
      case PendingApprovalGeneralTypeCode.MedicalClinic:
        return 'Request to add new Medical Clinics to the list';
      case PendingApprovalGeneralTypeCode.MedicalProvider:
        return 'Request to add new Medical Provider to the list';
      case PendingApprovalGeneralTypeCode.DentalProvider:
        return 'Request to add new Dental Provider to the list';
      case PendingApprovalGeneralTypeCode.InsuranceVendor:
        return 'Request to Add new Insurance Vendor to the list';
      case PendingApprovalGeneralTypeCode.Pharmacy:
        return 'Request to Add new Pharmacy to the list';
      case PendingApprovalGeneralTypeCode.Drug:
        return 'Request to Add New Drug to the list';
      case PendingApprovalGeneralTypeCode.InsurancePlan:
        return 'Request to Add new Insurance Plan to the list';
      case PendingApprovalGeneralTypeCode.InsuranceProvider:
        return 'Request to Add new Insurance Provider to the list';
    }
    return null;
  }
  loadCasereassignmentExpanedInfoEvent(approvalId: any) {
    this.loadCasereassignmentExpanedInfoParentEvent.emit(approvalId);
  }

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;
    if (control === 'sendBackNotes') {
      inValid = dataItem.sendBackNotesInValid;
    }
    if (inValid) {
      document.getElementById(control + rowIndex)?.classList.remove('ng-valid');
      document.getElementById(control + rowIndex)?.classList.add('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.add('ng-dirty');
    } else {
      document
        .getElementById(control + rowIndex)
        ?.classList.remove('ng-invalid');
      document.getElementById(control + rowIndex)?.classList.remove('ng-dirty');
      document.getElementById(control + rowIndex)?.classList.add('ng-valid');
    }
    return 'ng-dirty ng-invalid';
  }

  private tAreaVariablesInitiation(dataItem: any) {
    dataItem.forEach((dataItem: any) => {
      this.calculateCharacterCount(dataItem);
    });
  }

  calculateCharacterCount(dataItem: any) {
    let tAreaCessationCharactersCount = dataItem.sendBackNotes
      ? dataItem.sendBackNotes.length
      : 0;
    dataItem.tAreaCessationCounter = `${tAreaCessationCharactersCount}/${this.tAreaCessationMaxLength}`;
  }

  sendBackNotesChange(dataItem: any) {
    if (
        dataItem.status !== null &&
        dataItem.status === this.denyStatus &&
        dataItem.status !== undefined
      ) {
      if ( dataItem.sendBackNotesInValid && !(
        dataItem.sendBackNotes == null ||
        dataItem.sendBackNotes === undefined ||
        dataItem.sendBackNotes === '')
      ) {
        dataItem.sendBackNotesInValid = false;
        dataItem.sendBackNotesInValidMsg = null;
      }
    }
    this.assignRowDataToMainList(dataItem);
  }

  onSubmitPendingApprovalGeneralClicked() {
    this.validateApprovalsPaymentsGridRecord();
    const isValid = this.approvalsPaymentsGridPagedResult.filter(
      (x: any) => x.sendBackNotesInValid
    );
    const totalCount = isValid.length;
    if (isValid.length > 0) {
      this.pageValidationMessage =
        totalCount +
        ' Validation error(s) found, please review each page for errors.';
    } else if (
      this.approvalsPaymentsGridPagedResult.filter(
        (x: any) =>
          x.status == this.approveStatus || x.status == this.denyStatus
      ).length <= 0
    ) {
      this.pageValidationMessage = 'No data for approval';
    } else {
      this.pageValidationMessage = null;
      this.approvalsPaymentsGridUpdatedResult =
        this.approvalsPaymentsGridPagedResult.filter(
          (x: any) =>
            x.status == this.approveStatus || x.status == this.denyStatus
        );
      this.caseReassignmentsCount =
        this.approvalsPaymentsGridUpdatedResult.filter(
          (x: any) =>
            x.approvalTypeCode ===
            this.pendingApprovalGeneralTypeCode.CaseReassignment
        ).length;

      this.listManagementItemsCount =
        this.approvalsPaymentsGridUpdatedResult.filter(
          (x: any) =>
            x.approvalTypeCode ===
            this.pendingApprovalGeneralTypeCode.MasterList
        ).length;

      this.exceptionsCount = this.approvalsPaymentsGridUpdatedResult.filter(
        (x: any) =>
          x.approvalTypeCode ===
          this.pendingApprovalGeneralTypeCode.ClaimException
      ).length;
      
      this.onSubmitClicked(this.submitRequestModalDialog);
    }
  }

  validateApprovalsPaymentsGridRecord() {
    this.approvalsPaymentsGridPagedResult.forEach((currentPage: any, index: number) => {
      if (
        currentPage.status !== null &&
        currentPage.status === this.denyStatus &&
        currentPage.status !== undefined
      ) {
        if (
          currentPage.sendBackNotes == null ||
          currentPage.sendBackNotes === undefined ||
          currentPage.sendBackNotes === ''
        ) {
          currentPage.sendBackNotesInValid = true;
          currentPage.sendBackNotesInValidMsg =
            this.sendbackNotesRequireMessage;
        }
        else
        {
          currentPage.sendBackNotesInValid = false;
          currentPage.sendBackNotesInValidMsg = null;
        }
      } else {
        currentPage.sendBackNotesInValid = false;
        currentPage.sendBackNotesInValidMsg = null;
      }
    });
    this.assignPagedGridItemToUpdatedList(this.approvalsGeneralLists$);
  }

  assignPagedGridItemToUpdatedList(dataItem: any) {
    dataItem.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    });
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.approvalsPaymentsGridPagedResult.find((x: any) =>x.generalPendingApprovalId === dataItem.generalPendingApprovalId);
    if (ifExist !== undefined) {
      this.approvalsPaymentsGridPagedResult.forEach(
        (item: any, index: number) => {
          if (item.generalPendingApprovalId === ifExist.generalPendingApprovalId) {
            this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
            this.approvalsPaymentsGridPagedResult[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
            this.approvalsPaymentsGridPagedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
            this.approvalsPaymentsGridPagedResult[index].status = dataItem?.status;
            this.approvalsPaymentsGridPagedResult[index].sendBackNotes = dataItem?.sendBackNotes;
            this.approvalsPaymentsGridPagedResult[index].caseWorkerId = dataItem?.caseWorkerId;
          }
        }
      );
    }
  }

  onRowLevelApproveClicked(
    e: boolean,
    dataItem: any
  ) {
    dataItem.sendBackNotes = '';
    if (
      dataItem.status === undefined ||
      dataItem.status === '' ||
      dataItem.status === null
    ) {
      dataItem.status = this.approveStatus;
      dataItem.isExpanded = true;
    } else if (dataItem.status == this.approveStatus) {
      dataItem.status = '';
      dataItem.sendBackNotes = '';
      dataItem.isExpanded = false;
    } else if (dataItem.status == this.denyStatus) {
      dataItem.status = this.approveStatus;
      dataItem.isExpanded = true;
    }
    this.isPanelExpanded = dataItem.isExpanded;
    if (
      dataItem.approvalTypeCode ===
      PendingApprovalGeneralTypeCode.MasterList
    )
    {
      this.isPanelExpanded = dataItem.isExpanded = false;
    }
    this.calculateCharacterCount(dataItem);
    this.cd.detectChanges();
    this.assignRowDataToMainList(dataItem);
    this.enableSubmitButton();
    this.cd.detectChanges();
  }

  onRowLevelDenyClicked(
    e: boolean,
    dataItem: any
  ) {
    dataItem.isExpanded = false;
    if (
      dataItem.status === undefined ||
      dataItem.status === '' ||
      dataItem.status === null
    ) {
      dataItem.status = this.denyStatus;
    } else if (dataItem.status == this.denyStatus) {
      dataItem.status = '';
      dataItem.sendBackNotes = '';
    } else {
      dataItem.status = this.denyStatus;
    }
    if (
      dataItem.approvalTypeCode ===
      PendingApprovalGeneralTypeCode.MasterList
    )
    {
      this.isPanelExpanded = dataItem.isExpanded;
    }
    this.calculateCharacterCount(dataItem);
    this.cd.detectChanges();
    this.assignRowDataToMainList(dataItem);
    this.enableSubmitButton();
    this.cd.detectChanges();
  }

  enableSubmitButton() {
    const totalCount = this.approvalsPaymentsGridPagedResult.filter(
      (x: any) => x.status == this.approveStatus || x.status == this.denyStatus
    ).length;
    this.hasDisabledSubmit = totalCount <= 0;
    this.cd.detectChanges();
  }

  getLoggedInUserProfile() {
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loginUserId = profile[0]?.loginUserId;
      }
    });
  }

  onCloseSubmitGeneralRequestClicked() {
    this.submitRequestDialogService.close();
  }

  makeRequestData() {
    let requests = [{}];
    for (let element of this.approvalsPaymentsGridUpdatedResult) {
      let request = {
        approvalId: element.generalPendingApprovalId,
        approvalTypeCode: element.approvalTypeCode,
        entityId: element.approvalEntityId,
        statusCode: element.status,
        denialDescription: element.sendBackNotes ? element.sendBackNotes : null,
        approvedUserId: this.loginUserId,
        asignedCaseWorkerId: element.caseWorkerId,
        entityType: element.approvalEntityType,
      };
      requests.push(request);
    }
    requests.splice(0, 1);
    this.submit(requests);
  }

  submit(data: any) {
    this.submitGeneralRequestsEvent.emit(data);
  }

  searchClinicClicked(event: any) {
    this.searchClinicVendorClicked.emit(event);
  }

  updateMasterDetailsClicked(event:any) {
    this.updateMasterDetailsClickedEvent.emit(event);
  }

  onProviderNameClick(paymentRequestId: any) {
    this.onVendorClickedEvent.emit(paymentRequestId);
  }

  recordUpdate(event:any){
      this.onCloseEditListItemsDetailClicked();
      const userObject = {
        approvalEntityId: this.currentlyExpandedPanelId,
        subTypeCode: this.selectedSubtypeCode,
      };
      this.getMasterDetailsEvent.emit(userObject);
  }

  ngOnDestroy(): void {
    this.submitGenerealRequestSubscription?.unsubscribe();
    this.selectedMasterDetailSubscription?.unsubscribe();
    this.approvalsGeneralListsSubscription?.unsubscribe();

  }
}
