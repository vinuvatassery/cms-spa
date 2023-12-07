import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-system-interface-dashboard-page',
  templateUrl: './system-interface-dashboard-page.component.html',
  styleUrls: ['./system-interface-dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemInterfaceDashboardPageComponent implements OnInit {
  dashboardChartList$ = this.systemInterfaceDashboardFacade.dashboardChartList$;
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;
  sort = this.systemInterfaceDashboardFacade.sort;
  public state!: State;
  /** Constructor **/
  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade
  ) {}
  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
      };
    this.loadChartsList(); 
    this.loadActivityEventLog( )
  }

   loadChartsList() {
    this.systemInterfaceDashboardFacade.loadDashboardContent();
  }

   loadActivityEventLog( ) {
    this.systemInterfaceDashboardFacade.getEventLogLists();
  }
}
