/** Angular **/
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import {  NotificationFacade, ReminderFacade } from '@cms/productivity-tools/domain';
import {  SnackBarNotificationType } from '@cms/shared/util-core'; 

@Component({
  selector: 'productivity-tools-notification-and-reminder-page',
  templateUrl: './notification-and-reminder-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAndReminderPageComponent {
  notificationList$ = this.notificationFacade.notificationList$;
  @Input() focusedTab:any = 'NOTIFICATION';
  @Output() closeDialog = new EventEmitter<void>();
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
  onloadReminderAndNotificationsGrid(isViewAll : boolean){
    this.notificationFacade.loadNotificationsAndReminders(isViewAll);
  }
  onListenSearchTerm(searchedValue:any){
    if(searchedValue){
      this.notificationFacade.loadNotificatioBySearchText(searchedValue);
    }else {
      this.onloadReminderAndNotificationsGrid(true);
    }
    
  }
  onCloseDialog(event: any) : void {
    this.closeDialog.emit();
  }
}
