import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WidgetService } from '../infrastructure/widget.service';
import { WidgetChartModel } from '../entities/widget-chart';

@Injectable({ providedIn: 'root' })
export class WidgetFacade {
  private recentlyViewedProfileSubject = new BehaviorSubject<any>([]);  
  public recentlyViewedProfileList$ = this.recentlyViewedProfileSubject.asObservable(); 
 
  private activeClientsByGroupSubject = new BehaviorSubject<any>([]);

  public activeClientsByGroup$ =
    this.activeClientsByGroupSubject.asObservable(); 

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
}
