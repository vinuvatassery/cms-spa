import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { SystemInterfaceSupportService } from '../infrastructure/system-interface-support.service';
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceSupportFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueSupportGroup = 'groupName';
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
  public supportGroup$ = this.supportGroupSubject.asObservable();


  private distributionListsSubject = new Subject<any>();
  public distributionLists$ = this.distributionListsSubject.asObservable();

  private notificationCategoryListSubject = new Subject<any>();
  notificationCategoryLists$ = this.notificationCategoryListSubject.asObservable();

  private addSupportGroupSubject = new Subject<any>();
  addSupportGroup$ = this.addSupportGroupSubject.asObservable();

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any, source: NotificationSource = NotificationSource.API) {
    if (type === SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle, source)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(private systemInterfaceSupportService: SystemInterfaceSupportService,
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



  loadSupportGroup(paginationParameters: any) {
    this.showLoader();
    this.service.getSupportGroupList( paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.supportGroupSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  // loadBatchLogsList(interfaceTypeCode: string, displayAll: boolean, paginationParameters: any) {
  //   this.batchLogsDataLoaderSubject.next(true);
  //   this.service.loadBatchLogsList(interfaceTypeCode, displayAll, paginationParameters).subscribe({
  //     next: (dataResponse: any) => {
  //       const gridView: any = {
  //         data: dataResponse['items'],
  //         total: dataResponse?.totalCount,
  //       };
  //       this.activityEventLogListSubject.next(gridView);
  //       this.batchLogsDataLoaderSubject.next(false);
  //     },
  //     error: (err) => {
  //       this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
  //       this.batchLogsDataLoaderSubject.next(false);
  //       this.hideLoader();
  //     },
  //   });
  // }

  loadDistributionLists() {
    this.systemInterfaceSupportService.getDistributionLists().subscribe({
      next: (response) => {
        this.distributionListsSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }
  loadNotificationCategory() {
    this.systemInterfaceSupportService.loadNotificationCategoryServices().subscribe({
      next: (response) => {
        this.notificationCategoryListSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

  addSupportGroup(notificationGroup: any) {
    return this.systemInterfaceSupportService.addSupportGroup(notificationGroup);
  }

  supportGroupAdded(): Observable<any>  {
    return this.addSupportGroupSubject.asObservable();
  }

  addSupportGroupData(dto: any): Observable<any> {
    return this.systemInterfaceSupportService.addSupportGroup(dto).pipe(
      tap((response: any) => {
        this.addSupportGroupSubject.next(response);
      }),
    );
  }

}
