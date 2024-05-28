import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable, of } from 'rxjs'; 

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  constructor(private http: HttpClient ,private configurationProvider: ConfigurationProvider) {}

  getRecentlyViewedClients(): Observable<any> {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/general-widgets/recently-viewed-clients`
    );
    
  }

  getRecentlyViewedVendors(): Observable<any> {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/general-widgets/recently-viewed-vendors`
    );
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
          type: 'line'
        },
        {
          name: 'Med Prem',
          data: [75, 130, 170, 220, 100, 180, 50],
          type: 'line'
        },
        {
          name: 'Dental Claims',
          data: [10, 30, 20, 10, 40, 70, 60],
          type: 'line'
        },
        {
          name: 'Dental Prem',
          data: [20, 10, 30, 60, 40, 80, 60],
          type: 'line'
        },
        {
          name: 'Pharm Claim',
          data: [100, 10, 60, 60, 40, 70, 60],
          type: 'line'
        },
      ],
    });
  }

  getActiveClientsByGroup(dashboardId : string, userId : string): Observable<any> {
   
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/client-widgets/${dashboardId}/clients-by-group/${userId}`
    );
    
  }
  getActiveClientsByStatus(dashboardId : string , userId : string) {

    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/client-widgets/${dashboardId}/clients-by-status/${userId}`
    );
    
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
            type: 'column',
            spacing: 0,
          },
          {
            name: 'Replenishment Costs',
            data: [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200],
            type: 'column',
            spacing: 0,
          },
        ],
      },
    });
  }
 

  getPharmacyClaims(dashboardId:string,payload:any): Observable<any> {
    
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/fiscal-widgets/pharmacy-claims/${dashboardId}`,
      payload
    );
   
  }
  getPremiumExpensesByInsurance(dashboardId:any, payload:any): Observable<any> {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/fiscal-widgets/insurance-premium/${dashboardId}`,
      payload
    );
   
  }
  getProgramExpenses(dashboardId : string,payload:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/fiscal-widgets/program-expenses/${dashboardId}`,
      payload
    );
    
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
            stack: true,
          },
          {
            name: 'Replenishment',
            data: [75, 130, 180, 50],
            type: 'column',
            stack: true,
          },
        ],
      },
    });
  }
 
  getTodayGlance(): Observable<any> {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/general-widgets/today-at-glance`
    ); 
    
  }

  loadApplicationCERStats(dashboardId : string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/client-widgets/${dashboardId}/applications-cers-count`
    ); 
  }
  loadActiveClients() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/client-widgets/users`
    ); 
  }
 
 loadinsuranceTypeFPLtats(dashboardId : string) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/app-dashboard/client-widgets/${dashboardId}/fpl-count`
    ); 
  }
}
