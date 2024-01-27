/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef, TemplateRef
} from '@angular/core';
/** Facades **/
import { NotificationFacade, ReminderFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { LoggingService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
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
  notifications: any = [];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  isNotificationPopupOpened = false;
  isNewReminderOpened = false;
  isNotificationsAndRemindersOpened = false;
  private newReminderDetailsDialog : any;
  private notificationReminderDialog : any;
  private deleteReminderDialog: any;
  public data = [
    {
      buttonType:"btn-h-primary",
      text: "Snooze",
      icon: "snooze", 
    }, {
      buttonType:"btn-h-danger",
      text: "Discard",
      icon: "notifications_off", 
    }, ];

  public dataTwo = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Remainder",
      icon: "edit",
      click: (): void => {
        this.onNewReminderOpenClicked(this.NewReminderTemplate);

      },
    },
 
    {
      buttonType:"btn-h-danger",
      text: "Delete Remainder",
      icon: "delete",
      click: (): void => {
        this.onDeleteReminderOpenClicked(this.deleteReminderTemplate);
      },
    } 
  ];
  /** Constructor **/
  constructor(
    private readonly notificationFacade: NotificationFacade,
    private readonly todoFacade: TodoFacade,
    private loggingService : LoggingService,
    private dialogService: DialogService,
    private reminderFacade: ReminderFacade,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.loadSignalrGeneralNotifications();
    this.loadSignalrReminders();
  }

  /** Private methods */
  private loadSignalrGeneralNotifications() {
    this.notificationFacade.signalrGeneralNotifications$?.subscribe({
      next: (notificationResponse) => {
        if (notificationResponse?.payload?.signalData) {
          this.notifications.push(notificationResponse?.payload?.signalData);
        }
      },
      error: (err) => {
        this.loggingService.logException(err)
      },
    });
  }

  private loadSignalrReminders() {
    this.todoFacade.signalrReminders$?.subscribe({
      next: (reminderResponse) => {
        if (reminderResponse?.payload?.signalData) {
          this.notifications.push(reminderResponse?.payload?.signalData);
        }
      },
      error: (err) => {
        this.loggingService.logException(err)
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
    if(result){
      this.newReminderDetailsDialog.close()
    }}

    onNewReminderOpenClicked(template: TemplateRef<unknown>): void {
    this.newReminderDetailsDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    }); 
  }

  onNotificationsAndRemindersClosed() {
    this.isNotificationsAndRemindersOpened = false;
    this.notificationReminderDialog.close()
  }

  onNotificationsAndRemindersOpenClicked(template: TemplateRef<unknown>): void {
    this.notificationReminderDialog = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-wid-md-full no_body_padding-modal reminder_modal',
    }); 
    this.isNotificationsAndRemindersOpened = true;
  }
   
 

  onNotificationButtonToggleClicked(show?: boolean): void {
    this.isNotificationPopupOpened =
      show !== undefined ? show : !this.isNotificationPopupOpened;
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

  onReminderDoneClicked(event:any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }
}
