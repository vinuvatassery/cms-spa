import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output, 
} from '@angular/core';
import { WidgetFacade } from '@cms/dashboard/domain';
import { Subject, takeUntil } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SeriesLabelsContentArgs } from '@progress/kendo-angular-charts';
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
  @Input() isEditDashboard!: any; 
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}
  data = ['Group 1', 'Group 2'];



 
  ngOnInit(): void {
    this.loadActiveClientsByGroupChart();
  }

  public labelContent(e: SeriesLabelsContentArgs): string {
    return `${e.category}: \n ${e.value}%`;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  removeWidgetCard(){
    this.removeWidget.emit();
  }
  loadActiveClientsByGroupChart() {
    this.widgetFacade.loadActiveClientsByGroupChart("e2301551-610c-43bf-b7c9-9b623ed425c3");
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
