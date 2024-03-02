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
})
export class ClientRecordSentComponent {
  clientRecordSendChart: any;
  DaysRange=7;
  isCardRequest=false;
  isloader=true;
  constructor(private systemInterfaceDashboardFacade:SystemInterfaceDashboardFacade){
    this.systemInterfaceDashboardFacade.loadClientRecordSendChart(this.DaysRange,this.isCardRequest);
    this.systemInterfaceDashboardFacade.ClientRecordSendChart$.subscribe((res:any)=>{
      debugger
      this.isloader=false;
      this.clientRecordSendChart={
        component: 'ClientRecordsSent',
        chartData: {
          title: {
            visible: false,
            text: 'Client Records Sent',
          },
          legend: {
            visible: false,
            position: 'right',
            orientation: 'vertical',
          },
          categoryAxis: {
            categories:res.dates,
            labels: { format: 'd', rotation: 'auto' },
          },
          tooltip: {
            visible: true,
            shared: true,
          },
          series: [
            {
              data:res.data,
      
              type: 'column',
              color: '#005994',
            },
            {
              data: res.data,
      
              type: 'line',
              color: '#005994',
              style: 'smooth',
            },
          ],
        },
      };

    })
   
   
  }
}
