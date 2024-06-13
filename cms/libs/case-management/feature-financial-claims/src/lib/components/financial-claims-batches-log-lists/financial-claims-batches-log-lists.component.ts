/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FinancialClaimsFacade,
  PaymentBatchName,
  PaymentStatusCode,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  ConfigurationProvider,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { LovFacade, NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  ColumnVisibilityChangeEvent,
  GridDataResult,
  ColumnComponent
} from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, Subscription, debounceTime, first } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-batches-log-lists',
  templateUrl: './financial-claims-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesLogListsComponent
  implements OnInit, OnChanges {
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('unBatchClaimsDialogTemplate', { read: TemplateRef })
  unBatchClaimsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialogTemplate', { read: TemplateRef })
  deleteClaimsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;
  isRequestPaymentClicked = false;
  isPrintAdviceLetterClicked = false;
  isUnBatchClaimsClosed = false;
  isDeleteClaimClosed = false;
  isBulkUnBatchOpened = false;
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  UnBatchDialog: any;
  deleteClaimsDialog: any;
  onlyPrintAdviceLetter = true;
  currentPrintAdviceLetterGridFilter: any;
  private addClientRecentClaimsDialog: any;
  vendorId: any;
  clientId: any;
  clientName: any;
  PaymentStatusList = [
    PaymentStatusCode.Paid,
    PaymentStatusCode.PaymentRequested,
    PaymentStatusCode.ManagerApproved,
  ];
  clientBalance$ = this.financialClaimsFacade.clientBalance$;
  public bulkMore !:any


  @Input() claimsType: any;
  @Input() batchId: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() loader$!: Observable<boolean>;
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;
  @Input() exportButtonShow$: any;
  @Input() letterContentList$: any;
  @Input() letterContentLoader$: any;
  @Input() claimsBathcPaymentProfilePhoto$: any;
  @Output() loadTemplateEvent = new EventEmitter<any>();
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  public state!: State;
  columnsReordered = false;
  searchValue = '';
  isFiltered = false;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  gridClaimsBatchLogDataSubject = new Subject<any>();
  gridClaimsBatchLogData$ = this.gridClaimsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  selectAll: boolean = false;
  unCheckedPaymentRequest: any = [];
  selectedDataIfSelectAllUnchecked: any = [];
  noOfRecordToPrint: any = 0;
  totalRecord: any;
  batchLogPrintAdviceLetterPagedList: any;
  isEdit!: boolean;
  paymentRequestId!: string;
  @ViewChild('addEditClaimsDialog')
  private addEditClaimsDialog!: TemplateRef<any>;
  private addEditClaimsFormDialog: any;
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  batchLogListItemsSubscription!: Subscription;
  gridLoaderSubject = new BehaviorSubject(false);
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  unCheckedProcessRequest: any = [];
  batchLogGridLists!: any;
  isReconciled: boolean = false;
  permissionLevels:any[]=[];
  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    itemNbr: 'Item #',
    invoiceNbr: 'Invoice ID',
    vendorName: 'Provider Name',
    tin: 'Tax ID',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    serviceCount: 'Service Count',
    serviceCost: 'Total Cost',
    amountDue: 'Total Due',
    paymentMethodDesc: 'Payment Method',
    paymentTypeDesc: 'Payment Type',
    paymentStatusDesc: 'Payment Status',
    clientMaximum: 'Client Annual Total',
    balanceAmount: 'Client Balance',
  };

  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';
  selected: any;
  selectedDataRows: any;
  selectedCount = 0;
  disablePrwButton = true;
  deletemodelbody =
    'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  //searching
  searchColumnList: { columnName: string; columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'vendorName', columnDesc: 'Provider Name', },
    { columnName: 'tin', columnDesc: 'Tax ID', },
    { columnName: 'clientFullName', columnDesc: 'Client Name', }
  ];

  dateColumns: any[] = [];
  private searchSubject = new Subject<string>();
  selectedSearchColumn = 'ALL';
  showDateSearchWarning = false;
  showNumberSearchWarning = true;
  searchText: null | string = null;

  //sorting
  sortColumn = 'itemNbr';
  sortDir = 'Descending';
  sortColumnName = 'Item #';

  //filtering
  filteredBy = '';
  filter: any = [];

  filteredByColumnDesc = '';
  selectedStatus = '';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columnChangeDesc = 'Default Columns';
  //export
  showExportLoader = false;

  //LovDropdowns
  selectedPaymentMethod: string | null = null;
  selectedPaymentStatus: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  batchStatus = PaymentStatusCode.PendingApproval;
  claimsBathcPaymentProfileSubject = new Subject();
  getBatchLogGridActions(dataItem: any) {
    return [{
      buttonType: 'btn-h-primary',
      text: 'Edit Claim',
      icon: 'edit',
      disabled: dataItem.paymentStatusCode !== PaymentStatusCode.Denied,
      click: (claim: any): void => {
        this.onClaimClick(claim);
      }
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Claim',
      icon: 'undo',
      disabled: [
        PaymentStatusCode.Paid,
        PaymentStatusCode.PaymentRequested,
        PaymentStatusCode.ManagerApproved,
      ].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if (
          ![
            PaymentStatusCode.Paid,
            PaymentStatusCode.PaymentRequested,
            PaymentStatusCode.ManagerApproved,
          ].includes(data.paymentStatusCode)
        )
          if (!this.isUnBatchClaimsClosed) {
            this.isUnBatchClaimsClosed = true;
            this.selected = data;
            this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
          }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      disabled: [PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved,].includes(dataItem.paymentStatusCode),
      click: (data: any): void => {
        if (
          [
            PaymentStatusCode.Paid,
            PaymentStatusCode.PaymentRequested,
            PaymentStatusCode.ManagerApproved,
          ].includes(data.paymentStatusCode)
        ) {
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.ERROR,
            'This claim cannot be deleted',
            NotificationSource.UI
          );
        } else {
          this.isUnBatchClaimsClosed = false;
          this.isDeleteClaimClosed = true;
          this.onSingleClaimDelete(data.paymentRequestId.split(','));
          this.onDeleteClaimsOpenClicked(
            this.deleteClaimsConfirmationDialogTemplate
          );
        }
      },
    },
    ];
  }

  /** Constructor **/
  constructor(
    private route: Router,
    private dialogService: DialogService,
    public activeRoute: ActivatedRoute,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    private readonly userManagementFacade : UserManagementFacade,
    private readonly navigationMenuFacade : NavigationMenuFacade
  ) { }

  ngOnInit(): void {
    this.loadLov();
    this.initializePage();
    this.sortColumnName = 'Item #';
    this.loadBatchLogListGrid();
    this.batchLogListSubscription();
  }

  initializeBulkMore(){
    this.bulkMore = [
      {
        buttonType: 'btn-h-primary',
        text: 'RECONCILE PAYMENTS',
        icon: 'edit',
        click: (data: any): void => {
          this.navToReconcilePayments(data);
        },
      },
      {
        buttonType: 'btn-h-primary',
        text: 'PRINT ADVICE LETTER',
        icon: 'print',
        click: (data: any): void => {
          this.isReconciled = true;
          this.loadBatchLogListGrid();
          this.isRequestPaymentClicked = false;
          this.isPrintAdviceLetterClicked = true;
        },
      },
      {
        buttonType: 'btn-h-primary',
        text: 'UNBATCH ENTIRE BATCH',
        icon: 'undo',
        disabled: [
          PaymentStatusCode.Paid,
          PaymentStatusCode.PaymentRequested,
          PaymentStatusCode.ManagerApproved,
        ].includes(this.batchStatus),
        click: (data: any): void => {
          if (!this.isBulkUnBatchOpened) {
            this.isBulkUnBatchOpened = true;
            this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
          }
        },
      },
    ];
  }

  batchLogListSubscription() {
    this.batchLogListItemsSubscription = this.batchLogGridLists$.subscribe((response: any) => {
      this.totalRecord = response.total;

      let payments =  response && response.data

      payments.forEach((item :any) =>{
        if([PaymentStatusCode.Paid, PaymentStatusCode.PaymentRequested, PaymentStatusCode.ManagerApproved].includes(item.paymentStatusCode)){
          this.batchStatus = item.paymentStatusCode
         }
        })
      this.initializeBulkMore()
      if (this.selectAll) {
        this.markAsChecked(response.data);
      }
      this.batchLogPrintAdviceLetterPagedList = response;
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.initializeGrid();
    this.loadBatchLogListGrid();
  }

  ngOnDestroy(): void {
    this.batchLogListItemsSubscription.unsubscribe();
  }

  private loadLov() {
    this.lovFacade.getPaymentMethodLov();
    this.lovFacade.getPaymentStatusLov();
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning =
      isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performSearch(data: any) {
    this.defaultGridState();
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
              operator: 'contains',
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

  restGrid() {
    this.sortValue = 'itemNbr';
    this.sortColumnName = this.gridColumns[this.sortValue];
    this.sortType = 'desc';
    this.initializeGrid();
    this.sortDir = 'Descending';
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.filteredBy = '';
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.showNumberSearchWarning = false;
    this.loadBatchLogListGrid();
  }

  onChange(data: any) {
    this.defaultGridState();
    const stateData = this.state;
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
    this.isPageCountChanged = false;
    this.isPageChanged = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnName = this.gridColumns[this.sortColumn];
    this.filter = stateData?.filter?.filters;
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.gridColumns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
      this.filteredBy = '';
    }
    if (!this.filteredBy.includes('Payment Method'))
      this.selectedPaymentMethod = null;
    if (!this.filteredBy.includes('Payment Status'))
      this.selectedPaymentStatus = '';
    this.loadBatchLogListGrid();
    if (this.isPrintAdviceLetterClicked) {
      this.handleBatchPaymentsGridData();
    }
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  rowClass = (args: any) => ({
    'table-row-disabled': !args.dataItem.assigned,
  });

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentTypeCode') {
      this.paymentTypeFilter = value;
    } else if (field === 'paymentStatusCode') {
      this.paymentStatusFilter = value;
    }
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
    if (this.isPrintAdviceLetterClicked) {
      this.handleBatchPaymentsGridData();
    }
  }

  backToBatch(event: any) {
    this.route.navigate(['/financial-management/claims/' + this.claimsType]);
  }

  goToBatchItems(event: any) {
    this.route.navigate([this.route.url, 'items']);
  }

  paymentClickHandler(dataItem: any) {
    const batchId = this.activeRoute.snapshot.queryParams['bid'];
    this.route.navigate([this.route.url.split('?')[0], 'items'], {
      queryParams: {
        bid: batchId,
        pid: dataItem.paymentRequestId,
        eid: dataItem.vendorAddressId,
      },
    });
  }

  navToReconcilePayments(event: any) {
    this.route.navigate(
      [
        `/financial-management/claims/${this.claimsType}/batch/reconcile-payments`,
      ],
      { queryParams: { bid: this.batchId } }
    );
  }

  public onPreviewSubmitPaymentOpenClicked(
    template: TemplateRef<unknown>
  ): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) {
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked() {
    this.isReconciled = false;
    this.selectAll = false;
    this.isRequestPaymentClicked = false;
    this.isPrintAdviceLetterClicked = false;
    this.selectedDataRows = [];
    this.selectedCount = 0;
    this.noOfRecordToPrint = 0;
    this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
    this.markAsUnChecked(this.selectedDataIfSelectAllUnchecked);
    this.selectedDataRows.PrintAdviceLetterSelected = [];
    this.selectedDataRows.PrintAdviceLetterUnSelected = [];
    this.unCheckedPaymentRequest = [];
    this.selectedDataIfSelectAllUnchecked = [];
    this.loadBatchLogListGrid();
  }

  onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.selectedDataRows.currentPrintAdviceLetterGridFilter = JSON.stringify(
      this.currentPrintAdviceLetterGridFilter
    );
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-xlg app-c-modal-np_0',
    });
  }

  onPrintAuthorizationCloseClicked(result: any) {
    if (result) {
      this.printAuthorizationDialog.close();
    }
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
      if (this.isBulkUnBatchOpened) {
        this.handleUnbatchEntireBatch();
        this.financialClaimsFacade.unbatchEntireBatch(
          [this.batchId],
          this.claimsType
        );
      } else {
        this.handleUnbatchClaims();
        this.financialClaimsFacade.unbatchClaims(
          [this.selected.paymentRequestId],
          this.claimsType
        );
      }
    }
    this.isUnBatchClaimsClosed = false;
    this.isBulkUnBatchOpened = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchClaims() {
    this.financialClaimsFacade.unbatchClaims$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadPendingApprovalPaymentCount();
          this.loadBatchLogListGrid();
        }
      });
  }

  handleUnbatchEntireBatch() {
    this.financialClaimsFacade.unbatchEntireBatch$
      .pipe(
        first(
          (unbatchEntireBatchResponse: any) =>
            unbatchEntireBatchResponse != null
        )
      )
      .subscribe((unbatchEntireBatchResponse: any) => {
        if (unbatchEntireBatchResponse ?? false) {
          this.route.navigateByUrl(
            `financial-management/claims/${this.claimsType}?tab=2`
          );
          this.loadPendingApprovalPaymentCount();
          this.loadBatchLogListGrid();
        }
      });
  }

  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.isDeleteClaimClosed = false;
      this.deleteClaimsDialog.close();
    }
  }
  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }

  onModalBatchDeletingClaimsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteClaims();
      this.financialClaimsFacade.deleteClaims(this.selected, this.claimsType);
    }
  }

  handleDeleteClaims() {
    this.financialClaimsFacade.deleteClaims$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse != null) {
          this.isDeleteClaimClosed = false;
          this.deleteClaimsDialog.close();
          this.loadBatchLogListGrid();
        }
      });
  }

  disablePreviewButton(result: any) {
    this.selectedDataRows = result;
    this.selectedDataRows.batchId = this.batchId;
    if (result.selectAll && this.batchLogPrintAdviceLetterPagedList.data?.length > 0) {
      this.disablePrwButton = false;
    } else if (result.PrintAdviceLetterSelected.length > 0) {
      this.disablePrwButton = false;
    } else {
      this.disablePrwButton = true;
    }
  }
  selectUnSelectPayment(dataItem: any) {
    if (!dataItem.selected) {
      const exist = this.selectedDataRows.PrintAdviceLetterUnSelected.filter(
        (x: any) => x.vendorAddressId === dataItem.vendorAddressId
      ).length;
      if (exist === 0) {
        this.selectedDataRows.PrintAdviceLetterUnSelected.push({
          paymentRequestId: dataItem.paymentRequestId,
          vendorAddressId: dataItem.vendorAddressId,
          selected: true,
        });
      }
      this.selectedDataRows?.PrintAdviceLetterSelected?.forEach(
        (element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        }
      );
    } else {
      this.selectedDataRows.PrintAdviceLetterUnSelected.forEach(
        (element: any) => {
          if (element.paymentRequestId === dataItem.paymentRequestId) {
            element.selected = false;
          }
        }
      );
      const exist = this.selectedDataRows.PrintAdviceLetterSelected.filter(
        (x: any) => x.vendorAddressId === dataItem.vendorAddressId
      ).length;
      if (exist === 0) {
        this.selectedDataRows.PrintAdviceLetterSelected.push({
          paymentRequestId: dataItem.paymentRequestId,
          vendorAddressId: dataItem.vendorAddressId,
          selected: true,
        });
      }
    }
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.addClientRecentClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
      animation: {
        direction: 'up',
        type: 'slide',
        duration: 200,
      },
    });
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
  }

  closeRecentClaimsModal(result: any) {
    if (result) {
      this.addClientRecentClaimsDialog.close();
    }
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();

    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  onClaimClick(dataitem: any) {
    if (!dataitem.vendorId.length) return;
    this.isEdit = true;
    this.paymentRequestId = dataitem.paymentRequestId;
    this.openAddEditClaimDialoge();
  }

  openAddEditClaimDialoge() {
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: this.addEditClaimsDialog,
      cssClass: 'app-c-modal app-c-modal-96full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result === true) {
      this.loadPendingApprovalPaymentCount();
      this.loadBatchLogListGrid();
    }
    this.addEditClaimsFormDialog.close();
  }
  //#region Private
  /* Private methods */
  private initializeGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'itemNbr', dir: 'desc' }],
    };
  }

  private initializePage() {
    this.addSearchSubjectSubscription();
  }

  private loadBatchLogListGrid(): void {
    this.loadBatchLog(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadBatchLog(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isBatchLogGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: this.sortColumn ?? 'itemNbr',
      sortType: sortTypeValue ?? 'desc',
      filter: this.state?.['filter']?.['filters'] ?? [],
      isReconciled: this.isReconciled
    };
    this.loadBatchLogListEvent.emit(gridDataRefinerValue);
    this.currentPrintAdviceLetterGridFilter = this.state?.['filter']?.['filters'] ?? [];
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  private setFilterBy(
    isFromGrid: boolean,
    searchValue: any = '',
    filter: any = []
  ) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters
            ?.filter((fld: any) => fld.value)
            ?.map((fld: any) => this.gridColumns[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc =
        this.searchColumnList?.find(
          (i) => i.columnName === this.selectedSearchColumn
        )?.columnDesc ?? '';
    }
  }

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

  loadEachLetterTemplate(event: any) {
    this.loadTemplateEvent.emit(event);
  }

  selectionAllChange() {
    this.unCheckedPaymentRequest = [];
    this.selectedDataIfSelectAllUnchecked = [];
    this.batchLogPrintAdviceLetterPagedList.data = this.batchLogPrintAdviceLetterPagedList?.data.filter((x:any)=>x.checkNbr !== null && x.checkNbr !== undefined && x.checkNbr !== '');
    if (this.selectAll) {
      this.markAsChecked(this.batchLogPrintAdviceLetterPagedList?.data);
      this.noOfRecordToPrint = this.totalRecord;
      this.selectedCount = this.noOfRecordToPrint;
    }
    else {
      this.markAsUnChecked(this.batchLogPrintAdviceLetterPagedList.data);
      this.noOfRecordToPrint = 0;
      this.selectedCount = this.noOfRecordToPrint;
    }
    this.selectedAllPaymentsList = {
      'selectAll': this.selectAll, 'PrintAdviceLetterUnSelected': this.unCheckedPaymentRequest,
      'PrintAdviceLetterSelected': this.selectedDataIfSelectAllUnchecked, 'print': true,
      'batchId': null, 'currentPrintAdviceLetterGridFilter': null, 'requestFlow': 'print', 'isReconciled': this.isReconciled
    }
    this.disablePreviewButton(this.selectedAllPaymentsList);
  }

  markAsUnChecked(data: any) {
    data.forEach((element: any) => {
      element.selected = false;
    });
  }
  markAsChecked(data: any) {
    data.forEach((element: any) => {
      if (this.selectAll) {
        element.selected = true;
      }
      else {
        element.selected = false;
      }
      if (this.unCheckedPaymentRequest.length > 0 || this.selectedDataIfSelectAllUnchecked.length > 0) {
        let itemMarkedAsUnChecked = this.unCheckedPaymentRequest.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        if (itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined) {
          element.selected = false;
        }
        let itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        if (itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined) {
          element.selected = true;
        }
      }

    });

  }
  selectionChange(dataItem: any, selected: boolean) {
    if (!selected) {
      this.noOfRecordToPrint = this.noOfRecordToPrint - 1;
      this.selectedCount = this.noOfRecordToPrint
      this.unCheckedPaymentRequest.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId': dataItem.batchId, 'checkNbr': dataItem.checkNbr });
      if (!this.selectAll) {
        this.selectedDataIfSelectAllUnchecked = this.selectedDataIfSelectAllUnchecked.filter((item: any) => item.paymentRequestId !== dataItem.paymentRequestId);

      }
    }
    else {
      this.noOfRecordToPrint = this.noOfRecordToPrint + 1;
      this.selectedCount = this.noOfRecordToPrint
      this.unCheckedPaymentRequest = this.unCheckedPaymentRequest.filter((item: any) => item.paymentRequestId !== dataItem.paymentRequestId);
      if (!this.selectAll) {
        this.selectedDataIfSelectAllUnchecked.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId': dataItem.batchId, 'checkNbr': dataItem.checkNbr });
      }
    }
    this.selectedAllPaymentsList = {
      'selectAll': this.selectAll, 'PrintAdviceLetterUnSelected': this.unCheckedPaymentRequest,
      'PrintAdviceLetterSelected': this.selectedDataIfSelectAllUnchecked, 'print': true,
      'batchId': null, 'currentPrintAdviceLetterGridFilter': null, 'requestFlow': 'print', 'isReconciled': this.isReconciled
    }
    this.disablePreviewButton(this.selectedAllPaymentsList);
  }

  handleBatchPaymentsGridData() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.batchLogGridLists = this.gridDataResult?.data;
      if (this.recordCountWhenSelectallClicked == 0) {
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if (!this.selectAll) {
        this.batchLogGridLists.forEach((item1: any) => {
          const matchingGridItem = this.selectedAllPaymentsList?.PrintAdviceLetterSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
          if (matchingGridItem) {
            item1.selected = true;
          } else {
            item1.selected = false;
          }
        });
      }
      this.currentPageRecords = this.batchLogGridLists;
      //If the user is selecting the individual check boxes and changing the page count
      this.handlePageCountSelectionChange();
      //If the user click on select all header and either changing the page number or page count
      this.pageNumberAndCountChangedInSelectAll();
      this.gridLoaderSubject.next(false);
    });
  }

  handlePageCountSelectionChange() {
    if (!this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      // Extract the payment request ids from grid data
      const idsToKeep: number[] = this.selectedDataIfSelectAllUnchecked.map((item: any) => item.paymentRequestId);
      // Remove items from selected records based on the IDs from grid data
      for (let i = this.selectedAllPaymentsList?.PrintAdviceLetterSelected?.length - 1; i >= 0; i--) {
        if (!idsToKeep.includes(this.selectedAllPaymentsList?.PrintAdviceLetterSelected[i].paymentRequestId)) {
          this.selectedAllPaymentsList?.PrintAdviceLetterSelected.splice(i, 1); // Remove the item at index i
        }
      }
    }
  }

  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if (this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      this.selectedAllPaymentsList = [];
      this.selectedAllPaymentsList.PrintAdviceLetterSelected = [];
      for (const item of this.batchLogGridLists) {
        // Check if the item is in the second list.
        const isItemInSecondList = this.unCheckedPaymentRequest.find((item2: any) => item2.paymentRequestId === item.paymentRequestId);
        // If the item is in the second list, mark it as selected true.
        if (isItemInSecondList) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      }
    }
  }
  //#endregion

  //#region Grid Column Add-Remove Action in Header Text
  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.columnChangeDesc = 'Columns Added';
  }
  else {
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }
  event.columns.forEach(column => {
    if (column.hidden) {
      const field = (column as ColumnComponent)?.field;
      const mainFilters = this.state.filter?.filters;
      mainFilters?.forEach((filter:any) => {
          const filterList = filter.filters;
          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.loadBatchLogListGrid();
            this.batchLogListSubscription();
          }
        });
      }
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.gridColumns[columnData.field] = columnData.title;
      }

    });
  }

  loadPendingApprovalPaymentCount() {

    this.permissionLevels = this.userManagementFacade.GetPermissionlevelsForPendingApprovalsCount();

    this.navigationMenuFacade.getPendingApprovalPaymentCount(
    this.permissionLevels
    );
  }
  //endregion
}
