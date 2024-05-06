

/** Angular **/
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ActivatedRoute, Router } from '@angular/router';
import {  ColumnComponent, GridDataResult } from '@progress/kendo-angular-grid';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject } from 'rxjs';
@Component({
  selector: 'cms-financial-claims-batches-list',
  templateUrl: './financial-claims-batches-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesListComponent implements OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isFinancialClaimsBatchGridLoaderShow = false;
  @Input() claimsType: any;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() financialClaimsBatchGridLists$: any;
  @Input() exportButtonShow$: any;

  @Output() loadFinancialClaimsBatchListEvent = new EventEmitter<any>();
  @Output() exportGridDataEvent = new EventEmitter<any>();

  public state!: State;
  sortColumn = 'Batch #';
  sortDir = 'Ascending';
  columnsReordered = false;
  filteredBy = '';
  searchValue = '';
  isFiltered = false;
  filter!: any;
  claimType: any;
  selectedColumn ='ALL'
  gridDataResult!: GridDataResult;
  showExportLoader = false;
  gridFinancialClaimsBatchDataSubject = new Subject<any>();
  gridFinancialClaimsBatchData$ =
    this.gridFinancialClaimsBatchDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

    // --------------------- grid columns visiblity
    visibleColumnFields: string[] = [];
    visibleColumns: any[] = [];
    @ViewChild('clientsGrid') clientsGrid: any;
    // ---------------------

  columns: any = {
    creationTime: 'Batch #',
    sendBackNotes: 'Send Back Notes',
    providerCount: '# of Providers',
    totalClaims: '# of Claims',
    totalPaymentsRequested: '# of Pmts Requested',
    reconciledPayments: '# of Pmts Reconciled',
    totalAmountDue: 'Total Amount Due',
    totalAmountReconciled: 'Total Amount Reconciled',
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
  /** Constructor **/
  constructor(
    private route: Router,
    public activeRoute: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.loadFinancialClaimsBatchListGrid();
  }

  private loadFinancialClaimsBatchListGrid(): void {
    this.loadClaimsProcess(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadClaimsProcess(
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isFinancialClaimsBatchGridLoaderShow = true;
    const gridDataRefinerValue = {
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue,
      filter: this.state?.['filter']?.['filters'] ?? [],
    };
    this.loadFinancialClaimsBatchListEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }

  onChange(data: any) {
    this.defaultGridState();
    let operator = 'startswith';

    if (this.selectedColumn !== 'creationTime') {
      operator = 'eq';
    }

    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedColumn ?? 'creationTime',
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
      let stateFilter = stateData.filter?.filters.slice(-1)[0].filters[0];
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
    this.loadFinancialClaimsBatchListGrid();
  }
  // updating the pagination infor based on dropdown selection
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = data.skip;
    this.loadFinancialClaimsBatchListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  gridDataHandle() {
    this.financialClaimsBatchGridLists$.subscribe((data: GridDataResult) => {
      this.gridDataResult = data;
      this.gridFinancialClaimsBatchDataSubject.next(this.gridDataResult);
      if (data?.total >= 0 || data?.total === -1) {
        this.isFinancialClaimsBatchGridLoaderShow = false;
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
    this.searchValue = '';
    this.isFiltered = false;
    this.columnsReordered = false;

    this.sortValue = 'creationTime';
    this.sortType = 'desc';
    this.sort = this.sortColumn;

    this.loadFinancialClaimsBatchListGrid();
  }

  navToBatchDetails(data: any) {
    this.route.navigate(
      [`/financial-management/claims/${this.claimsType}/batch`],
      { queryParams: { bid: data?.paymentRequestBatchId } }
    );
  }

  GetHiddenDataGridColumns() {
    return this.clientsGrid.columns.toArray()
      .filter((column: ColumnComponent) => column.hidden)
      .map((column: any) => column.field ? column.field.charAt(0).toUpperCase() + column.field.slice(1) : null);
  }


  onClickedExport() {
    this.showExportLoader = true;
    this.exportGridDataEvent.emit(this.GetHiddenDataGridColumns());

    this.exportButtonShow$.subscribe((response: any) => {
      if (response) {
        this.showExportLoader = false;
        this.cdr.detectChanges();
      }
    });
  }
}


