/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
/** Facades **/
import { NotificationFacade, TodoFacade } from '@cms/productivity-tools/domain';
import { LoggingService } from '@cms/shared/util-core';

@Component({
  selector: 'productivity-tools-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationPanelComponent implements OnInit {
  /** Public properties **/
  @ViewChild('anchor') anchor!: ElementRef;
  @ViewChild('popup', { read: ElementRef }) popup!: ElementRef;
  // data: Array<any> = [{}];
  notifications: any = [];
  popupClass1 = 'more-action-dropdown app-dropdown-action-list';
  isNotificationPopupOpened = false;
  isNewReminderOpened = false;
  isNotificationsAndRemindersOpened = false;
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
      text: "Discard",
      icon: "notifications_off",
      click: (): void => {
      },
    },
   
    
  ];

  public dataTwo = [
    {
      buttonType:"btn-h-primary",
      text: "Edit Remainder",
      icon: "edit",
      click: (): void => {
      },
    },
 
    {
      buttonType:"btn-h-danger",
      text: "Delete Remainder",
      icon: "delete",
      click: (): void => {
      },
    } 
  ];
  /** Constructor **/
  constructor(
    private readonly notificationFacade: NotificationFacade,
    private readonly todoFacade: TodoFacade,
    private loggingService : LoggingService
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

  onNewReminderClosed() {
    this.isNewReminderOpened = false;
  }

  onNewReminderOpenClicked() {
    this.isNewReminderOpened = true;
  }

  onNotificationsAndRemindersClosed() {
    this.isNotificationsAndRemindersOpened = false;
  }

  onNotificationsAndRemindersOpenClicked() {
    this.isNotificationsAndRemindersOpened = true;
  }

  onNotificationButtonToggleClicked(show?: boolean): void {
    this.isNotificationPopupOpened =
      show !== undefined ? show : !this.isNotificationPopupOpened;
  }
}
