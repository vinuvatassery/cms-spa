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
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
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
  @Input() exportButtonShow$: any;

  @Output() loadVendorRefundAllPaymentsListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  @Output() exportReceiptDataEvent = new EventEmitter<any>();
  @Output() changeTitle = new EventEmitter<any>();

  @ViewChild('unBatchRefundsDialogTemplate', { read: TemplateRef })
  unBatchRefundsDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteRefundsConfirmationDialogTemplate', { read: TemplateRef })
  deleteRefundsConfirmationDialogTemplate!: TemplateRef<any>;

  private addEditRefundFormDialog: any;

  public state!: State;
  sortColumn = 'Batch #';
  sortDir = 'Descending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn = 'batchNumber'
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
      columnCode: 'batchNumber',
      columnDesc: 'Batch #',
    },
    {
      columnCode: 'providerName',
      columnDesc: 'Vendor',
    },
    {
      columnCode: 'paymentType',
      columnDesc: 'Type',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'insuranceName',
      columnDesc: 'Name on Primary Insurance Card',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    },
    {
      columnCode: 'warrantNumber',
      columnDesc: 'Refund Warrant #',
    },
    {
      columnCode: 'refundAmount',
      columnDesc: 'Refund Amount',
    }
  ];
  showExportLoader = false;


  /** Constructor **/
  constructor(
    private route: Router, private readonly cdr: ChangeDetectorRef,
    private financialVendorRefundFacade: FinancialVendorRefundFacade,
    private dialogService: DialogService) { }

  ngOnInit(): void {
    this.sortType = 'desc'   
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
    this.onChange('')
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'originalAmount'
    ) {
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
    this.loadVendorRefundAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundAllPaymentsListGrid();
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
    if (!this.selectedPayments.length) return;
    this.showExportLoader = true;

    this.exportReceiptDataEvent.emit(this.selectedPayments);
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

    this.sortColumn = 'Batch #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'batchNumber';
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
    if (result) {
      this.isRefundEditDialogOpen = false;
      this.addEditRefundFormDialog.close();
    }
  }

  isLogGridExpanded = false;
  hideActionButton = false;
  receiptLogMode = false
  selectedPayments: any[] = [];

  cancelActions() {
    this.selectedPayments = [];
    this.changeTitle.emit();
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.hideActionButton = !this.hideActionButton;
    this.receiptLogMode = !this.receiptLogMode;
  }

  receiptingLogClicked() {
    this.changeTitle.emit("Receipting Log");
    this.isLogGridExpanded = !this.isLogGridExpanded;
    this.receiptLogMode = !this.receiptLogMode;
    this.hideActionButton = !this.hideActionButton;
  }

}
