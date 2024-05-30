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
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  BatchClaim,
  FinancialClaimsFacade,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import {
  FilterService,
  GridComponent,
  GridDataResult,
  SelectableMode,
  SelectableSettings,
} from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject, Subscription, first, take } from 'rxjs';
import { Router } from '@angular/router';
import { LovFacade, NavigationMenuFacade, UserLevel, UserManagementFacade} from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-claims-process-list',
  templateUrl: './financial-claims-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProcessListComponent implements OnChanges , OnInit ,OnDestroy {
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
  paymentStatusLovSubscription!:Subscription;
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() sortValueFinancialInvoices: any;
  @Input() financialClaimsProcessGridLists$: any;
  @Input() financialClaimsInvoice$: any;
  @Input() exportButtonShow$: any;
  @Input() medicalClaimsProfilePhoto$!: any;
  @Output() loadFinancialClaimsProcessListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();
  userLevel = UserLevel.Level1Value;
  paymentStatusCode =null
  public state!: any;
  sortColumn = 'Invoice ID';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedSearchColumn='ALL';
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridFinancialClaimsProcessDataSubject = new Subject<any>();
  gridFinancialClaimsProcessData$ =
    this.gridFinancialClaimsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  paymentStatuses$ = this.lovFacade.paymentStatus$
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  @ViewChildren(GridComponent) private grid !: QueryList<GridComponent>;

  @ViewChild('addEditClaimsDialog')
  private addEditClaimsDialog!: TemplateRef<any>;

  isEdit!: boolean;
  paymentRequestId!: string;
  paymentStatusType:any;
  vendorId: any;
  clientId: any;
  clientName: any;
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  isDeleteClaimClicked =false;
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  permissionLevels:any[]=[];
  public selectedProcessClaims: any[] = [];
  columns: any = {
    ALL: 'All Columns',
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
    { columnCode: 'ALL', columnDesc: 'All Columns' },
    {
      columnCode: 'vendorFullName',
      columnDesc: 'Provider Name',
    },
    {
      columnCode: 'tin',
      columnDesc: 'Tax ID',
    },
    {
      columnCode: 'clientFullName',
      columnDesc: 'Client Name',
    },
    {
      columnCode: 'clientId',
      columnDesc: 'Client ID',
    }
  ];

  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH CLAIMS',
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
      text: 'DELETE CLAIMS',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true;
          this.onDeleteClaimsGridSelectedClicked();
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
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade : LovFacade,
    private readonly navigationMenuFacade : NavigationMenuFacade,
    private readonly userManagementFacade : UserManagementFacade
  ) {
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }
  ngOnInit(): void {
    this.lovFacade.getPaymentStatusLov()
    this.paymentStatusSubscription();
  }


  paymentStatusSubscription()
  {
    this.paymentStatusLovSubscription = this.paymentStatuses$.subscribe(data=>{
      this.paymentStatusType = data;
      this.cdr.detectChanges()
    });
  }

  ngOnDestroy(): void {
    this.paymentStatusLovSubscription.unsubscribe();
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
    let operator = 'contains';

    if (
      this.selectedSearchColumn === 'serviceCount' ||
      this.selectedSearchColumn === 'annualTotal' ||
      this.selectedSearchColumn === 'amountDue' ||
      this.selectedSearchColumn === 'balanceAmount'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'invoiceNbr',
              operator: operator,
              value: this.searchValue,
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
    this.searchValue = '';
    this.onChange(data)
  }
  pageChange(event:any){
    if(this.isDeleteClaimClicked){
        this.selectedProcessClaims =[]
    }
  }

  gridDataHandle() {
    this.financialClaimsProcessGridLists$.subscribe((data: any) => {
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
          this.loadPendingApprovalPaymentCount();
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
    if (!this.selectedProcessClaims.length)
    {
      this.financialClaimsFacade.errorShowHideSnackBar("Select a claim to delete")
      return;
    }
    this.deleteClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalDeleteClaimsModalClose(result: any) {

    if (result) {
      this.isDeleteBatchClosed = false;
      this.isProcessGridExpand = true;
      this.isDeleteBatchClosed = false;
      this.isProcessBatchClosed = false;
      this.selectedProcessClaims = [];
      this.deleteClaimsDialog.close();
      this.cdr.detectChanges();
    }
    this.isDeleteClaimClicked = false;
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
    this.isEdit = false;
    this.openAddEditClaimDialoge();
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result === true) {
      this.collapseRowsInGrid();
      this.loadFinancialClaimsProcessListGrid();
    }
    this.addEditClaimsFormDialog.close();
  }
  private collapseRowsInGrid() {
    this.gridFinancialClaimsProcessData$.pipe(take(1)).subscribe(({ data }) => {
      data.forEach((item: any, idx: number) => {
        this.grid.last.collapseRow((this.state.skip ?? 0) + idx);
      });
    });
  }
  onBatchClaimsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onDeleteClaimsGridSelectedClicked(){
    this.isProcessGridExpand = false;
    this.isDeleteClaimClicked =true;
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
    this.isDeleteClaimClicked = false;
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
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'invoiceNbr';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''

    this.loadFinancialClaimsProcessListGrid();
  }

  onClaimClick(dataitem: any) {
    if (!dataitem?.vendorId?.length) return;
    this.isEdit = true;
    this.paymentRequestId = dataitem?.paymentRequestId;
    this.openAddEditClaimDialoge();
  }

  openAddEditClaimDialoge() {
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: this.addEditClaimsDialog,
      cssClass: 'app-c-modal app-c-modal-96full add_claims_modal',
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

  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value.lovCode
    }],
      logic: "or"
  });
    if(field == "paymentStatusCode"){
      this.paymentStatusCode = value;
    }
  }

  sortRecordsByCreationTime(data: GridDataResult) {
    data.data.sort((a, b) => {
        const dateA = new Date(a.creationTime);
        const dateB = new Date(b.creationTime);
        return dateB.getTime() - dateA.getTime();
      });
  }

  loadPendingApprovalPaymentCount() {

    this.permissionLevels = this.userManagementFacade.GetPermissionlevelsForPendingApprovalsCount();

    this.navigationMenuFacade.getPendingApprovalPaymentCount(
    this.permissionLevels
    );
  }

}
