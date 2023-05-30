import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State, filterBy } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-vendors-list',
  templateUrl: './vendors-list.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VendorsListComponent implements OnChanges{
  public formUiStyle : UIFormStyle = new UIFormStyle();
@Input() financeTabTypeCode! : string
@Input() vendorTypeCode! : string
@Input() pageSizes : any;
@Input() sortValue : any;
@Input() sortType : any;
@Input() sort : any;
@Input() vendorsList$ : any

@Output() loadFinancialVendorsListEvent = new EventEmitter<any>();

vndorId! : string
public  state!: State
groupData:any=[]
caseStatusTypes:any=[]
sortColumn = "Vendor Name";
  sortDir = "Ascending";
  columnsReordered = false;
  filteredBy = "";
  searchValue = "";
  isFiltered = false;
  filter! : any

selectedColumn! : string

gridDataResult! : GridDataResult
gridVendorsDataSubject = new Subject<any>();
gridVendorsData$ = this.gridVendorsDataSubject.asObservable();
filterData : CompositeFilterDescriptor={logic:'and',filters:[]};
loader = false;

columns : any = {
  vendorName:"Vendor Name",
  tin:"Tin",
  paymentMethod:"Payment Method",
  totalPayments:"Total Payments",
  unreconciledPayments:"Unreconciled Payments",
  insurancePlans:"Insurance Plans",
  clients:"Clients",
  invoiceDelivery:"Invoice Delivery",
  totalDrugs:"Total Drugs",
  openInvoices:"Open Invoices",
  phones:"Phones",
  emails:"Emails",
  mailCode:"Mail Code",
  address:"Address",
  preferredFlag:"Preferred Flag",
  nabp:"Nabp",
  ncpdp:"Ncpdp",
  physicalAddress:"Physical Address",
}


constructor(private route: Router) {
 
}
ngOnChanges(): void {  
  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };
  if(this.vendorTypeCode)
  {
   this.loadFinancialVendorsList()
  }
}
get financeVendorTypeCodes(): typeof FinancialVendorTypeCode {
  return FinancialVendorTypeCode;
}

private loadFinancialVendorsList(): void {
  this.loadVendors(this.state?.skip ?? 0 ,this.state?.take ?? 0,this.sortValue , this.sortType)
}
loadVendors(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string)
 {
  this.loader = true;
   const gridDataRefinerValue =
   {
     skipCount: skipcountValue,
     pagesize : maxResultCountValue,
     sortColumn : sortValue,
     sortType : sortTypeValue,
     vendorTypeCode : this.vendorTypeCode     
   }
   this.loadFinancialVendorsListEvent.emit(gridDataRefinerValue)
   this.gridDataHandle()
 }

  onVendorClicked(vendorId : string)
  {
    const query = {
      queryParams: {
        v_id: vendorId ,
        tab_code :  this.financeTabTypeCode    
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query )
  }
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    
  }

  onChange($event : any)
  {}

  onColumnReorder($event : any)
  {
    this.columnsReordered = true;
  }

  columnChange($event : any)
  {}

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc'
    this.state=stateData;

    this.sortColumn = this.columns[stateData.sort[0]?.field];    
    this.sortDir = this.sort[0]?.dir === 'asc'? 'Ascending': 'Descending';

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

    this.loadFinancialVendorsList();
}

// updating the pagination infor based on dropdown selection
pageselectionchange(data: any) {
  this.state.take = data.value;
  this.state.skip = 0;
  this.loadFinancialVendorsList()
}

  filterChange($event : any)
  {}

  gridDataHandle() {   

    this.vendorsList$.subscribe((data: GridDataResult) => {          

      this.gridDataResult = data    
      this.gridDataResult.data = filterBy(this.gridDataResult.data, this.filterData)
      this.gridVendorsDataSubject.next(this.gridDataResult);  
        if (data?.total >= 0 || data?.total === -1) {
          this.loader = false;          
        }
    });

  }
  
}
