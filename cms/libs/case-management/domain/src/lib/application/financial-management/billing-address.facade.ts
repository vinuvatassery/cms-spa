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
import { map, catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BillingAddressFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];
  private searchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  private billingAddressDataSubject = new BehaviorSubject<any>([]);
  //private deactivateAddressDataSubject = new BehaviorSubject<any>([]);

  billingAddressData$ = this.billingAddressDataSubject.asObservable();
  searchLoaderVisibility$ = this.searchLoaderVisibilitySubject.asObservable();
  //deactivateAddressData$ = this.searchLoaderVisibilitySubject.asObservable();


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

  loadPaymentsAddressListGrid(
    vendorTypeCode: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ) {
    this.showLoader();

    this.searchLoaderVisibilitySubject.next(true);

    this.billingAddressDataService
      .loadBillingPaymentsAddressListService(
        vendorTypeCode,
        skipcount,
        maxResultCount,
        sort,
        sortType
      )
      .subscribe({
        next: (dataResponse) => {
          this.billingAddressDataSubject.next(dataResponse);
          if (dataResponse) {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.billingAddressDataSubject.next(gridView);
          }
          this.searchLoaderVisibilitySubject.next(false);
          this.hideLoader();
        },
        error: (err) => {
          this.searchLoaderVisibilitySubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  //to deactivate any payment address
  deactivateAddress(addressId: string): Observable<any> {
    this.loaderService.show();
    return this.billingAddressDataService.deactivatePaymentAddress(addressId).pipe(
      map((response) => {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Payment Address De-Activated Successfully');
        this.hideLoader();
        return response;
      }),
      catchError((err: Error) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
        throw err; // Rethrow the error to be handled by the caller
      })
    );
  }

  //to delete any payment address
  deleteAddress(addressId: string): Observable<any> {
    this.loaderService.show();
    return this.billingAddressDataService.deletePaymentAddress(addressId).pipe(
      map((response) => {
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.SUCCESS, 'Payment Address Deleted Successfully');
        this.hideLoader();
        return response;
      }),
      catchError((err: Error) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
        throw err; // Rethrow the error to be handled by the caller
      })
    );
  }
}
