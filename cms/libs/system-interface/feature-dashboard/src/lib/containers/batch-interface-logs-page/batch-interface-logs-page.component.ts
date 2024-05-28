import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
import { State } from '@progress/kendo-data-query';
import { LovFacade } from '../../../../../../system-config/domain/src/lib/application/lov.facade';
@Component({
  selector: 'cms-system-interface-batch-interface-logs-page',
  templateUrl: './batch-interface-logs-page.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class BatchInterfaceLogsPageComponent implements OnInit {  

  batchLogExcptionLists$ = this.systemInterfaceDashboardFacade.batchLogExcptionLists$;
  public state!: State;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sort = this.systemInterfaceDashboardFacade.sort;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;

  BatchInterfaceActivityLogLovs$ = this.lovFacade.batchInterfaceActivityLogLovs$;
  constructor(
    private systemInterfaceDashboardFacade: SystemInterfaceDashboardFacade,
    private lovFacade: LovFacade
  ) { }

  ngOnInit(): void {
    this.state = {
      skip: 0,
      take: this.pageSizes[0]?.value,
      sort: this.sort
    };
    this.lovFacade.getBatchInterfaceActivityLogLovs();
  }

 

}
