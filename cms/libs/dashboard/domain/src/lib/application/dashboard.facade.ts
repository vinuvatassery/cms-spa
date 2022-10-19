/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Dashboard } from '../entities/dashboard';
/** Data services **/
import { DashboardDataService } from '../infrastructure/dashboard.data.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  /** Private  properties **/
  private dashboardSubject = new BehaviorSubject<Dashboard[]>([]);

  /** Public properties **/
  dashboard$ = this.dashboardSubject.asObservable();

  /** Constructor **/
  constructor(private readonly dashboardDataService: DashboardDataService) {}

  /** Public methods **/
  loadDashboard(): void {
    this.dashboardDataService.loadDashboard().subscribe({
      next: (dashboardResponse) => {
        this.dashboardSubject.next(dashboardResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
