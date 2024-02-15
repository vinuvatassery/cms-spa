

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
import { ActivatedRoute, Router } from '@angular/router';
import { GridFilterParam } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ColumnVisibilityChangeEvent, FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
import {
  CompositeFilterDescriptor,
  State
} from '@progress/kendo-data-query';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'cms-pharmacy-claims-batches-list',
  templateUrl: './pharmacy-claims-batches-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchesListComponent implements OnInit, OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isPharmacyClaimsBatchGridLoaderShow = false;
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  claimsType= 'pharmacy-claims';
  @Input() pharmacyClaimsBatchGridLists$: any;
  @Input() PharmacyBatchGridLoader$: any;
  @Output() loadPharmacyClaimsBatchListEvent = new EventEmitter<any>();
  @Output() exportPharmacyClaimsBatchListEvent = new EventEmitter<any>();
  public state!: State;
  columnsReordered = false;
  searchValue = '';
  isFiltered = false
  selectedColumn!: any;
  gridDataResult!: GridDataResult;

  gridPharmacyClaimsBatchDataSubject = new Subject<any>();
  gridPharmacyClaimsBatchData$ = this.gridPharmacyClaimsBatchDataSubject.asObservable();
  columnDropListSubject = new Subject<any[]>();
  columnDropList$ = this.columnDropListSubject.asObservable();

  gridColumns: any = {
    ALL: 'All Columns',
    batchName: 'Batch #',
    sendBackNotes: 'Send Back Notes',
    totalPharmacy: '# of Pharmacies',
    totalClaims: '# of Claims',
    totalReconciled: '# of Pmts Reconciled',
    totalAmountPaid: 'Total Amt. Paid',
    totalAmountReconciled: 'Total Amt. Reconciled',
    creationTime: 'Creation Time'
  };

  searchColumnList: { columnName: string; columnDesc: string }[] = [
    { columnName: 'ALL', columnDesc: 'All Columns' },
    {
      columnName: 'batchName',
      columnDesc: 'Batch #',
    }
  ];

  numericColumns: any[] = ['totalAmountReconciled', 'totalAmountPaid', 'totalReconciled', 'totalClaims', 'totalPharmacy'];
  dateColumns: any[] = [];

  //searching
  private searchSubject = new Subject<string>();
  selectedSearchColumn = 'ALL';
  searchText: null | string = null;

  //sorting
  sortColumnDesc = 'Creation Time';
  sortDir = 'Descending';

  //filtering
  filteredBy = '';
  filter: any = [];

  filteredByColumnDesc = '';
  selectedStatus = '';
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  showDateSearchWarning = false;
  showNumberSearchWarning = false;
  columnChangeDesc = 'Default Columns';

  /** Constructor **/
  constructor(
    private route: Router,
    public activeRoute: ActivatedRoute,
    private readonly configProvider: ConfigurationProvider,
    private readonly intl: IntlService,) {}

  ngOnInit(): void {
    this.initializePharmacyBatchPage()
  }

  ngOnChanges(): void {
    this.sortType = 'desc';
    this.initializePharmacyBatchGrid();
    this.loadPharmacyBatchListGrid();
  }

  /* Public methods */
  navToBatchDetails(event : any){
    this.route.navigate([`/financial-management/pharmacy-claims/batch`],
    { queryParams :{bid: event.paymentRequestBatchId}});
  }

  onExportClaims() {
    const params = {
      SortType: this.sortType,
      Sorting: this.sortValue,
      Filter: JSON.stringify(this.filter)
    };

    this.exportPharmacyClaimsBatchListEvent.emit(params);
  }

  searchColumnChangeHandler(value: string) {
    this.filter = [];
    this.showNumberSearchWarning = this.numericColumns.includes(value);
    this.showDateSearchWarning = this.dateColumns.includes(value);
    if (this.searchText) {
      this.onSearch(this.searchText);
    }
  }

  onSearch(searchValue: any) {
    const isDateSearch = searchValue.includes('/');
    this.showDateSearchWarning =
      isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
    searchValue = this.formatSearchValue(searchValue, isDateSearch);
    if (isDateSearch && !searchValue) return;
    this.setFilterBy(false, searchValue, []);
    this.searchSubject.next(searchValue);
  }

  performSearch(data: any) {
    this.defaultGridState();
    const operator = [...this.numericColumns, ...this.dateColumns].includes(
      this.selectedSearchColumn
    )
      ? 'eq'
      : 'startswith';
    if (
      this.dateColumns.includes(this.selectedSearchColumn) &&
      !this.isValidDate(data) &&
      data !== ''
    ) {
      return;
    }
    if (
      this.numericColumns.includes(this.selectedSearchColumn) &&
      isNaN(Number(data))
    ) {
      return;
    }
    this.filterData = {
      logic: 'and',
      filters: [
        {
          filters: [
            {
              field: this.selectedSearchColumn ?? 'ALL',
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

  restGrid() {
    this.sortValue = 'creationTime';
    this.sortColumnDesc = 'Creation Time';
    this.sortType = 'desc';
    this.initializePharmacyBatchGrid();
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.filter = [];
    this.searchText = '';
    this.selectedSearchColumn = 'ALL';
    this.filteredByColumnDesc = '';
    this.columnChangeDesc = 'Default Columns';
    this.showDateSearchWarning = false;
    this.showNumberSearchWarning = false;
    this.loadPharmacyBatchListGrid();
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
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadPharmacyBatchListGrid();
  }

  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadPharmacyBatchListGrid();
  }

  filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  } 

  columnChange(event: ColumnVisibilityChangeEvent) {
    const columnsRemoved = event?.columns.filter((x) => x.hidden).length;
    this.columnChangeDesc =
      columnsRemoved > 0 ? 'Columns Removed' : 'Default Columns';
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'and',
    });
  }

  /* Private methods */
  private initializePharmacyBatchGrid() {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: [{ field: 'creationTime', dir: 'desc' }],
    };
  }


  private initializePharmacyBatchPage() {
    this.addSearchSubjectSubscription();
  }

  private loadPharmacyBatchListGrid(): void {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,

      JSON.stringify(this.filter)
    );
    this.loadPharmacyClaimsBatchListEvent.emit(param);
  }

  private addSearchSubjectSubscription() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((searchValue) => {
      this.performSearch(searchValue);
    });
  }

  private setFilterBy(
    isFromGrid: boolean,
    searchValue: any = '',
    filter: any = []
  ) {
    this.filteredByColumnDesc = '';
    if (isFromGrid) {
      if (filter.length > 0) {
        const filteredColumns = this.filter?.map((f: any) => {
          const filteredColumns = f.filters
            ?.filter((fld: any) => fld.value)
            ?.map((fld: any) => this.gridColumns[fld.field]);
          return [...new Set(filteredColumns)];
        });

        this.filteredByColumnDesc =
          [...new Set(filteredColumns)]?.sort()?.join(', ') ?? '';
      }
      return;
    }

    if (searchValue !== '') {
      this.filteredByColumnDesc =
        this.searchColumnList?.find(
          (i) => i.columnName === this.selectedSearchColumn
        )?.columnDesc ?? '';
    }
  }

  private isValidDate = (searchValue: any) =>
    isNaN(searchValue) && !isNaN(Date.parse(searchValue));

  private formatSearchValue(searchValue: any, isDateSearch: boolean) {
    if (isDateSearch) {
      if (this.isValidDate(searchValue)) {
        return this.intl.formatDate(
          new Date(searchValue),
          this.configProvider?.appSettings?.dateFormat
        );
      } else {
        return '';
      }
    }
    return searchValue;
  }
}


