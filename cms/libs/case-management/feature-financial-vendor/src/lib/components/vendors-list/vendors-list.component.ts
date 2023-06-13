import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
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
export class VendorsListComponent implements OnChanges , OnInit{
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

  selectedColumn!: any;

gridDataResult! : GridDataResult
gridVendorsDataSubject = new Subject<any>();
gridVendorsData$ = this.gridVendorsDataSubject.asObservable();
columnDroplistSubject =  new Subject<any[]>();
columnDroplist$ = this.columnDroplistSubject.asObservable();
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

dropDowncolumns : any = [
  {   
    "columnCode": "vendorName",    
    "columnDesc": "Vendor Name"   ,
    "vendorTypeCode": "ALL",
  },
  {   
    "columnCode": "tin",    
    "columnDesc": "Tin"   ,
    "vendorTypeCode": "ALL",
  }
  ,
  {   
    "columnCode": "paymentMethod",    
    "columnDesc": "Payment Method"   ,
    "vendorTypeCode": "INSURANCE_PROVIDER",
  }
  ,
  {   
    "columnCode": "totalPayments",    
    "columnDesc": "Total Payments"   ,
    "vendorTypeCode": "INSURANCE_PROVIDER",
  }
  ,
  {   
    "columnCode": "unreconciledPayments",    
    "columnDesc": "Unreconciled Payments"   ,
    "vendorTypeCode": "INSURANCE_PROVIDER",
  }
  ,
  {   
    "columnCode": "insurancePlans",    
    "columnDesc": "Insurance Plans"   ,
    "vendorTypeCode": "INSURANCE_PROVIDER",
  }
  ,
  {   
    "columnCode": "clients",    
    "columnDesc": "Clients"   ,
    "vendorTypeCode": "INSURANCE_PROVIDER",
  }
  ,
  {   
    "columnCode": "invoiceDelivery",    
    "columnDesc": "Invoice Delivery"   ,
    "vendorTypeCode": "MANUFACTURERS",
  }

  ,
  {   
    "columnCode": "totalDrugs",    
    "columnDesc": "Total Drugs"   ,
    "vendorTypeCode": "MANUFACTURERS",
  },
  {   
    "columnCode": "openInvoices",    
    "columnDesc": "Open Invoices"   ,
    "vendorTypeCode": "MANUFACTURERS",
  }
  ,
  {   
    "columnCode": "phones",    
    "columnDesc": "Phones"   ,
    "vendorTypeCode": "MANUFACTURERS",
  }
  ,
  {   
    "columnCode": "emails",    
    "columnDesc": "Emails"   ,
    "vendorTypeCode": "MANUFACTURERS",
  }
  ,
  {   
    "columnCode": "mailCode",    
    "columnDesc": "Mail Code"   ,
    "vendorTypeCode": "MANUFACTURERS",
  }
  ,
  {   
    "columnCode": "address",    
    "columnDesc": "Address"   ,
    "vendorTypeCode": "MANUFACTURERS",
  },
  {   
    "columnCode": "unreconciledPayments",    
    "columnDesc": "Unreconciled Payments"   ,
    "vendorTypeCode": "PHARMACY",
  }
  ,
  {   
    "columnCode": "emails",    
    "columnDesc": "Emails"   ,
    "vendorTypeCode": "PHARMACY",
  }
  ,
  {   
    "columnCode": "preferredFlag",    
    "columnDesc": "Preferred Flag"   ,
    "vendorTypeCode": "PHARMACY",
  }
  ,
  {   
    "columnCode": "nabp",    
    "columnDesc": "Nabp"   ,
    "vendorTypeCode": "PHARMACY",
  }
  ,
  {   
    "columnCode": "ncpdp",    
    "columnDesc": "Ncpdp"   ,
    "vendorTypeCode": "PHARMACY",
  }
  ,  
  {   
    "columnCode": "physicalAddress",    
    "columnDesc": "Physical Address"   ,
    "vendorTypeCode": "PHARMACY",
  }
]
constructor(private route: Router, 
  private readonly  cdr :ChangeDetectorRef) {
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

ngOnInit(): void {
  this.bindDropdownClumns()
  if(!this.selectedColumn)
      {
        this.selectedColumn = "vendorName";     
      }
}


private bindDropdownClumns()
{    
  this.dropDowncolumns = this.dropDowncolumns.filter((x : any)=>x.vendorTypeCode === this.vendorTypeCode || x.vendorTypeCode === 'ALL') 
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

  onVendorClicked(vendorId: any, vendorAddressId : any)
  {
    const query = {
      queryParams: {
        v_id: vendorId ,
        v_ad_id : vendorAddressId,
        tab_code :  this.financeTabTypeCode    
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query )
  }
 
  onChange(data: any)
  {
    this.defaultGridState()
    
    this.sortColumn = this.columns[this.selectedColumn];
    this.filterData = {logic:'and',filters:[{
      "filters": [
          {
              "field": this.selectedColumn ?? "vendorName",
              "operator": "startswith",
              "value": data
          }
      ],
      "logic": "and"
  }]}
  let stateData = this.state
  stateData.filter = this.filterData
  this.dataStateChange(stateData);
  }

  defaultGridState(){
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      filter:{logic:'and',filters:[]}
      };
  }

  onColumnReorder($event : any)
  {
    this.columnsReordered = true;
  }
 
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

public filterChange(filter: CompositeFilterDescriptor): void {
 
  this.filterData = filter;
 }

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
