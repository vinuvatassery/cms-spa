/** Angular **/
import { Component,  OnInit,    Output,  ChangeDetectionStrategy,  EventEmitter,  } from '@angular/core';
/** Facades **/
import { TodoFacade } from '@cms/productivity-tools/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
@Component({
  selector: 'productivity-tools-todo-list',
  templateUrl: './todo-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent implements OnInit {
  /** Public properties **/
  todoGrid$ = this.todoFacade.todoGrid$;
  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  private todoItemDetailsDialog: any;
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  public moreactions = [
    {
      buttonType: 'btn-h-primary',
      text: 'Done',
      icon: 'done',
      click: (): void => {
        console.log('test');
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (): void => {
        this.onOpenTodoDetailsClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (): void => {
        this.onOpenDeleteTodoClicked();
      },
    },
  ];

  /** Constructor **/
  constructor(
    private readonly todoFacade: TodoFacade,
    private dialogService: DialogService
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoGrid();
  }

  /** Private methods **/
  private loadTodoGrid() {
    this.todoFacade.loadTodoGrid();
  }

  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit();
  }

  onCloseDeleteTodoClicked() {
    this.isOpenDeleteTodo = false;
  }

  onOpenDeleteTodoClicked() {
    this.isOpenDeleteTodo = true;
  }
}
