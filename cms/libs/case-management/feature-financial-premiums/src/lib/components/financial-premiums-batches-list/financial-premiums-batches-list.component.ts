 

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
import { ActivatedRoute, Router } from '@angular/router';
import {  GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
  filterBy,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-premiums-batches-list',
  templateUrl: './financial-premiums-batches-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsBatchesListComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialPremiumsBatchGridLoaderShow = false;
  @Input() premiumsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialPremiumsBatchGridLists$: any;
  @Output() loadFinancialPremiumsBatchListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'batch';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridFinancialPremiumsBatchDataSubject = new Subject<any>();
  gridFinancialPremiumsBatchData$ = this.gridFinancialPremiumsBatchDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  batchClaimGridData=[
    {
      id:1,
      batch: '05012021_001 `',
      ofProviders:'XX', 
      ofClaims:'XX', 
      pmtsRequested:'XX', 
      pmtsReconciled:'XX', 
      totalAmountDue:'XX,XXX.XX', 
      totalAmountReconciled:'XX,XXX.XX',  
    },
    {
      id:2,
      batch: '05012021_001 `',
      ofProviders:'XX', 
      ofClaims:'XX', 
      pmtsRequested:'XX', 
      pmtsReconciled:'XX', 
      totalAmountDue:'XX,XXX.XX', 
      totalAmountReconciled:'XX,XXX.XX',
    }
  ];
  
  /** Constructor **/
  constructor(private route: Router,public activeRoute: ActivatedRoute ) {}

  ngOnInit(): void {
    this.loadFinancialPremiumsBatchListGrid();
  }
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialPremiumsBatchListGrid();
  }


  private loadFinancialPremiumsBatchListGrid(): void {
    this.loadRefundBatch(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadRefundBatch(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialPremiumsBatchGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
    };
    this.loadFinancialPremiumsBatchListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

 
  onChange(data: any) {
    this.defaultGridState();

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'vendorName',
              operator: 'startswith',
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    let stateData = this.state;
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
    this.loadFinancialPremiumsBatchListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadFinancialPremiumsBatchListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.financialPremiumsBatchGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridDataResult.data = filterBy(
        this.gridDataResult.data,
        this.filterData
      );
      this.gridFinancialPremiumsBatchDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) { 
        this.isFinancialPremiumsBatchGridLoaderShow = false;
      }
    });
    this.isFinancialPremiumsBatchGridLoaderShow = false;
  }
  navToBatchDetails(event : any){    
    
    this.route.navigate([`/financial-management/premiums/${this.premiumsType}/batch`],
    { queryParams :{bid: '569e1a0e-4bb7-4035-9616-12649b171797'}});
  }

}


 