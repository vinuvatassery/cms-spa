import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';
@Component({
  selector: 'cms-system-interface-batch-interface-logs-page',
  templateUrl: './batch-interface-logs-page.component.html',
  styleUrls: ['./batch-interface-logs-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class BatchInterfaceLogsPageComponent implements OnInit{
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  public state!: State;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sort = this.systemInterfaceDashboardFacade.sort;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;
constructor(
  private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade
) {}

ngOnInit(): void {

  this.state = {
    skip: 0,
    take: this.pageSizes[0]?.value,
    sort: this.sort
    };
  this.loadActivityEventLog();  

  this.systemInterfaceDashboardFacade.getInterfaceBatchLovs();

}

loadActivityEventLog( ) {
  this.systemInterfaceDashboardFacade.getEventLogLists();
}

}
