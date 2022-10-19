/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'productivity-tools-reminder-item',
  templateUrl: './reminder-item.component.html',
  styleUrls: ['./reminder-item.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderItemComponent {
  /** Public properties **/
  // data: Array<any> = [{}];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';

  public data = [
    {
      buttonType:"btn-h-primary",
      
      icon: "edit",
      click: (): void => {
        // this.onPhoneNumberDetailClicked(true);
      },
    },
    {
      buttonType:"btn-h-danger",
     
      icon: "delete",
      click: (): void => {
      //  this.onDeactivatePhoneNumberClicked()
      },
    },
    // {
    //   // buttonType:"btn-h-danger",
    //   // text: "Discard",
    //   // icon: "notifications_off",
    //   // click: (): void => {
    //   // //  this.onDeactivatePhoneNumberClicked()
    //   // },
    // },
   
   
    
 
  ];

}
