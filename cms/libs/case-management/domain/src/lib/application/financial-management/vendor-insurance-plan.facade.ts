/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { VendorInsurancePlanDataService } from '../../infrastructure/financial-management/vendor-insurance-plan.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class VendorInsurancePlanFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'lastUpdatedBy';
  public sortType = 'desc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private vendorInsurancePlanDataSubject = new BehaviorSubject<any>([]);
  private vendorInsuranceGridLoaderSubject = new BehaviorSubject<any>([]);
  vendorInsurancePlanData$ = this.vendorInsurancePlanDataSubject.asObservable();
  vendorInsuranceGridLoader$ = this.vendorInsuranceGridLoaderSubject.asObservable();

  insuranceVendorProfilePhotoSubject = new Subject();

  /** Private properties **/

  /** Public properties **/

  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  errorShowHideSnackBar(subtitle: any) {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, subtitle, NotificationSource.UI)
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    public vendorInsurancePlanDataService: VendorInsurancePlanDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
  loadVendorInsuranceProviderListGrid(vendorId: string, pageParameters: GridFilterParam) {
    this.vendorInsuranceGridLoaderSubject.next(true);
    this.vendorInsurancePlanDataService.loadVendorInsuranceProviderListGrid(vendorId, pageParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.vendorInsurancePlanDataSubject.next(gridView);
        this.loadInsuranceProviderListDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.vendorInsuranceGridLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.vendorInsuranceGridLoaderSubject.next(false);
      },
    });
  }

  loadInsuranceProviderListDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.lastUpdatedBy))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.insuranceVendorProfilePhotoSubject.next(data);
          }
        },
      });
    }
  }

  loadVendorInsurancePlan(vendorId:string, providerId:string, pageParameters: State) {
    return this.vendorInsurancePlanDataService.loadVendorInsurancePlan(vendorId, providerId, pageParameters);
  }

}
