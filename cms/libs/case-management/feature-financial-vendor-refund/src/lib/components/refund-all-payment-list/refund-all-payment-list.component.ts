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
  ViewChild
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Router } from '@angular/router';
import { GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { BehaviorSubject, Subject, first } from 'rxjs';
import { FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialServiceTypeCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
@Component({
  selector: 'cms-refund-all-payment-list',
  templateUrl: './refund-all-payment-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundAllPaymentListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundAllPaymentsGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueRefunds: any;
  @Input() vendorRefundAllPaymentsGridLists$: any;
  vendorRefundAllPaymentsGridLists: any = [];
  @Input() exportButtonShow$: any;
  @Input() vendorProfile$: any;
  @Input() updateProviderPanelSubject$: any
  @Input() ddlStates$: any
  @Input() paymentMethodCode$: any
  @Input() allRefundProfilePhoto$!: any;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() exportReceiptDataEvent = new EventEmitter<any>();
  @Output() changeTitle = new EventEmitter<any>();

  @ViewChild('unBatchRefundsDialogTemplate', { read: TemplateRef })
  unBatchRefundsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteRefundsConfirmationDialogTemplate', { read: TemplateRef })
  deleteRefundsConfirmationDialogTemplate!: TemplateRef<any>; 
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  private addEditRefundFormDialog: any;
  clientBalance$ = this.financialClaimsFacade.clientBalance$;
  public state!: State;
  sortColumn = 'Batch #';
  sortDir = 'Descending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'ALL'
  gridDataResult!: GridDataResult;

  gridVendorsAllPaymentsDataSubject = new Subject<any>();
  gridVendorsAllPaymentsData$ =
    this.gridVendorsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  isRefundEditDialogOpen = false;
  isUnBatchRefundsClosed = false;
  isDeleteClaimClosed = false;
  unBatchDialog: any;
  deleteRefundsDialog: any;
  selected: any;
  deletemodelbody = 'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  refunEditServiceType = '';
  refundEditClientId = '';
  refundEditClientFullName: any;
  refundEditVendorAddressId = '';
  refundEditVendorName: any;
  inspaymentRequestId: any;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;
  @ViewChild('addEditRefundDialog', { read: TemplateRef })
  addEditRefundFormDialogDialogTemplate!: TemplateRef<any>;

  public allPaymentsGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
      click: (dataItem: any): void => {
        if (!this.isRefundEditDialogOpen) {
          this.isRefundEditDialogOpen = true;
          this.refunEditServiceType = dataItem.paymentTypeCode
          this.refundEditClientId = dataItem.clientId
          this.refundEditClientFullName = dataItem.clientFullName
          this.refundEditVendorAddressId = dataItem.vendorAddressId
          this.refundEditVendorName = dataItem.providerName
          this.inspaymentRequestId = dataItem.paymentRequestId
          this.onEditRefundClaimClicked(this.addEditRefundFormDialogDialogTemplate)
        }
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Unbatch Refund',
      icon: 'undo',
      click: (data: any) => {
        if (!this.isUnBatchRefundsClosed) {
          this.isUnBatchRefundsClosed = true;
          this.selected = data;
          this.onUnBatchOpenClicked(this.unBatchRefundsDialogTemplate);
        }
      }
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete',
      click: (data: any): void => {
        this.isUnBatchRefundsClosed = false;
        this.isDeleteClaimClosed = true;
        this.onSingleClaimDelete(data.paymentRequestId.split(','));
        this.onDeleteRefundsOpenClicked(
          this.deleteRefundsConfirmationDialogTemplate
        );
      },
    },
  ];

  columns: any = {
    ALL: 'All Columns',
    batchNumber: 'Batch #',
    providerName: 'Vendor',
    paymentType: 'Type',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    warrantNumber: 'Refund Warrant #',
    refundAmount: 'Refund Amount',
    depositDate: 'Deposit Date',
    originalWarrantNumber: 'Original Warrant #',
    originalAmount: 'Original Amount',
    indexCode: 'Index Code',
    pcaCode: 'PCA',
    voucherPayable: 'VP',
    refundNote: 'Refund Note',
    entryDate: 'Entry Date'
  };

  dropDowncolumns: any = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnCode: 'providerName',
      columnDesc: 'Vendor',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },

  ];
  showExportLoader = false;


  //recent claims modal
  @ViewChild('clientRecentClaimsDialog') clientRecentClaimsDialogRef!: TemplateRef<unknown>
  @ViewChild('clientRecentPremiumsDialogTemplate') clientRecentPremiumsDialogRef!: TemplateRef<unknown>
  @ViewChild('clientRecentPharmacyClaimsDialog') clientRecentPharmacyClaimsDialogRef!: TemplateRef<unknown>
  @Output() providerNameClickEvent = new EventEmitter<any>();
  vendorId: any;
  clientId: any;
  clientName: any;
  claimsType: any;
  paymentRequestId: any;
  private addClientRecentClaimsDialog: any;
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
  sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  allRefundProfilePhotoSubject = new Subject();
  showDateSearchWarning = false;


  /** Constructor **/
  constructor(
    private route: Router, private readonly cdr: ChangeDetectorRef,
    private financialVendorRefundFacade: FinancialVendorRefundFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private dialogService: DialogService,
    private readonly configurationProvider: ConfigurationProvider,
    public readonly intl: IntlService,
    private readonly financialPharmacyClaimsFacade : FinancialPharmacyClaimsFacade,) {
      this.selectableSettings = {
        checkboxOnly: this.checkboxOnly,
        mode: this.mode,
        drag: this.drag,
      };
    }

  ngOnInit(): void {
        this.sortType = 'desc'
    this.handleAllPaymentsGridData();
  }
  gridLoaderSubject = new BehaviorSubject(false);

  handleAllPaymentsGridData() {
    this.vendorRefundAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsAllPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.gridLoaderSubject.next(false);
      }
      this.vendorRefundAllPaymentsGridLists = this.gridDataResult?.data;
      if (this.recordCountWhenSelectallClicked == 0) {
        this.recordCountWhenSelectallClicked = this.gridDataResult?.total;
        this.totalGridRecordsCount = this.gridDataResult?.total;
      }
      if (!this.selectAll) {
        this.vendorRefundAllPaymentsGridLists.forEach((item1: any) => {
          const matchingGridItem = this.selectedAllPaymentsList?.paymentsSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
          if (matchingGridItem) {
            item1.selected = true;
          } else {
            item1.selected = false;
          }
        });
      }
      this.currentPageRecords = this.vendorRefundAllPaymentsGridLists;
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
      const idsToKeep: number[] = this.checkedAndUncheckedRecordsFromSelectAll.map((item: any) => item.paymentRequestId);
      // Remove items from selected records based on the IDs from grid data
      for (let i = this.selectedAllPaymentsList?.paymentsSelected?.length - 1; i >= 0; i--) {
        if (!idsToKeep.includes(this.selectedAllPaymentsList?.paymentsSelected[i].paymentRequestId)) {
          this.selectedAllPaymentsList?.paymentsSelected.splice(i, 1); // Remove the item at index i
        }
      }
      this.getSelectedReportCount(this.selectedAllPaymentsList?.paymentsSelected?.filter((item: any) => item.selected));
    }
  }

  pageNumberAndCountChangedInSelectAll() {
    //If selecte all header checked and either the page count or the page number changed
    if (this.selectAll && (this.isPageChanged || this.isPageCountChanged)) {
      this.selectedAllPaymentsList = [];
      this.selectedAllPaymentsList.paymentsSelected = [];
      for (const item of this.vendorRefundAllPaymentsGridLists) {
        // Check if the item is in the second list.
        const isItemInSecondList = this.unCheckedProcessRequest.find((item2: any) => item2.paymentRequestId === item.paymentRequestId);
        // If the item is in the second list, mark it as selected true.
        if (isItemInSecondList) {
          item.selected = false;
        } else {
          item.selected = true;
        }
      }
    }
  }

  ngOnChanges(): void {
    this.sortType = 'desc'
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadVendorRefundAllPaymentsListGrid();
  }

  private loadVendorRefundAllPaymentsListGrid(): void {
    this.loadRefundAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadRefundAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isVendorRefundAllPaymentsGridLoaderShow = true;

    if (sortValue === 'batchNumber') {
      sortValue = 'entryDate'
    }

    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.loadVendorRefundAllPaymentsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  searchColumnChangeHandler(data: any) {
    this.searchValue = '';
    this.filter = [];
    this.refundAllPaymentSearch(this.searchValue)
  }

  refundAllPaymentSearch(searchValue: any) { 
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning = (!isDateSearch && this.selectedColumn === 'depositDate') && searchValue !== '';
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.onChange(searchValue);
  }

  onChange(data: any) {
    this.defaultGridState();
    if (this.selectedColumn === 'depositDate' && (!this.isValidDate(data) && data !== '')) {
      return;
    }
    let operator = 'contains';

    if (
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'originalAmount'
    ) {
      operator = 'eq';
    }
    if(this.selectedColumn === 'depositDate'){
      data = this.intl.formatDate(data.replace(/\s/g, ""),this.dateFormat);
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batchNumber',
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
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
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

    this.loadVendorRefundAllPaymentsListGrid();
    this.handleAllPaymentsGridData();
    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
    }
  }

  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundAllPaymentsListGrid();
    this.handleAllPaymentsGridData();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.vendorRefundAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsAllPaymentsDataSubject.next(this.gridDataResult);
      this.isVendorRefundAllPaymentsGridLoaderShow = false;
    });

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

  onClickedDownload() {
   
    this.selectedAllPaymentsList =
    {
      'data': this.selectedPayments 
    };

    this.showExportLoader = true;
    this.exportReceiptDataEvent.emit(this.selectedAllPaymentsList);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.selectedPayments = [];
        this.receiptLogMode = false;
        this.cdr.detectChanges();
      }
    });
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Batch #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'batchNumber';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue = ''

    this.loadVendorRefundAllPaymentsListGrid();
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.unBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
      this.handleUnbatchRefunds();
      this.financialVendorRefundFacade.unbatchRefund(
        [this.selected.paymentRequestId]
      );
    }
    this.isUnBatchRefundsClosed = false;
    this.unBatchDialog.close();
  }

  handleUnbatchRefunds() {
    this.financialVendorRefundFacade.unbatchRefunds$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadVendorRefundAllPaymentsListGrid();
        }
      });
  }

  public onDeleteRefundsOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteRefundsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalDeleteRefundsModalClose(result: any) {
    if (result) {
      this.isDeleteClaimClosed = false;
      this.deleteRefundsDialog.close();
    }
  }

  onSingleClaimDelete(selection: any) {
    this.selected = selection;
  }

  onModalBatchDeletingRefundsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteRefunds();
      this.financialVendorRefundFacade.deleteRefunds(this.selected);
    }
  }

  handleDeleteRefunds() {
    this.financialVendorRefundFacade.deleteRefunds$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse != null) {
          this.isDeleteClaimClosed = false;
          this.deleteRefundsDialog.close();
          this.loadVendorRefundAllPaymentsListGrid();
        }
      });
  }

  onEditRefundClaimClicked(template: TemplateRef<unknown>): void {
    this.addEditRefundFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_refund_modal',
    });
  }

  modalCloseAddEditRefundFormModal(result: any) {
    this.isRefundEditDialogOpen = false;
    this.addEditRefundFormDialog.close();
    if (result) {
      this.loadVendorRefundAllPaymentsListGrid();
    }
  }

  navToBatchDetails(data: any) {
    const query = {
      queryParams: {
        b_id: data?.batchId,
      },
    };
    this.route.navigate(['/financial-management/vendor-refund/batch/batch-log-list'], query);
  }

  isLogGridExpanded = false;
  hideActionButton = false;
  receiptLogMode = false

  cancelActions() {
    this.selectedPayments = [];
    this.changeTitle.emit();
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.hideActionButton = !this.hideActionButton;
    this.receiptLogMode = !this.receiptLogMode;

    this.markAsUnChecked(this.selectedAllPaymentsList?.paymentsSelected);
    this.markAsUnChecked(this.vendorRefundAllPaymentsGridLists);
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedAllPaymentsList.paymentsSelected = [];
    this.selectedAllPaymentsList.PrintAdviceLetterUnSelected = [];
    this.getSelectedReportCount(this.selectedAllPaymentsList?.paymentsSelected);
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
    this.selectionCount = 0;
  }

  receiptingLogClicked() {
    this.changeTitle.emit("Receipting Log");
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.receiptLogMode = !this.receiptLogMode;
    this.hideActionButton = !this.hideActionButton;
  }

  onProviderNameClick(paymentRequestId:any, type:any){
    const data ={
      paymentRequestId,
      type
    }
    this.providerNameClickEvent.emit(data);
  }

  selectionAllChange() {
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    if (this.selectAll) {
      this.markAsChecked(this.vendorRefundAllPaymentsGridLists);
    }
    else {
      this.markAsUnChecked(this.vendorRefundAllPaymentsGridLists);
    }
    this.selectedAllPaymentsList =
    {
      'selectAll': this.selectAll,
      'paymentsUnSelected': this.unCheckedProcessRequest,
      'paymentsSelected': this.checkedAndUncheckedRecordsFromSelectAll,
    };

    this.cdr.detectChanges();
    if (this.selectAll) {


      if (this.unCheckedProcessRequest?.length > 0) {
        this.selectionCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.selectionCount;
      } else {
        this.selectionCount = this.totalGridRecordsCount;
      }
    } else {
      this.getSelectedReportCount(this.selectedAllPaymentsList?.paymentsSelected);
    }
  }

  getSelectedReportCount(selectedSendReportList: []) {
    this.selectionCount = selectedSendReportList?.length;
  }

  selectionChange(dataItem: any, selected: boolean) {
    if (!selected) {
      this.onRecordSelectionChecked(dataItem);
    }
    else {
      this.onRecordSelectionUnChecked(dataItem);
    }

    this.selectedAllPaymentsList =
    {
      'selectAll': this.selectAll,
      'paymentsUnSelected': this.unCheckedProcessRequest,
      'paymentsSelected': this.checkedAndUncheckedRecordsFromSelectAll,
    };

    if (this.selectAll) {
      if (this.unCheckedProcessRequest?.length > 0) {
        this.selectionCount = this.totalGridRecordsCount - this.unCheckedProcessRequest?.length;
        this.recordCountWhenSelectallClicked = this.selectionCount;
      } else {
        this.recordCountWhenSelectallClicked = selected ? this.recordCountWhenSelectallClicked + 1 : this.recordCountWhenSelectallClicked - 1;
        this.selectionCount = this.recordCountWhenSelectallClicked;
      }
    } else {
      this.selectionCount = this.selectedAllPaymentsList?.paymentsSelected?.filter((item: any) => item.selected).length;
    }
    this.cdr.detectChanges();
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
        const itemMarkedAsUnChecked = this.unCheckedPaymentRequest.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        if (itemMarkedAsUnChecked !== null && itemMarkedAsUnChecked !== undefined) {
          element.selected = false;
        }
        const itemMarkedAsChecked = this.selectedDataIfSelectAllUnchecked.find((x: any) => x.paymentRequestId === element.paymentRequestId);
        if (itemMarkedAsChecked !== null && itemMarkedAsChecked !== undefined) {
          element.selected = true;
        }
      }

    });

  }

  markAsUnChecked(data: any) {
    data.forEach((element: any) => {
      element.selected = false;
    });
  }

  onRecordSelectionChecked(dataItem: any) {
    this.unCheckedProcessRequest.push({ 'paymentRequestId': dataItem.paymentRequestId, 'selected': true });
    this.currentPageRecords?.forEach((element: any) => {
      if (element.paymentRequestId === dataItem.paymentRequestId) {
        element.selected = false;
      }
    });
    const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
    if (exist === 0) {
      this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'selected': false });
    } else {
      const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
      if (recordIndex !== -1) {
        this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
      }
    }
  }

  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
  }

  onRecordSelectionUnChecked(dataItem: any) {
    this.unCheckedProcessRequest = this.unCheckedProcessRequest.filter((item: any) => item.paymentRequestId !== dataItem.paymentRequestId);
    this.currentPageRecords?.forEach((element: any) => {
      if (element.paymentRequestId === dataItem.paymentRequestId) {
        element.selected = true;
      }
    });
    const exist = this.checkedAndUncheckedRecordsFromSelectAll?.filter((x: any) => x.paymentRequestId === dataItem.paymentRequestId).length;
    if (exist === 0) {
      this.checkedAndUncheckedRecordsFromSelectAll.push({ 'paymentRequestId': dataItem.paymentRequestId, 'vendorAddressId': dataItem.vendorAddressId, 'selected': true, 'batchId': dataItem.batchId });
    } else {
      const recordIndex = this.checkedAndUncheckedRecordsFromSelectAll.findIndex((element: any) => element.paymentRequestId === dataItem.paymentRequestId);
      if (recordIndex !== -1) {
        this.checkedAndUncheckedRecordsFromSelectAll.splice(recordIndex, 1); // Remove the record at the found index
      }
    }
  }

  selectedPayments: any[] = [];
  selectedKeysChange(selection: any) {
    this.selectedPayments = selection;
  }

  clientRecentClaimsModalClicked(
    data: any
  ): void {
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
    this.paymentRequestId = data.paymentRequestId
    this.claimsType = 'medical'
    let template;

    switch (data.paymentTypeCode) {
      case FinancialServiceTypeCode.Tpa: {
        template = this.clientRecentClaimsDialogRef
        break;
      }
      case FinancialServiceTypeCode.Insurance: {
        template = this.clientRecentPremiumsDialogRef;
        break;
      }
      case FinancialServiceTypeCode.Pharmacy: {
        template = this.clientRecentPharmacyClaimsDialogRef;
        break;
      }
      default: break;
    }

    if (template)
      this.addClientRecentClaimsDialog = this.dialogService.open({
        content: template,
        cssClass: 'app-c-modal  app-c-modal-bottom-up-modal',
        animation: {
          direction: 'up',
          type: 'slide',
          duration: 200,
        },
      });
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

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configurationProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }
    return searchValue;
  }

  selectAll: boolean = false;
  unCheckedPaymentRequest: any = [];
  selectedDataIfSelectAllUnchecked: any = [];
  currentPageRecords: any = [];
  selectedAllPaymentsList!: any;
  isPageCountChanged: boolean = false;
  isPageChanged: boolean = false;
  unCheckedProcessRequest: any = [];
  checkedAndUncheckedRecordsFromSelectAll: any = [];
  recordCountWhenSelectallClicked: number = 0;
  totalGridRecordsCount: number = 0;
  selectionCount: number = 0;
}
