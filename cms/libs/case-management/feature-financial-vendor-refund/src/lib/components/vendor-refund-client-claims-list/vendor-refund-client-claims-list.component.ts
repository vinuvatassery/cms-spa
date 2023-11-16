/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorId: any;
  @Input() clientId: any;
  @Input()refundType:any;
  @Output() loadVendorRefundProcessListEvent = new EventEmitter<any>();
  @Input() confirmClicked: any;
  vendorRefundlistData!: [];
  public selectedVendorRefunds: any = [];
  public state!: State;
  @Input() financialClaimsProcessGridLists$: any;
  @Output() loadClientClaimsListEvent = new EventEmitter<any>();
  @Output() selectedVendorRefundsListEvent = new EventEmitter<any>();

  sortColumn = 'clientId';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;
  isRefundGridClaimShow=false;
private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimListData$ = this.clientClaimsListDataSubject.asObservable();
  clientclaimsData$=this.financialVendorRefundFacade.clientClaimsListData$
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  gridData: any;
  constructor(
    public financialVendorRefundFacade:FinancialVendorRefundFacade,private readonly cdr: ChangeDetectorRef,
  ) { }
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
    if(this.confirmClicked == true) {
      this.selectedVendorRefundsListEvent.emit(this.selectedVendorRefunds)
    }
    this.cdr.detectChanges();
  }
  // private loadClientClaimsListGrid(): void {
  //   this.loadClientClaimsList(
  //     this.state?.skip ?? 0,
  //     this.state?.take ?? 0,
  //     this.sortValue,
  //     this.sortType
  //   );
  // }
  // loadClientClaimsList
  // (    skipCountValue: number,
  //   maxResultCountValue: number,
  //   sortValue: string,
  //   sortTypeValue: string) {
  //     this.isClientClaimsLoaderShow = true;
  //     const gridDataRefinerValue = {
  //       skipCount: skipCountValue,
  //       pagesize: maxResultCountValue,
  //       sortColumn: sortValue,
  //       sortType: sortTypeValue,
  //     }; 
  //   this.loadClientClaimsListEvent.emit(gridDataRefinerValue);
  //   this.gridDataHandle();
  // }
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
  gridDataHandle() { 
    this. clientclaimsData$.subscribe((data: GridDataResult) => {
      this.gridData = data;
      this.gridDataResult = data;
      this.clientClaimsListDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
      }
      this.isClientClaimsLoaderShow = false;
    });
  }
  private loadRefundClaimsListGrid(): void {
    this.loadClaimsProcess(
      this.vendorId,
      this.clientId,
      this.refundType,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    vendorId: string,
    clientId: number,
    refundType: string,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isClientClaimsLoaderShow = true;
    const gridDataRefinerValue = {
      vendorId: vendorId,
      clientId: clientId,
      refundType : refundType,
      skipCount: skipCountValue,
      pageSize: maxResultCountValue,
      sort: sortValue,
      sortType: sortTypeValue,
      filter : this.state?.["filter"]?.["filters"] ?? []
    };
    this. loadRefundClaimsGrid(gridDataRefinerValue);
    this.gridDataHandle();
  
  }

  loadRefundClaimsGrid(data: any) {
    this.financialVendorRefundFacade.loadRefundClaimsListGrid(data);
  }
  selectedKeysChange(selection: any[]) {
    this.selectedVendorRefunds = this.gridData.data.filter((i: any) => selection.includes( i.prescriptionFillId));
  }
}
