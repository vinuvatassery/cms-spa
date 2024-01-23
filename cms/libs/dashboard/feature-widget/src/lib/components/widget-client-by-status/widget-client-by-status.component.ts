
import { Component,ChangeDetectionStrategy, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { WidgetFacade, WidgetChartModel, } from '@cms/dashboard/domain';
import { DashboardChartComponent } from '@cms/dashboard/feature-dashboard';
import { PlaceholderDirective } from '@cms/shared/ui-common';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'cms-widget-client-by-status',
  templateUrl: './widget-client-by-status.component.html',
  styleUrls: ['./widget-client-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClientByStatusComponent implements OnInit, OnDestroy{
  activeClientsByStatus: any; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadActiveClientsByStatusChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadActiveClientsByStatusChart() {
    this.widgetFacade.loadActiveClientsByStatusChart();
    this.widgetFacade.activeClientsByStatusChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.activeClientsByStatus = response;
          }
        }
      });
  }
}
