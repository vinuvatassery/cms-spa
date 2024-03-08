/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  Output,
  OnChanges,
  EventEmitter,
  Input,
  ChangeDetectorRef
} from '@angular/core';
/** External libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { Subject } from 'rxjs';
import { UIFormStyle } from '@cms/shared/ui-tpa';
/** Facades **/ 
import { LoaderService } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertTypeCode, TodoFacade } from '@cms/productivity-tools/domain';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
@Component({
  selector: 'productivity-tools-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderListComponent implements  OnChanges{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @ViewChild('reminderDetailsTemplate', { read: TemplateRef })
  reminderDetailsTemplate!: TemplateRef<any>;
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  isOpenDeleteTODOItem = false;
  sortColumn ="alertDueDate";
  sortValue ="alertDueDate";
  isToDODeleteActionOpen = false;
  @Input() isToDODetailsActionOpen: any;
   @Input()todoGrid$ : any;
  @Output() isLoadTodoGridEvent = new EventEmitter<any>();
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  sort: SortDescriptor[] = [{
    field: this.sortColumn,
    dir: 'asc',
  }]
  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  snackbar$ = this.snackbarSubject.asObservable();
  isShowReminderDetailsModal = false;
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  private newReminderDetailsDialog: any;
  public deleteReminderDialog: any;
  public deleteToDoDialog: any;
  gridDataResult!: GridDataResult;
  gridTodoDataSubject = new Subject<any>();
  gridToDoItemData$ = this.gridTodoDataSubject.asObservable();
  @Output() ReminderEventClicked  = new EventEmitter<any>();
  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  todoItemList: any[] = [];
  selectedAlertId:string="";
  public toDoGridState!: State;

  public reminderActions = [
    {
      buttonType: 'btn-h-primary',
      id:'done',
      text: 'Done',
      icon: 'done',
      click: (): void => {
        this.onReminderDoneClicked();
      },
    },
    {
      buttonType: 'btn-h-primary',
      id:'edit',
      text: 'Edit',
      icon: 'edit',
    },
    {
      buttonType: 'btn-h-danger',
      id:'del',
      text: 'Delete',
      icon: 'delete',
    },
  ];

  /** Constructor **/
  constructor( 
    private loaderService: LoaderService,
    private dialogService: DialogService,
    private readonly Todofacade: TodoFacade,
    private cdr : ChangeDetectorRef
  ) {}
  ngOnChanges(): void {
    this.toDoGridState = {
      skip: 0,
      take: 10,
      sort: this.sort,
    };
    this.loadTodoGrid();
  }
  /** Internal event methods **/
  onReminderDoneClicked() { 
    this.ReminderEventClicked.emit();
  }

  onNewReminderClosed(result: any) {
    if (result) {
      this.newReminderDetailsDialog.close();
    }
  }

  onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
      
    });
  }

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.deleteToDoDialog.close();
    }
  }

  onDeleteReminderClosed(result: any) {
    if (result) {
      this.deleteReminderDialog.close();
    }
  }
  onDeleteReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.deleteReminderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  todoItemCrossedDueDate(todoItem:any):boolean{
    let isCrossedDueDate = false;
    var currentDate = new Date();
    var numberOfDaysToAdd = 7;
    var resultDate =new Date(currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd));
    if(new Date(todoItem.alertDueDate) < resultDate){
      isCrossedDueDate = true;
    }
     return isCrossedDueDate;
  }
  private loadTodoGridData(skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string, alertType:string){
      this.loaderService.show;
      const gridDataRefinerValue = {
        SkipCount: skipCountValue,
        MaxResultCount: maxResultCountValue,
        Sorting: sortValue,
        SortType: sortTypeValue,
        Filter: "[]",
      };
        this.isLoadTodoGridEvent.emit({gridDataRefinerValue, alertType})
        this.todoGrid$.subscribe((todoItemList : any) =>{
          this.todoItemList = todoItemList?.items ? todoItemList?.items : [];
          var currentDate = new Date();
          this.todoItemList = this.todoItemList.filter(todoItem => new Date(todoItem.alertDueDate) <= new Date(currentDate.setDate(currentDate.getDate() +30)));
          this.todoItemList.forEach((todoItem:any)=>{
          
            var todayDate = new Date();
            todayDate.setHours(0,0,0);
            var postDate = new Date();
            todoItem.isToday = false;
            todoItem.isTomorrow = false;
            let tomorrow = new Date(postDate.setDate(postDate.getDate() +1));
            if(new Date(todoItem.alertDueDate).toDateString() == todayDate.toDateString()){
              todoItem.isToday = true;
            }
            if(new Date(todoItem.alertDueDate).toDateString() == tomorrow.toDateString()){
              todoItem.isTomorrow = true;
            }
                  
          })
          this.cdr.detectChanges();
        });
  }
  private loadTodoGrid() {
    this.loadTodoGridData(
      this.toDoGridState.skip?? 0,
      this.toDoGridState.take?? 10,
      this.toDoGridState?.sort![0]?.field ?? this.sortValue,
      this.toDoGridState?.sort![0]?.dir ?? 'asc',
      AlertTypeCode.Todo.toString()
    )
  }
  onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
      this.selectedAlertId = gridItem.alertId;
       this.onDoneTodoItem();
     }
    else if(item.id == 'edit'){ 
      if (!this.isToDODetailsActionOpen) {
        this.selectedAlertId = gridItem.alertId;
          this.onOpenTodoDetailsClicked();
        }
     }
    else if(item.id == 'del'){ 
      if (!this.isToDODeleteActionOpen) {
          this.isToDODeleteActionOpen = true;
          this.selectedAlertId = gridItem.alertId;
          this.onOpenDeleteToDoClicked(this.deleteToDODialogTemplate);
        }
    }
  }
 
  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit();
  }
  onDoneTodoItem(){
    this.onMarkAlertAsDoneGridClicked.emit(this.selectedAlertId);
  }
  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      this.onDeleteAlertGridClicked.emit(this.selectedAlertId);
    }
  }
}
