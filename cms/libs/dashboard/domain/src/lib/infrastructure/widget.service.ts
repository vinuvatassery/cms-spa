import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  constructor(private http: HttpClient) {}

  getRecentlyViewedClients(): Observable<any> {
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

  getChartData(): Observable<any> {
    return of({
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
          type: 'line',
          color: 'red',
        },
        {
          name: 'Med Prem',
          data: [75, 130, 170, 220, 100, 180, 50],
          type: 'line',
          color: 'blue',
        },
        {
          name: 'Dental Claims',
          data: [10, 30, 20, 10, 40, 70, 60],
          type: 'line',
          color: 'green',
        },
        {
          name: 'Dental Prem',
          data: [20, 10, 30, 60, 40, 80, 60],
          type: 'line',
          color: 'yellow',
        },
        {
          name: 'Pharm Claim',
          data: [100, 10, 60, 60, 40, 70, 60],
          type: 'line',
          color: 'purple',
        },
      ],
    });
  }

  getActiveClientsByGroup(): Observable<any> {
    return of({
      component: 'ActiveClientsByGroup',
      chartData: {
        title: {
          text: 'ACTIVE CLIENTS BY GROUP',
        },
        legend: {
          position: 'right',
          orientation: 'vertical',
          labels: {
            useSeriesColor: true,
          },
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        chartArea: {
          padding: 0,
          margin: 0,
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
    });
  }
  getActiveClientsByStatus(): Observable<any> {
    return of({
      component: 'ClientByStatus',
      chartData: {
        title: {
          text: 'Active Client By Status',
        },
        legend: {
          position: 'right',
          orientation: 'vertical',
          labels: {
            useSeriesColor: true,
          },
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        chartArea: {
          padding: 0,
          margin: 0,
        },
        series: [
          {
            data: [
              {
                category: 'ACCEPT',
                value: 45,
                color: '#FFD064',
              },
              {
                category: 'PENDING',
                value: 15,
                color: '#ED6363',
              },
              {
                category: 'WAITLIST',
                value: 10,
                color: '#57BAC3',
              },
              {
                category: 'RESTRICTED',
                value: 10,
                color: '#0063A6',
              },
            ],

            type: 'donut',
          },
        ],
      },
    });
  }
  getNetIncome(): Observable<any> {
    return of({
      component: 'netIncome',
      chartData: {
        chartType: 'line',
        title: {
          text: 'Net Income',
        },
        legend: {
          position: 'top',
          orientation: 'horizontal',
          align: 'end',
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        tooltip: {
          visible: true,
          format: '{0}%',
          template: '#= series.name #: #= value #',
        },
        categoryAxis: {
          title: {
            text: 'Month',
          },
          rotation: 'auto',
          spacing: 0,
          categories: [
            '01/21 (1)',
            '01/21 (2)',
            '02/21 (1)',
            '02/21 (2)',
            '03/21 (1)',
            '03/21 (2)',
            '04/21 (1)',
            '04/21 (2)',
            '05/21 (1)',
            '05/21 (2)',
            '06/21 (1)',
          ],
          line: {
            visible: false,
          },
          labels: {
            rotation: 'auto',
          },
        },

        valueAxis: {
          visible: true,
          title: {
            text: 'Dollar Amount in Thousands',
          },
          majorGridLines: { 
            visible: false,
          },
        },
        series: [
          {
            name: 'Insurance Revenue',
            data: [120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220],
            color: '#57C395',
            type: 'column',
            spacing: 0,
          },
          {
            name: 'Replenishment Costs',
            data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
            color: '#F56F7B',
            type: 'column',
            spacing: 0,
          },
        ],
      },
    });
  }
 

  getPharmacyClaims(): Observable<any> {
    
    return of({
      component: 'pharmacyClaims',
      chartData: {
        title: {
          text: 'Pharmacy Claims',
        },
        legend: {
          position: 'right',
          orientation: 'vertical',
          labels: {
            useSeriesColor: true,
          },
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        chartArea: {
          padding: 0,
          margin: 0,
        },
        series: [
          {
            data: [
              {
                category: 'FULL PAY',
                value: 60,
                color: '#FFA35A',
              },
              {
                category: 'REGULAR PAY',
                value: 40,
                color: '#0063A6',
              },
             
            ],

            type: 'donut',
          },
        ],
      },
    });
  }
  getPremiumExpensesByInsurance(): Observable<any> {
    return of({
      component: 'premiumInsurance',
      chartData: {
        title: {
          text: 'Premium Expenses By Insurance',
        },
        legend: {
          visible:false,
          position: 'top',
          orientation: 'horizontal',
          align: 'end',
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        tooltip: {
          visible: true,
          format: '{0}%',
          template: '#= series.name #: #= value #',
        },
        categoryAxis: {
          title: {
            text: 'Month',
          },
          rotation: 'auto',
          spacing: 0,
          categories: [
            'OHP',
            'QHP',
            'Off Exchange',
            'Group',
            'COBRA',
            'VA',
            'Medicare', 
          ],
          line: {
            visible: false,
          },
          labels: {
            rotation: 'auto',
          },
        },

        valueAxis: {
          visible: true,
          title: {
            text: 'Dollar Amount in Thousands',
          },
         
          majorGridLines: { 
            visible: false,
          },
        
        
        },
        series: [
          {
            name: 'Insurance Revenue',
            data: [120, 130, 140, 150, 160, 170, 180],
            color: '#F56F7B',
            type: 'column',
            spacing: 0,
          },
       
        ],
      },
    });
  }
  getProgramExpenses() {
    return of({
      component: 'ProgramExpenses',
      chartData: {
        title: {
          text: 'Program Expenses',
        },
        legend: {
          position: 'top',
          orientation: 'horizontal',
          align: 'end',
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        categoryAxis: {
          title: {
            text: 'Month',
          },
          rotation: 'auto',
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },

        valueAxis: {
          visible: true,
          title: {
            text: 'Dollar Amount in Thousands',
          },
          majorGridLines: { 
            visible: false,
          },
        },

        series: [
          {
            name: 'Med Claims',
            data: [300, 200, 250, 400, 300, 350, 500],
            type: 'line',
            color: 'red',
          },
          {
            name: 'Med Prem',
            data: [75, 130, 170, 220, 100, 180, 50],
            type: 'line',
            color: 'blue',
          },
          {
            name: 'Dental Claims',
            data: [10, 30, 20, 10, 40, 70, 60],
            type: 'line',
            color: 'green',
          },
          {
            name: 'Dental Prem',
            data: [20, 10, 30, 60, 40, 80, 60],
            type: 'line',
            color: 'yellow',
          },
          {
            name: 'Pharm Claim',
            data: [100, 10, 60, 60, 40, 70, 60],
            type: 'line',
            color: 'purple',
          },
        ],
      },
    });
  }
  getProgramIncome() {
    return of({
      component: 'ProgramIncome',
      chartData: {
        title: {
          text: 'Program Income',
        },
        legend: {
          position: 'top',
          orientation: 'horizontal',
          align: 'end',
          markers: {
            type: 'circle',
            width: 10,
            height: 10,
          },
        },
        categoryAxis: {
          title: {
            text: 'Quarter',
          },
          rotation: 'auto',
          categories: ['Q1 2020', 'Q2 2020', 'Q3 2020', 'Q4 2020'],
        },

        valueAxis: {
          visible: true,
          title: {
            text: 'Dollar Amount in Thousands',
          },
          majorGridLines: { 
            visible: false,
          },
        },
        series: [
          {
            name: 'Rebates',
            data: [300, 200, 350, 500],
            type: 'column',
            color: '#57BAC3',
            stack: true,
          },
          {
            name: 'Replenishment',
            data: [75, 130, 180, 50],
            type: 'column',
            color: '#FFD064',
            stack: true,
          },
        ],
      },
    });
  }
 
  getTodayGlance(): Observable<any> {
    return of({
      todoItems: {
        count: 10,
        isVisible: true,
      },
      pendingApprovals: {
        count: 20,
        isVisible: true,
      },
      directMessages: {
        count: 5,
        isVisible: true,
      },
      todayReminder: {
        count: 8,
        isVisible: true,
      },
      newNotification: {
        count: 12,
        isVisible: true,
      },
    });
  }
 
}
