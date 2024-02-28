import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { GridFilterParam, SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject} from 'rxjs';
import { FilterService} from '@progress/kendo-angular-grid';

@Component({
  selector: 'cms-system-interface-batch-interface-logs',
  templateUrl: './batch-Interface-logs.component.html',
  styleUrls: ['./batch-interface-logs.component.scss'],
})
export class BatchInterfaceLogsComponent implements OnChanges, OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  batchLogsDataLoader$ = this.systemInterfaceDashboardFacade.batchLogsDataLoader$;
  batchLogExcptionLists$ = this.systemInterfaceDashboardFacade.batchLogExcptionLists$;
  
  showHistoricalFlag: boolean = true;
 @Input() lovsList$: any;
  @Input() skipCount$: any;
  public state!: State;
  filteredBy = '';
  isFiltered = false;
  filter!: any;
  columns: any;
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filteredByColumnDesc = '';
  selectedStatus = '';
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns';

  dateColumns = ['startDate', 'endDate'];
  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  /** Public properties **/
  InterfaceType: string = "RAMSELL";
  columnsReordered = false;
  displayAll: boolean = true;
  activityEventLogSubList = [
    {
      id: 1,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id: 2,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id: 3,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
  ]
  lovsList!: any[];
  gridColumns: any = {
    startDate: 'Start Date',
    endDate: 'End Date',
    interfaceTypeDesc: 'Interface',
    processTypeDesc: 'Process',
    status: 'status'

  };
  searchColumnList: { columnName: string; columnDesc: string }[] = [
    {
      columnName: 'startDate',
      columnDesc: 'Start Date',
    },
    {
      columnName: 'endDate',
      columnDesc: 'End Date',
    },

  ];
  numericColumns: any[] = [
    'totalRecords',
    'totalFailed'
  ];
 
  selectedSearchColumn: string = '';
  private searchSubject = new Subject<string>();
  sortColumn = 'StartDate';
  sortColumnDesc = 'StartDate';
  sortDir = 'Ascending';
  interfaceExceptionFilter = '';
  interfaceProcessBatchFilter = '';
  statusFilter = '';

  // lov 
  interfaceExcptionLov$ = this.lovFacade.interfaceExceptionLov$;
  interfaceProcessBatchLov$ = this.lovFacade.interfaceProcessBatchLov$;
  BatchInterfaceStatusLov$ = this.lovFacade.BatchInterfaceStatusLov$;
  fileId: any;
  interfaceTypeCode: any;
  /** Lifecycle hooks **/

  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade, private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider, private readonly lovFacade: LovFacade,
  ) { }
  processTypeCode:string='';
  ngOnInit(): void {
    this.sortType = 'desc';
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadActivityListGrid();
    this.lovFacade.getInterfaceProcessBatchLov(this.InterfaceType);
    this.lovFacade.getInterfaceExceptionLov();
    this.lovFacade.getInBatchInterfaceStatusLov();
  }

  ngOnChanges(): void {

    this.initializePaging();
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
    this.loadActivityListGrid();
  }

  childPageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadActivityListGrid();
  }

  handleShowHistoricalClick() {
    this.loadActivityListGrid();
  }

  onInterfaceChange(event: any) {
    this.InterfaceType = event;
    this.lovFacade.getInterfaceProcessBatchLov(this.InterfaceType);
    this.defaultGridState()
    this.loadActivityListGrid();
  }

  loadActivityListGrid() {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.systemInterfaceDashboardFacade.loadBatchLogsList(this.InterfaceType, !this.displayAll, param);
  }

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
    if(stateData.filter?.filters.length > 0){
      for (const filter of stateData.filter.filters) {
        filterList.push(this.gridColumns[filter.filters[0].field]);
      }
    }
    this.filteredBy = filterList.toString();
    this.loadActivityListGrid();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {

    this.filterData = filter;
  }
  public columnChange(e: any) {
  }
  onColumnReorder($event: any) {
    this.columnsReordered = true;
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
  onSearch(searchValue: any) {

  const isDateSearch = searchValue.includes('/');
  this.showDateSearchWarning =
    isDateSearch || this.dateColumns.includes(this.selectedSearchColumn);
  searchValue = this.formatSearchValue(searchValue, isDateSearch);
  if (isDateSearch && !searchValue) return;
  this.searchSubject.next(searchValue);
}
performSearch(data: any) {
  this.defaultGridState();
  const operator = [...this.numericColumns, ...this.dateColumns].includes(
    this.selectedSearchColumn?? 'interface'
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
            field: this.selectedSearchColumn ?? 'interface',
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
resetGrid() {
  this.sortType = 'asc';
  this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
  this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
  this.filteredBy ='';
  this.filteredByColumnDesc = '';
  this.sortColumnDesc = this.gridColumns[this.sortValue];
  this.columnChangeDesc = 'Default Columns';
  this.loadActivityListGrid();

}

public onDetailExpand(e: any): void {
this.fileId=e.dataItem.fileId;
this.interfaceTypeCode=e.dataItem.interfaceTypeCode;
this.processTypeCode=e.dataItem.processTypeCode;
}
  
  dropdownFilterChange(
    field: string,
    value: any,
    filterService: FilterService
  ): void {
    if (field === 'interfaceTypeDesc') {
      this.interfaceExceptionFilter = value;
    } else if (field === 'processTypeDesc') {
      this.interfaceProcessBatchFilter = value;
    } else if (field === 'status') {
      this.statusFilter = value;
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

  downloadFile(filePath: any) {
    this.systemInterfaceDashboardFacade.viewOrDownloadFile(filePath, "ramsell")
  }

}
