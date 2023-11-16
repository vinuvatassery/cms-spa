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
  selector: 'cms-vendor-refund-insurance-premium-list',
  templateUrl: './vendor-refund-insurance-premium-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundInsurancePremiumListComponent  implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClientClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
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
  selectedInsuranceClaims :any[] =[]
  gridClientClaimsDataSubject = new Subject<any>();
  gridClientClaimsData$ = this.gridClientClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  financialPremiumsProcessData$ = this.financialVendorRefundFacade.financialPremiumsProcessData$;
  premiumsListData$ =   this.financialVendorRefundFacade.premiumsListData$;
 
   
  constructor( private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,)
  {
 
  }
  selectedKeysChange(selection: any) {
    this.selectedClaims = selection;
  }
  ngOnInit(): void {
    
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadRefundClaimsListGrid();
    
  }
  ngOnChanges(): void {  
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadRefundClaimsListGrid();
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

  loadRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadMedicalPremiumList(data);
  }
  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadRefundClaimsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadRefundClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  private loadRefundClaimsListGrid(): void {
    this.loadClaimsProcess(
      this.vendorId,
      this.clientId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    vendorId: string,
    clientId: number,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isClientClaimsLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  
  }
  gridDataHandle() { 
    this.financialPremiumsProcessData$.subscribe((data: GridDataResult) => {
      
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
