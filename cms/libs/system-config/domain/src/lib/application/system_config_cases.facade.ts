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
import { SystemConfigCasesDataService } from '../infrastructure/system_config_cases.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemConfigCasesFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueEligibilityChecklist = 'creationTime'; 
  public sortEligibilityChecklistGrid: SortDescriptor[] = [{
    field: this.sortValueEligibilityChecklist,
  }];

  public sortValueDomain = 'creationTime'; 
  public sortDomainGrid: SortDescriptor[] = [{
    field: this.sortValueDomain,
  }];

  private loadDomainsListsServiceSubject = new BehaviorSubject<any>([]);
  loadDomainsListsService$ = this.loadDomainsListsServiceSubject.asObservable();

  private loadEligibilityChecklistsListsServiceSubject = new BehaviorSubject<any>([]);
  loadEligibilityChecklistsListsService$ =
    this.loadEligibilityChecklistsListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly systemConfigCasesDataService: SystemConfigCasesDataService,
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
    this.systemConfigCasesDataService.loadDomainsListsService().subscribe({
      next: (response) => {
        this.loadDomainsListsServiceSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadEligibilityChecklistsLists() {
    this.systemConfigCasesDataService
      .loadEligibilityChecklistsListsService()
      .subscribe({
        next: (response) => {
          this.loadEligibilityChecklistsListsServiceSubject.next(response);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
