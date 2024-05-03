import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { FilterService, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-financial-premiums-recent-premiums-list',
  templateUrl: './financial-premiums-recent-premiums-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsRecentPremiumsListComponent {
  public sortValue = this.financialPremiumsFacade.sortValueRecentPremiumList;
  public sortType = this.financialPremiumsFacade.sortType;
  public pageSizes = this.financialPremiumsFacade.gridPageSizes;
  public gridSkipCount = this.financialPremiumsFacade.skipCount;
  public sort = this.financialPremiumsFacade.sortRecentPremiumList;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() premiumsType: any;
  @Input() paymentRequestId :any
  @Input() includeServiceSubTypeFilter = true;
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  dentalOrMedicalServiceField:any;
  public state!: any;
  searchValue = '';
  isFiltered = false;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  recentPremiumsGridLists$ = this.financialPremiumsFacade.recentPremiumGridLists$;
  recentPremiumListDataSubject = new Subject<any>();
  recentPremiumListData$ =  this.recentPremiumListDataSubject.asObservable();
  recentPremiumLoader$ = this.financialPremiumsFacade.recentPremiumLoader$;

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  addRemoveColumns="Default Columns"
  columns : any;
  dropDowncolumns : any;
  isFinancialClaimsRecentPremiumGridLoaderShow = false;

  healthInsuranceTypeLov$ = this.lovFacade.insuranceTypelov$;
  paymentStatusLov$ = this.lovFacade.paymentStatus$;
  paymentMethodTypeLov$ = this.lovFacade.paymentMethodType$;
  healthInsuranceTypeLovs:any=[];
  paymentMethodTypeLovs:any=[];
  paymentStatusLovs:any=[];
  healthInsuranceValue = null;
  paymentMethodTypeValue = null;
  paymentStatusValue = null;
  columnName: any = "";

  column: any = {
    vendorName: 'Insurance Vendor',
    coverageStartDate: 'Coverage Dates',
    premiumAmount: 'Premium Amount',
    insurancePlanName: 'Plan Name',
    healthInsuranceTypeCode: 'Insurance Type',
    paymentMethodCode: 'Pmt. Method',
    insuranceIdNbr: 'Policy ID',
    insuranceGroupNumber: 'Ins. Group ID',
    paymentIdNbr: 'Payment ID',
    paymentStatusCode: 'Payment Status',
    checkNbr: 'Warrant #',
    creationTime: 'Entry Date'
  };

  //Column Standards
  @ViewChild(GridComponent) grid!: GridComponent;
  columnsReordered = false;

  //sorting
  sortColumn = 'creationTime';
  sortColumnDesc = 'Entry Date';
  sortDir = 'Ascending';

  //filtering
  filteredBy = '';
  filter: any = [
    {
      filters: [],
      logic: 'and',
    },
  ];
  filteredByColumnDesc = '';
  selectedStatus = 'Active';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columnChangeDesc = 'Default Columns';
  @Input() isFromAddRefundPanel=false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly lovFacade: LovFacade,
    private readonly financialPremiumsFacade: FinancialPremiumsFacade
  ) { }

  ngOnInit(): void {
    this.lovFacade.getPaymentStatusLov();
    this.lovFacade.getPaymentMethodLov();
    this.lovFacade.getHealthInsuranceTypeLovs();

    this.loadPaymentStatusLovs();
    this.loadPaymentMethodLovs();
    this.loadHealthInsuranceLovs();
    this.loadFinancialRecentPremiumListGrid();
  }

  ngAfterViewInit() {
    this.grid.filter = {
      logic: 'and',
      filters: [
        {
          filters: [],
          logic: 'and',
        },
      ],
    };
    this.loadFinancialRecentPremiumListGrid();
  }

  ngOnChanges(): void {
    this.initializeGrid(false);
    this.loadFinancialRecentPremiumListGrid();
  }

  loadFinancialRecentPremiumListGrid() {
    this.loadRecentPremiums(
      this.vendorId,
      this.clientId,
      this.premiumsType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  loadRecentPremiums(
    vendorId: string,
    clientId: number,
    premiumsType: string,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialClaimsRecentPremiumGridLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      includeServiceSubTypeFilter: this.includeServiceSubTypeFilter,
      premiumsType : premiumsType,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sorting: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this.loadRecentPremiumsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }

  gridDataHandle() {
    this.recentPremiumsGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.recentPremiumListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialClaimsRecentPremiumGridLoaderShow = false;
      }
    });
  }

  loadRecentPremiumsGrid(data: any) {
    if(!this.isFromAddRefundPanel){
    this.financialPremiumsFacade.loadRecentPremiumListGrid(data);
    }else{
      this.financialPremiumsFacade.loadRecentPremiumsByClient(data,this.clientId);
    }
  }

    //Column Options Standard Implementation
    dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
      filterService.filter({
          filters: [{
            field: field,
            operator: "eq",
            value:value.lovCode
        }],
          logic: "or"
      });

      if(field == "healthInsuranceTypeCode"){
        this.healthInsuranceValue = value;
      }
      if(field == "paymentMethodCode"){
        this.paymentMethodTypeValue = value;
      }
      if(field == "paymentStatusCode"){
        this.paymentStatusValue = value;
      }
    }

    public columnChange(e: any) {
      this.cdr.detectChanges();
    }

    private loadHealthInsuranceLovs() {
      this.healthInsuranceTypeLov$
      .subscribe({
        next: (data: any) => {
          this.healthInsuranceTypeLovs = data.filter((item:any) => {
            return item.lovCode !== 'DENTAL_INSURANCE' && item.lovCode !== 'OREGON_HEALTH_PLAN' && item.lovCode !== 'VETERANS_ADMINISTRATION';
          });
        }
      });
    }

    private loadPaymentMethodLovs() {
      this.paymentMethodTypeLov$
      .subscribe({
        next: (data: any) => {
          this.paymentMethodTypeLovs=data;
        }
      });
    }

    private loadPaymentStatusLovs() {
      this.paymentStatusLov$
      .subscribe({
        next: (data: any) => {
          this.paymentStatusLovs=data.filter((item:any) => {
            return item.lovCode !== 'FAILED' && item.lovCode !== 'HOLD';
          });
        }
      });
    }

    restGrid() {
      this.sortValue = 'creationTime';
      this.sortType = 'asc';
      this.sortColumn = 'creationTime';
      this.sortDir = 'Ascending';
      this.filter = [];
      this.filteredByColumnDesc = '';
      this.sortColumnDesc = this.column[this.sortValue];
      this.columnChangeDesc = 'Default Columns';
      this.initializeGrid(true);
      this.loadFinancialRecentPremiumListGrid();
      this.healthInsuranceValue = this.paymentStatusValue = this.paymentMethodTypeValue = null;
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
      this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
      this.sortColumnDesc = this.column[this.sortValue];
      this.filter = stateData?.filter?.filters;
      if(this.sortValue === "paymentMethodCode"){
        this.sortValue = "paymentMethodDesc ";
      }
      if(this.sortValue === "healthInsuranceTypeCode"){
        this.sortValue = "healthInsuranceTypeDesc ";
      }
      if(this.sortValue === "paymentStatusCode"){
        this.sortValue = "paymentStatusDesc ";
      }
      this.setFilterBy(true, '', this.filter);
      if (!this.filteredByColumnDesc.includes('Status')) this.selectedStatus = '';
      if (!this.filteredByColumnDesc.includes('Insurance Type')) this.healthInsuranceValue = null;
      if (!this.filteredByColumnDesc.includes('Pmt. Method')) this.paymentMethodTypeValue = null;
      if (!this.filteredByColumnDesc.includes('Payment Status')) this.paymentStatusValue = null;
      this.loadFinancialRecentPremiumListGrid();
    }

    filterChange(filter: CompositeFilterDescriptor): void {
      this.filterData = filter;
    }

    private initializeGrid(resetState:boolean) {
      if (this.state == undefined || resetState) {
         this.state = {
          skip: 0,
          take: this.pageSizes[0]?.value,
          sort: [{ field: this.sortValue, dir: this.sortType }],
        };
      }
    }

    private setFilterBy(
      isFromGrid: boolean,
      searchValue: any = '',
      filter: any = []
    ) {
      this.filteredByColumnDesc = '';
      if (isFromGrid) {
        if (filter.length > 0) {
          const filteredColumns = this.filter?.map((f: any) => {
            const filteredColumns = f.filters
              ?.filter((fld: any) => fld.value)
              ?.map((fld: any) => this.column[fld.field]);
            return [...new Set(filteredColumns)];
          });

          this.filteredByColumnDesc =
            [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
        }
      }
    }

    pageSelectionChange(data: any) {
      this.state.take = data.value;
      this.state.skip = 0;
      this.loadFinancialRecentPremiumListGrid();
    }

    onProviderNameClick(event:any){
      this.onProviderNameClickEvent.emit(this.paymentRequestId ? this.paymentRequestId : event)
    }
}
