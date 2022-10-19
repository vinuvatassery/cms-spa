/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'productivity-tools-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  /** Public properties **/
  data: Array<any> = [{}];
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
        // this.onDoneClicked();
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      //  this.onOpenTodoDetailsClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
      // this.onOpenDeleteTodoClicked()
      },
    },
    
 
  ];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
}
