/** Angular **/
import {
  Component,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Input,
  EventEmitter,
} from '@angular/core';
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
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  todoGrid$ = this.todoFacade.todoGrid$;
  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public deleteToDoDialog: any;
  isToDODeleteActionOpen = false;
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Input() isToDODetailsActionOpen: any;

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
        if (!this.isToDODetailsActionOpen) {
          this.onOpenTodoDetailsClicked();
        }
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (): void => {
        if (!this.isToDODeleteActionOpen) {
          this.isToDODeleteActionOpen = true;
          this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
        }
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

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
    }
  }
}
