import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { ColumnComponent, ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'common-cms-pharmacy-claims-recent-claims',
  templateUrl: './cms-pharmacy-claims-recent-claims.component.html',
  styleUrls: ['./cms-pharmacy-claims-recent-claims.component.scss'],
})
export class CmsPharmacyClaimsRecentClaimsComponent {
  
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() claimsType: any;
  dentalOrMedicalServiceField:any;
  @Input() duplicatePaymentInputObject:any;
  @Input() sortType : any;
  @Input() pageSizes : any;
  @Input() gridSkipCount : any;
  @Input() sortValueRecentClaimList : any;
  @Input() sortRecentClaimList : any;
  @Input() recentClaimsGridLists$ : any;
  @Input() pharmacyRecentClaimsProfilePhoto$!: any;

  @Output()  loadRecentClaimListEvent = new EventEmitter<any>();
  public state!: any;
  sortColumn = 'Fill Date';
  sortDir = 'desc';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  recentClaimListDataSubject = new Subject<any>();
  recentClaimListData$ =  this.recentClaimListDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  addRemoveColumns="Default Columns"
  columns : any;
  dropDowncolumns : any;
  isFinancialClaimsRecentClaimGridLoaderShow = false;

  selectedPaymentStatus: string | null = null;
  selectedPaymentMethod: string | null = null;
  selectedPaymentType: string | null = null;
  paymentMethodType$ = this.lovFacade.paymentMethodType$;
  paymentStatus$ = this.lovFacade.paymentStatus$;
  paymentRequestTypes$= this.lovFacade.paymentRequestType$;
  paymentMethodTypes: any = [];
  paymentStatus: any = [];
  paymentRequestTypes: any = [];

  paymentTypeFilter = '';
  iseditView:string="";
  defaultPageSize=20;
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,

  ) { }
  ngOnInit(): void {
    this.loadColumnsData();
    this.getClaimStatusLov();
    this.getCoPaymentRequestTypeLov();
    this.getPaymentMethodLov();
    this.state = {
      skip: this.gridSkipCount,
      take: this.defaultPageSize
    };
    this.loadFinancialRecentClaimListGrid();
  }

  private getPaymentMethodLov() {
    this.lovFacade.getPaymentMethodLov();
    this.paymentMethodType$.subscribe({
      next: (data: any) => {
        data.forEach((item: any) => {
          item.lovDesc = item.lovDesc.toUpperCase();
        });
        this.paymentMethodTypes = data.sort(
          (value1: any, value2: any) => value1.sequenceNbr - value2.sequenceNbr
        );
      },
    });
  }
  ngOnChanges(): void {

    this.state = {
      skip: 0,
      take: this.defaultPageSize,
      sort: this.sortDir,

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
      this.sortValueRecentClaimList,
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
              field: this.selectedColumn ?? 'FillDate',
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
      sort: this.sortValueRecentClaimList,
      filter: { logic: 'and', filters: [] },
    };
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  dataStateChange(stateData: any): void {
    this.sortRecentClaimList = stateData.sort;
    this.sortValueRecentClaimList = stateData.sort[0]?.field ?? this.sortValueRecentClaimList;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortRecentClaimList[0]?.dir === 'asc' ? 'Ascending' : 'Descending';

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
    this.recentClaimsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.recentClaimListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialClaimsRecentClaimGridLoaderShow = false;
      }
    });
  }

  loadRecentClaimsGrid(data: any) {
    this.loadRecentClaimListEvent.next(data);
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

  event.columns.forEach((column:any) => {
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
    this.dentalOrMedicalServiceField= this.claimsType == "dental" ? "Dental Service":"Medical Service";
    this.columns = {
      invoiceId:"Invoice ID",
      serviceStartDate:"Service Start",
      serviceEndDate:"Service End",
      cptCode:"CPT Code",
      medicalService:this.dentalOrMedicalServiceField,
      serviceCost:"Service Cost",
      amountDue:"Amount Due",
      paymentTypeDesc:"Payment Type",
      clientAnnualTotal:"Client Annual Total",
      clientBalance:"Client Balance",
      fillDate:"Fill Date",
      paymentStatusDesc:"Payment Status"
    }

    this.dropDowncolumns = [
      {
        "columnCode": "brandName",
        "columnDesc": "Brand Name"
      },
      {
        "columnCode": "drugName",
        "columnDesc": "Drug Name"
      },
      {
        "columnCode": "nDCCode",
        "columnDesc": "NDC Code"
      },
      {
        "columnCode": "cptCode",
        "columnDesc": "CPT Code"
      },
      {
        "columnCode": "payment Type",
        "columnDesc": "PaymentTypeDesc"
      },
      {
        "columnCode": "amountPaid",
        "columnDesc": "Amount Paid"
      },
      {
        "columnCode": "qty",
        "columnDesc": "Qty"
      },
      {
        "columnCode": "rxType",
        "columnDesc": "RX Type"
      },
      {
        "columnCode": "daysSupply",
        "columnDesc": "Days Supply"
      },
      {
        "columnCode": "fillDate",
        "columnDesc": "Fill Date"
      },
      {
        "columnCode": "prescriptionNumber",
        "columnDesc": "Prescription Number"
      },
      {
        "columnCode": "indexCode",
        "columnDesc": "Index Code"
      },
      {
        "columnCode": "pCACode",
        "columnDesc": "PCA Code"
      },
      {
        "columnCode": "objectCode",
        "columnDesc": "Object Code"
      },
      {
        "columnCode": "paymentMethodDesc",
        "columnDesc": "Payment Method"
      },
      {
        "columnCode": "warrantSPOTNumber",
        "columnDesc": "Warrant SPOTs Number"
      },
      {
        "columnCode": "paymentStatusCode",
        "columnDesc": "Payment Status "
      },
      {
        "columnCode": "pharmacyName",
        "columnDesc": "Pharmacy Name"
      },
      {
        "columnCode": "by",
        "columnDesc": "By"
      }
    ]
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

