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
        component: 'ClientByStatus',
        widgetChartConfig:{ 
          title:{
            text:'Program Expenses'
          },
          legend:{ 
            position:'right',
            orientation: 'vertical',
           
          },
          categoryAxis:{
            categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
          },
          series:[
            
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
            
              type:'donut',
              color:'red'
            },
          ]
        }
        
      },
      {
        id:2,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ProgramIncome',
      },
      {
        id: 3,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ClientByStatus',
        widgetChartConfig: {
          title: {
            text: 'ACTIVE CLIENTS BY GROUP',
           
          },
          legend: { 
            position: 'top',
            orientation: 'horizontal',
          },
          categoryAxis:{
            categories:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
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
        },
      },
      {
        id:4,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'ProgramExpenses',
        widgetChartConfig:{ 
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
        id:5,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'DirectMessages',
      },
      {
        id:6,
        cols: 6,
        rows: 4,
        x: 0,
        y: 0,
        component: 'RecentlyViewed',
      },
   
    ]);
  }

  getDashboardConfiguration(): Observable<GridsterConfig> {
    return of({
      gridType: GridType.VerticalFixed,
      displayGrid: DisplayGrid.OnDragAndResize, 
      resizable: { enabled: true }, 
      swap: true,
      pushItems: false,
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
      disableWindowResize: false, 
      disableWarnings: true,
      scrollSpeed: 10, 
      defaultItemCols: 2,
      defaultItemRows: 2,
      keepFixedWidthInMobile: false,
      keepFixedHeightInMobile: true,
      draggable: {
        enabled: true,
        ignoreContent: false, // if true drag will start only from elements from `dragHandleClass`
        dragHandleClass: 'drag-handle', // drag event only from this class. If `ignoreContent` is true. 
      },
  
      
    });
  }
}
