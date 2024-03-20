/** Angular **/
import { Component, ChangeDetectionStrategy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
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
  constructor(   private cdr : ChangeDetectorRef) {
  
    
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
    console.log('adding ' + days + ' days');
    console.log(date);
    date.setDate(date.getDate() + parseInt(days));
    console.log(date);
    return date;
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
