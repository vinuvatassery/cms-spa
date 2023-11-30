/** Angular **/
import {
  ChangeDetectionStrategy,
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
import { FinancialVendorRefundFacade, GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {  GridDataResult, SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject, Subscription, first } from 'rxjs';
@Component({
  selector: 'cms-refund-process-list',
  templateUrl: './refund-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundProcessListComponent implements  OnInit, OnChanges, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('batchRefundConfirmationDialog', { read: TemplateRef })
  batchRefundConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteRefundConfirmationDialog', { read: TemplateRef })
  deleteRefundConfirmationDialog!: TemplateRef<any>;
  private deleteRefundDialog: any;
  private batchConfirmRefundDialog: any;
  private addEditRefundFormDialog: any;
  @ViewChild('addEditRefundDialog', { read: TemplateRef })
  addEditRefundFormDialogDialogTemplate!: TemplateRef<any>;

  isDeleteBatchClosed = false;
  isDataAvailable=true;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundProcessGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorRefundProcessGridLists$: any;
  @Input() vendorProfile$ :any;
  @Input() updateProviderPanelSubject$:any
  @Input() ddlStates$ :any
  @Input() paymentMethodCode$ :any
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  isColumnsReordered = false;
  columnChangeDesc = 'Default Columns';
  filteredByColumnDesc = '';
  sortColumnDesc = 'Vendor Name';
  searchText = '';
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'Vendor Name';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn='VendorName';
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  isBatchSelected=false;
  gridVendorsProcessDataSubject = new Subject<any>();
  gridVendorsProcessData$ = this.gridVendorsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  serviceType =''
  gridColumns: { [key: string]: string }  = {
    ALL: 'All Columns',
    VendorName: "Vendor Name",
  };

  columns: any = {
    VendorName: 'Vendor Name',
    type: 'Type' ,
    clientFullName: 'Client Name',
    refundWarrentnbr: 'Refund Warrant #',
    refundAmount:'Refund Amount',
    indexCode: 'Index Code',
    pcaCode:'PCA',
    vp:'VP',
    refunfNotes:'Refund Note',
    origionalWarrentnbr:'Original Warrant #',


  };

  dropDowncolumns: any = [

    {
      columnCode: 'VendorName',
      columnDesc: 'Vendor Name',
    },
    {
      columnCode: 'type',
      columnDesc: 'Type',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'refundWarrentnbr',
      columnDesc: 'Refund Warrant #',
    },
    {
      columnCode: 'refundAmount',
      columnDesc: 'Refund Amount',
    },

    {
      columnCode: 'indexCode',
      columnDesc: 'Index Code',
    },

    {
      columnCode: 'pcaCode',
      columnDesc: 'PCA',
    },
    {
      columnCode: 'origionalWarrentnbr',
      columnDesc: 'Original Warrant #',
    },

    {
      columnCode: 'vp',
      columnDesc: 'VP',
    },

    {
      columnCode: 'refundNotes',
      columnDesc: 'Refund Note',
    },
  ]

  public selectedProcessRefunds: any[] = [];
  isProcessGridExpand = true;
  public refundProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH REFUNDS',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed && this.isDataAvailable) {
          this.isProcessBatchClosed = true;
          this.onBatchRefundsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'DELETE REFUNDS',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed && this.isDataAvailable) {
          this.isDeleteBatchClosed = true;
          this.onBatchRefundsGridSelectedClicked();
        }
      },
    },
  ];
  isAddRefundModalOpen = false;
  isEditRefund = false;
  refunEditServiceType='';
  refundEditClientId='';
  refundEditClientFullName: any;
  refundEditVendorAddressId='';
  refundEditVendorName: any;
  inspaymentRequestId: any;
  refundEditVendorId: any;

  public processGridActions(dataItem:any){
     return [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Refund',
      icon: 'edit',
      click: (refund: any): void => {
        if(!this.isAddRefundModalOpen){
          this.isAddRefundModalOpen = true;
          this.isEditRefund = true
          this.refunEditServiceType = dataItem.serviceSubTypeCode
          this.refundEditClientId =dataItem.clientId
          this.refundEditClientFullName = dataItem.clientFullName
          this.refundEditVendorAddressId = dataItem.vendorAddressId
          this.refundEditVendorName = dataItem.vendorName
          this.inspaymentRequestId = dataItem.paymentRequestId
          this.refundEditVendorId = dataItem.vendorId
        this.onEditRefundClaimClicked(this.addEditRefundFormDialogDialogTemplate)
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Refund',
      icon: 'delete',
      click: (refund: any): void => {
        if(refund.paymentRequestId){
          this.onSingleRefundDelete(refund.paymentRequestId?.split(','));
          this.onDeleteRefundsOpenClicked(this.deleteRefundConfirmationDialog);
        }
      },
    },
  ];
}

  deletemodelbody = 'This action cannot be undone, but you may add a refund at any time.';
  singleRefundDelete = false;

  public selectAllState: SelectAllCheckboxState = "unchecked";
  vendorRefundProcessGridLists: any;
  vendorRefundProcessGridListsSub!: Subscription;

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private financialVendorRefundFacade: FinancialVendorRefundFacade
  ) {
  }

  ngOnInit(){
    this.vendorRefundProcessGridListsSub = this.vendorRefundProcessGridLists$.subscribe((res: any) => this.vendorRefundProcessGridLists = res)
  }

  ngOnDestroy(){
    this.vendorRefundProcessGridListsSub?.unsubscribe();
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'VendorName', dir: 'asc' }]
    };
    this.loadVendorRefundProcessListGrid();
  }
  private loadVendorRefundProcessListGrid(): void {
    this.loadRefundProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isVendorRefundProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadVendorRefundProcessListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onModalBatchRefundModalClose(result: any) {
    if (result) {
      this.isProcessBatchClosed = false;
      this.batchConfirmRefundDialog.close();
    }
  }

  public onDeleteRefundOpenClicked(
    template: TemplateRef<unknown>,
    data: any
  ): void {
    this.deleteRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteRefundModalClose(result: any) {
    if (result) {
      this.isDeleteBatchClosed = false;
      this.deleteRefundDialog.close();
    }
  }

  onClickOpenAddEditRefundFromModal(template: TemplateRef<unknown>): void {
    this.isEditRefund =false
    this.refunEditServiceType = ""
    this.refundEditClientId =""
    this.refundEditClientFullName = ""
    this.refundEditVendorAddressId = ""
    this.refundEditVendorName = ""
    this.inspaymentRequestId = ""

    this.addEditRefundFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_refund_modal',
    });
  }
  modalCloseAddEditRefundFormModal(result: any) {
    this.isAddRefundModalOpen = false;
    this.addEditRefundFormDialog.close();
    if (result) {
      this.loadVendorRefundProcessListGrid();
    }
  }
  searchColumnChangeHandler(data:any){
    this.onChange(data)
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    if (
      this.selectedColumn === 'refundAmount' ||
      this.selectedColumn === 'refundWarrentnbr' ||
      this.selectedColumn === 'indexCode'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'VendorName',
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
    this.loadVendorRefundProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.vendorRefundProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isVendorRefundProcessGridLoaderShow = false;
      }
      if(data?.total < 1)
      {
        this.isDataAvailable=false;
      }
    });
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.sortColumn = 'Vendor Name';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'VendorName';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortValue = 'VendorName';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''
    this.loadVendorRefundProcessListGrid();
  }

  public onBatchRefundsClicked(template: TemplateRef<unknown>): void {
    if (!this.selectedProcessRefunds.length) return;
    this.batchConfirmRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }

  onModalBatchRefundsModalClose(result: any) {
    if(result){
      this.batchConfirmRefundDialog.close();
    }
  }

  onModalBatchRefundsButtonClicked(event: any) {
    this.handleBatchRefunds();

    this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType

    const gridDataRefinerValue: any = {
      skipCount: this.state?.skip ?? 0,
      maxResultCount: this.state?.take ?? 0,
      sorting: this.sortValue,
      sortType: this.sortType,
      filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };

    this.financialVendorRefundFacade.batchRefunds(this.selectedProcessRefunds, this.selectAllState === 'checked', gridDataRefinerValue);
  }

  handleBatchRefunds() {
    this.financialVendorRefundFacade.batchRefunds$
      .pipe(first((batchResponse: any) => batchResponse != null))
      .subscribe((batchResponse: any) => {
        if (batchResponse ?? false) {
          this.loadVendorRefundProcessListGrid();
          this.onBatchRefundsGridSelectedCancelClicked();
        }
      });
    this.batchConfirmRefundDialog.close();
  }

  onBatchRefundsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchRefundsDeleteGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  selectedKeysChange(selection: any) {

    const len = this.selectedProcessRefunds.length;

    if (len === 0) {
      this.selectAllState = "unchecked";
    } else if (len > 0 && len < this.vendorRefundProcessGridLists.total) {
      this.selectAllState = "indeterminate";
    } else {
      this.selectAllState = "checked";
    }

    this.selectedProcessRefunds = selection;
  }

  public onSelectAllChange(checkedState: SelectAllCheckboxState): void {
    if (checkedState === "checked") {
      this.selectedProcessRefunds = this.vendorRefundProcessGridLists.data.map((item: any) => item.paymentRequestId);
      this.selectAllState = "checked";
    } else {
      this.selectedProcessRefunds = [];
      this.selectAllState = "unchecked";
    }
  }

  onBatchRefundsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
    this.singleRefundDelete = false;
    this.selectedProcessRefunds = [];
    this.selectAllState = "unchecked";
    this.cdr.detectChanges();
  }

  onSingleRefundDelete(selection: any) {
    this.singleRefundDelete = true;
    this.selectedKeysChange(selection);
  }

  handleDeleteRefunds() {
    this.financialVendorRefundFacade.deleteRefunds$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse ?? false) {
          this.loadVendorRefundProcessListGrid();
          this.onBatchRefundsGridSelectedCancelClicked();
        }
      });
    this.deleteRefundDialog.close();
  }

  onModalBatchDeletingRefundsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteRefunds();
      this.financialVendorRefundFacade.deleteRefunds(
        this.selectedProcessRefunds
      );
    }
  }

  public onDeleteRefundsOpenClicked(template: TemplateRef<unknown>): void {
    if (!this.selectedProcessRefunds?.length)
    {
      this.financialVendorRefundFacade.errorShowHideSnackBar("Select a Refund to delete")
      return;
    }
    this.deleteRefundDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onModalDeleteRefundsModalClose(result: any) {
    if (result) {
      this.singleRefundDelete = false;
      this.deleteRefundDialog.close();
    }
  }

  onEditRefundClaimClicked(template: TemplateRef<unknown>): void {
    this.addEditRefundFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_refund_modal',
    });
  }

  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }
}
