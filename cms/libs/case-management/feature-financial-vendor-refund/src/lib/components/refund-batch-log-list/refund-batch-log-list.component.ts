/** Angular **/
import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, OnChanges, Output, TemplateRef,
  ViewChild, ChangeDetectorRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Observable, Subject, first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialVendorRefundFacade, PaymentBatchName } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { OnInit } from '@angular/core';
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
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() batchLogGridLists$: any;
  @Input() exportButtonShow$: any
  @Input() paymentBatchName$!: Observable<PaymentBatchName>;

  @Output() loadVendorRefundBatchLogListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() exportReceiptDataEvent = new EventEmitter<any>();

  isUnBatchRefundsClosed = false;
  isDeleteClaimClosed = false;
  UnBatchDialog: any;
  deleteRefundsDialog: any;
  selected: any;
  receiptLogTitlePart = "";
  deletemodelbody =
    'This action cannot be undone, but you may add a claim at any time. This claim will not appear in a batch';

  public batchLogGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
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
    voucherPayable: 'VP',
    refundNote: 'Refund Note',
    entryDate: 'Entry Date'
  };

  dropDowncolumns: any = [
    {
      columnCode: 'vendorName',
      columnDesc: 'Vendor',
    },
    {
      columnCode: 'serviceType',
      columnDesc: 'Type',
    },

    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'nameOnInsuranceCard',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'refundWarrant',
      columnDesc: 'Refund Warrant #',
    },
    {
      columnCode: 'refundAmount',
      columnDesc: 'Refund Amount',
    }
    ,
    {
      columnCode: 'depositDate',
      columnDesc: 'Deposit Date',
    }
    ,
    {
      columnCode: 'originalWarrant',
      columnDesc: 'Original Warrant #',
    }
    ,
    {
      columnCode: 'originalAmount',
      columnDesc: 'Original Amount',
    }
    ,
    {
      columnCode: 'indexCode',
      columnDesc: 'Index Code',
    }
    ,
    {
      columnCode: 'pcaCode',
      columnDesc: 'PCA',
    }
    ,
    {
      columnCode: 'grantNumber',
      columnDesc: 'Grant #',
    },
    {
      columnCode: 'voucherPayable',
      columnDesc: 'VP',
    },
    {
      columnCode: 'refundNote',
      columnDesc: 'Refund Note',
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
  selectedColumn = 'vendorName'
  gridDataResult!: GridDataResult;

  gridVendorsBatchLogDataSubject = new Subject<any>();
  gridVendorsBatchLogData$ = this.gridVendorsBatchLogDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  isBulkUnBatchOpened: any;
  batchId: any;

  /** Constructor **/
  constructor(
    private route: Router,
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private dialogService: DialogService,
    private readonly cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const batchId = params['b_id'];
      this.batchId = batchId;
    });
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
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
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadBatchLogListGrid();
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
    this.receiptLogTitlePart = "";
    this.selectedPayments = [];
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.hideActionButton = !this.hideActionButton;
    this.receiptLogMode = !this.receiptLogMode;
  }

  receiptingLogClicked() {
    this.receiptLogTitlePart = "Receipting Log";
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.receiptLogMode = !this.receiptLogMode;
    this.hideActionButton = !this.hideActionButton;
  }

  onClickedDownload() {
    if (!this.selectedPayments.length) {
      return;
    }
    this.showExportLoader = true;
    var data = {
      batchId : this.batchId,
      selectedIds : this.selectedPayments,
      gridDataResult : this.gridDataResult
    };
    this.exportReceiptDataEvent.emit(data);
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }
}
