import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';
import { Subject, takeUntil } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'dashboard-widget-active-clients-by-group',
  templateUrl: './widget-active-clients-by-group.component.html',
  styleUrls: ['./widget-active-clients-by-group.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetActiveClientsByGroupComponent implements OnInit, OnDestroy {
  activeClientsByGroup: any;
  private destroy$ = new Subject<void>();
  public formUiStyle: UIFormStyle = new UIFormStyle();
  constructor(private widgetFacade: WidgetFacade) {}
  data = ['Group 1', 'Group 2'];

  ngOnInit(): void {
    this.loadActiveClientsByGroupChart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadActiveClientsByGroupChart() {
    this.widgetFacade.loadActiveClientsByGroupChart();
    this.widgetFacade.activeClientsByGroupChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.activeClientsByGroup = response;
          }
        },
      });
  }
}
