import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { Observable, of } from 'rxjs';
import { DashboardContent } from '../..';

@Injectable({
  providedIn: 'root',
})
export class DashboardWrapperService {
  constructor(private http: HttpClient) {}

  options!: GridsterConfig;

  getDashboardContent(): Observable<DashboardContent[]> {
    return of([
      {
        id:1,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ProgramIncome',
      },
      {
        id:2,
        cols: 6,
        rows: 4,
        x: 2,
        y: 0,
        component: 'ProgramExpenses',
        widgetChartConfig:{
          chartType:'bar',
          title:{
            text:'Program Expensessss'
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
        }
      },
      {
        id:3,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ProgramExpenses',
        widgetChartConfig:{
          chartType:'bar',
          title:{
            text:'Program Expenses'
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
              type:'bar',
              color:'red'
            },
            {
              name: 'Med Prem',
              data: [75, 130, 170, 220, 100, 180, 50],
              type:'bar',
              color:'blue'
            },
            {
              name: 'Dental Claims',
              data: [10, 30, 20, 10, 40, 70, 60],
              type:'bar',
              color:'green'
            },
            {
              name: 'Dental Prem',
              data: [20, 10, 30, 60, 40, 80, 60],
              type:'bar',
              color:'yellow'
            },
            {
              name: 'Pharm Claim',
              data: [100, 10, 60, 60, 40, 70, 60],
              type:'bar',
              color:'purple'
            }
          ]
        }
      },
      {
        id:4,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'DirectMessages',
      },
      {
        id:5,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'RecentlyViewed',
      },
      {
        id:6,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ClientByStatus',
        widgetChartConfig:{
          chartType:'donut',
          title:{
            text:'Program Expenses'
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
              type:'bar',
              color:'red'
            },
            {
              name: 'Med Prem',
              data: [75, 130, 170, 220, 100, 180, 50],
              type:'bar',
              color:'blue'
            },
            {
              name: 'Dental Claims',
              data: [10, 30, 20, 10, 40, 70, 60],
              type:'bar',
              color:'green'
            },
            {
              name: 'Dental Prem',
              data: [20, 10, 30, 60, 40, 80, 60],
              type:'bar',
              color:'yellow'
            },
            {
              name: 'Pharm Claim',
              data: [100, 10, 60, 60, 40, 70, 60],
              type:'bar',
              color:'purple'
            }
          ]
        }
        
      },
    ]);
  }

  getDashboardConfiguration(): Observable<GridsterConfig> {
    return of({
      gridType: GridType.VerticalFixed,
      displayGrid: DisplayGrid.OnDragAndResize,
      draggable: { enabled: true },
      resizable: { enabled: false }, 
      swap: true,
      pushItems: true,
      outerMargin: true,
      enableEmptyCellDrop: false,  
      maxItemCols:6,
      maxCols:12, 
      rowHeightRatio: .5,
      minItemRows:4, 
      minItemArea:4,      
      setGridSize: true,
      useBodyForBreakpoint: true,
      fixedRowHeight: 100, 
      disableWindowResize: true, 
      disableWarnings: true,
    });
  }
}
