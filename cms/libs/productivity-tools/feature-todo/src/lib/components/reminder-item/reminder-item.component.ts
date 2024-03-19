/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { ReminderFacade } from '@cms/productivity-tools/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
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
  alertsData:any = {};
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  notificationaAndReminderDataSubject = new Subject<any>();
  gridDataResult!: GridDataResult;
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  items!:any[]
  isDueWithIn7Days = false;
  @Input() todoAndReminders$! : Observable<any>
  @Output() reminderDetailsClickedEvent = new EventEmitter();
  @Output() deleteReminderOpenClickedEvent = new EventEmitter();
  public data = [
    {
      buttonType: 'btn-h-primary',
      text: 'Done',
      icon: 'check',
      click: (): void => {
        this.onReminderDoneClicked();
      },
    },

    {
      buttonType: 'btn-h-primary',
      text: 'Edit',
      icon: 'edit',
      click: (): void => {
        this.onNewReminderOpenClicked();
      },
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Delete',
      icon: 'delete',
      click: (): void => {
        this.onDeleteReminderOpenClicked();
      },
    },
  ];

  constructor(private reminderFacade: ReminderFacade,
    private cdr : ChangeDetectorRef) {}
  ngOnInit(): void {
    this.loadNotificationsAndReminders();
      this.notificationList$?.subscribe((data: any) => {
        this.alertsData.items =  data.items.filter((item:any) => item.alertTypeCode == 'REMINDER');
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

  onNewReminderOpenClicked() {
    this.reminderDetailsClickedEvent.emit(true);
  }

  onDeleteReminderOpenClicked() {
    this.deleteReminderOpenClickedEvent.emit(true);
  }

  onReminderDoneClicked() {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }
  public loadNotificationsAndReminders() {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit();
    this.notificationList$?.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {
        this.alertsData.items =  data.items.filter((item:any) => item.alertTypeCode == 'REMINDER');
        this.isToDoGridLoaderShow.next(false);
      }
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
  }
}
