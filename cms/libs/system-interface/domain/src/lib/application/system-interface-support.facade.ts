import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SystemInterfaceSupportService } from '../infrastructure/system-interface-support.service';
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';
import { SystemInterfaceActivityStatusCode } from '../enums/system-interface-status-type-code';
import { SystemInterfaceActivityStatusCodeDescription } from '../enums/system-interface-status-type-code.description';
import { SystemInterfaceEecProcessTypeCode } from '../enums/system-interface-eec-process-type-code';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceSupportFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueSupportGroup = 'invoiceID';
  public sortSupportGroupList: SortDescriptor[] = [{
    field: this.sortValueSupportGroup,
  }];

  public sortValueDistribution = 'batch';
  public sortDistributionList: SortDescriptor[] = [{
    field: this.sortValueDistribution,
  }];

  public sortValueNotificationCategory = 'batch';
  public sortNotificationCategoryList: SortDescriptor[] = [{
    field: this.sortValueNotificationCategory,
  }];

  private supportGroupSubject = new Subject<any>();

  public supportGroup$ =
    this.supportGroupSubject.asObservable();
  private distributionListsSubject = new Subject<any>();
  public distributionLists$ =
    this.distributionListsSubject.asObservable();
  private notificationCategoryListSubject = new Subject<any>();
  notificationCategoryLists$ =
    this.notificationCategoryListSubject.asObservable();

 

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any, source: NotificationSource = NotificationSource.API) {
    if (type === SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle, source)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(private SystemInterfaceSupportService: SystemInterfaceSupportService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    public intl: IntlService, private service: SystemInterfaceSupportService) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

 

  loadSupportGroup() {
    this.SystemInterfaceSupportService.getSupportGroup().subscribe({
      next: (response) => {
        this.supportGroupSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDistributionLists() {
    this.SystemInterfaceSupportService.getDistributionLists().subscribe({
      next: (response) => {
        this.distributionListsSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadNotificationCategory () {
    this.SystemInterfaceSupportService.loadNotificationCategoryServices().subscribe({
      next: (response) => {
        this.notificationCategoryListSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

   

 
   

}
