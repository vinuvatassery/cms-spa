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
import { AlertFrequencyTypeCode } from '@cms/productivity-tools/domain';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** Facades **/
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { Subject } from 'rxjs';
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
  gridDataResult!: GridDataResult;
  gridTodoDataSubject = new Subject<any>();
  gridToDoItemData$ = this.gridTodoDataSubject.asObservable();
  dateFormat= this.configurationProvider.appSettings.dateFormat
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
    private dialogService: DialogService,
    private configurationProvider: ConfigurationProvider
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadTodoGrid();
  }

  /** Private methods **/
  private loadTodoGrid() { 
    const gridDataRefinerValue = {
      SkipCount: 0,
      MaxResultCount: 20,
      Sorting: "alertduedate",
      SortType: "desc",
      Filter: "[]",
    };
      this.isLoadTodoGridEvent.emit(gridDataRefinerValue)
      this.todoGrid$.subscribe((data: any) => {
        this.gridDataResult = data.items;
        this.gridTodoDataSubject.next(this.gridDataResult);
      });
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
  public get alertFrequencyTypes(): typeof AlertFrequencyTypeCode {
    return AlertFrequencyTypeCode;
  }
}
