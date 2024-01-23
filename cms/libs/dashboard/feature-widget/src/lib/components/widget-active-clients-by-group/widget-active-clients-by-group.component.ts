import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WidgetChartModel } from '@cms/dashboard/domain';
import { DashboardChartComponent } from '@cms/dashboard/feature-dashboard';
import { PlaceholderDirective } from '@cms/shared/ui-common';
import { WidgetFacade } from '@cms/dashboard/domain';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'cms-widget-active-clients-by-group',
  templateUrl: './widget-active-clients-by-group.component.html',
  styleUrls: ['./widget-active-clients-by-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetActiveClientsByGroupComponent implements OnInit, OnDestroy {
  activeClientsByGroup: any;
  activeClientsByGroup$ = this.widgetFacade.activeClientsByGroup$; 
  private destroy$ = new Subject<void>();
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadActiveClientsByGroupChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadActiveClientsByGroupChart() {
    this.widgetFacade.loadActiveClientsByGroupChart();
    this.widgetFacade.activeClientsByGroup$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.activeClientsByGroup = response;
          }
        }
      });
  }

}
