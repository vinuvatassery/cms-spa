import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { WidgetFacade } from '@cms/dashboard/domain';
import { NotificationDataFacade } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'dashboard-widget-today-at-a-glance',
  templateUrl: './widget-today-at-a-glance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTodayAtAGlanceComponent implements OnInit, OnDestroy {
  todayGlance: any;
  private notificationReminderDialog: any;
  private destroy$ = new Subject<void>();
  @Input() isEditDashboard!: any;
  @Input() dashboardId! : any 
  @Output() removeWidget = new EventEmitter<string>();
  @Input() focusedTab:any = 'REMINDER';
  isNotificationsAndRemindersOpened = false;
  constructor(private widgetFacade: WidgetFacade , private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private dialogService: DialogService,
  private notificationFacade : NotificationDataFacade) {}

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
          this.cd.detectChanges()
        }
      },
    });
  }

  todoitemsNavigate()
  {
    this.router.navigate([`/productivity-tools/todo-items/list`]);
  }

  pendingApprovalsNavigate()
  {
    this.router.navigate([`/productivity-tools/approval`]);
  }

  directMessagesNavigate()
  {
    this.router.navigate([`/productivity-tools/direct-message`]);
  }

  remindersNavigate(tab: any)
  {
    this.notificationFacade.loadNotificationsAndReminders(tab);
  
  }

  notificationsNavigate(tab: any)
  {
    this.notificationFacade.loadNotificationsAndReminders(tab);
  }
  onNotificationsAndRemindersOpenClicked(template: TemplateRef<unknown>): void {
    this.notificationReminderDialog = this.dialogService.open({
      content: template,
      cssClass:
        'app-c-modal app-c-modal-wid-md-full no_body_padding-modal reminder_modal',
    });
    this.isNotificationsAndRemindersOpened = true;
  } 
  onCloseNotificationsAndReminders(event: any) {
    this.notificationReminderDialog.close();
  }
}
