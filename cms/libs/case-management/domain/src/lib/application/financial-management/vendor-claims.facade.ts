/** Angular **/
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
/** External libraries **/
import { catchError, of } from 'rxjs';
/** internal libraries **/
import { SortDescriptor } from '@progress/kendo-data-query';
import { VendorClaimsDataService } from '../../infrastructure/financial-management/vendor-claims.data.service';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
//** entities **/
import { BatchClaim } from '../../entities/financial-management/batch-claim';

@Injectable({ providedIn: 'root' })
export class VendorClaimsFacade {
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'address1';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [
    {
      field: this.sortValue,
    },
  ];

  /** Private properties **/
  /** Public properties **/
  // handling the snackbar & loader

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  /** Constructor**/
  constructor(
    public vendorcontactsDataService: VendorClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) {}

  /** Public methods **/
  batchClaims(batchClaims: BatchClaim) {
    this.showLoader();
    return this.vendorcontactsDataService.batchClaims(batchClaims).pipe(
      catchError((err: HttpErrorResponse) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    );
  }
}

