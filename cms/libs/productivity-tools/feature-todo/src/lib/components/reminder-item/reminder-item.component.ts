/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ReminderFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
@Component({
  selector: 'productivity-tools-reminder-item',
  templateUrl: './reminder-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderItemComponent implements OnInit {
  /** Public properties **/
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public newReminderDetailsDialog: any;
  public deleteReminderDialog: any;
  @Input() nDays =""
  @Output() isLoadReminderAndNotificationEvent = new EventEmitter<any>();
  @Input() notificationList$: any;
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  notificationaAndReminderDataSubject = new Subject<any>();
  gridDataResult!: GridDataResult;
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  items!:any[]
  isDueWithIn7Days = false;
  @Input() todoAndReminders$! : Observable<any>
  @Output() onEditReminderClickedEvent = new EventEmitter();
  @Output() onDeleteAlertGridClicked = new EventEmitter();
  getTodo$ = this.todoFacade.getTodo$;

  @ViewChild('newReminderTemplate', { read: TemplateRef })
  newReminderTemplate!: TemplateRef<any>;
  reminderDialog! :any
  isEdit = false;
  selectedAlertId!:any
  isDelete = false
  isReminderOpenClicked= false
  public data = [
    {
      buttonType: 'btn-h-primary',
      text: 'Snooze',
      icon: 'check',
      click: (): void => {
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (): void => {
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (): void => {
      },
    },
  ];

  constructor(private reminderFacade: ReminderFacade,
    private cdr : ChangeDetectorRef,
    private dialogService: DialogService,
    private todoFacade : TodoFacade) {}
  ngOnInit(): void {
    this.loadNotificationsAndReminders();
      this.notificationList$?.subscribe((data: any) => {
        this.items =  data.items.filter((item:any) => item.alertTypeCode == 'REMINDER');
        this.cdr.detectChanges();
        this.loadNotificationsAndReminders;
      });
    this.todoAndReminders$?.subscribe((clientsTodoReminders :any) =>{
      const clientsReminder  = 
      clientsTodoReminders.filter((x:any) => x.alertTypeCode =="REMINDER")
   
      if(this.nDays=="DUE WITHIN 7 DAYS"){
           this.items = 
        clientsReminder.filter((x:any)=> new Date(x.alertDueDate) >= new Date() && new Date(x.alertDueDate) <= this.addDays(new Date(), 7) )
      this.isDueWithIn7Days = true
      }
      if(this.nDays=="DUE WITHIN 30 DAYS"){
          this.items = 
        clientsReminder.filter((x:any)=> new Date(x.alertDueDate) >= this.addDays(new Date(), 8) && new Date(x.alertDueDate) <= this.addDays(new Date(), 30) )   
      }
      if(this.nDays=="DUE LATER"){
        this.items = 
        clientsReminder.filter((x:any)=> new Date(x.alertDueDate) >= this.addDays(new Date(), 31) )
      }
      if(!this.nDays){
        this.items = clientsTodoReminders
      }
       this.cdr.detectChanges()
    })
  }


  addDays(date: Date, days: any): Date {
    date.setDate(date.getDate() + parseInt(days));
    return date;
  }


  onGetTodoItem($event:any){
    this.todoFacade.getTodoItem($event);
  }


  onActionClicked(item: any,gridItem: any){ 
   if(item.text == 'Edit'){ 
      if (!this.isReminderOpenClicked) {
          this.onEditReminderClickedEvent.emit(gridItem.alertId);
          this.isReminderOpenClicked = false
        }
    }
    if(item.text == 'Delete'){ 
      if (!this.isReminderOpenClicked) {
          this.onDeleteAlertGridClicked.emit(gridItem.alertId);
          this.isReminderOpenClicked = false
        }
    }
   
  }
  public loadNotificationsAndReminders() {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit();
    this.notificationList$?.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {
        this.items =  data.items.filter((item:any) => item.alertTypeCode == 'REMINDER');
        this.isToDoGridLoaderShow.next(false);
      }
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
  }
}
