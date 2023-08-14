import { ChangeDetectionStrategy,ChangeDetectorRef,Component, Input, OnChanges, OnInit } from '@angular/core';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State,CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
import { FinancialClaimsFacade } from '@cms/case-management/domain';

@Component({
  selector: 'cms-financial-claims-recent-claims-list',
  templateUrl: './financial-claims-recent-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsRecentClaimsListComponent implements OnInit, OnChanges {
  public sortValue = this.financialClaimsFacade.sortValueRecentClaimList;
  public sortType = this.financialClaimsFacade.sortType;
  public pageSizes = this.financialClaimsFacade.gridPageSizes;
  public gridSkipCount = this.financialClaimsFacade.skipCount;
  public sort = this.financialClaimsFacade.sortRecentClaimList;
  public formUiStyle : UIFormStyle = new UIFormStyle();
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input() claimsType: any;

  public state!: State;
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

  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  columns : any = {
    invoiceId:"Invoice ID",
    serviceStartDate:"Service Start Date",
    serviceEndDate:"Service End Date",
    cptCode:"CPT Code",
    medicalService:"Medical Service",
    serviceCost:"Service Cost",
    amountDue:"Amount Due",
    paymentTypeDesc:"Payment Type",
    clientAnnualTotal:"Client Annual Total",
    clientBalance:"Client Balance",
    entryDate:"Entry Date",
    paymentStatusDesc:"Payment Status"   
  }
  
  dropDowncolumns : any = [
    {
      "columnCode": "invoiceId",
      "columnDesc": "Invoice ID"    
    },
    {
      "columnCode": "serviceStartDate",
      "columnDesc": "Service Start Date"        
    },
    {
      "columnCode": "serviceEndDate",
      "columnDesc": "Service End Date"     
    }
    ,
    {
      "columnCode": "cptCode",
      "columnDesc": "CPT Code"         
    }
    ,
    {
      "columnCode": "medicalService",
      "columnDesc": "Medical Service"         
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
  isFinancialClaimsRecentClaimGridLoaderShow = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly financialClaimsFacade: FinancialClaimsFacade
  ) { }
  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadFinancialRecentClaimListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadFinancialRecentClaimListGrid();
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
    this.financialClaimsFacade.loadRecentClaimListGrid(data);
  }
}
