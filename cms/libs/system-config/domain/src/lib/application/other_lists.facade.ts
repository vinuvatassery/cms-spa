/** Angular **/
import { Injectable } from '@angular/core';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { Subject, first, Observable } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
/** Data services **/
import { SystemConfigOtherListsDataService } from '../infrastructure/other_lists.data.service';

@Injectable({ providedIn: 'root' })
export class SystemConfigOtherListsFacade {
  private loadDomainsListsServiceSubject = new BehaviorSubject<any>([]);
  loadDomainsListsService$ = this.loadDomainsListsServiceSubject.asObservable();

  private loadAssisterGroupsListsServiceSubject = new BehaviorSubject<any>([]);
  loadAssisterGroupsListsService$ =
    this.loadAssisterGroupsListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly systemConfigOtherListsDataService: SystemConfigOtherListsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) {}

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadDomainsLists() {
    this.systemConfigOtherListsDataService.loadDomainsListsService().subscribe({
      next: (response) => {
        this.loadDomainsListsServiceSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadAssisterGroupsLists() {
    this.systemConfigOtherListsDataService
      .loadAssisterGroupsListsService()
      .subscribe({
        next: (response) => {
          this.loadAssisterGroupsListsServiceSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
