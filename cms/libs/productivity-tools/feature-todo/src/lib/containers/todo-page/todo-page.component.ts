/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'productivity-tools-todo-page',
  templateUrl: './todo-page.component.html',
  styleUrls: ['./todo-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoPageComponent {
  /** Public properties **/
  isOpenTodo = false;

  /** Public methods **/
  onCloseTodoClicked() {
    this.isOpenTodo = false;
  }

  onOpenTodoClicked() {
    this.isOpenTodo = true;
  }
}
