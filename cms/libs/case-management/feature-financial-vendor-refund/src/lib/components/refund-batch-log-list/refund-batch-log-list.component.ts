/** Angular **/
import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnChanges, Output, TemplateRef,
  ViewChild, ChangeDetectorRef, OnInit
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { BehaviorSubject, Observable, Subject, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialServiceTypeCode, FinancialVendorFacade, FinancialVendorRefundFacade, PaymentBatchName } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-refund-batch-log-list',
  templateUrl: './refund-batch-log-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchLogListComponent implements OnInit, OnChanges {
  @ViewChild('unBatchRefundsDialogTemplate', { read: TemplateRef })
  unBatchRefundsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteRefundsConfirmationDialogTemplate', { read: TemplateRef })
  deleteRefundsConfirmationDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isBatchLogGridLoaderShow = false;

  @ViewChild('addEditRefundDialog', { read: TemplateRef })
  addEditRefundFormDialogDialogTemplate!: TemplateRef<any>;

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  batchLogGridLists: any;
  @Input() exportButtonShow$: any
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;

  @Output() loadVendorRefundBatchLogListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() exportReceiptDataEvent = new EventEmitter<any>();
  @Input() vendorProfile$: any;
  @Input() updateProviderPanelSubject$: any
  @Input() ddlStates$: any
  @Input() paymentMethodCode$: any
  @Input() vendorRefundBatchClaims$!: any;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  private addEditRefundFormDialog: any;
  isUnBatchRefundsClosed = false;
  isDeleteClaimClosed = false;
  UnBatchDialog: any;
  deleteRefundsDialog: any;
  selected: any;
  receiptLogTitlePart = "";
  isRefundEditDialogOpen = false;
  deletemodelbody =
    'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  refunEditServiceType = '';
  refundEditClientId = '';
  refundEditClientFullName: any;
  refundEditVendorAddressId = '';
  refundEditVendorName: any;
  inspaymentRequestId: any;

  public batchLogGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
      click: (dataItem: any): void => {
        if (!this.isRefundEditDialogOpen) {
          this.isRefundEditDialogOpen = true;
          this.refunEditServiceType = dataItem.serviceTypeCode
          this.refundEditClientId = dataItem.clientId
          this.refundEditClientFullName = dataItem.clientFullName
          this.refundEditVendorAddressId = dataItem.vendorAddressId
          this.refundEditVendorName = dataItem.vendorName
          this.inspaymentRequestId = dataItem.paymentRequestId;
          this.vendorId = dataItem.vendorId;
          this.onEditRefundClaimClicked(this.addEditRefundFormDialogDialogTemplate)
        }
      }
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
      },
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
    vendorName: 'Vendor',
    serviceType: 'Type',
    clientFullName: 'Client Name',
    nameOnInsuranceCard: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    refundWarrant: 'Refund Warrant #',
    refundAmount: 'Refund Amount',
    depositDate: 'Deposit Date',
    originalWarrant: 'Original Warrant #',
    originalAmount: 'Original Amount',
    indexCode: 'Index Code',
    pcaCode: 'PCA',
    grantNumber: 'Grant #',
    voucherPayable: 'VP - Suffix',
    refundNote: 'Refund Note',
    entryDate: 'Entry Date'
  };

  dropDowncolumns: any = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'vendorName',
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
    {
      columnCode: 'voucherPayable',
      columnDesc: 'VP - Suffix',
    }
  ];
  showExportLoader = false;


  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'ALL'
  gridDataResult!: GridDataResult;

  gridVendorsBatchLogDataSubject = new Subject<any>();
  gridVendorsBatchLogData$ = this.gridVendorsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  isBulkUnBatchOpened: any;
  batchId: any;
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;

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
  refundBatchClaimsSubject = new Subject();

  /** Constructor **/
  constructor(
    private route: Router,
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,    private readonly userManagementFacade: UserManagementFacade,

  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const batchId = params['b_id'];
      this.batchId = batchId;
    });
    this.handleAllPaymentsGridData();
  }

  gridLoaderSubject = new BehaviorSubject(false);

  handleAllPaymentsGridData() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsBatchLogDataSubject.next(this.gridDataResult);
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
          const matchingGridItem = this.selectedAllPaymentsList?.paymentsSelected.find((item2: any) => item2.paymentRequestId === item1.paymentRequestId);
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

  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
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
      for (const item of this.batchLogGridLists) {
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
    this.state = {
      skip: 0,
      take: 10,
      sort: this.sort,
    };

    this.loadBatchLogListGrid();
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
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.loadVendorRefundBatchLogListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'bulkPayment' ||
      this.selectedColumn === 'totalRefund'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
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
    this.activatedRoute.queryParams.subscribe(params => {
      const batchId = params['b_id'];
      this.batchId = batchId;
    });

    this.isPageChanged = true;
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
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

    this.loadBatchLogListGrid();
    this.handleAllPaymentsGridData();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.isPageCountChanged = true;
    this.isPageChanged = false;
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
    this.handleAllPaymentsGridData();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.batchLogGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;

      if (this.gridDataResult && this.gridDataResult.data && this.gridDataResult.data.length > 0) {
        this.batchId = this.gridDataResult.data[0].batchId;
      }
      this.gridVendorsBatchLogDataSubject.next(this.gridDataResult);
      this.isBatchLogGridLoaderShow = false;
    });

  }

  onBackClicked() {
    this.route.navigate(['financial-management/vendor-refund']);
  }

  onUnBatchOpenClicked(template: TemplateRef<unknown>): void {
    this.UnBatchDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onUnBatchCloseClicked(result: any) {
    if (result) {
      this.handleUnbatchRefunds();
      this.financialVendorRefundFacade.unbatchRefund([
        this.selected.paymentRequestId,
      ]);
    }
    this.isUnBatchRefundsClosed = false;
    this.isBulkUnBatchOpened = false;
    this.UnBatchDialog.close();
  }

  handleUnbatchRefunds() {
    this.financialVendorRefundFacade.unbatchRefunds$
      .pipe(first((unbatchResponse: any) => unbatchResponse != null))
      .subscribe((unbatchResponse: any) => {
        if (unbatchResponse ?? false) {
          this.loadBatchLogListGrid();
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
          this.loadBatchLogListGrid();
        }
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

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Vendor';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'vendorName';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'vendorName';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue = ''

    this.loadBatchLogListGrid();
  }

  searchColumnChangeHandler(data: any) {
    this.onChange('')
  }

  isLogGridExpanded = false;
  hideActionButton = false;
  receiptLogMode = false
  selectedPayments: any[] = [];

  cancelActions() {
    this.selectedPayments = [];
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.hideActionButton = !this.hideActionButton;
    this.receiptLogMode = !this.receiptLogMode;


    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    this.selectedAllPaymentsList.paymentsSelected = [];
    this.selectedAllPaymentsList.PrintAdviceLetterUnSelected = [];
    this.getSelectedReportCount(this.selectedAllPaymentsList?.paymentsSelected);
    this.selectAll = false;
    this.recordCountWhenSelectallClicked = 0;
    this.selectionCount = 0;
    this.markAsUnChecked(this.selectedAllPaymentsList?.paymentsSelected);
    this.markAsUnChecked(this.batchLogGridLists);
  }

  receiptingLogClicked() {
    this.receiptLogTitlePart = "Receipting Log";
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.receiptLogMode = !this.receiptLogMode;
    this.hideActionButton = !this.hideActionButton;
  }

  onClickedDownload() {
    this.selectedAllPaymentsList =
    {
      'selectAll': this.selectAll,
      'paymentsUnSelected': this.unCheckedProcessRequest,
      'paymentsSelected': this.checkedAndUncheckedRecordsFromSelectAll,
      'batchId': this.batchId,
    };
    this.showExportLoader = true;
    this.exportReceiptDataEvent.emit(this.selectedAllPaymentsList);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  // onClickedDownload() {
  // if (!this.selectedPayments.length) {
  //   return;
  // }
  //   this.showExportLoader = true;
  //   let data = {
  //     batchId : this.batchId,
  //     selectedIds : this.selectedPayments,
  //     gridDataResult : this.gridDataResult
  //   };
  //   this.exportReceiptDataEvent.emit(data);
  //   this.exportButtonShow$.subscribe((response: any) => {
  //     if (response) {
  //       this.showExportLoader = false;
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

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
      this.loadBatchLogListGrid();
    }
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

    switch (data.serviceTypeCode) {
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

  onProviderNameClick(paymentRequestId:any, type:any) {
    const data ={
      paymentRequestId,
      type
    }
    this.providerNameClickEvent.emit(data);
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }


  selectionAllChange() {
    this.unCheckedProcessRequest = [];
    this.checkedAndUncheckedRecordsFromSelectAll = [];
    if (this.selectAll) {
      this.markAsChecked(this.batchLogGridLists);
    }
    else {
      this.markAsUnChecked(this.batchLogGridLists);
    }

    this.selectedAllPaymentsList =
    {
      'selectAll': this.selectAll,
      'paymentsUnSelected': this.unCheckedProcessRequest,
      'paymentsSelected': this.checkedAndUncheckedRecordsFromSelectAll,
      'batchId': this.batchId,
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
      'batchId': this.batchId,
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

  selectedKeysChange(selection: any) {
    this.selectedPayments = selection;
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
