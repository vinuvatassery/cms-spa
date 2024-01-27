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
  isOpenDeleteTodo = false;
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  public deleteToDoDialog: any;
  isToDODeleteActionOpen = false;
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Input() isToDODetailsActionOpen: any;
  @Input()  todoGrid$ :any;

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
    private dialogService: DialogService
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoGrid();
  }

  /** Private methods **/
  private loadTodoGrid() { 
      this.isLoadTodoGridEvent.emit()
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
