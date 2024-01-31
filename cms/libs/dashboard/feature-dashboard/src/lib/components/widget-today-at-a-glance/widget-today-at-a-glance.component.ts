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

@Component({
  selector: 'dashboard-widget-today-at-a-glance',
  templateUrl: './widget-today-at-a-glance.component.html',
  styleUrls: ['./widget-today-at-a-glance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTodayAtAGlanceComponent implements OnInit, OnDestroy {
  todayGlance: any;
  private destroy$ = new Subject<void>();
  @Input() isEditDashboard!: any;
  @Output() removeWidget = new EventEmitter<string>();
  constructor(private widgetFacade: WidgetFacade) {}

  removeWidgetCard() {
    this.removeWidget.emit();
  }

  ngOnInit(): void {
    this.loadTodayGlance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadTodayGlance() {
    this.widgetFacade.loadTodayGlance();
    this.widgetFacade.todayGlance$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response) {
          this.todayGlance = response;
        }
      },
    });
  }
}
