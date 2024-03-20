/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import {  ReminderFacade } from '@cms/productivity-tools/domain';
import {  SnackBarNotificationType } from '@cms/shared/util-core'; 

@Component({
  selector: 'productivity-tools-notification-and-reminder-page',
  templateUrl: './notification-and-reminder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAndReminderPageComponent {
  constructor(
    private reminderFacade: ReminderFacade,
  ) {}

  onReminderDoneClicked(event:any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }
}
