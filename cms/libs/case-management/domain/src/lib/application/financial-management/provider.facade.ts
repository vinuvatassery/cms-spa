/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
/** Providers **/
import { LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ProviderFacade {

  /** Private properties **/
  private invoiceDataSubject = new BehaviorSubject<any>([]);
  private serviceDataSubject = new BehaviorSubject<any>([]);
  private isInvoiceLoadingSubject = new BehaviorSubject<boolean>(false);

  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>(); 
  serviceData$ = this.serviceDataSubject.asObservable();
  invoiceData$ = this.invoiceDataSubject.asObservable();
  isInvoiceLoading$ = this.isInvoiceLoadingSubject.asObservable();
 

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
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  searchProvider(searchText: string) {

    //this.CPTCodeSearchLoaderVisibilitySubject.next(true);

    return this.financialClaimsDataService.searchProbider(searchText).subscribe({

      next: (response: any[]) => {

        response?.forEach((cptcodes: any) => {

          cptcodes.cptCode1 = `${cptcodes.cptCode1 ?? ''}`;

        });

        this.searchCTPCodeSubject.next(response);

        this.CPTCodeSearchLoaderVisibilitySubject.next(false);

      },

      error: (err) => {

        this.CPTCodeSearchLoaderVisibilitySubject.next(false);

        this.snackbarService.manageSnackBar(

          SnackBarNotificationType.ERROR,

          err

        );

        this.loggingService.logException(err);

        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;

        this.hideLoader();

      },

    });

  }
 
}
