/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-client-claims-list',
  templateUrl: './vendor-refund-client-claims-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundClientClaimsListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClientClaimsLoaderShow = false;
  /** Constructor **/
  public sortValue = this.financialVendorRefundFacade.sortValueRefundProcess;
  public sortType = this.financialVendorRefundFacade.sortType;
  public pageSizes = this.financialVendorRefundFacade.gridPageSizes;
  public gridSkipCount = this.financialVendorRefundFacade.skipCount;
  public sort = this.financialVendorRefundFacade.sortProcessList;
  public state!: State;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();

  @Input() clientClaimsListData$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  paymentStatusType:any;
  public selectedClaims: any[] = [];
  paymentStatusCode =null
  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsProcessData$ = this.financialVendorRefundFacade.financialPremiumsProcessData$;
  constructor( private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,)
  {
 
  }
  selectedKeysChange(selection: any) {
    this.selectedClaims = selection;
  }
  ngOnInit(): void {
    debugger
    var sdf=this.clientId;
    var sdfdf=this.vendorId;
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.filter=null,
    this.isClientClaimsLoaderShow = true;
    this.gridDataHandle();
    this.financialVendorRefundFacade.loadMedicalPremiumList( 
      this.state.skip??0,this.state.take??0,"",this.sortType,this.filter);  
    
    this.loadClientClaimsListGrid();
  }
  ngOnChanges(): void {  

    this.loadClientClaimsListGrid();
  }
  dropdownFilterChange(field:string, value: any, filterService: FilterService): void {
    filterService.filter({
      filters: [{
        field: field,
        operator: "eq",
        value:value.lovCode
    }],
      logic: "or"
  });
    if(field == "paymentStatusCode"){
      this.paymentStatusCode = value;
    }
  }
  private loadClientClaimsListGrid(): void {
    this.loadClientClaimsList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClientClaimsList
  (    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string) {
      this.isClientClaimsLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      }; 
    this.loadClientClaimsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadClientClaimsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClientClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() { 
    this.financialPremiumsProcessData$.subscribe((data: GridDataResult) => {
      debugger
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClientClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isClientClaimsLoaderShow = false;
      }
    });
    this.isClientClaimsLoaderShow = false;

  }
}
