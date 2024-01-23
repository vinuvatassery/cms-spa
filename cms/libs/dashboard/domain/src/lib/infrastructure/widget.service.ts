import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WidgetChartModel } from '../entities/widget-chart';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  constructor(private http: HttpClient) {}

  getRecentlyViewedProfiles(): Observable<any> {
    return of([
      {
        ProfileName: 'Donna Summer',
        ProfileId: 'ID 1212312',
        DOB: '20-12-1996',
        Status: 'ACCEPT',
      },
      {
        ProfileName: 'Abbot Labs',
        ProfileId: 'TIN 965998',
        DOB: '',
        Status: '',
      },
      {
        ProfileName: 'Moda Healthcare',
        ProfileId: 'TIN 88896',
        DOB: '',
        Status: '',
      },
      {
        ProfileName: 'Rite Aide Pharmacy #57007',
        ProfileId: 'TIN 6866579',
        DOB: '06-11-1963',
        Status: 'RESTRICTED',
      },
      {
        ProfileName: 'Julia Child',
        ProfileId: 'ID 56983',
        DOB: '06-08-1983',
        Status: 'RESTRICTED',
      },
    ]);
  }

  getChartData():Observable<any> {
    return of({
      title:{
        text:'Program Expensessssssssssss'
      },
      
      legend:{
        position:'top',
        orientation: 'horizontal'
      },
      categoryAxis:{
        categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
      },
      series:[
        {
          name: 'Med Claims',
          data: [300, 200, 250, 400, 300, 350, 500],
          type:'line',
          color:'red'
        },
        {
          name: 'Med Prem',
          data: [75, 130, 170, 220, 100, 180, 50],
          type:'line',
          color:'blue'
        },
        {
          name: 'Dental Claims',
          data: [10, 30, 20, 10, 40, 70, 60],
          type:'line',
          color:'green'
        },
        {
          name: 'Dental Prem',
          data: [20, 10, 30, 60, 40, 80, 60],
          type:'line',
          color:'yellow'
        },
        {
          name: 'Pharm Claim',
          data: [100, 10, 60, 60, 40, 70, 60],
          type:'line',
          color:'purple'
        }
      ]
    });
  }
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
  getActiveClientsByGroup() :Observable<any>{
    return of({
      component: 'ActiveClientsByGroup',
      chartData: {
      title: {
        text: 'ACTIVE CLIENTS BY GROUP',
      },
      legend: {
        position: 'top',
        orientation: 'horizontal',
      },
      categoryAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      },
      series: [
        {
          data: [
            {
              category: 'UPP',
              value: 45,
              color: '#FFD064',
            },
            {
              category: 'GROUP I',
              value: 15,
              color: '#ED6363',
            },
            {
              category: 'GROUP II',
              value: 10,
              color: '#57BAC3',
            },
            {
              category: 'BRIDGE',
              value: 10,
              color: '#0063A6',
            },
            {
              category: 'GROUP I / INS GAP',
              value: 10,
              color: '#BF61A5',
            },
            {
              category: 'GROUP II / INS GAP',
              value: 10,
              color: '#D8D365',
            },
          ],
          type: 'donut',
          color: 'red',
        },
      ],
    }});
  }
  getActiveClientByStatus(){

  }
  getNetIncome(){

  }
  getDirectMessages(){

  }
  getInsuranceTypeFpl(){

  }
  GetLineHeap(){

  }


  getPharmacyClaims(){}
  getPremiumExpensesByInsurance(){
    
  }
  getProgramExpenses(){

  }
  getProgramIncome(){

  }
  getQuickClinks(){

  }
  getRentOverages(){}
  getServiceTracking(){}
  getSlotsAllocation(){}
  getTodayGlance(){}
  GetApplicationsCers(){}

}
