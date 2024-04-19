/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Notification } from '../entities/notification';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class NotificationDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadNotifications(): Observable<Notification[]> {
    return of([
      { id: '1', name: 'Lorem ipsum', text: 'Lorem ipsum dolor sit amet' },
      {
        id: '2',
        name: 'At vero eos',
        text: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: '3',
        name: 'Duis autem',
        text: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }

  loadNotificationsAndReminders(isViewAll :boolean) {
    return this.http.get(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/notifications/${isViewAll}`);
  }

  getNotificationsCount() {
    return this.http.get(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/notifications-count`);
  }

  viewNotifictaions(notifications: any[]) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/notifications-viewed`, notifications
    );
  }
  searchNotifications(text: string){  
     const searchData = {text:text}
    return this.http.put<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/search`,searchData );
  }

  SnoozeReminder(reminderId:any,duration:any, isFullDay:boolean) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/snooze-reminder/${reminderId}/${duration}?isFullDay=${isFullDay}`,null);
  }

  todoAndReminderFabCount(clientId:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/alerts/clients/${clientId}/fab-count`,null);
  }
}

