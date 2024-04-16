import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { SystemInterfaceDashboardFacade} from '@cms/system-interface/domain';
@Component({
  selector: 'cms-card-requests',
  templateUrl: './card-requests.component.html',
  styleUrls: ['./card-requests.component.scss'],
})
export class CardRequestsComponent {
cardsRequestChart: any;
  DaysRange=7;
  isCardRequest=true;
  isloader=true;
  constructor(private systemInterfaceDashboardFacade:SystemInterfaceDashboardFacade){
    this.systemInterfaceDashboardFacade.loadCardsRequestChart(this.DaysRange,this.isCardRequest);
    this.systemInterfaceDashboardFacade.cardsRequestChart$.subscribe((res:any)=>{
   this.isloader=false;
    this.cardsRequestChart= 
    {
      component: 'CardsRequest',
      chartData: {
        title: {
          visible: false,
          text: 'Cards Request',
        },
        legend: {
          visible: false,
          position: 'right',
          orientation: 'vertical',
        },
        categoryAxis: {
          categories:res.dates,
          title: {
            text: 'Dates' // Add title for x-axis
        },
          labels: { format: 'd', rotation: 'auto' },
        },
        valueAxis: {
          title: {
              text: 'Number of Cards Requests' // Add title for y-axis
          }
      },
        tooltip: {
          visible: true,
          shared: true,
        },
        series: [
          {
            data: res.data,

            type: 'column',
            color: '#ec891d',
            gap:2,
            spacing: .25
          },
   
        ],
      },
    }
  
  });

   
};
}

