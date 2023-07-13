/** Angular **/
import { Component, ChangeDetectionStrategy, TemplateRef, Output, EventEmitter } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'productivity-tools-reminder-item',
  templateUrl: './reminder-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderItemComponent {
  /** Public properties **/
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public newReminderDetailsDialog: any;
  public deleteReminderDialog: any;
  @Output() reminderDetailsClickedEvent = new EventEmitter();
  @Output() deleteReminderOpenClickedEvent = new EventEmitter();
  
 

  /** Constructor **/
  constructor() {}
 

  onNewReminderOpenClicked( )  { 
    this.reminderDetailsClickedEvent.emit(true)
  }

  onDeleteReminderOpenClicked(){
    this.deleteReminderOpenClickedEvent.emit(true)

  }

}
