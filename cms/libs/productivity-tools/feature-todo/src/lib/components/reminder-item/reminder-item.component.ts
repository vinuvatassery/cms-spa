/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'productivity-tools-reminder-item',
  templateUrl: './reminder-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderItemComponent {
  /** Public properties **/
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';

  public data = [
    {
      buttonType:"btn-h-primary",
      
      icon: "edit",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-danger",
     
      icon: "delete",
      click: (): void => {
      },
    }
  ];

}
