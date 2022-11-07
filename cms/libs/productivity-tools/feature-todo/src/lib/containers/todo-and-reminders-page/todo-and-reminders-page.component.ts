/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'productivity-tools-todo-and-reminders-page',
  templateUrl: './todo-and-reminders-page.component.html',
  styleUrls: ['./todo-and-reminders-page.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoAndRemindersPageComponent {
  /** Output properties **/
  @Output() closeAction = new EventEmitter();

  /** Public properties **/
  isShowTodoReminders = false;

  /** Public methods **/
  onCloseTodoRemindersClicked() {
    this.closeAction.emit();
    this.isShowTodoReminders = !this.isShowTodoReminders;
  }
}
