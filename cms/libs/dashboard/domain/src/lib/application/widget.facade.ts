import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WidgetService } from '../infrastructure/widget.service'; 

@Injectable({ providedIn: 'root' })
export class WidgetFacade {
  private recentlyViewedProfileSubject = new BehaviorSubject<any>([]);  
  public recentlyViewedProfileList$ = this.recentlyViewedProfileSubject.asObservable(); 
 
  private activeClientsByGroupSubject = new BehaviorSubject<any>([]);
  public activeClientsByGroupChart$ = this.activeClientsByGroupSubject.asObservable(); 

   
  private activeClientsByStatusSubject = new BehaviorSubject<any>([]);
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

  constructor(private widgetService: WidgetService) {}

  loadRecentlyViewedProfiles(): void {
    this.widgetService.getRecentlyViewedProfiles().subscribe({
      next: (profiles: any) => {
        this.recentlyViewedProfileSubject.next(profiles);
      },
      error: (err: any) => {
        console.error('err', err);
      },
    });
  }
  loadChartData(){
    return this.widgetService.getChartData();
  }

  loadActiveClientsByGroupChart() {
    this.widgetService.getActiveClientsByGroup().subscribe({
      next: (result) => { 
        this.activeClientsByGroupSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }

  loadActiveClientsByStatusChart() {
    this.widgetService.getActiveClientsByStatus().subscribe({
      next: (result) => { 
        this.activeClientsByStatusSubject.next(result);
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

  loadPharmacyClaimsChart() {
    this.widgetService.getPharmacyClaims().subscribe({
      next: (result) => { 
        this.pharmacyClaimsSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
  loadPremiumExpensesByInsuranceChart() {
    this.widgetService.getPremiumExpensesByInsurance().subscribe({
      next: (result) => { 
        this.premiumExpensesByInsuranceSubject.next(result);
      },
       
      error: (err) => { 
        console.error('err', err);
      },
    });
  }
  loadProgramExpensesChart() {
    this.widgetService.getProgramExpenses().subscribe({
      next: (result) => { 
        this.programExpensesSubject.next(result);
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
}
