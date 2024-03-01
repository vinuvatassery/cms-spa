import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SystemInterfaceDashboardFacade } from '@cms/system-interface/domain';
@Component({
  selector: 'cms-card-requests',
  templateUrl: './card-requests.component.html',
  styleUrls: ['./card-requests.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardRequestsComponent {

    ClientRecordSendChart$ = this.systemInterfaceDashboardFacade.ClientRecordSendChart$;
  cardsRequestChart$ = this.systemInterfaceDashboardFacade.cardsRequestChart$;
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;
  sort = this.systemInterfaceDashboardFacade.sort;
  cardsRequestChart: any;
  constructor(private systemInterfaceDashboardFacade:SystemInterfaceDashboardFacade){

  }
}
