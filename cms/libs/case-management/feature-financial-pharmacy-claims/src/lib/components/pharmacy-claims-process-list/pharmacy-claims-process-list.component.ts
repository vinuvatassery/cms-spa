/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DrugsFacade, FinancialClaimsFacade, FinancialPharmacyClaimsFacade, FinancialVendorFacade, GridFilterParam, VendorFacade } from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ColumnVisibilityChangeEvent, FilterService, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BatchPharmacyClaims } from 'libs/case-management/domain/src/lib/entities/financial-management/batch-pharmacy-claims';
import { Subject, debounceTime, first } from 'rxjs';
@Component({
  selector: 'cms-pharmacy-claims-process-list',
  templateUrl: './pharmacy-claims-process-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProcessListComponent implements OnInit, OnDestroy {

  /* Input Properties */
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmacyClaimsProcessGridLoader$: any;
  @Input() pharmacyClaimsProcessGridLists$: any;

  /* Output Properties */
  @Output() loadPharmacyClaimsProcessListEvent = new EventEmitter<any>();
  @Output() exportPharmacyClaimsProcessListEvent = new EventEmitter<any>();
  @Input() batchingClaims$: any; 
  @Output() onbatchClaimsClickedEvent = new EventEmitter<any>();
  @Output() ondeleteClaimsClickedEvent = new EventEmitter<any>();
  public selectedProcessClaims: any[] = [];
  public selectableSettings: SelectableSettings;
  public checkboxOnly = true;
  public mode: SelectableMode = 'multiple';
  public drag = false;
  @ViewChild('batchClaimsConfirmationDialog', { read: TemplateRef })
  batchClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog', { read: TemplateRef })
  addEditClaimsDialog!: TemplateRef<any>;

  public formUiStyle: UIFormStyle = new UIFormStyle();
  private deleteClaimsDialog: any;
  private batchConfirmClaimsDialog: any;
  private addEditClaimsFormDialog: any;
  private addClientRecentClaimsDialog: any;
  providerDetailsDialog: any;
  isDeleteBatchClosed = false;
  isDeleteBatchMoreOptionClosed = false;
  isAddEditClaimMoreClose = false;
  isBatchClaimsOption = false;
  isDeleteClaimsOption = false;
  isProcessBatchClosed = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isProcessGridExpand = true;
  isPharmacyClaimsProcessGridLoaderShow = false;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  vendorId: any;
  clientId: any;
 clientName: any;
 claimsType:any;
 paymentRequestId!: string;
  @Input() addPharmacyClaim$: any;
  @Input() editPharmacyClaim$: any;
  @Input() getPharmacyClaim$: any;
  @Input() searchPharmacies$: any;
  @Input() searchClients$: any;
  @Input() searchDrugs$: any;
  @Input() searchPharmaciesLoader$: any;
  @Input() searchClientLoader$: any;
  @Input() searchDrugsLoader$: any;
  @Input() paymentRequestType$ : any
  @Input() deliveryMethodLov$ :any
  @Input() pharmacyClaimsProcessListProfilePhoto$: any;

  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();

  public state!: State;
  sortColumnDesc = 'Entry Date';
  sortDir = 'Descending';
  columnsReordered = false;
  filteredByColumnDesc = '';
  columnChangeDesc = 'Default Columns';
  isColumnsReordered = false;
  selectedSearchColumn = 'ALL';
  searchText = '';
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridPharmacyClaimsProcessDataSubject = new Subject<any>();
  gridPharmacyClaimsProcessData$ =
    this.gridPharmacyClaimsProcessDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  private searchSubject = new Subject<string>();
  addDrug$ = this.drugsFacade.addDrug$
  manufacturersLov$ = this.financialVendorFacade.manufacturerList$;
  sortValueRecentClaimList = this.financialPharmacyClaimsFacade.sortValueRecentClaimList;
  sortRecentClaimList = this.financialPharmacyClaimsFacade.sortRecentClaimList;
  gridSkipCount = this.financialPharmacyClaimsFacade.skipCount;
  recentClaimsGridLists$ = this.financialPharmacyClaimsFacade.recentClaimsGridLists$;
  pharmacyRecentClaimsProfilePhoto$ = this.financialPharmacyClaimsFacade.pharmacyRecentClaimsProfilePhoto$;
  fromDrugPurchased:any = false;
  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'BATCH CLAIMS',
      icon: 'check',
      click: (data: any,paymentRequestId : any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true;
          this.isDeleteBatchClosed = false;
          this.onBatchClaimsGridSelectedClicked();
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'DELETE CLAIMS',
      icon: 'delete',
      click: (data: any,paymentRequestId : any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isProcessBatchClosed=false;
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
      click: (data: any,paymentRequestId : any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog,paymentRequestId);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        if(data.paymentRequestId)
        {
          this.onSingleClaimDelete(data.paymentRequestId.split(','));
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialog);
        }
      
      },
    },
  ];
  onSingleClaimDelete(selection: any) {
    this.selectedKeysChange(selection);
  }
  gridColumns: any = {
    ALL: 'All Columns',
    pharmacyName: 'Pharmacy Name',
    paymentMethodDesc: 'Payment Method',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentType: 'Payment Type',
    amountDue: 'Amount Paid',
    indexCode: 'Index Code',
    pcaCode: 'PCA Code',
    objectCode: 'Object Code',
    paymentStatusDesc: 'Payment Status',
    creationTime: 'Entry Date'
  };

  searchColumnList: { columnName: string, columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'pharmacyName', columnDesc: 'Pharmacy Name' },
    { columnName: 'clientFullName', columnDesc: 'Client Name' },
    { columnName: 'clientId', columnDesc: 'Client ID' },
  ];

  paymentMethodFilter = '';
  paymentTypeFilter = '';
  paymentStatusFilter = '';
  deletemodelbody =
  'This action cannot be undone, but you may add a claim at any time.';
  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private route: Router,
    private readonly drugsFacade: DrugsFacade,
    private readonly financialVendorFacade: FinancialVendorFacade,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private readonly vendorFacade:VendorFacade
  ) { 
    this.selectableSettings = {
      checkboxOnly: this.checkboxOnly,
      mode: this.mode,
      drag: this.drag,
    };
  }


  ngOnInit(): void {
    this.loadPharmacyClaimsProcessListGrid();
    this.addSearchSubjectSubscription();
    this.lovFacade.getClaimStatusLov();
    this.lovFacade.getPaymentMethodLov();   
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }

  loadManufacturerEvent(event:any){
    this.vendorFacade.loadAllVendors(FinancialVendorTypeCode.Manufacturers).subscribe({
      next: (data: any) => {
        this.financialVendorFacade.manufacturerListSubject.next(data);
      }      
    });
  }
  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadPharmacyClaimsProcessListGrid() {
    const gridDataRefinerValue = new GridFilterParam(this.state?.skip ?? 0, this.state?.take ?? 0, this.sortValue, this.sortType, JSON.stringify(this.filter));
    this.loadPharmacyClaimsProcessListEvent.emit(gridDataRefinerValue);
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

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.clearIndividualSelectionOnClear(stateData);
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadPharmacyClaimsProcessListGrid();
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);  
  }

  private setFilterBy(isFromGrid: boolean, searchValue: any = '', filter: any = []) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters?.filter((fld: any) => fld.value)?.map((fld: any) =>
            this.gridColumns[fld.field])
          return ([...new Set(filteredColumns)]);
        });

        this.filteredByColumnDesc = ([...new Set(filteredColumns)])?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc = this.searchColumnList?.find(i => i.columnName === this.selectedSearchColumn)?.columnDesc ?? '';
    }
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300))
      .subscribe((searchValue) => {
        this.performSearch(searchValue);
      });
  }

  resetGrid() {
    this.defaultGridState();
    this.sortValue = 'creationTime';
    this.sortType = 'desc';
    this.sortDir = this.sortType === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.loadPharmacyClaimsProcessListGrid();
  }

  performSearch(data: any) {
    this.defaultGridState();
    const operator = 'contains';
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
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

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmacyClaimsProcessListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  public onBatchClaimsClicked(template: TemplateRef<unknown>): void {
    this.batchConfirmClaimsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  onModalBatchClaimsModalClose() {
      this.batchConfirmClaimsDialog.close();
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
      
      this.isDeleteBatchMoreOptionClosed = false;
      this.deleteClaimsDialog.close();
    }
  }

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>,paymentRequestId : any): void {  
    if(paymentRequestId !== '00000000-0000-0000-0000-000000000000')  
    {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
    }
    this.addEditClaimsFormDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-96full add_claims_modal',
    });
  }
  modalCloseAddEditClaimsFormModal(result: any) {
    if (result) {
      this.isAddEditClaimMoreClose = false;
      this.addEditClaimsFormDialog.close();
    }
  }

  addDrugEventHandler(event:any){
    this.drugsFacade.addDrugData(event);
  }

  searchClientsDataEventHandler(client:any){
    this.financialPharmacyClaimsFacade.searchClientsDataSubject.next(client);
  }

  searchPharmacyDataEventHandler(vendor:any){
    this.financialPharmacyClaimsFacade.searchPharmaciesDataSubject.next(vendor)
  }

  onBatchClaimsGridSelectedClicked() {
    this.isProcessGridExpand = false;
  }

  onBatchClaimsGridSelectedCancelClicked() {
    this.isProcessGridExpand = true;
    this.isDeleteBatchClosed = false;
    this.isProcessBatchClosed = false;
    this.selectedProcessClaims = [];
  }

  clientRecentClaimsModalClicked(
    template: TemplateRef<unknown>,
  data:any): void {
    
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

  onViewProviderDetailClicked(template: TemplateRef<unknown>): void {
    this.providerDetailsDialog = this.dialogService.open({
      content: template,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }

  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  addPharmacyClaim(data: any) {
    this.addPharmacyClaimEvent.emit(data);

    this.addPharmacyClaim$.pipe(first((addResponse: any ) => addResponse != null))
    .subscribe((addResponse: any) =>
    {
      if(addResponse)
      {      
        this.loadPharmacyClaimsProcessListGrid();
        this.modalCloseAddEditClaimsFormModal(true)
      }

    })
  }

  updatePharmacyClaim(data: any) {
    this.updatePharmacyClaimEvent.emit(data);
    this.editPharmacyClaim$.pipe(first((editResponse: any ) => editResponse != null))
    .subscribe((editResponse: any) =>
    {
      if(editResponse)
      {      
        this.loadPharmacyClaimsProcessListGrid();
        this.modalCloseAddEditClaimsFormModal(true)
      }

    })
  }


  searchPharmacies(searchText: any) {
    this.searchPharmaciesEvent.emit(searchText);
  }

  searchClients(searchText: any) {
    this.searchClientsEvent.emit(searchText);
  }
  searchDrug(searchText: string) {
    this.searchDrugEvent.emit(searchText);
  }

  getCoPaymentRequestTypeLov()
  {
    this.getCoPaymentRequestTypeLovEvent.emit();
  }

  getDrugUnitTypeLov()
  {
    this.getDrugUnitTypeLovEvent.emit();
  }


  onExportClaims() {
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.exportPharmacyClaimsProcessListEvent.emit(params);
  }

  
  selectedKeysChange(selection: any) {
    this.selectedProcessClaims = selection;
  }

  OnbatchClaimsClicked(){

    const input: BatchPharmacyClaims = {
      PaymentRequestIds: this.selectedProcessClaims,
    };
    this.batchingClaims$.subscribe((_:any) =>{
      this.onModalBatchClaimsModalClose()
      this.loadPharmacyClaimsProcessListGrid();
      this.onBatchClaimsGridSelectedCancelClicked()
    })
    this.onbatchClaimsClickedEvent.emit(input)
  }
  onModalBatchDeletingClaimsButtonClicked() {
    this.ondeleteClaimsClickedEvent.emit(this.selectedProcessClaims)
    this.batchingClaims$.subscribe((_:any) =>{
      
      this.isDeleteBatchMoreOptionClosed = false;
      this.deleteClaimsDialog.close();
      this.loadPharmacyClaimsProcessListGrid();
      this.onBatchClaimsGridSelectedCancelClicked()
    })
    
   
  }
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatusDesc') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentTypeCode') {
      this.paymentTypeFilter = value;
    } else if (field === 'paymentStatusDesc') {
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

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.addClientRecentClaimsDialog.close();
  }
  onProviderNameClick(event: any) {
    this.onProviderNameClickEvent.emit(event);
  }
  loadRecentClaimListEventHandler(data : any){
    this.financialPharmacyClaimsFacade.loadRecentClaimListGrid(data);
  }

  columnName: any = "";
  isFiltered = false;
  filteredBy = '';
  clearIndividualSelectionOnClear(stateData: any)
  {
    if(stateData.filter?.filters.length > 0)
      {
        let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
        this.columnName = stateFilter.field;

          this.filter = stateFilter.value;

        this.isFiltered = true;
        const filterList = []
        for(const filter of stateData.filter.filters)
        {
          filterList.push(this.gridColumns[filter.filters[0].field]);
        }
        this.isFiltered =true;
        this.filteredBy =  filterList.toString();
      }
      else
      {
        this.filter = "";
        this.isFiltered = false
        this.selectedPaymentMethod = '';
        this.selectedPaymentStatus = '';
      }
      this.state=stateData;
      if (!this.filteredBy.includes(this.gridColumns.paymentStatusDesc)) this.selectedPaymentStatus = '';
      if (!this.filteredBy.includes(this.gridColumns.paymentMethodDesc)) this.selectedPaymentMethod = '';
  }
}
