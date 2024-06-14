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
import { Router } from '@angular/router';
import { FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialServiceTypeCode, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {  ColumnVisibilityChangeEvent, GridDataResult, SelectAllCheckboxState, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
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
  isDataAvailable = true;
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
  @Input() exportButtonShow$: any
  @Input() vendorRefundListProfilePhoto$!: any;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  isColumnsReordered = false;
  columnChangeDesc = 'Default Columns';
  filteredByColumnDesc = '';
  sortColumnDesc = 'Vendor';
  searchText = '';
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'Vendor';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedSearchColumn='ALL';
  selectedColumn = 'VendorName';
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  isBatchSelected = false;
  gridVendorsProcessDataSubject = new Subject<any>();
  gridVendorsProcessData$ = this.gridVendorsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  serviceType = '';
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    VendorName: 'Vendor',
  };

  columns: any = {
    ALL: 'All Columns',
    VendorName: 'Vendor Name',
    type: 'Type',
    clientFullName: 'Client Name',
    refundWarrentnbr: 'Refund Warrant #',
    refundAmount: 'Refund Amount',
    indexCode: 'Index Code',
    pcaCode:'PCA',
    vp:'VP',
    refundNotes:'Refund Notes',
    origionalWarrentnbr:'Original Warrant #',
    creationTime: 'Entry Date',
    depositDate: 'Deposit Date'
  };

  dropDowncolumns: any = [
    { columnCode: 'ALL', columnDesc: 'All Columns' },
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
    }
  ];

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
  refunEditServiceType = '';
  refundEditClientId = '';
  refundEditClientFullName: any;
  refundEditVendorAddressId = '';
  refundEditVendorName: any;
  inspaymentRequestId: any;
  refundEditVendorId: any;
  clientBalance$ = this.financialClaimsFacade.clientBalance$;
  public processGridActions(dataItem: any) {
    return [
      {
        buttonType: 'btn-h-primary',
        text: 'Edit Refund',
        icon: 'edit',
        click: (refund: any): void => {
          if (!this.isAddRefundModalOpen) {
            this.isAddRefundModalOpen = true;
            this.isEditRefund = true;
            this.refunEditServiceType = dataItem.serviceSubTypeCode;
            this.refundEditClientId = dataItem.clientId;
            this.refundEditClientFullName = dataItem.clientFullName;
            this.refundEditVendorAddressId = dataItem.vendorAddressId;
            this.refundEditVendorName = dataItem.vendorName;
            this.inspaymentRequestId = dataItem.paymentRequestId;
            this.refundEditVendorId = dataItem.vendorId;
            this.onEditRefundClaimClicked(
              this.addEditRefundFormDialogDialogTemplate
            );
          }
        },
      },
      {
        buttonType: 'btn-h-danger',
        text: 'Delete Refund',
        icon: 'delete',
        click: (refund: any): void => {
          if (refund.paymentRequestId) {
            this.onSingleRefundDelete(refund.paymentRequestId?.split(','));
            this.onDeleteRefundsOpenClicked(
              this.deleteRefundConfirmationDialog
            );
          }
        },
      },
    ];
  }

  deletemodelbody =
    'This action cannot be undone, but you may add a refund at any time.';
  singleRefundDelete = false;

  public selectAllState: SelectAllCheckboxState = "unchecked";
  vendorRefundProcessGridLists: any;
  vendorRefundProcessGridListsSub!: Subscription;
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
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private financialVendorRefundFacade: FinancialVendorRefundFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly route: Router,
    private readonly financialPharmacyClaimsFacade : FinancialPharmacyClaimsFacade,
  ) {
    
    this.selectableSettings = { 
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  ngOnInit(){
    this.vendorRefundProcessGridListsSub = this.vendorRefundProcessGridLists$.subscribe((res: any) => {
      this.vendorRefundProcessGridLists = res;
    })
  }

  ngOnDestroy(){
    this.vendorRefundProcessGridListsSub?.unsubscribe();
  }

  ngOnChanges(): void {
    this.sortType = 'desc';
    this.state = {
      skip: 0,
      take: 20,
      sort: this.sort
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
 
  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
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
  searchColumnChangeHandler(data: any) {
    this.onChange(data);
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'contains';
    if (
      this.selectedSearchColumn === 'refundAmount' ||
      this.selectedSearchColumn === 'refundWarrentnbr' ||
      this.selectedSearchColumn === 'indexCode'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'VendorName',
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
      take: this.pageSizes[2]?.value,
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
    this.sortColumnDesc = this.gridColumns[this.sortValue];
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
      if (data?.total < 1) {
        this.isDataAvailable = false;
      }
      else
      {
        this.isDataAvailable=true;
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
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;
    this.sortColumnDesc = 'Entry Date';
    this.sortValue = 'creationTime';
    this.sortType = 'desc';
    this.sort = this.sortColumn;
    this.searchValue = '';
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
    if (result) {
      this.batchConfirmRefundDialog.close();
    }
  }

  onModalBatchRefundsButtonClicked(event: any) {
    this.handleBatchRefunds();

    this.state.skip= this.state?.skip ?? 0;
    this.state.take =this.state?.take ?? 0;  

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
    if (!this.selectedProcessRefunds?.length) {
      this.financialVendorRefundFacade.errorShowHideSnackBar(
        'Select a Refund to delete'
      );
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

  clientRecentClaimsModalClicked(
    data: any
  ): void {
    this.vendorId = data.vendorId;
    this.clientId = data.clientId;
    this.clientName = data.clientFullName;
    this.paymentRequestId = data.paymentRequestId
    this.claimsType = 'medical'
    let template;

    switch (data.type) {
      case FinancialServiceTypeCode.Tpa:{
        template = this.clientRecentClaimsDialogRef
        break;
      }
      case FinancialServiceTypeCode.Insurance:{
        template = this.clientRecentPremiumsDialogRef;
        break;
      }
      case FinancialServiceTypeCode.Pharmacy:{
        template = this.clientRecentPharmacyClaimsDialogRef;
        break;
      }
      default: break;
    }

    if(template)
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

  onProviderNameClick(paymentRequestId:any, type:any){
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
  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Columns Added';
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
}
