/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
  TemplateRef,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
/** Facades **/
import {
  NotificationFacade,
  ReminderFacade,
  TodoFacade,
} from '@cms/productivity-tools/domain';
import {
  LoggingService,
  SnackBarNotificationType,
  NotificationDataFacade
} from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
@Component({
  selector: 'productivity-tools-notification-panel',
  templateUrl: './notification-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPanelComponent implements OnInit {
  /** Public properties **/
  @ViewChild('anchor') anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) popup!: ElementRef;
  @ViewChild('deleteReminderTemplate', { read: TemplateRef })
  deleteReminderTemplate!: TemplateRef<any>;
  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  @ViewChild('notificationsAndRemindersDialog', { read: TemplateRef })
  notificationsAndRemindersDialog!: TemplateRef<any>;
  // data: Array<any> = [{}];
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$= this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  notificationaAndReminderDataSubject = new Subject<any>();
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  @Output() isLoadReminderAndNotificationEvent = new EventEmitter<any>();
  @Output() onSnoozeReminderEvent = new EventEmitter<any>();
  @Input() notificationList$: any;
  @Input() notificationListBell$ : any
  reminderFor = '';
  itemsLoader = false;
  isViewAll = true;
  notifications: any = [];
  skeletonCounts = [1,2,3];
  alertsData:any = {};
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  notificationAndReminderDataList$ = this.notificationDataFacade.notificationAndReminderDataList$;
  isNotificationPopupOpened = false;
  unViewedCount : number = 0;
  selectedAlertId =""
  isNewReminderOpened = false;
  isNotificationsAndRemindersOpened = false;
  private newReminderDetailsDialog: any;
  private notificationReminderDialog: any;
  private deleteReminderDialog: any;
  gridDataResult!: GridDataResult;
  isEdit= false
  isDelete = false
  isReminderOpenClicked = false
  getTodo$ = this.todoFacade.getTodo$
  crudText ="Create New"
  notificationAndReminderPageTab="NOTIFICATION";
  notificationListSubscription = new Subscription();

  public data = [
    {
      buttonType: 'btn-h-primary',
      text: 'Snooze',
      icon: 'snooze',
    },
    {
      buttonType: 'btn-h-danger',
      text: 'Discard',
      icon: 'notifications_off',
    },
  ];

  public dataTwo = [
    {
      buttonType: 'btn-h-primary',
      text: 'Edit Reminder',
      icon: 'edit',
      id:'edit',
      click: (): void => {
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: '1 Day Snooze',
      icon: 'snooze',
      id:'1daysnooze',
      click: (): void => {
         
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: '3 Days Snooze',
      icon: 'snooze',
      id:'3daysnooze',
      click: (): void => {
        
      },
    },
    {
      buttonType: 'btn-h-primary',
      text: '7 Days Snooze',
      icon: 'snooze',
      id:'7daysnooze',
      click: (): void => {
        
      },
    }, 
    {
      buttonType: 'btn-h-danger',
      text: 'Delete Reminder',
      icon: 'delete',
      id:'delete',
      click: (): void => {
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly notificationFacade: NotificationFacade,
    private readonly notificationDataFacade: NotificationDataFacade,
    private readonly todoFacade: TodoFacade,
    private loggingService: LoggingService,
    private dialogService: DialogService,
    private reminderFacade: ReminderFacade,
    private lovFacade: LovFacade,
    private financialVendorFacade: FinancialVendorFacade,
    private financialRefundFacade: FinancialVendorRefundFacade,
    private cdr : ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.notificationFacade.getNotificationsCount()
    this.loadNotificationsAndReminders();
      this.notificationList$.subscribe((data: any) => {
        this.alertsData = data;
        this.cdr.detectChanges();
      });
      this.notificationAndReminderDataList$.subscribe((data: any) => {
       if(data){
        this.notificationAndReminderPageTab = data;
        this.onNotificationsAndRemindersOpenClicked(this.notificationsAndRemindersDialog);
       }
        this.cdr.detectChanges();
      });
      
    this.loadSignalrGeneralNotifications();
    this.loadSignalrReminders();
  }

  /** Private methods */
  private loadSignalrGeneralNotifications() {
    this.notificationFacade.signalrGeneralNotifications$?.subscribe({
      next: (notificationResponse) => {
        if (notificationResponse?.payload?.alertText) {
          this.notifications.push(notificationResponse?.payload?.alertText);
        }
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  private loadSignalrReminders() {
    this.todoFacade.signalrReminders$?.subscribe({
      next: (reminderResponse) => {
        if (reminderResponse?.payload?.alertText) {
          this.notifications.push(reminderResponse?.payload?.alertText);
        }
      },
      error: (err) => {
        this.loggingService.logException(err);
      },
    });
  }

  private contains(target: any): boolean {
    return (
      this.anchor.nativeElement.contains(target) ||
      (this.popup ? this.popup.nativeElement.contains(target) : false)
    );
  }

  /** Internal event methods **/
  @HostListener('document:click', ['$event'])
  documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.onNotificationButtonToggleClicked(false);
    }
  }

  @HostListener('keydown', ['$event'])
  keydown(event: any): void {
    this.onNotificationButtonToggleClicked(false);
  }

  onNewReminderClosed(result: any) {
    this.reminderFor ='';
    this.isDelete = false;
    this.isEdit = false;
    this.crudText ="Create New"
    if (result) {
      this.isLoadReminderAndNotificationEvent.emit(true)
    }
    this.isReminderOpenClicked = false
    this.newReminderDetailsDialog.close();

  }

  onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-lg app-c-modal-np',
    });
  }

  onNotificationsAndRemindersClosed() {
    this.isNotificationsAndRemindersOpened = false;
    this.notificationReminderDialog.close();
  }

  onNotificationsAndRemindersOpenClicked(template: TemplateRef<unknown>): void {
    this.notificationReminderDialog = this.dialogService.open({
      content: template,
      cssClass:
        'app-c-modal app-c-modal-wid-md-full no_body_padding-modal reminder_modal',
    });
    this.isNotificationsAndRemindersOpened = true;
  } 

  onCloseNotificationsAndReminders(event: any) {
    this.notificationReminderDialog.close();
  }
  onNotificationButtonToggleClicked(show?: boolean): void {
    this.isNotificationPopupOpened =
      show !== undefined ? show : !this.isNotificationPopupOpened;
     if(this.isNotificationPopupOpened){
      this.itemsLoader = true;
      this.isViewAll = false;
      this.loadNotificationsAndReminders(this.isViewAll);
      this.notificationListSubscription = this.notificationList$.subscribe((data: any) => {
        if(data){
          this.itemsLoader = false;
        }
        this.alertsData = data;
        this.cdr.detectChanges();
        this.viewNotifications();
      });
      }
      else
      {
        this.notificationListSubscription.unsubscribe();
      }
      this.isViewAll = true;
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

  onReminderDoneClicked(event: any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }

  sanitizeHtml(html: string) {
    return html;
  }

  searchClientName(event:any){
    this.financialRefundFacade.loadClientBySearchText(event);
  }

  searchProvider(data:any){
    this.financialVendorFacade.searchAllProvider(data);
  }

  remainderFor(event:any){
  this.reminderFor = event
  }

  getReminderDetailsLov(){
    this.lovFacade.getEntityTypeCodeLov()
    }

  public loadNotificationsAndReminders(isViewAll? : any) {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit(isViewAll);
    this.notificationList$.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {    
        this.isToDoGridLoaderShow.next(false);
      }
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
    this.notificationListBell$.subscribe((data: any) => {
      this.unViewedCount =  !isNaN(data) ? data : 0
      this.notificationaAndReminderDataSubject.next(this.gridDataResult);
    });
  }
  viewNotifications ()
  {
    const viewedNotifications = this.alertsData.items?.slice(0,3);
      this.notificationFacade.viewNotifications(viewedNotifications)
      .subscribe({
        next: (x:any) =>{
          if(x){
            this.unViewedCount = 0;
          }
        }
      });
  }

  onGetTodoItemData(event:any){
    this.todoFacade.getTodoItem(event)
  }

  onActionClicked(item: any,gridItem: any){ 
    this.selectedAlertId = gridItem.alertId
    if(item.text == 'Edit Reminder'){ 
      this.isEdit=true
      this.crudText = 'Edit'
       if (!this.isReminderOpenClicked) {
           this.onNewReminderOpenClicked(this.NewReminderTemplate)
         }
     }
     if(item.text == 'Delete Reminder'){
      this.isDelete= true 
      this.crudText = 'Delete'
       if (!this.isReminderOpenClicked) {
        this.onNewReminderOpenClicked(this.NewReminderTemplate)
         }
     } 
     if(item.id == '1daysnooze' ){
      const snoozeReminder={
        reminderId:gridItem.alertId,
        duration: 1,
        isViewAll :false
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
    }
    if(item.id == '3daysnooze'){ 
      const snoozeReminder={
        reminderId:gridItem.alertId,
        duration: 3,
        isViewAll :false
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
    }
    if(item.id == '7daysnooze'){ 
      const snoozeReminder={
        reminderId:gridItem.alertId,
        duration: 7,
        isViewAll :false
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
    }
   }
   toggleDescription(message: any) {
    message.showFullDescription = !message.showFullDescription;
  }
  formatTime (time: string): string {
    if (!time) return ''; 
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
    return formattedTime;
  }
}
