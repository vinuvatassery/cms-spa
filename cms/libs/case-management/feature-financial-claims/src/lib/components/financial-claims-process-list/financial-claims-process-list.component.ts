/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  BatchClaim,
  FinancialClaimsFacade
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  GridDataResult,
  SelectableMode,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { Subject, first } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-financial-claims-process-list',
  templateUrl: './financial-claims-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProcessListComponent implements OnChanges {
  @ViewChild('batchClaimsConfirmationDialog', { read: TemplateRef })
  batchClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  private deleteClaimsDialog: any;
  private batchConfirmClaimsDialog: any;
  private addEditClaimsFormDialog: any;
  private addClientRecentClaimsDialog: any;
  isDeleteBatchClosed = false;
  isBatchClaimsOption = false;
  isDeleteClaimsOption = false;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isFinancialClaimsProcessGridLoaderShow = false;
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueFinancialInvoices: any;
  @Input() financialClaimsProcessGridLists$: any;
  @Input() financialClaimsInvoice$: any;
  @Input() exportButtonShow$: any;

  @Output() loadFinancialClaimsProcessListEvent = new EventEmitter<any>();
  @Output() loadFinancialClaimsInvoiceListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();

  public state!: State;
  sortColumn = 'Invoice ID';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn='invoiceNbr';
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridFinancialClaimsProcessDataSubject = new Subject<any>();
  gridFinancialClaimsProcessData$ =
    this.gridFinancialClaimsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() onProviderNameClickEvent = new EventEmitter<any>();

  @ViewChild('addEditClaimsDialog')
  private addEditClaimsDialog!: TemplateRef<any>;

  isEdit!: boolean;
  paymentRequestId!: string;

  vendorId: any;
  clientId: any;
  clientName: any;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;

  public selectedProcessClaims: any[] = [];
  columns: any = {
    invoiceNbr: 'Invoice ID',
    vendorFullName: 'Provider Name',
    tin: 'Tax ID',
    paymentMethodCode: 'Payment Method',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    serviceCount: 'Service Count',
    annualTotal: 'Client Annual Total',
    balanceAmount: 'Client Balance',
    amountDue: 'Total Due',
    paymentStatusCode: 'Payment Status',
  };

  dropDowncolumns: any = [
    {
      columnCode: 'invoiceNbr',
      columnDesc: 'Invoice ID',
    },
    {
      columnCode: 'vendorFullName',
      columnDesc: 'Provider Name',
    },
    {
      columnCode: 'tin',
      columnDesc: 'Tax ID',
    },
    {
      columnCode: 'paymentMethodCode',
      columnDesc: 'Payment Method',
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
      columnCode: 'serviceCount',
      columnDesc: 'Service Count',
    },
    {
      columnCode: 'annualTotal',
      columnDesc: 'Client Annual Total',
    },
    {
      columnCode: 'balanceAmount',
      columnDesc: 'Client Balance',
    },
    {
      columnCode: 'amountDue',
      columnDesc: 'Total Due',
    },
    {
      columnCode: 'paymentStatusCode',
      columnDesc: 'Payment Status',
    },
  ];

  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Batch Claims',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },
  ];
  public processGridActions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Claim',
      icon: 'edit',
      click: (claim: any): void => {
        this.onClaimClick(claim);
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        this.onSingleClaimDelete(data.paymentRequestId.split(','));
        if (!this.selectedProcessClaims.length)
        {
          this.financialClaimsFacade.errorShowHideSnackBar("Select a claim to delete")
          return;
        } 
        this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialog);
      },
    },
  ];
  deletemodelbody =
    'This action cannot be undone, but you may add a claim at any time.';
  /** Constructor **/
  constructor(
    private readonly route: Router,
    private dialogService: DialogService,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }

  onSingleClaimDelete(selection: any) {
    this.selectedKeysChange(selection);
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialClaimsProcessListGrid();
  }

  private loadFinancialClaimsProcessListGrid(): void {
    this.loadClaimsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialClaimsProcessGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadFinancialClaimsProcessListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'clientId' ||
      this.selectedColumn === 'serviceCount' ||
      this.selectedColumn === 'annualTotal' ||
      this.selectedColumn === 'amountDue' ||
      this.selectedColumn === 'balanceAmount'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'invoiceNbr',
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
    this.loadFinancialClaimsProcessListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialClaimsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  searchColumnChangeHandler(data:any){
    this.onChange(data)
  }

  gridDataHandle() {
    this.financialClaimsProcessGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridFinancialClaimsProcessDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialClaimsProcessGridLoaderShow = false;
      }
    });
  }

  public onBatchClaimsClicked(template: TemplateRef<unknown>): void {
    if (!this.selectedProcessClaims.length) return;
    this.batchConfirmClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-md app-c-modal-np',
    });
  }
  onModalBatchClaimsModalClose() {
    this.batchConfirmClaimsDialog.close();
  }

  onModalBatchClaimsButtonClicked(event: any) {
    const input: BatchClaim = {
      PaymentRequestIds: this.selectedProcessClaims,
    };

    this.handleBatchClaims();
    this.financialClaimsFacade.batchClaims(input, this.claimsType);
  }

  handleBatchClaims() {
    this.financialClaimsFacade.batchClaims$
      .pipe(first((batchResponse: any) => batchResponse != null))
      .subscribe((batchResponse: any) => {
        if (batchResponse ?? false) {
          this.loadFinancialClaimsProcessListGrid();
          this.onBatchClaimsGridSelectedCancelClicked();
        }
      });
    this.batchConfirmClaimsDialog.close();
  }

  handleDeleteClaims() {
    this.financialClaimsFacade.deleteClaims$
      .pipe(first((deleteResponse: any) => deleteResponse != null))
      .subscribe((deleteResponse: any) => {
        if (deleteResponse ?? false) {
          this.loadFinancialClaimsProcessListGrid();
          this.onBatchClaimsGridSelectedCancelClicked();
        }
      });
    this.deleteClaimsDialog.close();
  }

  onModalBatchDeletingClaimsButtonClicked(action: any) {
    if (action) {
      this.handleDeleteClaims();
      this.financialClaimsFacade.deleteClaims(
        this.selectedProcessClaims,
        this.claimsType
      );
    }
  }

  public onDeleteClaimsOpenClicked(template: TemplateRef<unknown>): void { 
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {
    if (result) {
      this.isDeleteBatchClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
    this.isEdit = false;
    this.openAddEditClaimDialoge();
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.loadFinancialClaimsProcessListGrid();
      this.addEditClaimsFormDialog.close();
    }
  }

  onBatchClaimsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchClaimsDeleteGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }
  selectedKeysChange(selection: any) {
    this.selectedProcessClaims = selection;
  }

  onBatchClaimsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
    this.selectedProcessClaims = [];
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
  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Invoice ID';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'invoiceNbr';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'invoiceNbr';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''

    this.loadFinancialClaimsProcessListGrid();
  }

  loadFinancialClaimsInvoiceListService(data: any) {
    this.loadFinancialClaimsInvoiceListEvent.emit(data);
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
      cssClass: 'app-c-modal app-c-modal-full add_claims_modal',
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

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeRecentClaimsModal(true);
  }

  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }
}
