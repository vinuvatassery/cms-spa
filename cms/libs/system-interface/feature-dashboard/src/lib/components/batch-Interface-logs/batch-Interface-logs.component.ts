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
import { GridFilterParam, SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';


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

  dateColumns = ['openDate', 'closeDate'];
  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  /** Public properties **/
  isActivityLogLoaderShow = false;
  InterfaceType:string="RAMSELL";
  columnsReordered = false;
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
  /** Lifecycle hooks **/

  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade
  ) { }
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadClaimsListGrid();
    this.loadLovList();
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

  loadClaimsListGrid() {
    debugger
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
      this.systemInterfaceDashboardFacade.loadBatchLogsList(this.InterfaceType, param);
  }

  
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortType = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;
    this.filter = stateData?.filter?.filters;
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
  
}
