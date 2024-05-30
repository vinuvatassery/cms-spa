/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import {
  HubEventTypes,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { NotificationDataService } from '../infrastructure/notification.data.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  /** Public properties **/
  signalrGeneralNotifications$!: Observable<any>;
  private notificationAndReminderListSubject = new Subject<any>();
  private snoozeReminderSubject = new Subject<any>();
  notificationList$ = this.notificationAndReminderListSubject.asObservable();
  private notificationAndReminderCountListSubject = new Subject<any>();
  notificationListBell$ =
    this.notificationAndReminderCountListSubject.asObservable();
  snoozeReminder$ = this.snoozeReminderSubject.asObservable();
  alertSearchLoaderVisibilitySubject = new Subject<boolean>();
  alertSearchLoaderVisibility$ =
    this.alertSearchLoaderVisibilitySubject.asObservable();

    private reminderSnackbarsSubject = new Subject<any>();
    reminderSnackbarsData$ = this.reminderSnackbarsSubject.asObservable();

  private todoAndReminderFabCountSubject = new Subject<boolean>();
  todoAndReminderFabCount$ = this.todoAndReminderFabCountSubject.asObservable();
  /** Constructor **/
  constructor(
    private readonly notificationDataService: NotificationDataService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private loggingService: LoggingService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService
  ) {
    this.loadReminderSnackbars()
    this.loadSignalrGeneralNotifications();
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.loaderService.hide();
  }
  /** Private methods **/
  private loadSignalrGeneralNotifications() {
    this.signalrGeneralNotifications$ =
      this.signalrEventHandlerService.signalrNotificationsObservable(
        HubEventTypes.GeneralNotification
      );
  }

  loadReminderSnackbars(): void {
    this.notificationDataService
    .loadReminderSnackbars()
    .subscribe({
      next: (response: any) => {
        this.reminderSnackbarsSubject.next(response);       
             
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadNotificationsAndReminders(isViewAll : any): void {
    this.notificationDataService
      .loadNotificationsAndReminders(isViewAll ?? false)
      .subscribe({
        next: (todoGridResponse: any) => {
          this.notificationAndReminderListSubject.next(todoGridResponse);
          if (isViewAll === false) {
            this.notificationAndReminderCountListSubject.next(todoGridResponse);
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  getNotificationsCount(): void {
    this.notificationDataService
      .getNotificationsCount()
      .subscribe({
        next: (response: any) => {  
            this.notificationAndReminderCountListSubject.next(response);         
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
  viewNotifications(notifictaions: any[]): Observable<any> {
    return this.notificationDataService.viewNotifictaions(notifictaions);
  }

  todoAndReminderFabCount(clientId: any): void {
    this.notificationDataService.todoAndReminderFabCount(clientId).subscribe({
      next: (fabCount: any) => {
        this.todoAndReminderFabCountSubject.next(fabCount);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadNotificatioBySearchText(text: string): void {
    this.alertSearchLoaderVisibilitySubject.next(true);
    if (text) {
      this.notificationDataService.searchNotifications(text).subscribe({
        next: (caseBySearchTextResponse) => {
          this.notificationAndReminderListSubject.next(
            caseBySearchTextResponse
          );
          this.alertSearchLoaderVisibilitySubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
    } else {
      this.notificationAndReminderListSubject.next(null);
      this.alertSearchLoaderVisibilitySubject.next(false);
    }
  }

  SnoozeReminder(
    reminderId: any,
    duration: any,
    isViewAll = true,
    isFullDay = true
  ) {
    this.loaderService.show();
    this.notificationDataService
      .SnoozeReminder(reminderId, duration, isFullDay)
      .subscribe({
        next: (snoozeResponse: any) => {
          this.loaderService.hide();
          this.snoozeReminderSubject.next(true);
          this.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            snoozeResponse.message
          );
          if (isViewAll) {
            this.loadNotificationsAndReminders(true);
          } else {
            this.loadNotificationsAndReminders(false);
          }
        },
        error: (err) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
