import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SystemInterfaceDashboardService {
  constructor(private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider) { }

  getClientRecordSendChart(): Observable<any> {
    return of({
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
          categories: [
            '05/01/21',
            '05/02/21',
            '05/03/21',
            '05/04/21',
            '05/05/21',
            '05/06/21',
            '05/07/21',
            '05/08/21',
            '05/09/21',
          ],
          labels: { format: 'd', rotation: 'auto' },
        },
        tooltip: {
          visible: true,
          shared: true,
        },
        series: [
          {
            data: [10, 12, 23, 34, 12, 23, 10, 12, 23],

            type: 'column',
            color: '#005994',
          },
          {
            data: [10, 12, 23, 34, 12, 23, 10, 12, 23],

            type: 'line',
            color: '#005994',
            style: 'smooth',
          },
        ],
      },
    });
  }
  getCardsRequestChart(): Observable<any> {
    return of({
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
          categories: [
            '05/01/21', '05/02/21', '05/03/21', '05/04/21', '05/05/21', '05/06/21', '05/07/21', '05/08/21', '05/09/21'
          ],
          labels: { format: 'd', rotation: 'auto' },
        },
        tooltip: {
          visible: true,
          shared: true,
        },
        series: [
          {
            data: [5, 15, 4, 15, 15, 23, 25, 13, 32],

            type: 'column',
            color: '#ec891d',
            gap: 2,
            spacing: .25
          },
          {
            data: [5, 15, 4, 15, 15, 23, 25, 13, 32],

            type: 'area',
            color: '#f9dcbb',
            style: 'smooth',
            gap: 2,
            spacing: .25
          },
        ],
      },
    });
  }

  loadActivityLogListsServices() {
    return of([
      {
        id: 1,
        interface: 'McKesson',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Failed',
        totalRecords: 100,
        failedRecords: 4,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM',
      },
      {
        id: 2,
        interface: 'OHA',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM',
      },
      {
        id: 3,
        interface: 'Kaiser',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM',
      },
      {
        id: 4,
        interface: 'Surveillance',
        process: 'Order',
        processStartDate: 'MM/DD/YYYY',
        processEndDate: 'MM/DD/YYYY',
        status: 'Success',
        totalRecords: 100,
        failedRecords: 0,
        stampDate: 'MM/DD/YYYY',
        standTime: '00:00:00 AM',
      },
    ]);
  }

  /** Public methods **/

}
