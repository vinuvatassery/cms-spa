 

/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
import { Router } from '@angular/router';
import {  ColumnVisibilityChangeEvent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State,
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-refund-batches-list',
  templateUrl: './refund-batches-list.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundBatchesListComponent implements  OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isVendorRefundBatchGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() vendorRefundBatchGridLists$: any;
  @Input() exportButtonShow$: any

  @Output() loadVendorRefundBatchListEvent = new EventEmitter<any>();
  public state!: State;
  sortColumn = 'Batch #';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  selectedColumn  = 'ALL'
  gridDataResult!: GridDataResult;
  columnChangeDesc = 'Default Columns';
  gridVendorsBatchDataSubject = new Subject<any>();
  gridVendorsBatchData$ = this.gridVendorsBatchDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  @Output() exportGridDataEvent = new EventEmitter<any>();

  columns: any = {
    batchName: 'Batch #',
    tpaRefunds: '# TPA Refunds',
    insRefunds: '# INS Refunds',
    rxRefunds: '# RX Refunds',
    bulkPayment: 'Bulk Payment',
    totalRefund: 'Total Refund Amount'   
  };

  dropDowncolumns: any = [
    {
      columnCode: 'ALL',
      columnDesc: 'All Columns',
    },
    {
      columnCode: 'batchName',
      columnDesc: 'Batch #',
    }
  ];
  showExportLoader = false;
  
  
  /** Constructor **/
  constructor(private route: Router, private readonly cdr: ChangeDetectorRef) {}

  
  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadVendorRefundBatchListGrid();
  }


  private loadVendorRefundBatchListGrid(): void {
    this.loadRefundBatch(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }

  navToBatchDetails(data: any) {   
    const query = {
      queryParams: {
        b_id: data?.paymentRequestBatchId ,         
      },
    };
    this.route.navigate(['/financial-management/vendor-refund/batch/batch-log-list'], query );
  }
  
  loadRefundBatch(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isVendorRefundBatchGridLoaderShow = true;

    if(sortValue  === 'batchName')
    {
      sortValue = 'creationTime'
    }
    const gridDataRefinerValue = {
      SkipCount: skipCountValue,
      MaxResultCount: maxResultCountValue,
      Sorting: sortValue,
      SortType: sortTypeValue,
      Filter: JSON.stringify(this.state?.['filter']?.['filters'] ?? []),
    };
    this.loadVendorRefundBatchListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  searchColumnChangeHandler(data:any){
    this.onChange('')
  }


  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (
      this.selectedColumn === 'bulkPayment' ||
      this.selectedColumn === 'totalRefund'
      ||
      this.selectedColumn === 'insRefunds'
      ||
      this.selectedColumn === 'rxRefunds'
      ||
      this.selectedColumn === 'tpaRefunds'
    ) {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'batchName',
              operator: operator,
              value: data,
            },
          ],
          logic: 'and',
        },
      ],
    };
    const stateData = this.state;
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

    this.sortColumn = this.columns[stateData.sort[0]?.field];

    if (stateData.filter?.filters.length > 0) {
      const stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
      this.filter = stateFilter.value;
      this.isFiltered = true;
      const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.columns[filter.filters[0].field]);
      }
      this.filteredBy = filterList.toString();
    } else {
      this.filter = '';
      this.isFiltered = false;
    }
    this.loadVendorRefundBatchListGrid();
  }

  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadVendorRefundBatchListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  gridDataHandle() {
    this.vendorRefundBatchGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridVendorsBatchDataSubject.next(this.gridDataResult);
        this.isVendorRefundBatchGridLoaderShow = false;
    });

  }

  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit();
    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }

  setToDefault() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.sortColumn = 'Batch #';
    this.sortDir = 'Ascending';
    this.filter = '';
    this.selectedColumn = 'ALL';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'batchName';
    this.sortType = 'asc';
    this.sort = this.sortColumn;
    this.searchValue =''

    this.loadVendorRefundBatchListGrid();
  }

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }
}
