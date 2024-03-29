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
  ElementRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { NotificationFacade, ReminderFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { ConfigurationProvider, LoggingService,SnackBarNotificationType, } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { IntlService } from '@progress/kendo-angular-intl';
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
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$= this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  searchProviderSubject = this.financialVendorFacade.searchProviderSubject
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  items!:any[]
  reminderFor = '';
  notifications: any = [];
  alertsData:any = {};
  isNotificationPopupOpened = false;
  unViewedCount : number = 0;
  selectedAlertId =""
  isNewReminderOpened = false;
  isNotificationsAndRemindersOpened = false;
  private notificationReminderDialog: any;
  isEdit= false
  isReminderOpenClicked = false
  reminderDialog! :any
  crudText ="Create New"
  isDueWithIn7Days = false;
  isDueWithIn30Days = false;
  isDueWithAfter30Days = false;
  @Output() noReminderFor7Days = new EventEmitter<any>()
  @Output() noReminderFor30Days = new EventEmitter<any>()
  @Output() noReminderAfter30Days = new EventEmitter<any>()
  @Input() todoAndReminders$! : Observable<any>
  @Output() onEditReminderClickedEvent = new EventEmitter();
  @Output() onDeleteAlertGridClicked = new EventEmitter();
  @Output() onSnoozeReminderEvent = new EventEmitter<any>();
  getTodo$ = this.todoFacade.getTodo$;
  @ViewChild('newReminderTemplate', { read: TemplateRef })
  newReminderTemplate!: TemplateRef<any>;
  @ViewChild('anchor') anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) popup!: ElementRef;
  @ViewChild('deleteReminderTemplate', { read: TemplateRef })
  deleteReminderTemplate!: TemplateRef<any>;
  @ViewChild('NewReminderTemplate', { read: TemplateRef })
  NewReminderTemplate!: TemplateRef<any>;
  isDelete = false
  @Output() noTodoFor7Days = new EventEmitter<any>()
  @Output() noTodoFor30Days = new EventEmitter<any>()
  @Output() noTodoAfter30Days = new EventEmitter<any>()
  dateFormat = this.configurationProvider.appSettings.dateFormat;
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
  constructor(private reminderFacade: ReminderFacade,
    private readonly notificationFacade: NotificationFacade,
    private cdr : ChangeDetectorRef,
    private dialogService: DialogService,
    private todoFacade : TodoFacade,
    public intl: IntlService,
    private configurationProvider : ConfigurationProvider,
   private loggingService: LoggingService,
   private sanitizer: DomSanitizer,
   private lovFacade: LovFacade,
   private financialVendorFacade: FinancialVendorFacade,
   private financialRefundFacade: FinancialVendorRefundFacade,
) {}
  ngOnInit(): void {
    this.loadNotificationsAndReminders();
      this.notificationList$?.subscribe((data: any) => {
        this.items =data?.items ?  data?.items?.filter((item:any) => item.alertTypeCode == 'REMINDER').sort((a : any, b : any) => {
          const dateA = new Date(a.alertDueDate).getTime();
          const dateB = new Date(b.alertDueDate).getTime();
          return dateA - dateB}) : []; // Sorting by alertDueDate in ascending order;
        this.cdr.detectChanges();
      });
    this.todoAndReminders$?.subscribe((clientsTodoReminders :any) =>{
      const clientsReminder  = 
      clientsTodoReminders.filter((x:any) => x.alertTypeCode =="REMINDER")
   
      if(this.nDays=="DUE WITHIN 7 DAYS"){
           this.items = 
        clientsReminder.filter((x:any)=> this.formatDate(new Date(x.alertDueDate)) >= this.formatDate(new Date()) 
                                        && this.formatDate(new Date(x.alertDueDate)) <= this.addDays(new Date(), 7) )
      this.isDueWithIn7Days = true
      this.isDueWithIn30Days = false;
         this.isDueWithAfter30Days = false;
      if(this.items.length<=0){
      this.noReminderFor7Days.emit(true)
      }
      }
      if(this.nDays=="DUE WITHIN 30 DAYS"){
          this.items = 
        clientsReminder.filter((x:any)=> this.formatDate(new Date(x.alertDueDate)) >= this.addDays(new Date(), 8) 
                                    && this.formatDate(new Date(x.alertDueDate)) <= this.addDays(new Date(), 30) )   
         
         if(this.items.length<=0){
            this.noReminderFor30Days.emit(true);
         }
         this.isDueWithIn7Days = false;
         this.isDueWithIn30Days = true;
         this.isDueWithAfter30Days = false;
                                  }
      if(this.nDays=="DUE LATER"){
        this.items = 
        clientsReminder.filter((x:any)=> this.formatDate(new Date(x.alertDueDate)) >= this.addDays(new Date(), 31) )
        this.isDueWithIn7Days = false
      this.isDueWithIn30Days = false;
         this.isDueWithAfter30Days = true;
        if(this.items.length<=0){
        this.noReminderAfter30Days.emit(true)
        }
      }
      if(!this.nDays){
        this.items = clientsTodoReminders
      }
       this.cdr.detectChanges()
    })
  }
  formatDate(date:any){
    return new Date(this.intl.formatDate(date, this.dateFormat));
  }

  getcssClassName(){
    if(this.isDueWithIn7Days){
      return 'card-list_items red-item-block'
    }
    if(this.isDueWithIn30Days){
      return' card-list_items canyon-item-block'
    }  
      return ' card-list_items'   
  }

  addDays(date: Date, days: any): Date {
    date.setDate(date.getDate() + parseInt(days));
    return this.formatDate(date);
  }
  onGetTodoItem($event:any){
    this.todoFacade.getTodoItem($event);
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
        duration: 1
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
    }
    if(item.id == '3daysnooze'){
      const snoozeReminder={
        reminderId:gridItem.alertId,
        duration: 3
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
    }
    if(item.id == '7daysnooze'){ 
      const snoozeReminder={
        reminderId:gridItem.alertId,
        duration: 7
      }
      this.onSnoozeReminderEvent.emit(snoozeReminder);
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
  onNewReminderClosed(result: any) {
    if (result) {
      this.reminderFor ='';
      this.isDelete = false;
      this.isEdit = false;
      this.crudText ="Create New"
      this.isLoadReminderAndNotificationEvent.emit(true)
    }
    this.isReminderOpenClicked = false
    this.newReminderDetailsDialog.close();
  }
  onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
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
      'Item  updated to Done successfully');
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
    onGetTodoItemData(event:any){
      this.todoFacade.getTodoItem(event)
    }
    formatTime(time: string): string {
      if (!time) return ''; 
      const [hours, minutes] = time.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedTime = `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${period}`;
      return formattedTime;
    }
}
