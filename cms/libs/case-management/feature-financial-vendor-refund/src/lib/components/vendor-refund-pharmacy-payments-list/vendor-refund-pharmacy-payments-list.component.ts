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
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Component({
  selector: 'cms-vendor-refund-pharmacy-payments-list',
  templateUrl: './vendor-refund-pharmacy-payments-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VendorRefundPharmacyPaymentsListComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isClaimsLoaderShow = false;
  /** Constructor **/
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Output() onProviderNameClickEvent = new EventEmitter<any>();
  public state!: State;
  @Input() claimsListData$: any;
  private recentRefundListDataSubject  =  new Subject<any>();
  RecentRefundsListData$ = this.recentRefundListDataSubject .asObservable();
  recentRefundsListData$= this.financialVendorRefundFacade.recentRefundsListData$ 
  @Output() loadClaimsListEvent = new EventEmitter<any>();
  
  sortColumn = 'vendorName';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  selectedPharmacyClaims:any[]=[]
  gridClaimsDataSubject = new Subject<any>();
  gridClaimsData$ = this.gridClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  gridVendorsRefundDataSubject = new Subject<any>();
  gridVendorsRefundData$ = this.gridVendorsRefundDataSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  
  @Output() selectedClaimsChangeEvent = new EventEmitter<any>();
  constructor(
    public financialVendorRefundFacade:FinancialVendorRefundFacade
  ) { }
 
  ngOnInit(): void {
    this.loadFinancialRecentRefundListGrid();
  }
  
  selectedKeysChange(selection: any) {
    
    this.selectedClaimsChangeEvent.emit(selection)
    this.selectedPharmacyClaims = selection;
  }

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadFinancialRecentRefundListGrid()
  }
  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadFinancialRecentRefundListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialRecentRefundListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.recentRefundsListData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.recentRefundListDataSubject.next(this.gridDataResult);
    });
  }
  private loadFinancialRecentRefundListGrid(): void {
    this.loadRefundProcess(
      this.vendorId,
      this.clientId,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundProcess(
    vendorId: string,
    clientId: number,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRecentRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  }
  loadRecentRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadFinancialRecentRefundListGrid(data);
  }
  onProviderNameClick(event:any){
    this.onProviderNameClickEvent.emit(event.paymentRequestId)
  }
}
