import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { LovFacade } from '@cms/system-config/domain';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-system-interface-web-service-logs-page',
  templateUrl: './web-service-logs-page.component.html',
  styleUrls: ['./web-service-logs-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class WebServiceLogsPageComponent implements OnInit {
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  public state!: State;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sort = this.systemInterfaceDashboardFacade.sort;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;

  webLogLovs$ = this.lovFacade.WebInterfaceLogLovs$;
  webLogsList$ = this.systemInterfaceDashboardFacade.webLogLists$;
  webLogsDataList$ :any ;
  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade,
    private lovFacade: LovFacade
  ) { }

  interfaceTypeCode = '';
  ngOnInit(): void {

    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
    };
    this.loadActivityEventLog();
    this.lovFacade.getInterfaceWebLogLovs();
    //this.systemInterfaceDashboardFacade.loadWebLogsList(this.interfaceTypeCode);
    //this.webLogsDataList$.subscribe();
  }

  loadActivityEventLog() {
    this.systemInterfaceDashboardFacade.getEventLogLists();
  }

  loadWebLogList(data: any) {
    this.interfaceTypeCode = data;
    // this.systemInterfaceDashboardFacade.loadWebLogsList(this.interfaceTypeCode);
    // this.webLogsList$.subscribe();
    
  }
}