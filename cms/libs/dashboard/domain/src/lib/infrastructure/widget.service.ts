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

  getChartData(){
    const chartData:WidgetChartModel={
      chartType: 'bar',
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
    };
    return chartData
  }
}
