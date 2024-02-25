/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { InvoiceDataService } from '../../infrastructure/financial-management/invoice.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class InvoiceFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'InvoiceNbr';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  /** Private properties **/
  private invoiceDataSubject = new BehaviorSubject<any>([]);
  private isInvoiceLoadingSubject = new BehaviorSubject<boolean>(false);
  /** Public properties **/
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>(); 
  invoiceData$ = this.invoiceDataSubject.asObservable();
  isInvoiceLoading$ = this.isInvoiceLoadingSubject.asObservable();
  invoiceListProfilePhotoSubject = new Subject();
 

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
    public invoiceDataService: InvoiceDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
  loadInvoiceListGrid(vendorId:any,state:any,tabCode:any,sortValue:any,sortType:any){
    this.isInvoiceLoadingSubject.next(true);
    this.invoiceDataService.loadInvoiceListService(vendorId,state,tabCode,sortValue,sortType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.invoiceDataSubject.next(gridView);
        this.loadInvoicesDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.isInvoiceLoadingSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.isInvoiceLoadingSubject.next(false);
      },
    });   
  }

  loadInvoicesDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.invoiceListProfilePhotoSubject.next(data);
          }
        },
      });
    }
  }

  loadPaymentRequestServices(dataItem:any,vendorId:any,vendorType:any){  
    return this.invoiceDataService.loadPaymentRequestServices(dataItem,vendorId,vendorType);
  }
 
}
