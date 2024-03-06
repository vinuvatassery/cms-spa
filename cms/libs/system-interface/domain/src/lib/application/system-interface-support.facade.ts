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

  private editSupportGroupSubject = new Subject<boolean>();
  editSupportGroup$ = this.editSupportGroupSubject.asObservable();

  private supportGroupReactivateSubject = new Subject<any>();
  supportGroupReactivate$ = this.supportGroupReactivateSubject.asObservable();
  private supportGroupRemoveSubject = new Subject<any>();
  supportGroupRemove$ = this.supportGroupRemoveSubject.asObservable();

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
    public intl: IntlService) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }



  loadSupportGroup(paginationParameters: any) {
    this.showLoader();
    this.systemInterfaceSupportService.getSupportGroupList(paginationParameters).subscribe({
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
    this.loaderService.show();
    this.systemInterfaceSupportService.addSupportGroup(notificationGroup).subscribe(
      {
        next: (response: any) => {
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS,'Support Group saved successfully');
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
      next: (response) => {
        if (response === true) {
          this.editSupportGroupSubject.next(true);
          this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Support Group updated successfully');
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
        next: (removeResponse) => {
          if (removeResponse ?? false) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, status ? 'Interface Support Group reactivated successfully' : 'Interface Support Group deactivated successfully')
          }
          this.supportGroupReactivateSubject.next(removeResponse);
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
        next: (removeResponse) => {
          if (removeResponse ?? false) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Interface Support Group successfully deleted!');
          }
          this.supportGroupRemoveSubject.next(removeResponse);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      });
  }

}
