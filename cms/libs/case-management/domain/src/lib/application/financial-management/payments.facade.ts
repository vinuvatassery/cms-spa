/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { PaymentsDataService } from '../../infrastructure/financial-management/payments.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PaymentsFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private paymentsDataSubject = new BehaviorSubject<any>([]);
  private paymentsAddressDataSubject = new BehaviorSubject<any>([]);
  paymentsData$ = this.paymentsDataSubject.asObservable();
  paymentsAddressData$ = this.paymentsAddressDataSubject.asObservable();

  
  private contactsSubject = new BehaviorSubject<any>([]);
  contacts$ = this.contactsSubject.asObservable();
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
    public paymentsDataService: PaymentsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadPaymentsListGrid(){
    this.paymentsDataService.loadPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.paymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });
  }




  loadPaymentsAddressListGrid(){
    this.paymentsDataService.loadPaymentsAddressListService().subscribe({
      next: (dataResponse) => {
        this.paymentsAddressDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });
  }
  loadcontacts(mailcode:string)
  {
    this.showLoader();
    this.paymentsDataService.loadcontacts(mailcode).subscribe({
      next:(res:any)=>{
      this.contactsSubject.next(res);
      this.hideLoader();
      },
      error:(err:any)=>{
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
     this.hideLoader(); 
      }
    })
  }
 
}
