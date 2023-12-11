/** Angular **/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { VendorDataService } from '../infrastructure/vendor.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class VendorFacade {

  private paymentRequestVendorsSubject = new BehaviorSubject<any>([]);
  private isVendorLoadingSubject = new BehaviorSubject<any>(true);
  paymentRequestVendors$ = this.paymentRequestVendorsSubject.asObservable();
  isVendorLoading$ = this.isVendorLoadingSubject.asObservable(); 
  
  public loadCarrierSubject = new BehaviorSubject<any>(true);
  loadCarrier$ = this.loadCarrierSubject.asObservable();

  constructor(
    private readonly vendorDataService: VendorDataService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService) { }

  /** Public methods **/
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();

  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadAllVendors(type: string) {
    return this.vendorDataService.loadAllVendors(type);
  }

  loadPaymentRequestVendors(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.isVendorLoadingSubject.next(true);
    return this.vendorDataService.loadPayemntRequestVendors(type, vendorType, clientId, clientCaseligibilityId).subscribe({
      next: (vendorResponse: any) => {
        this.paymentRequestVendorsSubject.next(vendorResponse);
        this.isVendorLoadingSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
}
