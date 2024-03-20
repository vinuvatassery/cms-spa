/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {  NotificationFacade, ReminderFacade } from '@cms/productivity-tools/domain';
import {  SnackBarNotificationType } from '@cms/shared/util-core'; 

@Component({
  selector: 'productivity-tools-notification-and-reminder-page',
  templateUrl: './notification-and-reminder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAndReminderPageComponent {
  notificationList$ = this.notificationFacade.notificationList$;
  alert$ = this.notificationFacade.alert$;
  constructor(
    private reminderFacade: ReminderFacade,
    public notificationFacade: NotificationFacade, 
  ) {}

  onReminderDoneClicked(event:any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }
  onloadReminderAndNotificationsGrid(){
    this.notificationFacade.loadNotificationsAndReminders();
  }
}
