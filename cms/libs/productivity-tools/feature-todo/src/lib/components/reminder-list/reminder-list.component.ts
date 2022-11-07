/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import {
  DateInputSize,
  DateInputRounded,
  DateInputFillMode,
} from '@progress/kendo-angular-dateinputs';

@Component({
  selector: 'productivity-tools-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderListComponent {
  public size: DateInputSize = 'medium';
  public rounded: DateInputRounded = 'full';
  public fillMode: DateInputFillMode = 'outline';
  
  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  isShowReminderDetailsModal = false;
  // reminderActions: Array<any> = [{}];
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';

  public reminderActions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
        this.onDoneClicked();
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      //  this.onSendNewEmailClicked()
      },
    },
    // {
    //   buttonType:"btn-h-danger",
    //   text: "Delete",
    //   icon: "delete",
    //   click: (): void => {
    //   //  this.onNewSMSTextClicked()
    //   },
    // },
    
 
  ];

  /** Internal event methods **/
  onDoneClicked() {
    const snackbarMessage: SnackBar = {
      title: 'Notification message!',
      subtitle: 'Sub title goes here.',
      type: 'success',
    };
    this.snackbarSubject.next(snackbarMessage);
  }

  onCloseReminderClicked() {
    this.isShowReminderDetailsModal = false;
  }

  onAddReminderClicked() {
    this.isShowReminderDetailsModal = true;
  }
}
