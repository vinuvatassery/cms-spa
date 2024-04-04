/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';
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
  @Output() noTodoFor7Days = new EventEmitter<any>()
  @Output() noTodoFor30Days = new EventEmitter<any>()
  @Output() noTodoAfter30Days = new EventEmitter<any>()
  reminderActionPopupClass = 'more-action-dropdown app-dropdown-action-list';
  selectedAlertId =""
  @Output() onMarkAlertAsDoneGridClicked = new EventEmitter<any>();
  @Output() onDeleteAlertGridClicked = new EventEmitter<any>();
  isToDODeleteActionOpen = false;
  @Output() isModalTodoDetailsOpenClicked = new EventEmitter<any>();
  dateFormat = this.configurationProvider.appSettings.dateFormat;
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
    private configurationProvider : ConfigurationProvider,
    public intl: IntlService) {
  
    
  }
  ngOnInit(): void {
    this.todoAndReminders$.subscribe((clientsTodoReminders :any) =>{
      const clientsTodo  = 
      clientsTodoReminders.filter((x:any) => x.alertTypeCode =="TODO")
      if(this.nDays=="DUE WITHIN 7 DAYS"){
           this.items = 
           clientsTodo.filter((x:any)=> this.formatDate(new Date(x.alertDueDate))>= this.formatDate(new Date()) 
           && this.formatDate(new Date(x.alertDueDate)) <= this.addDays(new Date(), 6) )
      this.isDueWithIn7Days = true;
      this.isDueWithIn30Days = false;
      if(this.items.length <=0){
        this.noTodoFor7Days.emit(true);
      }
      }
      if(this.nDays=="DUE WITHIN 30 DAYS"){
          this.items = 
          clientsTodo.filter((x:any)=> this.formatDate(new Date(x.alertDueDate)) >= this.addDays(new Date(), 7) 
          && this.formatDate( new Date(x.alertDueDate)) <= this.addDays(new Date(), 29) )   
     this.isDueWithIn30Days = true
     this.isDueWithIn7Days = false;
     if(this.items.length <=0){
      this.noTodoFor30Days.emit(true);
    }
        }
      if(this.nDays=="DUE LATER"){
        this.items = 
        clientsTodo.filter((x:any)=> this.formatDate(new Date(x.alertDueDate)) >= this.addDays(new Date(), 30) )
        if(this.items.length <=0){
          this.noTodoAfter30Days.emit(true);
        }
        this.isDueWithIn7Days = false;
        this.isDueWithIn30Days = false;
      }
       this.cdr.detectChanges()
    })
  }

  getcssClassName(){
    if(this.isDueWithIn7Days){
      return 'due-item-blocks red-item-block'
    }
    if(this.isDueWithIn30Days){
      return'due-item-blocks canyon-item-block'
    }
   
      return 'due-item-blocks'
    
  }
  formatDate(date:any){
    return new Date(this.intl.formatDate(date, this.dateFormat));
  }
  addDays(date: Date, days: any): Date {
    date.setDate(date.getDate() + parseInt(days));
    return this.formatDate(date);
  }

  onToDoActionClicked(item: any,gridItem: any){ 
    if(item.id == 'done'){
      this.selectedAlertId = gridItem.alertId;
       this.onDoneTodoItem();
    }else if(item.id == 'edit'){ 
        this.selectedAlertId = gridItem.alertId;
          this.onOpenTodoDetailsClicked();
    }
    else if(item.id == 'del'){ 
          this.selectedAlertId = gridItem.alertId;
         this.onDeleteAlertGridClicked.emit(this.selectedAlertId);

    }
  }


  
  onDoneTodoItem(){
    this.onMarkAlertAsDoneGridClicked.emit(this.selectedAlertId);
  }

  onOpenTodoDetailsClicked() {
    this.isModalTodoDetailsOpenClicked.emit(this.selectedAlertId);
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


