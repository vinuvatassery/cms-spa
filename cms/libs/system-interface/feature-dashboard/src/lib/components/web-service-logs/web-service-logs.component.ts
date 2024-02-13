import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridFilterParam, SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { FilterService, GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'cms-system-interface-web-service-logs',
  templateUrl: './web-service-logs.component.html',
  styleUrls: ['./web-service-logs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebServiceLogsComponent implements OnChanges, OnInit, OnDestroy {
  // UI Variables
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  // Input Variables
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() activityEventLogList$: any;
  @Input() lovsList$: any;
  @Input() skipCount$: any;

  // Flags
  displayAll = true;
  columnsReordered = false;

  // State Variables
  public state!: State;
  isActivityLogLoaderShow = false;
  gridDataResult!: GridDataResult;
  gridDataSubject = new Subject<any>();
  filter!: any;

  // Observable Variables
  webLogLists$ = this.systemInterfaceDashboardFacade.webLogLists$;
  webLogListsLoader$ = this.systemInterfaceDashboardFacade.webLogsDataLoader$;
  gridData$ = this.gridDataSubject.asObservable();

  // Output Events
  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  @Output() loadWebLogList = new EventEmitter<string>();
  filteredBy = '';
  columnChangeDesc = 'Default Columns';
  filteredByColumnDesc = '';
  selectedStatus = '';
  interfaceFilterDataList = null;

  // Sorting Variables
  sortColumn = 'startDate';
  sortColumnDesc = 'startDate';
  sortDir = 'Ascending';

  // Filtering Variables
  statusFilter = '';
  processFilter = '';
  public statusArray = ["FAILED", "SUCCESS", "IN_PROGRESS"]
  public statusArrayDesc = ["Failure", "Successful", "In Progress"]
  public processArray = ["New Enrollment", "Eligibility Change", "Maintanance", "Card Request"]
  interfaceProcessBatchFilter = '';
  dateColumns = ['startDate'];

  // Filter Data
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  interfaceFilterDropDown: any = null;
  lovsSubscription: Subscription | undefined;

  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade
  ) { }

  gridColumns: any = {
    process: 'Process',
    startDate: 'ProcessDate',
    status: 'Status',
    triggeredBy: 'Triggered By',
  };

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.sortColumn = this.gridColumns[stateData.sort[0]?.field];
    this.filter = stateData?.filter?.filters;
    const filterList = [];
      for (const filter of stateData.filter.filters) {
        filterList.push(this.gridColumns[filter.filters[0].field]);
      }
    this.filteredBy = filterList.toString();
    this.loadListGrid();
  }

  handleShowHistoricalClick() {
    this.loadListGrid();
  }

  resetGrid() {
    this.sortType = 'asc';
    this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
    this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
    this.filter = [];
    this.filteredByColumnDesc = '';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.columnChangeDesc = 'Default Columns';
    this.loadListGrid();

  }

  updateStatusFilterValue(filterGroups: any[], statusArray: any[], statusArrayDesc: any[]): void {
    if (!filterGroups || !Array.isArray(filterGroups)) return;

    filterGroups.forEach((filterGroup: any) => {
      // If filterGroup is null, or it doesn't have a 'filters' property, or 'filters' is not an array, exit this iteration.
      if (!filterGroup || !filterGroup.filters || !Array.isArray(filterGroup.filters)) return;

      // Find the status filter within the current filter group.
      const statusFilter = filterGroup.filters.find((filter: any) => filter && filter.field === 'status');

      if (!statusFilter || !statusArray || !Array.isArray(statusArray)) return;

      const statusIndex = statusArrayDesc.indexOf(statusFilter.value);

      // If statusIndex is valid , update the status filter value.
      if (statusIndex !== -1) {
        statusFilter.value = statusArray[statusIndex];
      }
    });
  }

  loadListGrid() {
    this.updateStatusFilterValue(this.filter, this.statusArray, this.statusArrayDesc);

    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));


    this.systemInterfaceDashboardFacade.loadWebLogsList(this.interfaceFilterDropDown.lovCode, !this.displayAll, param);
    this.webLogLists$ = this.systemInterfaceDashboardFacade.webLogLists$
  }


  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.sortType = "desc"
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };

    this.initializeDropdownWithFirstValue();

  }

  ngOnDestroy(): void {
    if (this.lovsSubscription) {
      this.lovsSubscription.unsubscribe();
    }
  }

  private initializeDropdownWithFirstValue() {
    this.lovsSubscription = this.lovsList$.subscribe((lovs: any) => {
      this.interfaceFilterDataList = lovs;
      if (lovs && lovs.length > 0) {
        this.interfaceFilterDropDown = lovs[0];
        this.loadListGrid();
      }
    });
  }

  ngOnChanges(): void {
    this.initializePaging();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }

  onColumnReorder($event: any) {
    this.columnsReordered = true;
  }

  private initializePaging() {
    const sort: SortDescriptor[] = [{
      field: 'creationTime',
      dir: 'desc'
    }];
    this.state = {
      skip: this.skipCount$ ?? 0,
      take: this.pageSizes[0]?.value,
      sort: sort,
      filter: this.filterData,
    };
  }

  private loadActivityLogLists() {
    this.loadActivityLogListEvent.emit();
  }

  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadListGrid();
  }

  onInterfaceSelectionChanged(event: any) {
    this.loadListGrid();
  }

  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'status') {
      this.statusFilter = value;
    }
    if (field === 'process') {
      this.processFilter = value;
    }

    filterService.filter({
      filters: [
        {
          field: field,
          operator: 'eq',
          value: value,
        },
      ],
      logic: 'or',
    });
  }

}
