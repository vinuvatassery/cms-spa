/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
/** Facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  /** Public properties **/
  todoGrid$ = this.todoFacade.todoGrid$;
  isOpenDeleteTodo = false;
  isOpenTodo = false;
  // moreactions: Array<any> = [{ text: 'Action' }];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';


  
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
       this.onOpenTodoDetailsClicked()
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
      this.onOpenDeleteTodoClicked()
      },
    },
    
 
  ];

  /** Constructor **/
  constructor(private readonly todoFacade: TodoFacade) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoGrid();
  }

  /** Private methods **/
  private loadTodoGrid() {
    this.todoFacade.loadTodoGrid();
  }

  /** Internal event methods **/
  onCloseTodoDetailsClicked() {
    this.isOpenTodo = false;
  }

  onOpenTodoDetailsClicked() {
    this.isOpenTodo = true;
  }

  onCloseDeleteTodoClicked() {
    this.isOpenDeleteTodo = false;
  }

  onOpenDeleteTodoClicked() {
    this.isOpenDeleteTodo = true;
  }
}
