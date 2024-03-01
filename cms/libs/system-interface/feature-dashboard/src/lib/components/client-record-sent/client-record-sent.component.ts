import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';

@Component({
  selector: 'cms-client-record-sent',
  templateUrl: './client-record-sent.component.html',
  styleUrls: ['./client-record-sent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientRecordSentComponent {
  ClientRecordSendChart$ = this.systemInterfaceDashboardFacade.ClientRecordSendChart$;
  cardsRequestChart$ = this.systemInterfaceDashboardFacade.cardsRequestChart$;
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;
  sort = this.systemInterfaceDashboardFacade.sort;
  cardsRequestChart: any;
  clientRecordSendChart: any;
  constructor(private systemInterfaceDashboardFacade:SystemInterfaceDashboardFacade){

  }
}
