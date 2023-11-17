import { Injectable } from '@angular/core';
import { WidgetRegistry } from '@cms/dashboard/feature-widget';
import { GridsterConfig } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { DashboardContent } from '../..';
import { DashboardWrapperService } from '../infrastructure/dashboard-wrapper.service';

@Injectable({ providedIn: 'root' })
export class DashboardWrapperFacade {
  private dashboardContentListSubject = new BehaviorSubject<DashboardContent[]>(
    []
  );
  public dashboardContentList$ =
    this.dashboardContentListSubject.asObservable();

  private dashboardConfigurationSubject = new BehaviorSubject<GridsterConfig>(
    {}
  );
  public dashboardConfiguration$ =
    this.dashboardConfigurationSubject.asObservable();
  private widgetCoponentCollection = WidgetRegistry;

  constructor(private dashboardWrapperService: DashboardWrapperService) {}

  loadDashboardContent(): void {
    this.dashboardWrapperService.getDashboardContent().subscribe({
      next: (dashboardList) => {
        dashboardList.filter((element) => {
          element.component = this.widgetCoponentCollection[element.component];
        });
        this.dashboardContentListSubject.next(dashboardList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDashboardConfiguration(): void {
    this.dashboardWrapperService.getDashboardConfiguration().subscribe({
      next: (dashboardConfiguration) => {
        this.dashboardConfigurationSubject.next(dashboardConfiguration);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
