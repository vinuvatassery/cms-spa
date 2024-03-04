/** Angular **/
import { Component, Input, Output,ChangeDetectionStrategy, EventEmitter } from '@angular/core';


@Component({
  selector: 'productivity-tools-delete-todo-confirmation',
  templateUrl: './delete-todo-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTodoConfirmationComponent {
  @Output() isModalDeleteTodoCloseClicked = new EventEmitter();
  @Output() isModalDeleteTodoClicked = new EventEmitter();
  @Input() userinfo: any;

  onCloseDeleteToDOClicked() 
  {
    this.isModalDeleteTodoCloseClicked.emit(true);
  }
  onDeleteToDOClicked() 
  {
    this.isModalDeleteTodoClicked.emit(true);
  }
}
