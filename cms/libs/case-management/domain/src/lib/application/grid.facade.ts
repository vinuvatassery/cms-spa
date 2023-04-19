/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { SnackBar } from '@cms/shared/ui-common';
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';

import { GridDataService } from '../infrastructure/grid.data.service';
import { GridState } from '../entities/grid-state';
@Injectable({ providedIn: 'root' })
export class GridFacade {

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

  constructor(private readonly GridDataService: GridDataService,
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
  loadLoginUserGridState(userId:any,gridStateKey:string,moduleCode:string) {
    return this.GridDataService.loadLoginUserGridState(userId,gridStateKey,moduleCode);
  }
  createLoginUserGridState(gridState: GridState) {
    return this.GridDataService.createLoginUserGridState(gridState);
  }

}