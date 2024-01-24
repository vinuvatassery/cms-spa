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
        id: 1,
        cols: 12,
        rows: 2,
        x: 0,
        y: 0,
        component: 'TodayAtAGlance',
        isVisible: true,
      },
      {
        id: 2,
        cols: 6,
        rows: 4,
        x: 0,
        y: 1,
        component: 'ApplicationsCers',
        isVisible: true,
      },
      {
        id: 3,
        cols: 6,
        rows: 4,
        x: 0,
        y: 2,
        component: 'RecentlyViewed',
        isVisible: true,
      },
      {
        id: 4,
        cols: 6,
        rows: 4,
        x: 0,
        y: 3,
        component: 'InsuranceTypeFpl',
        isVisible: true,
      },
      {
        id: 5,
        cols: 6,
        rows: 4,
        x: 0,
        y: 3,
        component: 'QuickLinks',
        isVisible: true,
      },
      {
        id: 6,
        cols: 6,
        rows: 4,
        x: 0,
        y: 4,
        component: 'ClientByStatus',
        isVisible: true,
        widgetChartConfig: {
          title: {
            text: 'Client By Status',
          },
          legend: {
            position: 'right',
            orientation: 'vertical',
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
        },
      },

      {
        id: 7,
        cols: 6,
        rows: 4,
        x: 0,
        y: 4,
        component: 'ActiveClientsByGroup',
        isVisible: true,
        widgetChartConfig: {
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
        },
      },
      {
        id: 8,
        cols: 6,
        rows: 4,
        x: 0,
        y: 5,
        component: 'ProgramIncome',
        isVisible: true,
      },
      {
        id: 4,
        cols: 6,
        rows: 4,
        x: 0,
        y: 5,
        component: 'ProgramExpenses',
        isVisible: true,
        widgetChartConfig: {
          title: {
            text: 'Program Expenses',
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
              name: 'Med Claims',
              data: [300, 200, 250, 400, 300, 350, 500],
              type: 'bar',
              color: 'red',
            },
            {
              name: 'Med Prem',
              data: [75, 130, 170, 220, 100, 180, 50],
              type: 'bar',
              color: 'blue',
            },
            {
              name: 'Dental Claims',
              data: [10, 30, 20, 10, 40, 70, 60],
              type: 'bar',
              color: 'green',
            },
            {
              name: 'Dental Prem',
              data: [20, 10, 30, 60, 40, 80, 60],
              type: 'bar',
              color: 'yellow',
            },
            {
              name: 'Pharm Claim',
              data: [100, 10, 60, 60, 40, 70, 60],
              type: 'bar',
              color: 'purple',
            },
          ],
        },
      },
      {
        id: 9,
        cols: 6,
        rows: 4,
        x: 0,
        y: 6,
        component: 'NetIncome',
        isVisible: true,
      },
      {
        id: 10,
        cols: 6,
        rows: 4,
        x: 0,
        y: 7,
        component: 'PharmacyClaims',
        isVisible: true,
      },
      {
        id: 11,
        cols: 6,
        rows: 4,
        x: 0,
        y: 7,
        component: 'PremiumExpensesByInsuranceType',
        isVisible: true,
      },

      {
        id: 12,
        cols: 6,
        rows: 2,
        x: 0,
        y: 8,
        component: 'SlotsAllocation',
        isVisible: true,
      },

      {
        id: 13,
        cols: 6,
        rows: 2,
        x: 0,
        y: 8,
        component: 'ServiceTracking',
        isVisible: true,
      },
      {
        id: 14,
        cols: 6,
        rows: 4,
        x: 0,
        y: 2,
        component: 'Liheap',
        isVisible: true,
      },

      {
        id: 15,
        cols: 6,
        rows: 1,
        x: 0,
        y: 2,
        component: 'RentOverages',
        isVisible: true,
      },
      {
        id: 16,
        cols: 6,
        rows: 4,
        x: 0,
        y: 8,
        component: 'DirectMessages',
        isVisible: true,
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
      maxItemCols: 6,
      maxCols: 12,
      rowHeightRatio: 0.5,
      minItemRows: 4,
      minItemArea: 4,
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
