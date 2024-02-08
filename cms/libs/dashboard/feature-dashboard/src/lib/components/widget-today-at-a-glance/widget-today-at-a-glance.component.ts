import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
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
  constructor(private widgetFacade: WidgetFacade , private readonly router: Router) {}

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

  todoitemsNavigate()
  {
    this.router.navigate([`/productivity-tools/todo-items`]);
  }

  pendingApprovalsNavigate()
  {
    this.router.navigate([`/productivity-tools/approval`]);
  }

  directMessagesNavigate()
  {
    this.router.navigate([`/productivity-tools/direct-message`]);
  }

  remindersNavigate()
  {
    this.router.navigate([`/productivity-tools/todo-items`]);
  }

  notificationsNavigate()
  {
    this.router.navigate([`/productivity-tools/todo-items`]);
  }
}
