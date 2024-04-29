/** Angular **/
import { Injectable } from '@angular/core';
import { LoggingService } from '../api/services/logging.service';
import { NotificationSnackbarService } from './services/notification-snackbar-service';
import { SnackBarNotificationType } from '../enums/snack-bar-notification-type.enum';
import { Subject } from 'rxjs';
/** External libraries **/

@Injectable({ providedIn: 'root' })
export class NotificationDataFacade {
    private notificationAndReminderListDataSubject = new Subject<any>();
    notificationAndReminderDataList$ = this.notificationAndReminderListDataSubject.asObservable();

    /** Constructor**/
    constructor(
        private readonly loggingService: LoggingService,
        private readonly snackbarService: NotificationSnackbarService,
       ) { }

    /** Public methods **/
    showSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.snackbarService.manageSnackBar(type, subtitle);
    }

    loadNotificationsAndReminders(): void {
     this.notificationAndReminderListDataSubject.next(true);
      }
}
