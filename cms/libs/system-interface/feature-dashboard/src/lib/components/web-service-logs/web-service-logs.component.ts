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
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CompositeFilterDescriptor, SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';


@Component({
  selector: 'cms-system-interface-web-service-logs',
  templateUrl: './web-service-logs.component.html',
  styleUrls: ['./web-service-logs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebServiceLogsComponent implements OnChanges, OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  @Input() pageSizes: any;
  @Input() sortValue: any;
  @Input() sortType: any;
  @Input() sort: any;
  @Input() activityEventLogList$: any;
  @Input() lovsList$: any;
  @Input() skipCount$: any;

  displayAll = true;

  webLogLists$ = this.systemInterfaceDashboardFacade.webLogLists$;
  webLogListsLoader$ = this.systemInterfaceDashboardFacade.webLogsDataLoader$;

  @Output() loadActivityLogListEvent = new EventEmitter<any>();
  @Output() loadWebLogList = new EventEmitter<string>();

  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade,
    private readonly configProvider: ConfigurationProvider, private readonly lovFacade: LovFacade,
  ) { }

  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.sortType = this.sort[0]?.dir === 'asc' ? 'Ascending' : 'Descending';
    this.filter = stateData?.filter?.filters;
    this.filter = stateData?.filter?.filters;
    this.loadListGrid();
  }

  handleShowHistoricalClick() {
    this.displayAll = !this.displayAll;
  }

  public state!: State;
  isActivityLogLoaderShow = false;
  gridDataResult!: GridDataResult;
  gridDataSubject = new Subject<any>();
  gridData$ = this.gridDataSubject.asObservable();
  filter!: any;
  loadListGrid() {
    const param = new GridFilterParam(
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType,
      JSON.stringify(this.filter));
    this.systemInterfaceDashboardFacade.loadWebLogsList('RAMSELL', this.displayAll, param);
    this.webLogLists$ = this.systemInterfaceDashboardFacade.webLogLists$
  }

  /** Public properties **/
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

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
    this.loadActivityLogLists();

  }

  filterData: CompositeFilterDescriptor = { logic: 'and', filters: [] };
  ngOnChanges(): void {
    this.initializePaging();
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    this.filterData = filter;
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
    this.loadActivityLogLists();
  }

  onInterfaceSelectionChanged(event: any) {
    this.loadListGrid();
  }
}
