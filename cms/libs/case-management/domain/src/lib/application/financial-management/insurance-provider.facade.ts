/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { GridFilterParam } from '../../entities/grid-filter-param';
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { InsuranceProviderDataService } from '../../infrastructure/financial-management/insurance-provider.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class InsuranceProviderFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public clientsSortValue = 'clientName'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];
  public clientSort: SortDescriptor[] = [{
    field: this.clientsSortValue,
  }];

  private insuranceProviderDataSubject = new BehaviorSubject<any>([]);
  private providerClientsDataSubject = new BehaviorSubject<any>([]);
  private gridLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);


  providerClientsData$ = this.providerClientsDataSubject.asObservable();
  insuranceProviderData$ = this.insuranceProviderDataSubject.asObservable();
  gridLoaderVisibility$ = this.gridLoaderVisibilitySubject.asObservable();
  insursnceProviderProfilePhotoSubject = new Subject();


  /** Private properties **/

  /** Public properties **/

  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  errorShowHideSnackBar( subtitle : any)
  {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR,subtitle, NotificationSource.UI)
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
    public insuranceProviderDataService: InsuranceProviderDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
  loadInsuranceProviderListGrid(){
    this.insuranceProviderDataService.loadInsuranceProviderListService().subscribe({
      next: (dataResponse: any) => {
        this.insuranceProviderDataSubject.next(dataResponse);
        this.loadInsuranceProviderDistinctUserIdsAndProfilePhoto(dataResponse?.data);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  loadInsuranceProviderDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.insursnceProviderProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadProviderClientsListGrid(
    providerId:any,
    tabCode:any,
    params: GridFilterParam
    ){
    this.gridLoaderVisibilitySubject.next(true);
    this.insuranceProviderDataService.loadProviderClientsListGrid(providerId,tabCode, params).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.providerClientsDataSubject.next(gridView);
        this.gridLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.gridLoaderVisibilitySubject.next(false);
      },
    });

  }

}
