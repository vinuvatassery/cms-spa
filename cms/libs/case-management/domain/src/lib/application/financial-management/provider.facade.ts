/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
/** Providers **/
import { LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { ProviderDataService } from '../../infrastructure/provider.data.service';
@Injectable({ providedIn: 'root' })
export class ProviderFacade {

  /** Private properties **/
  private invoiceDataSubject = new BehaviorSubject<any>([]);
  private serviceDataSubject = new BehaviorSubject<any>([]);
  private isInvoiceLoadingSubject = new BehaviorSubject<boolean>(false);
  private searchProviderSubject= new BehaviorSubject<any>([]);
  private removeprovidersubject=new BehaviorSubject<any>([]);
 private AddproviderNewSubject= new BehaviorSubject<any>([]);

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>(); 
  serviceData$ = this.serviceDataSubject.asObservable();
  invoiceData$ = this.invoiceDataSubject.asObservable();
  isInvoiceLoading$ = this.isInvoiceLoadingSubject.asObservable();
  searchProvider$=this.searchProviderSubject.asObservable();  
  removeprovider$=this.removeprovidersubject.asObservable();
  AddproviderNew$=this.AddproviderNewSubject.asObservable();
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
    private providerDataService:ProviderDataService ,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  searchProvider(searchText: string)
  {
    this.showLoader();
    return this.providerDataService.searchProvider(searchText).subscribe
    ({
      next: (response: any[]) => 
      {
        response?.forEach((searchTexts: any) => {
          searchTexts.VendorName = `${searchTexts.VendorName ?? ''}`;
        });
        this.searchProviderSubject.next(response);
        this.hideLoader();
      },
      error: (err) => 
      {
       this.hideLoader();
        this.showHideSnackBar(
          SnackBarNotificationType.ERROR,
        err
        );
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }
  removeprovider(providerId: any): void 
  {
    this.showLoader();
    this.providerDataService.removeprovider(providerId).subscribe
    ({
      next: (deleteResponse) =>
      {
        if (deleteResponse ?? false) 
        {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, deleteResponse.message)
          this.removeprovidersubject.next(deleteResponse)
        }
      },
      error: (err) => 
      {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      }
    });
  }
  addProvider(provider:any) 
  {
    this.showLoader();
    this.providerDataService.addProvider(provider).subscribe
    ({
      next: (addNewdependentsResponse) => 
      {
        if (addNewdependentsResponse) 
        {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'New provider Added Successfully')
        }
        this. AddproviderNewSubject.next(addNewdependentsResponse);
        this.hideLoader();
      },
      error: (err) =>
      {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
}
