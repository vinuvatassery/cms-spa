import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { FilterService } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';
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
searchValue = ''
selectedColumn! : string
isGridLoaderShow =false
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


private loadFinancialVendorsList(): void {
  this.loadVendors(this.state?.skip ?? 0 ,this.state?.take ?? 0,this.sortValue , this.sortType)
}
loadVendors(skipcountValue : number,maxResultCountValue : number ,sortValue : string , sortTypeValue : string)
 {
   const gridDataRefinerValue =
   {
     skipCount: skipcountValue,
     pagesize : maxResultCountValue,
     sortColumn : sortValue,
     sortType : sortTypeValue,
     vendorTypeCode : this.vendorTypeCode     
   }
   this.loadFinancialVendorsListEvent.emit(gridDataRefinerValue)
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
  {}

  columnChange($event : any)
  {}

  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc'
    this.state=stateData;
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
}
