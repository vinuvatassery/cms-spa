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
import { NotificationDataFacade, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Subject, catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'dashboard-widget-today-at-a-glance',
  templateUrl: './widget-today-at-a-glance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetTodayAtAGlanceComponent implements OnInit, OnDestroy {
  todayGlance: any;
  todayGlanceTodo: any;
  todayGlanceNotification: any;
  todayGlanceReminder: any;
  todayGlancedirectMessages: any;
  private notificationReminderDialog: any;
  private destroy$ = new Subject<void>();
  @Input() isEditDashboard!: any;
  @Input() dashboardId! : any
  @Output() removeWidget = new EventEmitter<string>();
  @Input() focusedTab:any = 'REMINDER';
  isNotificationsAndRemindersOpened = false;
  pendingApprovalCount = this.widgetFacade.dashboardPendingApprovalCardCount;
  constructor(private widgetFacade: WidgetFacade , private readonly router: Router,
    private readonly cd: ChangeDetectorRef,
    private dialogService: DialogService,
  private notificationFacade : NotificationDataFacade) {}

  removeWidgetCard() {
    this.removeWidget.emit();
  }

  ngOnInit(): void {
    this.loadTodayGlance();
    this.loadPendingApprovalsCount();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  loadTodayGlance() {
    
    const todayGlance = forkJoin({
      todo:  this.loadTodayGlanceTodo(),
      reminders: this.loadTodayGlanceReminders(),
      notifications: this.loadTodayGlanceNotifications(),
      assignedClients : this.loadTodayGlanceAssignedClients(),
      directMessageCount : this.loadTodayGlanceDirectMessageCount()
    });

    todayGlance.subscribe((response: any) => {
      if (response) {
         this.todayGlanceTodo = response.todo
         this.todayGlanceReminder = response.reminders
         this.todayGlanceNotification = response.notifications
         this.todayGlance = response.assignedClients
         this.todayGlancedirectMessages = response.directMessageCount
         this.cd.detectChanges()
      }
    })

  }

  loadTodayGlanceDirectMessageCount(){
    return this.widgetFacade.loadTodayGlanceDirectMessageCount().pipe(
      catchError((error: any) => {
        if (error) {
          this.widgetFacade.showSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(0);      
        }
        return of(0);      
      })
    );
  }
  loadTodayGlanceAssignedClients(){
    return this.widgetFacade.loadTodayGlance().pipe(
      catchError((error: any) => {
        if (error) {
          this.widgetFacade.showSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(0);      
        }
        return of(0);      
      })
    );
  }

  loadTodayGlanceReminders(){
    return this.widgetFacade.loadTodayGlanceReminders().pipe(
      catchError((error: any) => {
        if (error) {
          this.widgetFacade.showSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(0);      
        }
        return of(0);      
      })
    );
  }

  loadTodayGlanceNotifications(){
    return this.widgetFacade.loadTodayGlanceNotification().pipe(
      catchError((error: any) => {
        if (error) {
          this.widgetFacade.showSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(0);      
        }
        return of(0);      
      })
    );
  }

  loadTodayGlanceTodo() {
    return this.widgetFacade.loadTodayGlanceTodo().pipe(
      catchError((error: any) => {
        if (error) {
          this.widgetFacade.showSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
          return of(0);      
        }
        return of(0);      
      })
    );
  }

  loadPendingApprovalsCount()
  {
    this.widgetFacade.dashboardPendingApprovalCardCount$.subscribe({
      next: (response) => {
        if (response) {
          this.pendingApprovalCount = response;
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
    this.router.navigate([`/productivity-tools/direct-message/list`]);
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
