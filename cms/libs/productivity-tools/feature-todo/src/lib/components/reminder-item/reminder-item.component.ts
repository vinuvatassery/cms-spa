/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { ReminderFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
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
  public data = [
    {
      buttonType: 'btn-h-primary',
      text: 'Done',
      icon: 'check',
      click: (): void => {
        this.onReminderDoneClicked();
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (): void => {
        this.onNewReminderOpenClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (): void => {
        this.onDeleteReminderOpenClicked();
      },
    },
  ];

  constructor(private reminderFacade: ReminderFacade) {}
  onNewReminderOpenClicked() {
    this.reminderDetailsClickedEvent.emit(true);
  }

  onDeleteReminderOpenClicked() {
    this.deleteReminderOpenClickedEvent.emit(true);
  }

  onReminderDoneClicked() {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }
}
