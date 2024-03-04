/** Angular **/
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
/** External libraries **/
/** Data services **/
import { SnackBar } from '@cms/shared/ui-common';
import {
  NotificationSnackbarService,
  SnackBarNotificationType,
  LoggingService,
  LoaderService,
} from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ReminderFacade {
  /** Private properties **/

  /** Public properties **/

  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  clientFacadesnackbar$ = this.snackbarSubject.asObservable();

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService
  ) {}

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
}
