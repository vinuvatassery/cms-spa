/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { BillingAddressDataService } from '../../infrastructure/financial-management/billing-address.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class BillingAddressFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private billingAddressDataSubject = new BehaviorSubject<any>([]);
  billingAddressData$ = this.billingAddressDataSubject.asObservable();


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
    public billingAddressDataService: BillingAddressDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  saveBillingAddress(vendorId: any, paymentAddress: any) {
    this.showLoader();
    return this.billingAddressDataService.saveBillingAddress(paymentAddress, vendorId);
  }
  loadBillingAddressListGridService(){
    this.billingAddressDataService.loadBillingAddressListService().subscribe({
      next: (dataResponse) => {
        this.billingAddressDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });


  }

}
