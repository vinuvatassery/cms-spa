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
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ColumnVisibilityChangeEvent, GridDataResult, SelectableMode, SelectableSettings } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { BatchPharmacyClaims } from 'libs/case-management/domain/src/lib/entities/financial-management/batch-pharmacy-claims';
import { Subject, debounceTime } from 'rxjs';
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

  @Output() addPharmacyClaimEvent = new EventEmitter<any>();
  @Output() updatePharmacyClaimEvent = new EventEmitter<any>();
  @Output() getPharmacyClaimEvent = new EventEmitter<any>();
  @Output() searchPharmaciesEvent = new EventEmitter<any>();
  @Output() searchClientsEvent = new EventEmitter<any>();
  @Output() searchDrugEvent = new EventEmitter<any>();
  @Output() getCoPaymentRequestTypeLovEvent = new EventEmitter<any>();
  @Output() getDrugUnitTypeLovEvent = new EventEmitter<any>();

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
      click: (data: any): void => {
        if (!this.isAddEditClaimMoreClose) {
          this.isAddEditClaimMoreClose = true;
          this.onClickOpenAddEditClaimsFromModal(this.addEditClaimsDialog);
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claim',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchMoreOptionClosed) {
          this.isDeleteBatchMoreOptionClosed = true;
          this.onDeleteClaimsOpenClicked(this.deleteClaimsConfirmationDialog);
        }
      },
    },
  ];

  gridColumns: { [key: string]: string } = {
    ALL: 'All Columns',
    pharmacyName: 'Pharmacy Name',
    paymentMethodCode: 'Payment Method',
    clientFullName: 'Client Name',
    insuranceName: 'Name on Primary Insurance Card',
    clientId: 'Client ID',
    paymentType: 'Payment Type',
    amountPaid: 'Amount Paid',
    indexCode: 'Index Code',
    pcaCode: 'PCA Code',
    objectCode: 'Object Code',
    paymentStatus: 'Payment Status',
    creationTime: 'Entry Date'
  };

  searchColumnList: { columnName: string, columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    { columnName: 'pharmacyName', columnDesc: 'Pharmacy Name' },
    { columnName: 'paymentMethodCode', columnDesc: 'Payment Method' },
    { columnName: 'clientFullName', columnDesc: 'Client Name' },
    { columnName: 'insuranceName', columnDesc: 'Name on Primary Insurance Card' },
    { columnName: 'clientId', columnDesc: 'Client ID' },
    { columnName: 'paymentType', columnDesc: 'Payment Type' },
    { columnName: 'amountPaid', columnDesc: 'Amount Paid' },
    { columnName: 'indexCode', columnDesc: 'Index Code' },
    { columnName: 'pcaCode', columnDesc: 'PCA Code' },
    { columnName: 'objectCode', columnDesc: 'Object Code' },
    { columnName: 'paymentStatus', columnDesc: 'Payment Status' },
    { columnName: 'creationTime', columnDesc: 'Entry Date' }
  ];

  /** Constructor **/
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private dialogService: DialogService
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
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
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
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadPharmacyClaimsProcessListGrid();
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    //this.showNumberSearchWarning = (['pcaCode', 'appropriationYear']).includes(value);
    //this.showDateSearchWarning = value === 'closeDate';
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    // this.showDateSearchWarning = isDateSearch || this.selectedSearchColumn === 'closeDate';
    //searchValue = this.formatSearchValue(searchValue, isDateSearch);
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

  }

  performSearch(data: any) {
    this.defaultGridState();
    const operator = (['clientId']).includes(this.selectedSearchColumn) ? 'eq' : 'startswith';
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

  onClickOpenAddEditClaimsFromModal(template: TemplateRef<unknown>): void {
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
    template: TemplateRef<unknown>
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
  }

  updatePharmacyClaim(data: any) {
    this.updatePharmacyClaimEvent.emit(data);
  }

  getPharmacyClaim(paymentRequestId: any) {
    this.getPharmacyClaimEvent.emit(paymentRequestId);
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
}
