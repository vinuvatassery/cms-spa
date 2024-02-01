import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { GridFilterParam, SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';



@Component({
  selector: 'cms-system-interface-batch-interface-logs',
  templateUrl: './batch-Interface-logs.component.html',
  styleUrls: ['./batch-interface-logs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchInterfaceLogsComponent  implements OnChanges, OnInit
{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() activityEventLogList$: any;
  showHistoricalFlag:boolean = true;
  //@Input() batchLogExcptionLists$:any;
  batchLogExcptionLists$ = this.systemInterfaceDashboardFacade.batchLogExcptionLists$;
  @Input() lovsList$: any;
  @Input() skipCount$: any;
  public state!: State;
  filteredBy = '';
  isFiltered = false;
  filter!: any;
  columns : any;  
  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  filteredByColumnDesc = '';
  selectedStatus = '';
  showDateSearchWarning = false;
  columnChangeDesc = 'Default Columns';

  dateColumns = ['startDate', 'endDate'];
  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  /** Public properties **/
  isActivityLogLoaderShow = false;
  InterfaceType:string="RAMSELL";
  columnsReordered = false;
  displayAll:boolean=true;
  activityEventLogSubList =[
    {
      id:1,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id:2,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
    {
      id:3,
      errorCode: 12,
      errorDesc: 'errorDesc errorDesc',
      rowNumber: 14
    },
  ]
  lovsList!: any[];
  gridColumns: any = {
    startDate: 'Start Date',
    endDate: 'End Date',
 
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
  public statusArray = ["Failed", "Success", "Partial"]
  selectedSearchColumn:  string = '';
  private searchSubject = new Subject<string>();
  sortColumn = 'interface';
  sortColumnDesc = 'Interface';
  sortDir = 'Ascending';
  interfaceExceptionFilter = '';
  interfaceProcessBatchFilter= '';

  // lov 
  interfaceExcptionLov$ = this.lovFacade.interfaceExceptionLov$;
  interfaceProcessBatchLov$ = this.lovFacade. interfaceProcessBatchLov$;
  /** Lifecycle hooks **/

  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade,    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider, private readonly lovFacade: LovFacade,
  ) { }
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClaimsListGrid();
    this.loadLovList();
    this.lovFacade.getInterfaceProcessBatchLov();
    this.lovFacade.getInterfaceExceptionLov();
  }
  loadLovList(){
    this.lovsList$.subscribe((data: any[]) => {
      this.lovsList = data.sort((a, b) => a.sequenceNbr - b.sequenceNbr);
    });
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
        skip:this.skipCount$??0,
        take: this.pageSizes[0]?.value,
        sort: sort,
        filter : this.filterData,
    };
}

  private loadActivityLogLists() {
    this.loadActivityLogListEvent.emit();
  }
  pageSelectionchange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadClaimsListGrid();
  }
  handleShowHistoricalClick(){
    this.displayAll=!this.displayAll;
  }
  loadClaimsListGrid() {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
      this.systemInterfaceDashboardFacade.loadBatchLogsList(this.InterfaceType,this.displayAll, param);
  }

  
  public dataStateChange(stateData: any): void {
    debugger
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortDir = this.sortType === 'asc' ? 'Ascending' : 'Descending';
    this.sortColumnDesc = this.gridColumns[this.sortValue];
    this.filter = stateData?.filter?.filters;
    this.setFilterBy(true, '', this.filter);
    this.loadClaimsListGrid();
  }
  
  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
  }
  public columnChange(e: any) {
   // this.cdr.detectChanges();
  }
  onColumnReorder($event: any) {
    this.columnsReordered = true;
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
public onDetailExpand(e: any): void {
  debugger
  const param = new GridFilterParam(
    this.state?.skip ?? 0,
    this.state?.take ?? 0,
    this.sortValue,
    this.sortType,
    JSON.stringify({ logic: 'and', filters: [] }));
    this.systemInterfaceDashboardFacade.getBatchLogExceptionsLists(e.dataItem.fileId,e.dataItem.processTypeCode, param);

}
restGrid() {
  this.sortType = 'asc';
  this.sortDir = this.sort[0]?.dir === 'asc' ? 'Ascending' : '';
  this.sortDir = this.sort[0]?.dir === 'desc' ? 'Descending' : '';
  this.filter = [];
  this.filteredByColumnDesc = '';
  this.sortColumnDesc = this.gridColumns[this.sortValue];
  this.columnChangeDesc = 'Default Columns';
  this.showDateSearchWarning = false;
  this.loadClaimsListGrid();

}
}
