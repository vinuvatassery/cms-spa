/** Angular **/
import { Component, Output,ChangeDetectionStrategy, EventEmitter } from '@angular/core';

@Component({
  selector: 'productivity-tools-delete-reminder-confirmation',
  templateUrl: './delete-reminder-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteReminderConfirmationComponent {
  @Output() isModalDeleteReminderCloseClicked = new EventEmitter();

  onCloseDeleteReminderClicked() 
  {
    this.isModalDeleteReminderCloseClicked.emit(true);
  }
}
