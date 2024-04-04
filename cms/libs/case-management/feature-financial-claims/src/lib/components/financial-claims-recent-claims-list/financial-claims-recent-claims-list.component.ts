import { ChangeDetectionStrategy,ChangeDetectorRef,Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService,GridDataResult,ColumnVisibilityChangeEvent, ColumnComponent } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';
import { FinancialClaimsFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
@Component({
  selector: 'cms-financial-claims-recent-claims-list',
  templateUrl: './financial-claims-recent-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsRecentClaimsListComponent implements OnInit, OnChanges, OnDestroy {
  public sortValue = this.financialClaimsFacade.sortValueRecentClaimList;
  public sortType = this.financialClaimsFacade.sortType;
  public pageSizes = this.financialClaimsFacade.gridPageSizes;
  public gridSkipCount = this.financialClaimsFacade.skipCount;
  public sort = this.financialClaimsFacade.sortRecentClaimList;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() claimsType: any;
  @Input() includeServiceSubTypeFilter = true;
  dentalOrMedicalServiceField:any;
  @Input() duplicatePaymentInputObject: any;
  public state!: any;
  sortColumn = 'Entry Date';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
  recentClaimListDataSubject = new Subject<any>();
  recentClaimListData$ =  this.recentClaimListDataSubject.asObservable();
  showDuplicatePaymentExceptionHighlight$ = this.financialClaimsFacade.showDuplicatePaymentExceptionHighlight$;
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns"
  columns : any;
  dropDowncolumns : any;
  isFinancialClaimsRecentClaimGridLoaderShow = false;
  selectedSearchColumn = 'ALL';
  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedPaymentType: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentRequestTypes$= this.lovFacade.paymentRequestType$;
  paymentMethodTypes: any = [];
  paymentStatus: any = [];
  paymentRequestTypes: any = [];
  claimsRecentClaimsProfilePhotoSubject = new Subject();
  recentClaimsGridListsSubscription = new Subscription();
  userMgmtProfilePhotoSubscription = new Subscription();
  paymentTypeFilter = '';
  claimsRecentClaimsProfilePhoto$ = this.financialClaimsFacade.claimsRecentClaimsProfilePhotoSubject;
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    private readonly financialClaimsFacade: FinancialClaimsFacade,

  ) { }

  ngOnInit(): void {
    this.loadColumnsData();
    this.getClaimStatusLov();
    this.getCoPaymentRequestTypeLov();
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.showDuplicatePaymentExceptionHighlight$.subscribe(() => {
      this.cdr.detectChanges();
    });
    this.loadFinancialRecentClaimListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadFinancialRecentClaimListGrid();
    this.cdr.detectChanges();
  }

loadFinancialRecentClaimListGrid() {
    this.loadRecentClaims(
      this.vendorId,
      this.clientId,
      this.claimsType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadRecentClaims(
    vendorId: string,
    clientId: number,
    claimType: string,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialClaimsRecentClaimGridLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      includeServiceSubTypeFilter: this.includeServiceSubTypeFilter,
      claimsType : claimType,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this.loadRecentClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator= "startswith"

    if(this.selectedColumn ==="serviceCost" || this.selectedColumn ==="amountDue" || this.selectedColumn ==="clientBalance"
    || this.selectedColumn ==="clientAnnualTotal" || this.selectedColumn === "balanceAmount")
    {
      operator = "eq"
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'entryDate',
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

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Entry Date';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedSearchColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'entryDate';
    this.sortType = 'asc';
    this.sort = this.financialClaimsFacade.sortRecentClaimList;
    this.searchValue = ''
    this.loadFinancialRecentClaimListGrid();
    this.cdr.detectChanges();
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

    if(stateData.filter?.filters.length > 0)
    {
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = []
      for(const filter of stateData.filter.filters)
      {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy =  filterList.toString();
    }
    else
    {
      this.filter = "";
      this.isFiltered = false
    }
    if (!this.filteredBy.includes('Payment Status'))
    this.selectedPaymentStatus = '';
    if (!this.filteredBy.includes('Payment Type'))
    this.selectedPaymentType = '';
    this.loadFinancialRecentClaimListGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialRecentClaimListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.recentClaimsGridListsSubscription = this.recentClaimsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.recentClaimListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialClaimsRecentClaimGridLoaderShow = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.recentClaimsGridListsSubscription?.unsubscribe();
    }

  loadRecentClaimsGrid(data: any) {
    this.financialClaimsFacade.loadRecentClaimListGrid(data);
  }

  public columnChange(e: any) {
    let event = e as ColumnVisibilityChangeEvent;
    const columnsRemoved = event?.columns.filter(x=> x.hidden).length
    const columnsAdded = event?.columns.filter(x=> x.hidden === false).length

  if (columnsAdded > 0) {
    this.addRemoveColumns = 'Columns Added';
  }
  else {
    this.addRemoveColumns = columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  event.columns.forEach(column => {
    if (column.hidden) {
      const field = (column as ColumnComponent)?.field;
      const mainFilters = this.state.filter.filters;

      mainFilters.forEach((filter:any) => {
          const filterList = filter.filters;

          const foundFilter = filterList.find((x: any) => x.field === field);

          if (foundFilter) {
            filter.filters = filterList.filter((x: any) => x.field !== field);
            this.clearSelectedColumn();
          }
        });
      }
      if (!column.hidden) {
        let columnData = column as ColumnComponent;
        this.columns[columnData.field] = columnData.title;
      }

    });
  }

  private clearSelectedColumn() {
    this.selectedColumn = '';
    this.filter = '';
    this.state.searchValue = '';
    this.state.selectedColumn = '';
    this.state.columnName = '';
  }

  private loadColumnsData()
  {
    this.dentalOrMedicalServiceField = this.getServiceField();
    this.columns = {
      invoiceId:"Invoice ID",
      serviceStartDate:"Service Start",
      serviceEndDate:"Service End",
      cptCode:"CPT Code",
      medicalService: this.dentalOrMedicalServiceField,
      serviceCost:"Service Cost",
      amountDue:"Amount Due",
      paymentTypeDesc:"Payment Type",
      clientAnnualTotal:"Client Annual Total",
      clientBalance:"Client Balance",
      entryDate:"Entry Date",
      paymentStatusDesc:"Payment Status"
    }

    this.dropDowncolumns = [
      {
        "columnCode": "invoiceId",
        "columnDesc": "Invoice ID"
      },
      {
        "columnCode": "serviceStartDate",
        "columnDesc": "Service Start"
      },
      {
        "columnCode": "serviceEndDate",
        "columnDesc": "Service End"
      }
      ,
      {
        "columnCode": "cptCode",
        "columnDesc": "CPT Code"
      }
      ,
      {
        "columnCode": "medicalService",
        "columnDesc": this.dentalOrMedicalServiceField
      }
      ,
      {
        "columnCode": "serviceCost",
        "columnDesc": "Service Cost"
      }
      ,
      {
        "columnCode": "amountDue",
        "columnDesc": "Amount Due"
      }
      ,
      {
        "columnCode": "paymentTypeDesc",
        "columnDesc": "Payment Type"
      }
      ,
      {
        "columnCode": "clientAnnualTotal",
        "columnDesc": "Client Annual Total"
      }
      ,
      {
        "columnCode": "clientBalance",
        "columnDesc": "Client Balance"
      }
      ,
      {
        "columnCode": "entryDate",
        "columnDesc": "Entry Date"
      }
      ,
      {
        "columnCode": "paymentStatusDesc",
        "columnDesc": "Payment Status"
      }
    ]
  }

  getServiceField(): string {
    if(this.includeServiceSubTypeFilter){
      return this.claimsType == 'dental' ? 'Dental Service' : 'Medical Service';
    }
    return 'Service';
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'paymentStatusDesc') this.selectedPaymentStatus = value;
    if (field === 'paymentTypeDesc') this.selectedPaymentType = value;
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'and',
    });
  }

  private getClaimStatusLov() {
    this.lovFacade.getClaimStatusLov();
    this.paymentStatus$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentStatus = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }

  private getCoPaymentRequestTypeLov() {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.paymentRequestTypes$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentRequestTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
   }
  public rowClass = (args:any) => {
    let bool =false ;
    if(this.duplicatePaymentInputObject?.amountDue)
 {
   bool = args.dataItem.amountDue == this.duplicatePaymentInputObject?.amountDue
   && args.dataItem.startDate== this.duplicatePaymentInputObject?.startDate
   && args.dataItem.endDate== this.duplicatePaymentInputObject?.endDate
   ;
 }
  return {"table-row-disabled" : bool }

  };
}
