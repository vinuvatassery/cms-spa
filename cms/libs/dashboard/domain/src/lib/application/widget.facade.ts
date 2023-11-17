import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WidgetService } from '../infrastructure/widget.service';

@Injectable({ providedIn: 'root' })
export class WidgetFacade {
  private recentlyViewedProfileSubject = new BehaviorSubject<any>([]);
  public recentlyViewedProfileList$ =
    this.recentlyViewedProfileSubject.asObservable();

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
}
