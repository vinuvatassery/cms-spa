import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WidgetService } from '../infrastructure/widget.service'; 

@Injectable({ providedIn: 'root' })
export class WidgetFacade {
  private recentlyViewedClientsSubject = new BehaviorSubject<any>([]);  
  public recentlyViewedClientsList$ = this.recentlyViewedClientsSubject.asObservable(); 
 
  private recentlyViewedVendorsSubject = new BehaviorSubject<any>([]);  
  public recentlyViewedVendorsList$ = this.recentlyViewedVendorsSubject.asObservable(); 
 

  private activeClientsByGroupSubject = new BehaviorSubject<any>([]);
  public activeClientsByGroupChart$ = this.activeClientsByGroupSubject.asObservable(); 

   
  private activeClientsByStatusSubject = new Subject<any>();
  public activeClientsByStatusChart$ = this.activeClientsByStatusSubject.asObservable(); 

  private netIncomeSubject = new BehaviorSubject<any>([]);
  public netIncomeChart$ = this.netIncomeSubject.asObservable();

  private pharmacyClaimsSubject = new BehaviorSubject<any>([]);
  public pharmacyClaimsChart$ = this.pharmacyClaimsSubject.asObservable();

  private premiumExpensesByInsuranceSubject = new BehaviorSubject<any>([]);
  public  premiumExpensesByInsuranceChart$ = this.premiumExpensesByInsuranceSubject.asObservable();

  private programExpensesSubject = new BehaviorSubject<any>([]);
  public  programExpensesChart$ = this.programExpensesSubject.asObservable();

  private programIncomeSubject = new BehaviorSubject<any>([]);
  public  programIncomeChart$ = this.programIncomeSubject.asObservable();

  private todayGlanceSubject = new BehaviorSubject<any>([]);
  public  todayGlance$ = this.todayGlanceSubject.asObservable();

  private applicationCERStatsSubject = new BehaviorSubject<any>([]);
  public  applicationCERStats$ = this.applicationCERStatsSubject.asObservable();

  private insuranceTypeFPLStatsSubject = new BehaviorSubject<any>([]);
  public  insuranceTypeFPLStats$ = this.insuranceTypeFPLStatsSubject.asObservable();

  constructor(private widgetService: WidgetService) {}




  loadRecentlyViewedClients(): void {
    this.widgetService.getRecentlyViewedClients().subscribe({
      next: (clients: any) => {
        this.recentlyViewedClientsSubject.next(clients);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadRecentlyViewedVendors(): void {
    this.widgetService.getRecentlyViewedVendors().subscribe({
      next: (clients: any) => {
        this.recentlyViewedVendorsSubject.next(clients);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }

  loadChartData(){
    return this.widgetService.getChartData();
  }

  loadActiveClientsByStatusChart(dashboardId : string  , myClients : boolean) {
    this.widgetService.getActiveClientsByStatus(dashboardId,myClients).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.clientsByStatus
        
        this.activeClientsByStatusSubject.next(widgetProperties);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadActiveClientsByGroupChart(dashboardId : string, myClients : boolean) {
    this.widgetService.getActiveClientsByGroup(dashboardId,myClients).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.clientsbyGroup
        
        this.activeClientsByGroupSubject.next(widgetProperties);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
  loadNetIncomeChart() {
    this.widgetService.getNetIncome().subscribe({
      next: (result) => { 
        this.netIncomeSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadPharmacyClaimsChart(dashboardId:string, payload:any) {
    this.widgetService.getPharmacyClaims(dashboardId,payload).subscribe({
      next: (result) => { 
        ;
        let widgetProperties = JSON.parse(result?.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.pharmacyClaims
        

        this.pharmacyClaimsSubject.next({widgetProperties, result});
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
  loadPremiumExpensesByInsuranceChart(dashboardId:any, payload:any) {
    this.widgetService.getPremiumExpensesByInsurance(dashboardId,payload).subscribe({
      next: (result) => { 
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series = [result?.barSeries]
        this.premiumExpensesByInsuranceSubject.next(widgetProperties);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
  loadProgramExpensesChart(dashboardId:string, payload:any) {
    this.widgetService.getProgramExpenses(dashboardId,payload).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series = result?.series
        widgetProperties.chartData.categoryAxis.categories = result?.categories
        this.programExpensesSubject.next(widgetProperties);
      },       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadProgramIncomeChart() {
    this.widgetService.getProgramIncome().subscribe({
      next: (result) => { 
        this.programIncomeSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadTodayGlance() {
    this.widgetService.getTodayGlance().subscribe({
      next: (result) => { 
        this.todayGlanceSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadApplicationCERStats(dashboardId : string) {
    this.widgetService.loadApplicationCERStats(dashboardId).subscribe({
      next: (result) => { 
        this.applicationCERStatsSubject.next(result);
      }, 
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadInsuranceTypeFPLStats(dashboardId : string) {
    this.widgetService.loadinsuranceTypeFPLtats(dashboardId).subscribe({
      next: (result) => { 
        this.insuranceTypeFPLStatsSubject.next(result);
      }, 
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
}
