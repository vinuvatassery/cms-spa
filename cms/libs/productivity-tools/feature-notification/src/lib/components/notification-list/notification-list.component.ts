/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'productivity-tools-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
  // data: Array<any> = [{}];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "Snooze",
      icon: "snooze",
      click: (): void => {
        // this.onPhoneNumberDetailClicked(true);
      },
    },
 
    
    {
      buttonType:"btn-h-danger",
      text: "Discard",
      icon: "notifications_off",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
   
    
  ];

}
