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
} from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FinancialVendorFacade, FinancialVendorRefundFacade } from '@cms/case-management/domain';
import { LovFacade } from '@cms/system-config/domain';
import { BehaviorSubject, Subject } from 'rxjs';
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
  // data: Array<any> = [{}];
  medicalProviderSearchLoaderVisibility$ = this.financialVendorFacade.medicalProviderSearchLoaderVisibility$
  providerSearchResult$ =this.financialVendorFacade.searchProvider$ 
  clientSearchLoaderVisibility$ = this.financialRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialRefundFacade.clients$;
  clientSubject = this.financialRefundFacade.clientSubject;
  entityTypeCodeSubject$ = this.lovFacade.entityTypeCodeSubject$;
  notificationaAndReminderDataSubject = new Subject<any>();
  gridToDoItemData$ = this.notificationaAndReminderDataSubject.asObservable();
  @Output() isLoadReminderAndNotificationEvent = new EventEmitter<any>();
  @Input() notificationList$: any;
  reminderFor = '';
  notifications: any = [];
  alertsData:any = {};
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  isToDoGridLoaderShow = new BehaviorSubject<boolean>(true);
  isNotificationPopupOpened = false;
  unViewedCount : number = 0;
  isNewReminderOpened = false;
  isNotificationsAndRemindersOpened = false;
  private newReminderDetailsDialog: any;
  private notificationReminderDialog: any;
  private deleteReminderDialog: any;
  gridDataResult!: GridDataResult;
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
      text: 'Edit Remainder',
      icon: 'edit',
      click: (): void => {
        this.onNewReminderOpenClicked(this.NewReminderTemplate);
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Remainder',
      icon: 'delete',
      click: (): void => {
        this.onDeleteReminderOpenClicked(this.deleteReminderTemplate);
      },
    },
  ];
  /** Constructor **/
  constructor(
    private readonly notificationFacade: NotificationFacade,
    private readonly todoFacade: TodoFacade,
    private loggingService: LoggingService,
    private dialogService: DialogService,
    private reminderFacade: ReminderFacade,
    private sanitizer: DomSanitizer,
    private lovFacade: LovFacade,
    private financialVendorFacade: FinancialVendorFacade,
    private financialRefundFacade: FinancialVendorRefundFacade,
    private cdr : ChangeDetectorRef
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadNotificationsAndReminders();
    this.loadSignalrGeneralNotifications();
    this.loadSignalrReminders();
    this.notificationList$.subscribe((data: any) => {
      this.alertsData = data;
      this.cdr.detectChanges();
      this.loadNotificationsAndReminders;
    });
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
    if (result) {
      this.reminderFor ='';
      this.newReminderDetailsDialog.close();
    }
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

  onNotificationButtonToggleClicked(show?: boolean): void {
    this.isNotificationPopupOpened =
      show !== undefined ? show : !this.isNotificationPopupOpened;
       
     if(this.isNotificationPopupOpened){
        this.viewNotifications();
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

  onReminderDoneClicked(event: any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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

  public loadNotificationsAndReminders() {
    this.isToDoGridLoaderShow.next(true);
    this.isLoadReminderAndNotificationEvent.emit({ });
    this.notificationList$.subscribe((data: any) => {
      this.gridDataResult = data?.items;
      if (data?.totalCount >= 0 || data?.totalCount === -1) {
      this.unViewedCount =  data.items.filter((item:any) => item.recentViewedFlag == 'N')?.length;
        this.isToDoGridLoaderShow.next(false);
      }
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
}
