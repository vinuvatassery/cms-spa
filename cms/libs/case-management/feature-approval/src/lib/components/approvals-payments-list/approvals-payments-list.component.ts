/** Angular **/
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { ColumnVisibilityChangeEvent, GridDataResult, RowArgs } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subject, Subscription } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  LovFacade,
  UserManagementFacade,
  UserDataService,
  UserLevel
} from '@cms/system-config/domain';
import {
  ApprovalTypeCode,
  ApprovalLimitPermissionCode,
  PendingApprovalPaymentTypeCode,
} from '@cms/case-management/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-approvals-payments-list',
  templateUrl: './approvals-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsPaymentsListComponent implements OnInit, OnChanges {
  isSubmitApprovalPaymentItems = false;
  isViewPaymentsBatchDialog = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isApprovalPaymentsGridLoaderShow = false;
  selectedApprovalId?: string | null = null;
  approvalPermissionCode: any;
  loginUserId!: any;
  @Input() pendingApprovalSubmit$: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() approvalsPaymentsLists$: any;
  @Input() approvalsPaymentsMainLists$: any;
  @Input() pendingApprovalSubmittedSummary$: any;
  @Input() batchDetailPaymentsList$: any;
  @Input() exportButtonShow$: any;
  @Input() userLevel: any;
  @Input() approvalPaymentProfilePhoto$!: any;
  @Output() loadApprovalsPaymentsGridEvent = new EventEmitter<any>();
  @Output() loadApprovalsPaymentsMainListEvent = new EventEmitter<any>();
  @Output() loadSubmittedSummaryEvent = new EventEmitter<any>();
  @Output() submitEvent = new EventEmitter<any>();
  @Output() loadBatchDetailPaymentsGridEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  readonly paymentTypeCode = PendingApprovalPaymentTypeCode;
  readonly UserLevel = UserLevel;
  public state!: State;
  sortColumn = 'batchName';
  sortDir = '';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  gridDataResult!: GridDataResult;
  pendingApprovalGridDataResult: any;
  approvalTypeCode!: any;
  approveStatus: string = 'APPROVED';
  sendbackStatus: string = 'SEND_BACK';
  hasPaymentPendingApproval: boolean = true;
  sendbackNotesRequireMessage: string = 'Send Back Note is required.';
  atleastOnePaymentRequireMessage: string = 'Selection of at least one payment is required.';
  dataItem:any;
  tAreaCessationMaxLength: any = 200;
  approveBatchCount: any = 0;
  sendbackBatchCount: any = 0;
  pageValidationMessage: any = null;
  isApproveAllClicked: boolean = false;
  approvalsPaymentsGridPagedResult: any = [];
  approvalsPaymentsGridUpdatedResult: any = [];
  approvalsPaymentsGridUpdatedResultDummy: any = [];
  selectedApprovalSendbackDataRows: any[] = [];
  selectedBatchIds: any = [];
  totalAmountSubmitted: any = 0;
  requestedCheck: any = 0;
  requestedACHPayments: any = 0;
  requestedDORHoldPayments: any = 0;
  gridApprovalPaymentsMainListDataSubject = new Subject<any>();
  gridApprovalPaymentsMainList$ =this.gridApprovalPaymentsMainListDataSubject.asObservable();

  approvalPaymentsSubmittedSummaryDataSubject = new Subject<any>();
  approvalPaymentsSubmittedSummaryData$ = this.approvalPaymentsSubmittedSummaryDataSubject.asObservable();
  selectedPaymentType: any;
  approverCount = 0;
  sendBackCount = 0;
  batchDetailModalSourceList: any;
  isSendbackMode:boolean=false;
  gridApprovalPaymentsDataSubject = new Subject<any>();
  gridApprovalPaymentsBatchData$ = this.gridApprovalPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  approvalTypeCodeEnum: any = ApprovalTypeCode;
  sortColumnDesc = 'Batch';
  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    batchName: 'Batch',
    providerCount: 'Provider Count',
    totalAmountDue: 'Total Amount',
    carrierCount: 'Carrier Count',
    totalPayments: 'Pmt Count',
    totalClaims: 'Premium Count',
    creationTime: 'Date Approval Requested',
    premiumType: 'Premium Type',
    premiumCount: 'Premium Count',
    dateApprovalRequested: 'Date Approval Requested',
    firstApprovalBy: 'First Approval By'
  };

  dropDownColumns: { columnCode: string; columnDesc: string }[] = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'BatchName',
      columnDesc: 'Batch #',
    },
    {
      columnCode: 'DateApprovalRequested',
      columnDesc: 'Date Approval Requested',
    },
  ];

  selectedColumn = 'ALL';
  filteredByColumnDesc = '';
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns';
  showExportLoader = false;

  private depositDetailsDialog: any;
  paymentStatusLovList: any;
  paymentMethodLovList: any;

  pendingApprovalPaymentType$ = this.lovFacade.pendingApprovalPaymentType$;
  paymentStatusLov$ = this.lovFacade.paymentStatus$;
  paymentMethodLov$ = this.lovFacade.paymentMethodType$;
  paymentStatusLovSubscription!: Subscription;
  paymentMethodLovSubscription!: Subscription;
  paymentType: any;
  isWarningDialogShow: boolean=false;
  providerCountFieldTitle:any="Provider Count";
  constantMaxApprovalAmount:number=10000;
  maxApprovalAmount:number=this.constantMaxApprovalAmount;
  /** Constructor **/
  constructor(
    private route: Router,
    private dialogService: DialogService,
    private readonly cd: ChangeDetectorRef,
    private lovFacade: LovFacade,
    private userManagementFacade: UserManagementFacade,
    private readonly userDataService: UserDataService,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider
  ) {}

  ngOnInit(): any {
    this.getPaymentTypeCode();
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.lovFacade.getPandingApprovalPaymentTypeLov();
    this.defaultPaymentType();
    this.getLoggedInUserProfile();
    this.loadPaymentStatusLov();
    this.loadPaymentMethodLov();
  }

  private getPaymentTypeCode() {
    this.pendingApprovalPaymentType$.subscribe((data) => {
      this.paymentType = data.sort((a: any, b: any) => a.sequenceNbr - b.sequenceNbr);
    });
  }

  private loadPaymentStatusLov(){
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatusLovSubscription = this.paymentStatusLov$.subscribe({
      next:(response) => {
        response.sort((value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr);
        this.paymentStatusLovList = response;
      }
    });
  }

  private loadPaymentMethodLov(){
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodLovSubscription = this.paymentMethodLov$.subscribe({
      next:(response) => {
        response.sort((value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr);
        this.paymentMethodLovList = response;
      }
    });
  }

  private defaultPaymentType() {
    this.pendingApprovalPaymentType$.subscribe({
      next: (value) => {
        this.selectedPaymentType = value[0].lovCode;
        switch (this.selectedPaymentType) {
          case PendingApprovalPaymentTypeCode.TpaClaim: {
            this.approvalPermissionCode =
              ApprovalLimitPermissionCode.MedicalClaimPermissionCode;
            break;
          }
          case PendingApprovalPaymentTypeCode.PharmacyClaim: {
            this.approvalPermissionCode =
              ApprovalLimitPermissionCode.PharmacyPermissionCode;
            break;
          }
          case PendingApprovalPaymentTypeCode.InsurancePremium: {
            this.approvalPermissionCode =
              ApprovalLimitPermissionCode.InsurancePremiumPermissionCode;
            break;
          }
          default: {
            break;
          }
        }
        this.onPaymentTypeCodeValueChange(this.selectedPaymentType);
      },
    });
  }

  ngOnChanges(): void {
    this.setGridValueAndData();
  }

  ngOnDestroy(): void {
    this.paymentStatusLovSubscription.unsubscribe();
    this.paymentMethodLovSubscription.unsubscribe();
  }

  setGridValueAndData() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'batchName', dir: 'desc' }],
    };
  }

  getLoggedInUserProfile() {
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loginUserId = profile[0]?.loginUserId;
      }
    });
  }

  onCloseSubmitApprovalPaymentItemsClicked() {
    this.isSubmitApprovalPaymentItems = false;
  }

  onOpenViewPaymentsBatchClicked(data?: any,isSendbackMode?:any) {
    if(this.userLevel == UserLevel.Level1Value){
      this.isSendbackMode = isSendbackMode;
    }
    this.isViewPaymentsBatchDialog = true;
    this.selectedApprovalId = data?.approvalId;
    this.dataItem=data;
    this.batchDetailModalSourceList =
      this.approvalsPaymentsGridUpdatedResult.map((item: any) => ({ ...item }));
  }

  onCloseViewPaymentsBatchClicked() {
    this.isViewPaymentsBatchDialog = false;
    if(this.isSendbackMode && this.userLevel == UserLevel.Level1Value)
    {
      this.dataItem.batchStatus="";
      this.assignRowDataToMainList(this.dataItem);
      this.enableSubmitButtonMain();
      this.approveAndSendbackCount();
    }
  }

  onBatchModalSaveClicked(data: any) {
    this.isViewPaymentsBatchDialog = false;
    this.approvalsPaymentsGridUpdatedResult = data.map((item: any) => ({
      ...item,
    }));
    this.loadApprovalPaymentsListGrid();
    this.enableSubmitButtonMain();
    this.approveAndSendbackCount();
  }

  onLoadBatchDetailPaymentsList(data?: any) {
    this.loadBatchDetailPaymentsGridEvent.emit(data);
  }
  private loadApprovalPaymentsListGrid(): void {
    this.loadApprovalPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadApprovalPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isApprovalPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      columnName: this.selectedColumn,
      sorting: null,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    let selectedPaymentType = this.selectedPaymentType;
    let level = this.userLevel;
    this.loadApprovalsPaymentsGridEvent.emit({
      gridDataRefinerValue,
      selectedPaymentType,
      level
    });
  }

  onChange(data: any) {
    this.defaultGridState();
    this.setGridValues(data);
  }

  searchColumnChangeHandler(value: string) {
    this.searchValue = '';
    this.filter = [];
    this.onApprovalSearch(this.searchValue);
  }

  onApprovalSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning = (!isDateSearch && this.selectedColumn === 'DateApprovalRequested') && searchValue !== '';
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.onChange(searchValue);
  }

  setGridValues(data: any) {
    if (this.selectedColumn === 'DateApprovalRequested' && (!this.isValidDate(data) && data !== '')) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'BatchName',
              operator:
                this.selectedColumn === 'DateApprovalRequested'
                  ? 'eq'
                  : 'startswith',
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
    this.sortColumn = this.columns[stateData.sort[0]?.field];
    if (this.sort[0]?.dir === undefined) {
      this.sortDir = '';
    }
    if (this.sort[0]?.dir !== undefined) {
      this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    }
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    if (stateData.filter?.filters.length > 0) {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadApprovalPaymentsListGrid();
    this.sortByProperty();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadApprovalPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  getGridDataHandle() {
    this.approvalsPaymentsLists$.subscribe((data: any) => {
      this.approverCount = data.approverCount;
      this.sendBackCount = data.sendBackCount;
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridApprovalPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isApprovalPaymentsGridLoaderShow = false;
      }
    });
  }

  onDepositDetailClicked(template: TemplateRef<unknown>): void {
    this.depositDetailsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseDepositDetailClicked() {
    this.depositDetailsDialog.close();
  }

  onPaymentTypeCodeValueChange(paymentSubTypeCode: any) {
    this.pageValidationMessage = null;
    this.selectedPaymentType = paymentSubTypeCode;
    this.approveBatchCount = 0;
    this.sendbackBatchCount = 0;
    switch (this.selectedPaymentType) {
      case PendingApprovalPaymentTypeCode.TpaClaim: {
        this.providerCountFieldTitle="Provider Count";
        this.approvalPermissionCode =
          ApprovalLimitPermissionCode.MedicalClaimPermissionCode;
        break;
      }
      case PendingApprovalPaymentTypeCode.PharmacyClaim: {
        this.providerCountFieldTitle="Provider Count";
        this.approvalPermissionCode =
          ApprovalLimitPermissionCode.PharmacyPermissionCode;
        break;
      }
      case PendingApprovalPaymentTypeCode.InsurancePremium: {
        this.providerCountFieldTitle="Carrier Count";
        this.approvalPermissionCode =
          ApprovalLimitPermissionCode.InsurancePremiumPermissionCode;
        break;
      }
      default: {
        break;
      }
    }
    this.selectedColumn = 'ALL';
    this.searchValue = '';
    this.setApprovalLevelAndMaxApprovalAmount();
    this.resetApprovalPaymentListGrid();
    this.loadApprovalPaymentsListGrid();
    this.mainListDataHandle();
    this.gridDataHandle();
    this.enableSubmitButtonMain();
  }

  setApprovalLevelAndMaxApprovalAmount()
  {
    if(this.userManagementFacade.hasPermission([this.approvalPermissionCode]))
    {
      this.maxApprovalAmount = this.userManagementFacade.getUserMaxApprovalAmount(this.approvalPermissionCode);
      if(this.maxApprovalAmount != null && this.maxApprovalAmount > 0)
      {
        this.approvalTypeCode = ApprovalTypeCode.L1Approval;
        this.userLevel = 1;
      }
      else
      {
        this.approvalTypeCode = ApprovalTypeCode.L2Approval;
        this.userLevel = 2;
      }
    }
    else
    {
      this.approvalTypeCode = ApprovalTypeCode.L1Approval;
      this.maxApprovalAmount = this.constantMaxApprovalAmount;
    }
  }

  onRowLevelApproveClicked(
    e: boolean,
    dataItem: any,
    control: any,
    rowIndex: any
  ) {
    dataItem.approveButtonDisabled = false;
    dataItem.sendBackButtonDisabled = true;
    this.pageValidationMessage = null;
    dataItem.sendBackNotes = '';
    if (
      dataItem.batchStatus === undefined ||
      dataItem.batchStatus === '' ||
      dataItem.batchStatus === null
    ) {
      dataItem.batchStatus = this.approveStatus;
      dataItem.atleastOnePaymentInValidMsg=null;
      dataItem.atleastOnePaymentInValid = false;
      dataItem.paymentRequestIds = [];
    } else if (dataItem.batchStatus == this.approveStatus) {
      dataItem.batchStatus = '';
      dataItem.sendBackNotesInValidMsg = '';
      dataItem.sendBackNotesInValid = false;
      dataItem.sendBackButtonDisabled = true;
      dataItem.atleastOnePaymentInValidMsg=null;
      dataItem.atleastOnePaymentInValid = false;
      dataItem.paymentRequestIds = [];

    } else if (dataItem.batchStatus == this.sendbackStatus) {
      dataItem.batchStatus = this.approveStatus;
      dataItem.sendBackNotesInValidMsg = '';
      dataItem.sendBackNotesInValid = false;
      dataItem.sendBackButtonDisabled = true;
      dataItem.atleastOnePaymentInValidMsg=null;
      dataItem.atleastOnePaymentInValid = false;
      dataItem.paymentRequestIds = [];
    }
    this.sendBackNotesChange(dataItem);
    this.assignRowDataToMainList(dataItem);
    this.ngDirtyInValid(dataItem, control, rowIndex);
    this.approveAndSendbackCount();
    this.enableSubmitButtonMain();
  }

  onRowLevelSendbackClicked(
    e: boolean,
    dataItem: any,
    control: any,
    rowIndex: any
  ) {
    dataItem.approveButtonDisabled = true;
    dataItem.sendBackButtonDisabled = false;
    this.pageValidationMessage = null;
    if (
      dataItem.batchStatus === undefined ||
      dataItem.batchStatus === '' ||
      dataItem.batchStatus === null
    ) {
      dataItem.batchStatus = this.sendbackStatus;
      dataItem.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;
      if(this.userLevel == UserLevel.Level1Value){
        this.onOpenViewPaymentsBatchClicked(dataItem,true);
      }
    }
    else if (dataItem.batchStatus == this.sendbackStatus) {
      if(this.userLevel == UserLevel.Level1Value){
        this.isSendbackMode=false;
        this.onOpenSendbackDeselectingWarningDialogClicked(dataItem);
      }
      else{
        dataItem.batchStatus = '';
        dataItem.sendBackNotesInValidMsg = '';
        dataItem.sendBackNotes = '';
        dataItem.sendBackNotesInValid = false;
        dataItem.sendBackButtonDisabled = true;
      }
    }
    else {
      dataItem.batchStatus = this.sendbackStatus;
      dataItem.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
      dataItem.sendBackNotesInValid = true;
      dataItem.sendBackButtonDisabled = false;
      if(this.userLevel == UserLevel.Level1Value){
        this.onOpenViewPaymentsBatchClicked(dataItem,true);
      }
    }
    this.cd.detectChanges();
    this.sendBackNotesChange(dataItem);
    if(this.userLevel == UserLevel.Level1Value){
      dataItem.batchStatus="";
    }
    else{
      this.assignRowDataToMainList(dataItem);
      this.ngDirtyInValid(dataItem, control, rowIndex);
      this.isApproveAllClicked = false;
      this.approveAndSendbackCount();
      this.enableSubmitButtonMain();
    }
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

  gridDataHandle() {
    this.approvalsPaymentsLists$.subscribe((response: any) => {
      let gridData = {
        data: response.data,
        total: response.total,
      };
      this.pendingApprovalGridDataResult = gridData;
      if (response.data.length > 0) {
        this.assignDataFromUpdatedResultToPagedResult(response);
        this.tAreaVariablesInitiation(this.approvalsPaymentsGridPagedResult);
        this.isApprovalPaymentsGridLoaderShow = false;
        this.gridApprovalPaymentsDataSubject.next(
          this.approvalsPaymentsGridPagedResult
        );
        if (response?.total >= 0 || response?.total === -1) {
          this.isApprovalPaymentsGridLoaderShow = false;
        }
        this.cd.detectChanges();
      } else {
        this.approvalsPaymentsGridPagedResult = response;
        this.isApprovalPaymentsGridLoaderShow = false;
        this.cd.detectChanges();
      }
    });
  }

  assignDataFromUpdatedResultToPagedResult(itemResponse: any) {
    itemResponse.data.forEach((item: any, index: number) => {
      itemResponse.data[index].sendBackButtonDisabled = true;
      itemResponse.data[index].sendBackNotes = '';
      itemResponse.data[index].batchStatus = '';
      let ifExist = this.approvalsPaymentsGridUpdatedResult.find(
        (x: any) => x.approvalId === item.approvalId
      );
      if (ifExist !== undefined && item.approvalId === ifExist.approvalId) {
        itemResponse.data[index].approvalId = ifExist?.approvalId;
        itemResponse.data[index].paymentRequestBatchId = ifExist?.paymentRequestBatchId;
        itemResponse.data[index].batchName = ifExist?.batchName;
        itemResponse.data[index].totalAmountDue = ifExist?.totalAmountDue;
        itemResponse.data[index].providerCount = ifExist?.providerCount;
        itemResponse.data[index].totalPayments = ifExist?.totalPayments;
        itemResponse.data[index].totalClaims = ifExist?.totalClaims;
        itemResponse.data[index].sendBackNotes = ifExist?.sendBackNotes;
        itemResponse.data[index].sendBackNotesInValidMsg = ifExist?.sendBackNotesInValidMsg;
        itemResponse.data[index].sendBackNotesInValid = ifExist?.sendBackNotesInValid;
        itemResponse.data[index].tAreaCessationCounter = ifExist?.tAreaCessationCounter;
        itemResponse.data[index].batchStatus = ifExist?.batchStatus;
        itemResponse.data[index].atleastOnePaymentInValidMsg=ifExist?.atleastOnePaymentInValidMsg;
        itemResponse.data[index].atleastOnePaymentInValid = ifExist?.atleastOnePaymentInValid;
        itemResponse.data[index].paymentRequestIds = ifExist?.paymentRequestIds;
      }
    });

    this.approvalsPaymentsGridPagedResult = itemResponse.data;
  }

  sendBackNotesChange(dataItem: any) {
    this.calculateCharacterCount(dataItem);
    this.assignRowDataToMainList(dataItem);
  }

  ngDirtyInValid(dataItem: any, control: any, rowIndex: any) {
    let inValid = false;

    if (control === 'sendBackNotes') {
      dataItem.sendBackNotesInValid = dataItem.batchStatus == this.sendbackStatus && dataItem.sendBackNotes.length <= 0;
      dataItem.sendBackNotesInValidMsg = dataItem.batchStatus == this.sendbackStatus && dataItem.sendBackNotes.length <= 0
                                        ? this.sendbackNotesRequireMessage
                                        : '';
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

  updatedResultValidationSendBack(index: any) {
    if (
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === null ||
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === '' ||
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes === undefined
    ) {
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = true;
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg =this.sendbackNotesRequireMessage;
    } else {
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = false;
      this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = null;
    }

    if(this.approvalsPaymentsGridUpdatedResult[index].paymentRequestIds === undefined ||
        (this.approvalsPaymentsGridUpdatedResult[index].paymentRequestIds != null && this.approvalsPaymentsGridUpdatedResult[index].paymentRequestIds.length < 1)
      )
      {
        this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValidMsg = this.atleastOnePaymentRequireMessage;
        this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValid = true;
      }
      else
      {
        this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValidMsg = null;
        this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValid = false;
      }
  }

  updatedResultValidation() {
    if (this.approvalsPaymentsGridUpdatedResult.length > 0) {
      this.approvalsPaymentsGridUpdatedResult.forEach(
        (item: any, index: number) => {
          if (this.approvalsPaymentsGridUpdatedResult[index].batchStatus == this.sendbackStatus) {
            this.updatedResultValidationSendBack(index);
          } else {
            this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = false;
            this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = null;
            this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValidMsg=null;
            this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValid = false;

          }
        }
      );
    }
  }

  onOpenSubmitApprovalPaymentItemsClicked() {
    this.validateApprovalsPaymentsGridRecord();
    const atleastOnePaymentInValid = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.atleastOnePaymentInValid);
    const isValid = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.sendBackNotesInValid);
    const totalCount = isValid.length + (this.userLevel == UserLevel.Level1Value ? atleastOnePaymentInValid.length : 0);
    if (totalCount > 0) {
      this.pageValidationMessage = totalCount + ' Validation error(s) found, please review each page for errors.';
    }
    else if (
      this.approvalsPaymentsGridUpdatedResult.filter((x: any) =>  x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus).length <= 0
    ) {
      this.pageValidationMessage = 'No data for approval.';
    } else {
      this.pageValidationMessage = null;
      this.selectedApprovalSendbackDataRows = this.approvalsPaymentsGridUpdatedResult.filter( (x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus);
    }
    this.selectedBatchIds = [];
    if ( totalCount <= 0 && this.selectedApprovalSendbackDataRows.length > 0 ) {
      this.checkApprovalLimit(this.selectedApprovalSendbackDataRows);
      this.loadSubmittedSummaryData();
      this.isSubmitApprovalPaymentItems = true;
    }
  }

  onApproveAllClicked() {
    this.isApproveAllClicked = true;
    this.pageValidationMessage = null;
    if (this.isApproveAllClicked) {
      this.approvalsPaymentsGridPagedResult.forEach(
        (currentPage: any, index: number) => {
          currentPage.batchStatus = this.approveStatus;
          currentPage.sendBackNotesInValid = false;
          currentPage.sendBackNotesInValidMsg = '';
          currentPage.sendBackButtonDisabled = true;
          currentPage.sendBackNotes = '';
          currentPage.atleastOnePaymentInValidMsg=null;
          currentPage.atleastOnePaymentInValid = false;
          currentPage.paymentRequestIds=[];
          this.sendBackNotesChange(currentPage);
        }
      );

      this.approvalsPaymentsGridUpdatedResult.forEach(
        (currentPage: any, index: number) => {
          currentPage.batchStatus = this.approveStatus;
          currentPage.sendBackNotesInValid = false;
          currentPage.sendBackNotesInValidMsg = '';
          currentPage.sendBackNotes = '';
          currentPage.sendBackButtonDisabled = true;
          currentPage.atleastOnePaymentInValidMsg=null;
          currentPage.atleastOnePaymentInValid = false;
          currentPage.paymentRequestIds=[];
          this.sendBackNotesChange(currentPage);
        }
      );
    }
    this.approveAndSendbackCount();
    this.enableSubmitButtonMain();
  }

  validateApprovalsPaymentsGridRecord() {
    this.approvalsPaymentsGridPagedResult.forEach(
      (currentPage: any, index: number) => {
        if (
          currentPage.batchStatus !== null &&
          currentPage.batchStatus === this.sendbackStatus &&
          currentPage.batchStatus !== undefined
        ) {
          if (
            currentPage.sendBackNotes == null ||
            currentPage.sendBackNotes === undefined ||
            currentPage.sendBackNotes === ''
          ) {
            currentPage.sendBackNotesInValid = true;
            currentPage.sendBackNotesInValidMsg = this.sendbackNotesRequireMessage;
          }

          if(currentPage.paymentRequestIds === undefined || currentPage.paymentRequestIds.length <1)
          {
              currentPage.atleastOnePaymentInValidMsg = this.atleastOnePaymentRequireMessage;
              currentPage.atleastOnePaymentInValid = true;
          }
          else
          {
            currentPage.atleastOnePaymentInValidMsg=null;
            currentPage.atleastOnePaymentInValid = false;
          }
        } else {
          currentPage.sendBackNotesInValid = false;
          currentPage.sendBackNotesInValidMsg = null;
        }
      }
    );

    this.updatedResultValidation();
    this.assignPagedGridItemToUpdatedList(
      this.approvalsPaymentsGridPagedResult
    );
  }

  assignPagedGridItemToUpdatedList(dataItem: any) {
    dataItem.forEach((item: any) => {
      this.assignRowDataToMainList(item);
    });
  }

  assignRowDataToMainList(dataItem: any) {
    let ifExist = this.approvalsPaymentsGridUpdatedResult.find(
      (x: any) => x.approvalId === dataItem.approvalId
    );
    if (ifExist !== undefined) {
      this.approvalsPaymentsGridUpdatedResult.forEach(
        (item: any, index: number) => {
          if (item.approvalId === ifExist.approvalId) {
            this.approvalsPaymentsGridUpdatedResult[index].approvalId = ifExist?.approvalId;
            this.approvalsPaymentsGridUpdatedResult[index].paymentRequestBatchId = ifExist?.paymentRequestBatchId;
            this.approvalsPaymentsGridUpdatedResult[index].batchName = ifExist?.batchName;
            this.approvalsPaymentsGridUpdatedResult[index].totalAmountDue = ifExist?.totalAmountDue;
            this.approvalsPaymentsGridUpdatedResult[index].providerCount = ifExist?.providerCount;
            this.approvalsPaymentsGridUpdatedResult[index].totalPayments = ifExist?.totalPayments;
            this.approvalsPaymentsGridUpdatedResult[index].totalClaims = ifExist?.totalClaims;
            this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValidMsg = dataItem?.sendBackNotesInValidMsg;
            this.approvalsPaymentsGridUpdatedResult[index].sendBackNotesInValid = dataItem?.sendBackNotesInValid;
            this.approvalsPaymentsGridUpdatedResult[index].tAreaCessationCounter = dataItem?.tAreaCessationCounter;
            this.approvalsPaymentsGridUpdatedResult[index].batchStatus = dataItem?.batchStatus;
            this.approvalsPaymentsGridUpdatedResult[index].sendBackNotes = dataItem?.sendBackNotes;
            this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValidMsg = dataItem?.atleastOnePaymentInValidMsg;
            this.approvalsPaymentsGridUpdatedResult[index].atleastOnePaymentInValid = dataItem?.atleastOnePaymentInValid;
            this.approvalsPaymentsGridUpdatedResult[index].paymentRequestIds = dataItem?.paymentRequestIds;
          }
        }
      );
    } else {
      this.approvalsPaymentsGridUpdatedResult.push(dataItem);
    }
  }

  approveAndSendbackCount() {
    this.approveBatchCount = this.approvalsPaymentsGridUpdatedResult.filter((x: any)=>x.batchStatus==this.approveStatus).length;
    this.sendbackBatchCount =  this.approvalsPaymentsGridUpdatedResult.filter((x: any)=>x.batchStatus==this.sendbackStatus).length;
  }

  mainListDataHandle() {
    this.selectedColumn = 'ALL';
    const gridDataRefinerValue = {
      skipCount: 0,
      pagesize: 99999,
      sortColumn: this.sortValue,
      sortType: this.sortType,
      columnName: this.selectedColumn,
      sorting: null,
      filter: [],
    };
    let selectedPaymentType = this.selectedPaymentType;
    this.loadApprovalsPaymentsMainListEvent.emit({
      gridDataRefinerValue,
      selectedPaymentType,
    });
    this.approvalsPaymentsGridUpdatedResultDummy =
      this.approvalsPaymentsGridUpdatedResult;
    this.approvalsPaymentsGridUpdatedResult = [];
    this.hasPaymentPendingApproval = false;
    this.approvalsPaymentsMainLists$.subscribe((response: any) => {
      if (response.data.length > 0) {
        this.approvalsPaymentsGridUpdatedResult = response.data.map(
          (item: any) => ({
            ...item,
            sendBackNotesInValidMsg: '',
            sendBackNotesInValid: false,
            batchStatus: '',
            sendBackNotes: '',
            paymentRequestIds:[],
            atleastOnePaymentInValidMsg: '',
            atleastOnePaymentInValid: false,
          })
        );
        this.hasPaymentPendingApproval = response.data.length > 0;
        this.cd.detectChanges();
        this.gridApprovalPaymentsMainListDataSubject.next(
          this.approvalsPaymentsGridUpdatedResult
        );
      }
    });
  }

  sortByProperty() {
    const ascending = this.sortType == 'asc';
    if (this.approvalsPaymentsGridUpdatedResult.length >= 0) {
      this.approvalsPaymentsGridUpdatedResult.sort(
        (a: { [x: string]: any }, b: { [x: string]: any }) => {
          if (ascending) {
            return this.sortListAscendingOrder(
              a[this.sortValue],
              b[this.sortValue]
            );
          } else {
            return this.sortListDescendingOrder(
              a[this.sortValue],
              b[this.sortValue]
            );
          }
        }
      );
      this.cd.detectChanges();
    }
  }

  sortListAscendingOrder(a: any, b: any) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }
  sortListDescendingOrder(a: any, b: any) {
    if (b < a) {
      return -1;
    } else if (b > a) {
      return 1;
    } else {
      return 0;
    }
  }

  loadSubmittedSummaryData() {
    this.selectedApprovalSendbackDataRows
      .filter((x: any) => x.batchStatus == this.approveStatus)
      .forEach((currentPage: any, index: number) => {
        this.selectedBatchIds.push(currentPage.paymentRequestBatchId);
      });
    this.loadSubmittedSummaryEvent.emit(this.selectedBatchIds);
    this.pendingApprovalSubmittedSummary$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.requestedCheck = response?.checkCount;
        this.requestedACHPayments = response?.achCount;
        this.requestedDORHoldPayments = response?.dorHoldCount;
        this.totalAmountSubmitted = response?.totalAmount;
        this.cd.detectChanges();
      }
    });
  }
  checkApprovalLimit(payments: any) {
    if(this.maxApprovalAmount > 0 && this.approvalTypeCode === ApprovalTypeCode.L1Approval)
    {
      let approvedRequestedAmountCount = 0;
      payments
        .filter((x: any) => x.batchStatus == this.approveStatus)
        .forEach((currentPage: any, index: number) => {
          approvedRequestedAmountCount += currentPage.totalAmountDue;
        });
      if (this.maxApprovalAmount != null && this.maxApprovalAmount < approvedRequestedAmountCount) {
        this.approvalTypeCode = ApprovalTypeCode.ExceedApprovalLimit;
      }
    }
  }
  makeRequestData() {
    let bodyData = {
      approvalType: this.approvalTypeCode,
      paymentType: this.selectedPaymentType,
      payments: [{}],
    };
    for (let element of this.selectedApprovalSendbackDataRows) {
      let payment = {
        approvalId: element.approvalId,
        approvalStatusCode: element.batchStatus,
        sendBackNote: element.sendBackNotes ? element.sendBackNotes : null,
        userId: this.loginUserId,
        paymentRequestIds: element.paymentRequestIds,
      };
      bodyData.payments.push(payment);
    }
    bodyData.payments.splice(0, 1);
    this.submit(bodyData);
  }
  submit(data: any) {
    this.submitEvent.emit(data);
    this.pendingApprovalSubmit$.subscribe((response: any) => {
      if (response !== undefined && response !== null) {
        this.onPaymentTypeCodeValueChange(this.selectedPaymentType);
        this.isSubmitApprovalPaymentItems = false;
      }
    });
  }

  columns: any = {};

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }
    return searchValue;
  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();

    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cd.detectChanges();
      }
    });
  }

  public expandSendBackNotes({ dataItem }: RowArgs): boolean {
    return dataItem.level2SendBackNotes ? true : false;
  }

  navToBatchDetails(data: any) {
    let type;
    switch (data.paymentRequestSubTypeCode) {
      case PendingApprovalPaymentTypeCode.MedicalClaim: {
        type = 'claims/medical';
        break;
      }
      case PendingApprovalPaymentTypeCode.DentalClaim: {
        type = 'claims/dental';
        break;
      }
      case PendingApprovalPaymentTypeCode.MedicalPremium: {
        type = 'premiums/medical';
        break;
      }
      case PendingApprovalPaymentTypeCode.DentalPremium: {
        type = 'premiums/dental';
        break;
      }
      case PendingApprovalPaymentTypeCode.PharmacyClaim: {
        type = 'pharmacy-claims';
        break;
      }
    }

    this.route.navigate([`/financial-management/${type}/batch`], {
      queryParams: { bid: data?.paymentRequestBatchId },
    });
  }

  enableSubmitButtonMain()
  {
    const totalCount = this.approvalsPaymentsGridUpdatedResult.filter((x: any) => x.batchStatus == this.approveStatus || x.batchStatus == this.sendbackStatus).length;
    this.hasPaymentPendingApproval = (totalCount <= 0);
    this.cd.detectChanges();
  }
  resetApprovalPaymentListGrid(){
    this.sortValue = 'batchName';
    this.sortType = 'desc';
    this.setGridValueAndData();
    this.sortColumn = 'batchName';
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : "Descending";
    this.filter = [];
    this.searchValue = '';
    this.selectedColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadApprovalPaymentsListGrid();
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  onOpenSendbackDeselectingWarningDialogClicked(data?: any) {
    data.batchStatus= this.sendbackStatus;
    this.cd.detectChanges();
    this.dataItem=data;
    this.sendBackNotesChange(this.dataItem);
    this.isWarningDialogShow = true;
  }

  onSendbackDeselectingWarningDialogCancelClicked()
  {
    this.isWarningDialogShow=false;
    this.dataItem.batchStatus =this.sendbackStatus;
    this.sendBackNotesChange(this.dataItem);
    this.approveAndSendbackCount();
    this.enableSubmitButtonMain();
  }

  onSendbackDeselectingWarningDialogYesClicked()
  {
    this.isWarningDialogShow=false;
    this.dataItem.batchStatus = '';
    this.dataItem.sendBackNotesInValidMsg = '';
    this.dataItem.sendBackNotes = '';
    this.dataItem.sendBackNotesInValid = false;
    this.dataItem.sendBackButtonDisabled = true;
    this.dataItem.atleastOnePaymentInValidMsg = '';
    this.dataItem.atleastOnePaymentInValid = false;
    this.dataItem.paymentRequestIds = [];
    this.sendBackNotesChange(this.dataItem);
    this.approveAndSendbackCount();
    this.enableSubmitButtonMain();
  }
}
