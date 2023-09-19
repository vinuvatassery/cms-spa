import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import {  GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
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
@Input() exportButtonShow$ : any

@Output() loadFinancialVendorsListEvent = new EventEmitter<any>();
@Output() exportGridDataEvent = new EventEmitter<any>();
showExportLoader = false;
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
vendorNameTitle ="Vendor Name"
vendorNameTitleDataSubject = new Subject<any>();
vendornameTitleData$ = this.vendorNameTitleDataSubject.asObservable();


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
  },
  {
    "columnCode": "paymentMethod",
    "columnDesc": "Payment Method"   ,
    "vendorTypeCode": ["INSURANCE_VENDOR","DENTAL_PROVIDER","MEDICAL_PROVIDER"],
  }
  ,
  {
    "columnCode": "totalClaims",
    "columnDesc": "Total Claims"   ,
    "vendorTypeCode": ["DENTAL_PROVIDER","MEDICAL_PROVIDER"],
  }
  ,
  {
    "columnCode": "unreconciledClaims",
    "columnDesc": "Unreconciled Claims"   ,
    "vendorTypeCode": ["PHARMACY","DENTAL_PROVIDER","MEDICAL_PROVIDER"],
  }
  ,
  {
    "columnCode": "totalPayments",
    "columnDesc": "Total Payments"   ,
    "vendorTypeCode": ["INSURANCE_VENDOR"],
  }
  ,
  {
    "columnCode": "unreconciledPayments",
    "columnDesc": "Unreconciled Payments"   ,
    "vendorTypeCode": ["INSURANCE_VENDOR"],
  }
  ,
  {
    "columnCode": "insurancePlans",
    "columnDesc": "Insurance Plans"   ,
    "vendorTypeCode": ["INSURANCE_VENDOR"],
  }
  ,
  {
    "columnCode": "clients",
    "columnDesc": "Clients"   ,
    "vendorTypeCode":["INSURANCE_VENDOR","PHARMACY"],
  }
  ,
  {
    "columnCode": "totalDrugs",
    "columnDesc": "Total Drugs"   ,
    "vendorTypeCode": ["MANUFACTURERS"],
  },
  {
    "columnCode": "address",
    "columnDesc": "Address"   ,
    "vendorTypeCode":  ["MANUFACTURERS","DENTAL_PROVIDER","MEDICAL_PROVIDER"],
  },
  {
    "columnCode": "NpiNbr",
    "columnDesc": "Npi Number"   ,
    "vendorTypeCode": ["PHARMACY"],
  }
  ,
  {
    "columnCode": "mailCode",
    "columnDesc": "Mail Code"   ,
    "vendorTypeCode":  ["MANUFACTURERS","DENTAL_PROVIDER","MEDICAL_PROVIDER"],
  }
  ,
  {
    "columnCode": "physicalAddress",
    "columnDesc": "Physical Address"   ,
    "vendorTypeCode": ["PHARMACY"],
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
    switch(this.vendorTypeCode)
    {
      case FinancialVendorTypeCode.Manufacturers:
          this.vendorNameTitle = "Manufacturer Name"
          break;
      case FinancialVendorTypeCode.Pharmacy:
          this.vendorNameTitle = "Pharmacy Name"
          break;
      case FinancialVendorTypeCode.MedicalProviders:
      case FinancialVendorTypeCode.DentalProviders:
          this.vendorNameTitle = "Provider Name"
          break;
    }
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
  this.dropDowncolumns = this.dropDowncolumns.filter((x : any)=>x.vendorTypeCode.includes(this.vendorTypeCode) || x.vendorTypeCode === 'ALL')
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
     vendorTypeCode : this.vendorTypeCode,
     filter : this.state?.["filter"]?.["filters"] ?? []
   }

   this.loadFinancialVendorsListEvent.emit(gridDataRefinerValue)
   this.gridDataHandle()
 }

  onVendorClicked(vendorId: any)
  {
    const query = {
      queryParams: {
        v_id: vendorId ,
        tab_code :  this.financeTabTypeCode
      },
    };
    this.route.navigate(['/financial-management/vendors/profile'], query )
  }

  onChange(data: any)
  {
    this.defaultGridState()
    let operator= "startswith"
    if(this.selectedColumn ==="totalClaims" || this.selectedColumn ==="unreconciledClaims" || this.selectedColumn ==="totalPayments"
    || this.selectedColumn ==="unreconciledPayments" || this.selectedColumn ==="insurancePlans"  || this.selectedColumn ==="clients"
    || this.selectedColumn ==="totalDrugs")
    {
      operator = "eq"
    }
    if(this.selectedColumn ==='mailCode')
      operator = "contains"


    this.filterData = {logic:'and',filters:[{
      "filters": [
          {
              "field": this.selectedColumn ?? "vendorName",
              "operator": operator,
              "value": data
          }
      ],
      "logic": "and"
  }]}
  const stateData = this.state
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
      this.gridVendorsDataSubject.next(this.gridDataResult);
      this.vendorNameTitleDataSubject.next(this.vendorNameTitle)
        if (data?.total >= 0 || data?.total === -1) {
          this.loader = false;
        }
    });

  }

  setToDefault()
  {

    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
      };

    this.sortColumn = 'Vendor Name';
    this.sortDir = 'Ascending';
    this.filter = "";
    this.searchValue = "";
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue  = 'vendorName';
    this.sortType  = 'asc'
    this.sort  = this.sortColumn;

    this.loadFinancialVendorsList();
  }
  public rowClass = (args:any) => ({
    "preferred-yellow": (args.dataItem.preferredFlag === 'Y' && this.vendorTypeCode === 'PHARMACY'),
  });

  onClickedExport(){
    this.showExportLoader = true
    this.exportGridDataEvent.emit()

    this.exportButtonShow$
    .subscribe((response: any) =>
    {
      if(response)
      {
        this.showExportLoader = false
        this.cdr.detectChanges()
      }

    })
  }
}
