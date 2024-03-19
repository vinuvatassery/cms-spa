/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'productivity-tools-todo-item',
  templateUrl: './todo-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent implements OnInit {
  @Input() nDays =""
  items!:any[]
  isDueWithIn7Days = false;
  isDueWithIn30Days = false;
  isDueAfter30Days = false;
  @Input() todoAndReminders$! : Observable<any>
  @Output() loadReminders = new EventEmitter()
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  selectedAlertId =""
  isToDODetailsActionOpen = false
  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  isToDODeleteActionOpen = false;
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  deleteToDoDialog!:any
  @ViewChild('deleteToDODialogTemplate', { read: TemplateRef })
  deleteToDODialogTemplate!: TemplateRef<any>;
  public todoActions = [
    {
      buttonType: 'btn-h-primary',
      id:'done',
      text: 'Done',
      icon: 'done',
      click: (): void => {
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

  constructor(   private cdr : ChangeDetectorRef,
    private dialogService : DialogService) {
  
    
  }
  ngOnInit(): void {
    this.todoAndReminders$.subscribe((clientsTodoReminders :any) =>{
      const clientsTodo  = 
      clientsTodoReminders.filter((x:any) => x.alertTypeCode =="TODO")
   
      if(this.nDays=="DUE WITHIN 7 DAYS"){
           this.items = 
           clientsTodo.filter((x:any)=> new Date(x.alertDueDate) >= new Date() && new Date(x.alertDueDate) <= this.addDays(new Date(), 7) )
      this.isDueWithIn7Days = true
      }
      if(this.nDays=="DUE WITHIN 30 DAYS"){
          this.items = 
          clientsTodo.filter((x:any)=> new Date(x.alertDueDate) >= this.addDays(new Date(), 8) && new Date(x.alertDueDate) <= this.addDays(new Date(), 30) )   
     this.isDueWithIn30Days = true
        }
      if(this.nDays=="DUE LATER"){
        this.items = 
        clientsTodo.filter((x:any)=> new Date(x.alertDueDate) >= this.addDays(new Date(), 31) )
      }
       this.cdr.detectChanges()
    })
  }

  addDays(date: Date, days: any): Date {
    date.setDate(date.getDate() + parseInt(days));
    return date;
  }

  loadReminder(){
this.loadReminders.emit()
  }

  onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
      this.selectedAlertId = gridItem.alertId;
       this.onDoneTodoItem();
    }else if(item.id == 'edit'){ 
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

  onOpenDeleteToDoClicked(template: TemplateRef<unknown>): void {
    this.deleteToDoDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }
  
  onDoneTodoItem(){
    this.onMarkAlertAsDoneGridClicked.emit(this.selectedAlertId);
  }

  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
  }

  onCloseDeleteToDoClicked(result: any) {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
    }
  }

  onDeleteToDOClicked(result: any) 
  {
    if (result) {
      this.isToDODeleteActionOpen = false;
      this.deleteToDoDialog.close();
      this.onDeleteAlertGridClicked.emit(this.selectedAlertId);
    }
  }

  /** Public properties **/
  data: Array<any> = [{}];
  public moreactions = [
    {
      buttonType:"btn-h-primary",
      text: "Done",
      icon: "done",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-primary",
      text: "Edit",
      icon: "edit",
      click: (): void => {
      },
    },
    {
      buttonType:"btn-h-danger",
      text: "Delete",
      icon: "delete",
      click: (): void => {
      },
    },
    
 
  ];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
}


