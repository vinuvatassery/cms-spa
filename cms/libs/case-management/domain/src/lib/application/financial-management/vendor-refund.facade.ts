import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialVendorRefundDataService } from '../../infrastructure/financial-management/vendor-refund.data.service';

@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueRefundProcess = 'vendorName';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueRefundProcess,
  }];

  public sortValueRefundBatch = 'batch';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueRefundBatch,
  }];

  public sortValueRefundPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueRefundPayments,
  }];

  public sortValueBatchLog = 'batch';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog,
  }];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [{
    field: this.sortValueClaims,
  }];

  public sortValuePremiums = 'batch';
  public sortPremiumsList: SortDescriptor[] = [{
    field: this.sortValuePremiums,
  }];

  private vendorRefundProcessDataSubject = new Subject<any>();
  vendorRefundProcessData$ = this.vendorRefundProcessDataSubject.asObservable();

  private vendorRefundBatchDataSubject =  new Subject<any>();
  vendorRefundBatchData$ = this.vendorRefundBatchDataSubject.asObservable();  

  private vendorRefundAllPaymentsDataSubject =  new Subject<any>();
  vendorRefundAllPaymentsData$ = this.vendorRefundAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private claimsListDataSubject =  new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private premiumsListDataSubject =  new Subject<any>();
  premiumsListData$ = this.premiumsListDataSubject.asObservable();
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
    public financialVendorRefundDataService: FinancialVendorRefundDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadVendorRefundProcessListGrid(){
    this.financialVendorRefundDataService.loadVendorRefundProcessListService().subscribe({
      next: (dataResponse) => {
        this.vendorRefundProcessDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   


  loadVendorRefundBatchListGrid(){
    this.financialVendorRefundDataService.loadVendorRefundBatchListService().subscribe({
      next: (dataResponse) => {
        this.vendorRefundBatchDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadVendorRefundAllPaymentsListGrid(){
    this.financialVendorRefundDataService.loadVendorRefundAllPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.vendorRefundAllPaymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadBatchLogListGrid(){
    this.financialVendorRefundDataService.loadBatchLogListService().subscribe({
      next: (dataResponse) => {
        this.batchLogDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }

  loadClaimsListGrid(){
    this.financialVendorRefundDataService.loadClaimsListService().subscribe({
      next: (dataResponse) => {
        this.claimsListDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
  loadPremiumsListGrid(){
    this.financialVendorRefundDataService.loadPremiumsListService().subscribe({
      next: (dataResponse) => {
        this.premiumsListDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
}