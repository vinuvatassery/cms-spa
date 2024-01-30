
import { Component,ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { WidgetFacade, } from '@cms/dashboard/domain';  
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'dashboard-widget-client-by-status',
  templateUrl: './widget-client-by-status.component.html',
  styleUrls: ['./widget-client-by-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetClientByStatusComponent implements OnInit, OnDestroy{
  activeClientsByStatus: any; 
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  data = ['Active','Inactive']
  constructor(private widgetFacade: WidgetFacade) {}

  ngOnInit(): void { 
    this.loadActiveClientsByStatusChart();
  }
  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
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
