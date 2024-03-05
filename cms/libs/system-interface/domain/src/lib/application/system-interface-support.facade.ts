import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
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

  private groupNamesDropDownListSubject = new Subject<any>();
  groupNamesDropDownList$ = this.groupNamesDropDownListSubject.asObservable();

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
    this.service.getSupportGroupList(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.supportGroupSubject.next(gridView);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  private distributionDataLoaderSubject = new BehaviorSubject<boolean>(false);
  distributionDataLoader$ = this.distributionDataLoaderSubject.asObservable();

  loadDistributionGroup(paginationParameters: any) {
    this.distributionDataLoaderSubject.next(true);
    this.service.getDistributionList(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.supportGroupSubject.next(gridView);
        this.distributionDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.distributionDataLoaderSubject.next(false);
        this.hideLoader();
      },
    });
  }

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

    this.systemInterfaceSupportService.addSupportGroup(notificationGroup).subscribe(
      {
        next: (response: any) => {
          this.hideLoader();
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
          this.addSupportGroupSubject.next(response);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      }
    );
    //return this.systemInterfaceSupportService.addSupportGroup(notificationGroup).subscribe();
  }

  supportGroupAdded(): Observable<any> {
    return this.addSupportGroupSubject.asObservable();
  }

  addSupportGroupData(dto: any): Observable<any> {
    return this.systemInterfaceSupportService.addSupportGroup(dto).pipe(
      tap((response: any) => {
        this.addSupportGroupSubject.next(response);
      }),
    );
  }

  loadGroupNamesDropDownList() {
    this.systemInterfaceSupportService.getGroupNamesDropDownList().subscribe({
      next: (response) => {
        this.groupNamesDropDownListSubject.next(response);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

}
