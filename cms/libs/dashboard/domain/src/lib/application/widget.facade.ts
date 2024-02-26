import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WidgetService } from '../infrastructure/widget.service'; 
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class WidgetFacade {
  private recentlyViewedClientsSubject = new Subject<any>();
  public recentlyViewedClientsList$ = this.recentlyViewedClientsSubject.asObservable(); 
 
  private recentlyViewedVendorsSubject = new Subject<any>();
  public recentlyViewedVendorsList$ = this.recentlyViewedVendorsSubject.asObservable(); 
 

  private activeClientsByGroupSubject = new Subject<any>();
  public activeClientsByGroupChart$ = this.activeClientsByGroupSubject.asObservable(); 

   
  private activeClientsByStatusSubject = new Subject<any>();
  public activeClientsByStatusChart$ = this.activeClientsByStatusSubject.asObservable(); 

  private netIncomeSubject =new Subject<any>();
  public netIncomeChart$ = this.netIncomeSubject.asObservable();

  private pharmacyClaimsSubject = new Subject<any>();
  public pharmacyClaimsChart$ = this.pharmacyClaimsSubject.asObservable();

  private premiumExpensesByInsuranceSubject = new Subject<any>();
  public  premiumExpensesByInsuranceChart$ = this.premiumExpensesByInsuranceSubject.asObservable();

  private programExpensesSubject = new Subject<any>();
  public  programExpensesChart$ = this.programExpensesSubject.asObservable();

  private programIncomeSubject = new Subject<any>();
  public  programIncomeChart$ = this.programIncomeSubject.asObservable();

  private todayGlanceSubject =new Subject<any>();
  public  todayGlance$ = this.todayGlanceSubject.asObservable();

  private applicationCERStatsSubject =new Subject<any>();
  public  applicationCERStats$ = this.applicationCERStatsSubject.asObservable();

  private activeClientsOnStatusSubject =new Subject<any>();
  public  activeClientsOnStatus$ = this.activeClientsOnStatusSubject.asObservable();

  private activeClientsOnGroupSubject =new Subject<any>();
  public  activeClientsOnGroup$ = this.activeClientsOnGroupSubject.asObservable();
  private insuranceTypeFPLStatsSubject =new Subject<any>();
  public  insuranceTypeFPLStats$ = this.insuranceTypeFPLStatsSubject.asObservable();

  public selectedDashboardId! : any
  constructor(private widgetService: WidgetService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService) {}
    showSnackBar(type: SnackBarNotificationType, subtitle: any) {
      if (type == SnackBarNotificationType.ERROR) {
          const err = subtitle;
          this.loggingService.logException(err)
      }
      this.snackbarService.manageSnackBar(type, subtitle);
  }
  showLoader(){  this.loaderService.show();}
  hideLoader() { this.loaderService.hide();}



  loadRecentlyViewedClients(): void {
    this.widgetService.getRecentlyViewedClients().subscribe({
      next: (clients: any) => {
        this.recentlyViewedClientsSubject.next(clients);
      },
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadRecentlyViewedVendors(): void {
    this.widgetService.getRecentlyViewedVendors().subscribe({
      next: (clients: any) => {
        this.recentlyViewedVendorsSubject.next(clients);
      },
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadChartData(){
    return this.widgetService.getChartData();
  }

  loadActiveClientsByStatusChart(dashboardId : string  , userId : string) {
    this.widgetService.getActiveClientsByStatus(this.selectedDashboardId,userId).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.clientsByStatus
        
        this.activeClientsByStatusSubject.next(widgetProperties);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadActiveClientsByGroupChart(dashboardId : string, userId : string) {
    this.widgetService.getActiveClientsByGroup(this.selectedDashboardId,userId).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.clientsbyGroup
        
        this.activeClientsByGroupSubject.next(widgetProperties);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
  loadNetIncomeChart() {
    this.widgetService.getNetIncome().subscribe({
      next: (result) => { 
        this.netIncomeSubject.next(result);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadPharmacyClaimsChart(dashboardId:string, payload:any) {
    this.widgetService.getPharmacyClaims(this.selectedDashboardId,payload).subscribe({
      next: (result) => { 
        ;
        let widgetProperties = JSON.parse(result?.widgetProperties);
        
        widgetProperties.chartData.series[0].data = result?.pharmacyClaims
        

        this.pharmacyClaimsSubject.next({widgetProperties, result});
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
  loadPremiumExpensesByInsuranceChart(dashboardId:any, payload:any) {
    this.widgetService.getPremiumExpensesByInsurance(this.selectedDashboardId,payload).subscribe({
      next: (result) => { 
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series = [result?.barSeries]
        this.premiumExpensesByInsuranceSubject.next(widgetProperties);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
  loadProgramExpensesChart(dashboardId:string, payload:any) {
    this.widgetService.getProgramExpenses(this.selectedDashboardId,payload).subscribe({
      next: (result : any) => { 
       
        let widgetProperties = JSON.parse(result.widgetProperties);
        
        widgetProperties.chartData.series = result?.series
        widgetProperties.chartData.categoryAxis.categories = result?.categories
        this.programExpensesSubject.next(widgetProperties);
      },       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadProgramIncomeChart() {
    this.widgetService.getProgramIncome().subscribe({
      next: (result) => { 
        this.programIncomeSubject.next(result);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadTodayGlance() {
    this.widgetService.getTodayGlance().subscribe({
      next: (result) => { 
        this.todayGlanceSubject.next(result);
      },
       
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadApplicationCERStats(dashboardId : string) {
    this.widgetService.loadApplicationCERStats(this.selectedDashboardId).subscribe({
      next: (result) => { 
        this.applicationCERStatsSubject.next(result);
      }, 
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }

  loadInsuranceTypeFPLStats(dashboardId : string) {
    this.widgetService.loadinsuranceTypeFPLtats(this.selectedDashboardId).subscribe({
      next: (result) => { 
        
        this.insuranceTypeFPLStatsSubject.next(result);
      }, 
      error: (error) => {              
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
  loadActivebyStatusClients() {
    this.widgetService.loadActiveClients().subscribe({
      next: (result) => { 
        this.activeClientsOnStatusSubject.next(result);
       
      }, 
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
  loadActivebyGroupClients() {
    this.widgetService.loadActiveClients().subscribe({
      next: (result) => { 
        this.activeClientsOnGroupSubject.next(result);
      }, 
      error: (error) => { 
        this.hideLoader();
        this.showSnackBar(SnackBarNotificationType.ERROR, error)
      },
    });
  }
}
