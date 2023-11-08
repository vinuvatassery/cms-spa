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
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
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
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  public state!: State;
  @Input() claimsListData$: any;
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

  gridClaimsDataSubject = new Subject<any>();
  gridClaimsData$ = this.gridClaimsDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  
 
  ngOnInit(): void {
    this.loadClaimsListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClaimsListGrid();
  }

  private loadClaimsListGrid(): void {
    this.loadClaimsList(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsList
  (    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string) {
      this.isClaimsLoaderShow = true;
      const gridDataRefinerValue = {
        skipCount: skipCountValue,
        pagesize: maxResultCountValue,
        sortColumn: sortValue,
        sortType: sortTypeValue,
      };
    this.loadClaimsListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  
  dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.loadClaimsListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClaimsListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.claimsListData$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridClaimsDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isClaimsLoaderShow = false;
      }
    });
    this.isClaimsLoaderShow = false;

  }
}
