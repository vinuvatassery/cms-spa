/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { PaymentsDataService } from '../../infrastructure/financial-management/payments.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { PaymentDetail } from '../../entities/financial-management/Payment-details';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class PaymentsFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'mailCode';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private paymentBatchesSubject = new BehaviorSubject<any>([]);
  private paymentBatchSubListSubject = new BehaviorSubject<any>([]);
  private paymentsAddressDataSubject = new BehaviorSubject<any>([]);
  private paymentBatchLoaderSubject = new BehaviorSubject<boolean>(false);
  private paymentPanelSubject = new Subject<any>();
  private paymentDetailsSubject = new Subject<PaymentDetail>();
  private updatePaymentPanelResponseSubject = new BehaviorSubject<any>([]);
  paymentBatches$ = this.paymentBatchesSubject.asObservable();
  paymentBatchSubList$ = this.paymentBatchSubListSubject.asObservable();
  paymentsAddressData$ = this.paymentsAddressDataSubject.asObservable();
  paymentBatchLoader$ = this.paymentBatchLoaderSubject.asObservable();
  paymentPanelData$ = this.paymentPanelSubject.asObservable();
  paymentDetails$ = this.paymentDetailsSubject.asObservable();
  updatePaymentPanelResponse$ = this.updatePaymentPanelResponseSubject.asObservable();
  paymentBatchesProfilePhotoSubject = new Subject();
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
    public paymentsDataService: PaymentsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
  loadPaymentsListGrid(vendorId: string, paginationParameters: GridFilterParam) {
    this.paymentBatchLoaderSubject.next(true);
    this.paymentsDataService.loadPaymentsListService(vendorId, paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.paymentBatchesSubject.next(gridView);
        this.loadPaymentsDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.paymentBatchLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.paymentBatchLoaderSubject.next(false);
      },
    });
  }

  loadPaymentsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.paymentBatchesProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadPaymentBatchSubList(batchId: string, paginationParameters: State) {
    return this.paymentsDataService.loadPaymentBatchSubListService(batchId, paginationParameters);
  }

  loadPaymentsAddressListGrid() {
    this.paymentsDataService.loadPaymentsAddressListService().subscribe({
      next: (dataResponse) => {
        this.paymentsAddressDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  loadPaymentPanel(paymentRequestId:any,batchId:any):any{
    this.paymentsDataService.loadPaymentPanel(paymentRequestId,batchId).subscribe({
      next: (dataResponse) => {
        this.paymentPanelSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  updatePaymentPanel(batchId:any,paymentPanel:any){
    this.paymentsDataService.updatePaymentPanel(batchId,paymentPanel).subscribe({
      next: (response: any) => {        
        this.updatePaymentPanelResponseSubject.next(response);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        this.hideLoader();   
      },
      error: (err) => {       
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  loadPaymentDetails(paymentId: string, type: string){
    return this.paymentsDataService.loadPaymentDetails(paymentId, type).subscribe({
      next: (dataResponse: any) => {
        this.paymentDetailsSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
