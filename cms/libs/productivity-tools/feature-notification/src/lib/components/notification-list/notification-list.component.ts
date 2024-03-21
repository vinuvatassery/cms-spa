/** Angular **/
import { Component, ChangeDetectionStrategy, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationFacade } from '@cms/productivity-tools/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { BehaviorSubject, Subject } from 'rxjs';
@Component({
  selector: 'productivity-tools-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationListComponent {
  @Output() isLoadReminderAndNotificationEvent = new EventEmitter<any>();
  @Input() notificationList$: any;
  alertsData:any = {};
  @Input()searchNotification$ : any;
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  notificationaAndReminderDataSubject = new Subject<any>();
  gridDataResult!: GridDataResult;
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  @Output() loadNotificationtEvent = new EventEmitter<any>();
  @Output() searchTermTextEvent = new EventEmitter<any>();
  searchTerm = new FormControl();
    /** Lifecycle hooks **/
    ngOnInit(): void {
      this.loadNotificationsAndReminders();
      this.notificationList$.subscribe((data: any) => {
        this.alertsData.items =data?.items ?  data?.items?.filter((item:any) => item.alertTypeCode == 'NOTIFICATION').sort((a : any, b : any) => {
          const dateA = new Date(a.alertDueDate).getTime();
          const dateB = new Date(b.alertDueDate).getTime();
          return dateA - dateB}) : []; // Sorting by alertDueDate in ascending order;
        this.cdr.detectChanges();
      });
      this.searchTerm.valueChanges.subscribe((value) =>{
          this.searchTermTextEvent.emit(value?.trim());
      })
    }
    constructor(
      private cdr : ChangeDetectorRef,
      private notificationFacade: NotificationFacade
    ) {}
  // data: Array<any> = [{}];
  public formUiStyle : UIFormStyle = new UIFormStyle();
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "Snooze",
      icon: "snooze",
      click: (): void => {
      },
    },
 
    
    {
      buttonType:"btn-h-danger",
      text: "Dismiss",
      icon: "notifications_off",
      click: (): void => {
      },
    },
   
    
  ];
  public loadNotificationsAndReminders() {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit({ });
    this.notificationList$.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {
      this.alertsData.items =  data.items.filter((item:any) => item.alertTypeCode == 'NOTIFICATION');
        this.isToDoGridLoaderShow.next(false);
      }
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
  }
}