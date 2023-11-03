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
  PaymentStatusCode
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {
  ConfigurationProvider,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  ColumnVisibilityChangeEvent,
  GridDataResult,
} from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import { FilterService } from '@progress/kendo-angular-treelist/filtering/filter.service';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Observable, Subject, debounceTime, first } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-batches-log-lists',
  templateUrl: './financial-claims-batches-log-lists.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesLogListsComponent
  implements OnInit, OnChanges
{
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
  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Print Advice Letters',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAdviceLetterClicked = true;
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Entire Batch',
      icon: 'undo',
      click: (data: any): void => {
        if (!this.isBulkUnBatchOpened) {
          this.isBulkUnBatchOpened = true;
          this.onUnBatchOpenClicked(this.unBatchClaimsDialogTemplate);
        }
      },
    },
  ];

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
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() loadBatchLogListEvent = new EventEmitter<any>();
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
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;

  gridColumns: { [key: string]: string } = {
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
    {
      columnName: 'itemNbr',
      columnDesc: 'Item #',
    },
    {
      columnName: 'invoiceNbr',
      columnDesc: 'Invoice ID',
    },
    {
      columnName: 'vendorName',
      columnDesc: 'Provider Name',
    },
    {
      columnName: 'tin',
      columnDesc: 'Tax ID',
    },
    {
      columnName: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnName: 'nameOnInsuranceCard',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnName: 'serviceCount',
      columnDesc: 'Service Count',
    },
    {
      columnName: 'serviceCost',
      columnDesc: 'Total Cost',
    },
    {
      columnName: 'amountDue',
      columnDesc: 'Total Due',
    },
    {
      columnName: 'paymentMethodDesc',
      columnDesc: 'Payment Method',
    },
    {
      columnName: 'paymentTypeDesc',
      columnDesc: 'Payment Type',
    },
    {
      columnName: 'paymentStatusDesc',
      columnDesc: 'Payment Status',
    },
    {
      columnName: 'clientMaximum',
      columnDesc: 'Client Annual Total',
    },
    {
      columnName: 'balanceAmount',
      columnDesc: 'Client Balance',
    },
  ];

  numericColumns: any[] = [
    'balanceAmount',
    'clientMaximum',
    'amountDue',
    'serviceCost',
    'serviceCount',
    'itemNbr',
  ];
  dateColumns: any[] = [];
  private searchSubject = new Subject<string>();
  selectedSearchColumn: null | string = 'itemNbr';
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
  selectedpaymentMethod: string | null = null;
  selectedPaymentType: string | null = null;
  selectedPaymentStatus: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentTypes$ = this.lovFacade.paymentRequestType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentMethods: any = [];
  paymentTypes: any = [];
  paymentStatusList: any = [];

  getBatchLogGridActions(dataItem: any) {
    return [
      {
        buttonType: 'btn-h-primary',
        text: 'Edit Claim',
        icon: 'edit',
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
  ) {}

  ngOnInit(): void {
    this.getPaymentMethodLov();
    this.getPaymentStatusLov();
    this.getCoPaymentRequestTypeLov();
    this.initializePage();
  }

  ngOnChanges(): void {
    this.initializeGrid();
    this.loadBatchLogListGrid();
  }

  private getPaymentMethodLov() {
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodType$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentMethods = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getCoPaymentRequestTypeLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.paymentTypes$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getPaymentStatusLov() {
    this.lovFacade.getPaymentStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStatusList = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    this.showNumberSearchWarning = this.numericColumns.includes(value);
    this.showDateSearchWarning = this.dateColumns.includes(value);
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
    const operator = [...this.numericColumns, ...this.dateColumns].includes(
      this.selectedSearchColumn
    )
      ? 'eq'
      : 'startswith';
    if (
      this.dateColumns.includes(this.selectedSearchColumn) &&
      !this.isValidDate(data) &&
      data !== ''
    ) {
      return;
    }
    if (
      this.numericColumns.includes(this.selectedSearchColumn) &&
      isNaN(Number(data))
    ) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'itemNbr',
              operator: operator,
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
    this.selectedSearchColumn = 'itemNbr';
    this.filteredByColumnDesc = '';
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.showNumberSearchWarning = false;
    this.loadBatchLogListGrid();
  }

  setNoOfRecordToBePrint(NoOfRecordToBePrint: any) {
    this.selectedCount = NoOfRecordToBePrint;
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
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumn = stateData.sort[0]?.field;
    this.sortColumnName = this.gridColumns[this.sortColumn];
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
      this.selectedpaymentMethod = null;
    if (!this.filteredBy.includes('Payment Type'))
      this.selectedPaymentType = '';
    if (!this.filteredBy.includes('Payment Status'))
      this.selectedPaymentStatus = '';
    this.loadBatchLogListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  rowClass = (args: any) => ({
    'table-row-disabled': !args.dataItem.assigned,
  });

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodDesc') this.selectedpaymentMethod = value;
    if (field === 'paymentTypeDesc') this.selectedPaymentType = value;
    if (field === 'paymentStatusDesc') this.selectedPaymentStatus = value;

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
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
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

  loadPrintAdviceLetterEvent(event: any) {
    this.currentPrintAdviceLetterGridFilter = event.filter;
    this.loadBatchLogListEvent.emit(event);
  }

  onBulkOptionCancelClicked() {
    this.isRequestPaymentClicked = false;
    this.isPrintAdviceLetterClicked = false;
    this.selectedDataRows = [];
    this.selectedCount = 0;
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
    if (result.selectAll) {
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

  //#endregion
}
