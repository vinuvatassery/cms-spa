/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnackBar } from '@cms/shared/ui-common';
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';

import { LoginUserGridStateDataService } from '../infrastructure/login-user-grid-state.data.service';
import { LoginUserGridState } from '../entities/login-user-grid-state';
@Injectable({ providedIn: 'root' })
export class LoginUserGridStateFacade {

  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  constructor(private readonly loginUserGridStateDataService: LoginUserGridStateDataService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loggingService: LoggingService) { }

  /** Public methods **/

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  loadLoginUserGridState() {
    return this.loginUserGridStateDataService.loadLoginUserGridState();
  }
  createLoginUserGridState(loginUserGridState: LoginUserGridState) {
    return this.loginUserGridStateDataService.createLoginUserGridState(loginUserGridState);
  }

}