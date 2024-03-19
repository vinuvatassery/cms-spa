/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubEventTypes } from '@cms/shared/util-core';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { NotificationDataService } from '../infrastructure/notification.data.service';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  /** Public properties **/
  signalrGeneralNotifications$!: Observable<any>;
  private notificationAndReminderListSubject = new Subject<any>();
  notificationList$ = this.notificationAndReminderListSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly notificationDataService: NotificationDataService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService
  ) {
    this.loadSignalrGeneralNotifications();
  }

  /** Private methods **/
  private loadSignalrGeneralNotifications() {
    this.signalrGeneralNotifications$ =
      this.signalrEventHandlerService.signalrNotificationsObservable(
        HubEventTypes.GeneralNotification
      );
  }

  loadNotificationsAndReminders(): void {
    this.notificationDataService.loadNotificationsAndReminders().subscribe({
      next: (todoGridResponse: any) => {
        this.notificationAndReminderListSubject.next(todoGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  viewNotifications(notifictaions: any[]): Observable<any> {
       
    return this.notificationDataService.viewNotifictaions(notifictaions);
  }
}
