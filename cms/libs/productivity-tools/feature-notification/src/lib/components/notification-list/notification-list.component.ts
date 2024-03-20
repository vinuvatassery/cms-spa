/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'productivity-tools-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
  // data: Array<any> = [{}];
  public formUiStyle : UIFormStyle = new UIFormStyle();
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "Snooze",
      icon: "snooze",
      click: (): void => {
      },
    },
 
    
    {
      buttonType:"btn-h-danger",
      text: "Dismiss",
      icon: "notifications_off",
      click: (): void => {
      },
    },
   
    
  ];

}
