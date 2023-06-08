/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { InsuranceProviderDataService } from '../../infrastructure/financial-management/insurance-provider.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

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

  providerClientsData$ = this.providerClientsDataSubject.asObservable();
  insuranceProviderData$ = this.insuranceProviderDataSubject.asObservable();


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
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadInsuranceProviderListGrid(){
    this.insuranceProviderDataService.loadInsuranceProviderListService().subscribe({
      next: (dataResponse) => {
        this.insuranceProviderDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });


  }
  loadProviderClientsListGrid(
    providerId:any,
    tabCode:any,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string){
    this.showLoader();
    this.insuranceProviderDataService.loadProviderClientsListGrid(providerId,tabCode, skipcount,maxResultCount,sort,sortType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.providerClientsDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });

  }

}
