/** Angular **/
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Entities **/

/** Services **/
import { NotificationService } from '@progress/kendo-angular-notification';

/** Providers **/
import { ConfigurationProvider, ReminderNotificationSnackbarService, ReminderSnackBarNotificationType } from '@cms/shared/util-core';
import { SnackBar } from '@cms/shared/ui-common';
@Component({
  selector: 'productivity-tools-reminder-notification-snack-bar',
  templateUrl: './reminder-notification-snack-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReminderNotificationSnackBarComponent implements OnInit {
 
  @Input() data$!: Observable<SnackBar>;
  public hideAfter = this.configurationProvider.appSettings.snackbarHideAfter;
  public duration =
    this.configurationProvider.appSettings.snackbarAnimationDuration;
 
  @ViewChild('reminderNotificationTemplate', { read: TemplateRef })
  alertTemplate!: TemplateRef<any>;
  snackbarMessage!: SnackBar; 
  @ViewChild('reminderNotificationTemplateContainer', {
    read: ViewContainerRef,
  })
  reminderNotificationTemplateContainer!: ViewContainerRef; 
  isReminderExpand = false;
  isReminderExpands = false;
  isReminderSideOn: any;
  isReminderSideOff: any;
  messageCount : any;
  public data = [
    {
      text: 'Edit Reminder Snooze',
    },
    {
      text: '15 Minutes Snooze',
    },
    {
      text: '30 Minutes Snooze',
    },
    {
      text: '1 Hour Snooze',
    },
  ];

  /** Constructor **/
  constructor(
    private readonly notificationService: NotificationService,
    private configurationProvider: ConfigurationProvider,
    private readonly reminderNotificationSnackbarService: ReminderNotificationSnackbarService,
  ) {}

  /** Lifecycle hooks **/
  ngOnInit(): void {
    this.removePreviousMessage();
    this.reminderSnackBarSubscribe();
  }

  reminderSnackBarSubscribe() {
    this.reminderNotificationSnackbarService.manageSnackBar(ReminderSnackBarNotificationType.LIGHT, '')
    this.reminderNotificationSnackbarService.snackbar$.subscribe({
      next: (res) => {
        if (res) {          
          this.snackbarMessage = res;
          this.notificationService.show({
            content: this.alertTemplate,
            appendTo: this.reminderNotificationTemplateContainer,
            position: { horizontal: 'right', vertical: 'bottom' },
            animation: { type: 'fade', duration: this.duration },
            closable: true,
            type: { style: res.type, icon: true },
            hideAfter: this.hideAfter,
            cssClass: 'reminder-notification-bar',
          });
        }
        this.messageCount = document.getElementsByClassName(
          'k-notification-container ng-star-inserted'
        );
   
      },
     
    });
  }

  public removePreviousMessage() {
    this.showSideReminderNotification();

    const divMessage = document.getElementsByClassName(
      'k-notification-container ng-star-inserted'
    );
    if (divMessage.length > 0) {
      let currentMessage = divMessage.item(0);
      currentMessage?.remove();
    }
  }

  reminderContainerClicked() {
    this.showSideReminderNotification();
    const divMessage = document.getElementsByClassName(
      'k-notification-container ng-star-inserted'
    );
    if (divMessage.length > 1) {
      this.isReminderExpand = !this.isReminderExpand;
    } else {
      this.isReminderExpand = false;
    }
  }
  moveSideReminderNotification() {
    this.isReminderSideOn = document.getElementById('reminder_notify');
    this.isReminderSideOn.classList.add('move_notify_aside');
    this.isReminderSideOn.classList.remove('expand_view');
    this.isReminderSideOn.classList.remove('collapse_view');
    this.isReminderExpand = false;
    this.isReminderExpands = true;
  }

  showSideReminderNotification() {
    this.isReminderSideOff = document.getElementById('reminder_notify');
    this.isReminderSideOff.classList.remove('move_notify_aside');
    this.isReminderExpands = false;
  }
}
