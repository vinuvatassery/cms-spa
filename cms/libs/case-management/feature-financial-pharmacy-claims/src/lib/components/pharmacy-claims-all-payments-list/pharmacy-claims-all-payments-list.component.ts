
import {
  ChangeDetectionStrategy,
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
import {  ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Observable, Subject, debounceTime } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';

@Component({
  selector: 'cms-pharmacy-claims-all-payments-list',
  templateUrl: './pharmacy-claims-all-payments-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsAllPaymentsListComponent implements OnInit, OnChanges{
  @ViewChild('previewSubmitPaymentDialogTemplate', { read: TemplateRef })
  previewSubmitPaymentDialogTemplate!: TemplateRef<any>;
  @ViewChild('deleteClaimsConfirmationDialog', { read: TemplateRef })
  deleteClaimsConfirmationDialog!: TemplateRef<any>;
  @ViewChild('addEditClaimsDialog', { read: TemplateRef })
  addEditClaimsDialog!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPharmacyClaimsAllPaymentsGridLoaderShow = false;
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() pharmacyClaimsAllPaymentsGridLists$: any;
  @Input() pharmacyClaimsAllPaymentsGridLoader$!: Observable<boolean>;
  @Input() exportLoader$!: Observable<boolean>;
  @Output() exportGridEvent$ = new EventEmitter<any>();
  @Output() loadPharmacyClaimsAllPaymentsListEvent = new EventEmitter<any>();
  public state!: State;
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  addClientRecentClaimsDialog:any;
  providerDetailsDialog: any;
  gridPharmacyClaimsAllPaymentsDataSubject = new Subject<any>();
  gridPharmacyClaimsAllPaymentsData$ = this.gridPharmacyClaimsAllPaymentsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  PreviewSubmitPaymentDialog: any;
  printAuthorizationDialog: any;
  isRequestPaymentClicked = false;
  isPrintAuthorizationClicked = false;
  isAddEditClaimMoreClose = false;
  isDeleteBatchMoreOptionClosed = false;
  addEditClaimsFormDialog: any;
  deleteClaimsDialog: any;
  showExportLoader = false;
 sortDir = 'Ascending';
 sortColumnDesc = 'Entry Date';
 filteredByColumnDesc = '';
 columnChangeDesc = 'Default Columns';
 isColumnsReordered = false;
 searchText = '';
 selectedSearchColumn = 'ALL';
 private searchSubject = new Subject<string>();
 paymentMethodType$ = this.lovFacade.paymentMethodType$;
 paymentStatus$ = this.lovFacade.paymentStatus$;
 paymentMethodFilter = '';
 paymentTypeFilter = '';
 paymentStatusFilter = '';
 
 gridColumns: { [key: string]: string } = {
  ALL: 'All Columns',
  pharmacyName: 'Pharmacy Name',
  paymentMethodCode: 'Payment Method',
  clientFullName: 'Client Name',
  insuranceName: 'Name on Primary Insurance Card',
  clientId: 'Client ID',
  amountPaid: 'Amount Paid',
  indexCode: 'Index Code',
  paymentStatus: 'Payment Status',
  warrantNumber: 'Warrant Number',
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
  { columnName: 'paymentStatus', columnDesc: 'Payment Status' },
  { columnName: 'warrantNumber', columnDesc: 'Warrant Number' },
  { columnName: 'creationTime', columnDesc: 'Entry Date' }
];
   
  public allPaymentsGridActions = [
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
      buttonType: 'btn-h-primary',
      text: 'Unbatch Claim',
      icon: 'undo', 
      click: (data: any): void => {        
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


  public bulkMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Request Payments',
      icon: 'local_atm',
      click: (data: any): void => {
      this.isRequestPaymentClicked = true;
      this.isPrintAuthorizationClicked = false;
        
      },  
    },
    
    {
      buttonType: 'btn-h-primary',
      text: 'Reconcile Payments',
      icon: 'edit',
      click: (data: any): void => {
        this.navToReconcilePayments(data);
      },  
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Print Authorizations',
      icon: 'print',
      click: (data: any): void => {
        this.isRequestPaymentClicked = false;
        this.isPrintAuthorizationClicked = true;
          
        },
    },
  ];
  
  constructor(private route: Router, 
    private dialogService: DialogService,
    private readonly lovFacade: LovFacade) {}

  ngOnInit(): void {
    this.addSearchSubjectSubscription();
  }
  ngOnChanges(): void {
    this.sortType = 'desc';
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  resetGrid(){
    this.defaultGridState();
    this.sortValue = 'creationTime';
    this.sortType = 'desc';
    this.sortDir = this.sortType === 'desc' ? 'Descending' : "";
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  onExportClaims() {
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.exportGridEvent$.emit(params);
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

  private loadPharmacyClaimsAllPaymentsListGrid(): void {
    this.loadClaimsAllPayments(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsAllPayments(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isPharmacyClaimsAllPaymentsGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadPharmacyClaimsAllPaymentsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  
  
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
              operator: 'startswith',
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

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'desc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmacyClaimsAllPaymentsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.pharmacyClaimsAllPaymentsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridPharmacyClaimsAllPaymentsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isPharmacyClaimsAllPaymentsGridLoaderShow = false;
      }
    });
    this.isPharmacyClaimsAllPaymentsGridLoaderShow = false;
  }
  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/pharmacy-claims/payments/reconcile-payments'] );
  }
  
 
  public onPreviewSubmitPaymentOpenClicked(template: TemplateRef<unknown>): void {
    this.PreviewSubmitPaymentDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onPreviewSubmitPaymentCloseClicked(result: any) {
    if (result) { 
      this.PreviewSubmitPaymentDialog.close();
    }
  }

  onBulkOptionCancelClicked(){
    this.isRequestPaymentClicked = false;
    this.isPrintAuthorizationClicked = false;
  }

  public onPrintAuthorizationOpenClicked(template: TemplateRef<unknown>): void {
    this.printAuthorizationDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

 
  onPrintAuthorizationCloseClicked(result: any) {
    if (result) { 
      this.printAuthorizationDialog.close();
    }
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

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentMethodCode') {
      this.paymentMethodFilter = value;
    } else if (field === 'paymentStatus') {
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

  onColumnReorder($event: any) {
    this.isColumnsReordered = true;
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter(x => x.hidden).length
    this.columnChangeDesc = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }
}