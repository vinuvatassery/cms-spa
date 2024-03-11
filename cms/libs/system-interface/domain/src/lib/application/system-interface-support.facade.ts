import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { SystemInterfaceSupportService } from '../infrastructure/system-interface-support.service';
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceSupportFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueSupportGroup = 'groupName';
  public sortSupportGroupList: SortDescriptor[] = [{
    field: this.sortValueSupportGroup,
  }];

  public sortValueDistribution = 'firstName';
  public sortDistributionList: SortDescriptor[] = [{
    field: this.sortValueDistribution,
  }];

  public sortValueNotificationCategory = 'notifcationCategoryId';
  public sortNotificationCategoryList: SortDescriptor[] = [{
    field: this.sortValueNotificationCategory,
  }];

  private supportGroupSubject = new Subject<any>();
  public supportGroup$ = this.supportGroupSubject.asObservable();


  private addSupportGroupSubject = new Subject<any>();
  addSupportGroup$ = this.addSupportGroupSubject.asObservable();

  private editSupportGroupSubject = new Subject<boolean>();
  editSupportGroup$ = this.editSupportGroupSubject.asObservable();

  private supportGroupReactivateSubject = new Subject<any>();
  supportGroupReactivate$ = this.supportGroupReactivateSubject.asObservable();

  private supportGroupListDataLoaderSubject = new BehaviorSubject<boolean>(false);
  supportGroupListDataLoader$ = this.supportGroupListDataLoaderSubject.asObservable();

  private supportGroupRemoveSubject = new Subject<any>();
  supportGroupRemove$ = this.supportGroupRemoveSubject.asObservable();

  private supportGroupProfilePhotoSubject = new Subject();
  supportGroupProfilePhoto$ = this.supportGroupProfilePhotoSubject.asObservable();

  // distribution list ----------------------------------------
  private distributionListsSubject = new Subject<any>();
  public distributionLists$ = this.distributionListsSubject.asObservable();

  private addDistributionListUserSubject = new Subject<any>();
  addDistributionListUser$ = this.addDistributionListUserSubject.asObservable();

  private distributionListDataLoaderSubject = new BehaviorSubject<boolean>(false);
  distributionListDataLoader$ = this.distributionListDataLoaderSubject.asObservable();
  //----------------------------------------


  // Notification Category 

  private notificationCategorySubject = new Subject<any>();
  public notificationCategories$ = this.notificationCategorySubject.asObservable();

  private addnotificationCategorySubject = new Subject<any>();
  addnotificationCategory$ = this.addnotificationCategorySubject.asObservable();

  private editNotificationCategorySubject = new Subject<boolean>();
  editnotificationCategory$ = this.editNotificationCategorySubject.asObservable();

  private notificationCategoryReactivateSubject = new Subject<any>();
  notificationCategoryReactivate$ = this.notificationCategoryReactivateSubject.asObservable();

  private notificationCategoryListDataLoaderSubject = new BehaviorSubject<boolean>(false);
  notificationCategoryListDataLoader$ = this.notificationCategoryListDataLoaderSubject.asObservable();

  private notificationCategoryRemoveSubject = new Subject<any>();
  notificationCategoryRemove$ = this.notificationCategoryRemoveSubject.asObservable();

  private notificationCategoryListSubject = new Subject<any>();
  notificationCategoryLists$ = this.notificationCategoryListSubject.asObservable();



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
    private readonly userManagementFacade: UserManagementFacade,
    public intl: IntlService) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadSupportGroup(paginationParameters: any) {

    this.supportGroupListDataLoaderSubject.next(true);
    this.systemInterfaceSupportService.getSupportGroupList(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.supportGroupSubject.next(gridView);
        this.loadSupportGroupDistinctUserIdsAndProfilePhoto(gridView?.data);
        this.supportGroupListDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.supportGroupListDataLoaderSubject.next(false);
      },
    });
  }


  addSupportGroup(notificationGroup: any) {
    this.loaderService.show();
    this.systemInterfaceSupportService.addSupportGroup(notificationGroup).subscribe(
      {
        next: (response: any) => {
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.addSupportGroupSubject.next(true);
        },
        error: (err) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      }
    );
  }


  editSupportGroup(notificationGroup: any) {

    this.loaderService.show();
    let notificationGroupId = notificationGroup.notificationGroupId;
    return this.systemInterfaceSupportService.editSupportGroup(notificationGroupId, notificationGroup).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.editSupportGroupSubject.next(true);
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.hideLoader();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }



  changeSupportGroupStatus(notificationGroupId: any, status: boolean) {
    this.showLoader();
    this.systemInterfaceSupportService.changeSupportGroupStatus(notificationGroupId, status)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message)
          }
          this.supportGroupReactivateSubject.next(true);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  deleteSupportGroup(notificationGroupId: string, isHardDelete: boolean): void {
    this.showLoader();
    this.systemInterfaceSupportService.deleteSupportGroup(notificationGroupId, isHardDelete)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          }
          this.supportGroupRemoveSubject.next(true);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  loadSupportGroupDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.lastModifierId))).join(',');
    if (distinctUserIds) {
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
        .subscribe({
          next: (data: any[]) => {
            if (data.length > 0) {
              this.supportGroupProfilePhotoSubject.next(data);
            }
          },
        });
    }
  }



  // Notification Catergory 

  loadNotificationCategory(paginationParameters: any) {
    this.notificationCategoryListDataLoaderSubject.next(true);
    this.systemInterfaceSupportService.getNotificationCategoryList(paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.notificationCategorySubject.next(gridView);
        this.notificationCategoryListDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.notificationCategoryListDataLoaderSubject.next(false);
      },
    });
  }

  addNotificationCategory(eventNotificationGroup: any) {
    this.loaderService.show();
    this.systemInterfaceSupportService.addNotificationCategory(eventNotificationGroup).subscribe(
      {
        next: (response: any) => {
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.addnotificationCategorySubject.next(true);
        },
        error: (err) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      }
    );
  }

  editNotificationCategory(eventNotificationGroup: any) {
    this.loaderService.show();
    let eventNotificationGroupId = eventNotificationGroup.eventNotificationGroupId;
    return this.systemInterfaceSupportService.editNotificationCategory(eventNotificationGroupId, eventNotificationGroup).subscribe({
      next: (response: any) => {
        if (response.status) {
          this.editNotificationCategorySubject.next(true);
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        }
        this.loaderService.hide();
      },
      error: (err) => {
        this.hideLoader();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

 changeNotificationCategoryStatus(eventNotificationGroupId: any, status: boolean) {
    this.showLoader();
    this.systemInterfaceSupportService.changeNotificationCategoryStatus(eventNotificationGroupId, status)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message)
          }
          this.notificationCategoryReactivateSubject.next(true);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

  deleteNotificationCategory(eventNotificationGroupId: string, isHardDelete: boolean): void {
    this.showLoader();
    this.systemInterfaceSupportService.deleteNotificationCategory(eventNotificationGroupId, isHardDelete)
      .subscribe({
        next: (response: any) => {
          if (response.status) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          }
          this.notificationCategoryRemoveSubject.next(true);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

}
