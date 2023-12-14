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
  ClientRecordSendChart$ = this.systemInterfaceDashboardFacade.ClientRecordSendChart$;
  cardsRequestChart$ = this.systemInterfaceDashboardFacade.cardsRequestChart$;
  activityEventLogLists$ = this.systemInterfaceDashboardFacade.activityEventLogLists$;
  pageSizes = this.systemInterfaceDashboardFacade.gridPageSizes;
  sortValue = this.systemInterfaceDashboardFacade.sortValue;
  sortType = this.systemInterfaceDashboardFacade.sortType;
  sort = this.systemInterfaceDashboardFacade.sort;
  public state!: State;
  clientRecordSendChart: any;
  cardsRequestChart: any;
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
    this.loadClientRecordSendChart(); 
    this.loadCardsRequestChart();
    this.loadActivityEventLog();  
  }

  loadClientRecordSendChart() {
    this.systemInterfaceDashboardFacade.loadClientRecordSendChart();
    this.ClientRecordSendChart$.subscribe({
      next: (response) => { 
        if(response){
          this.clientRecordSendChart = response 
        }
       
      }})
  }
  loadCardsRequestChart() {
    this.systemInterfaceDashboardFacade.loadCardsRequestChart();
    this.cardsRequestChart$.subscribe({
      next: (response) => { 
        if(response){
          this.cardsRequestChart = response 
        } 
      }})
  }
   loadActivityEventLog( ) {
    this.systemInterfaceDashboardFacade.getEventLogLists();
  }
}
