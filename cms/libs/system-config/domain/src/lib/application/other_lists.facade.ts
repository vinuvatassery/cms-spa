/** Angular **/
import { Injectable } from '@angular/core';
import {
  ConfigurationProvider,
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
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemConfigOtherListsFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueAssisterGroup = 'creationTime'; 
  public sortAssisterGroupGrid: SortDescriptor[] = [{
    field: this.sortValueAssisterGroup,
  }];

  public sortValueDomain = 'creationTime'; 
  public sortDomainGrid: SortDescriptor[] = [{
    field: this.sortValueDomain,
  }];

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
    private readonly loaderService: LoaderService,
    private readonly configurationProvider: ConfigurationProvider
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
