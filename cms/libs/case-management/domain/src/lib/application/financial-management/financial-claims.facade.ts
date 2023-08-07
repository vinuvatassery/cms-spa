import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialClaimsDataService } from '../../infrastructure/financial-management/financial-claims.data.service';
import { Router } from '@angular/router';
import { FinancialClaimTypeCode } from '../../enums/financial-claim-types';
import { GridFilterParam } from '@cms/case-management/domain';

@Injectable({ providedIn: 'root' })
export class FinancialClaimsFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialClaimsProcess = 'invoiceID';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsProcess,
  }];

  public sortValueFinancialClaimsBatch = 'batch';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsBatch,
  }];

  public sortValueFinancialClaimsPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsPayments,
  }];

  public sortValueBatchLog = 'creationTime';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog, dir: 'desc'
  }];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [{
    field: this.sortValueClaims,
  }];


  public sortValueBatchItem = 'creationTime';
  public sortBatchItemList: SortDescriptor[] = [{
    field: this.sortValueBatchItem, dir: 'desc'
  }];


  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [{
    field: this.sortValueReconcile,
  }];

  private financialClaimsProcessDataSubject = new Subject<any>();
  financialClaimsProcessData$ = this.financialClaimsProcessDataSubject.asObservable();

  private financialClaimsBatchDataSubject =  new Subject<any>();
  financialClaimsBatchData$ = this.financialClaimsBatchDataSubject.asObservable();  

  private financialClaimsAllPaymentsDataSubject =  new Subject<any>();
  financialClaimsAllPaymentsData$ = this.financialClaimsAllPaymentsDataSubject.asObservable();

  private paymentsByBatchDataSubject =  new Subject<any>();
  private paymentByBatchGridLoaderSubject =  new BehaviorSubject<boolean>(false);
  paymentsByBatchData$ = this.paymentsByBatchDataSubject.asObservable();
  paymentByBatchGridLoader$ = this.paymentByBatchGridLoaderSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  private batchItemsLoaderSubject =  new BehaviorSubject<any>(false);
  batchItemsData$ = this.batchItemsDataSubject.asObservable();
  batchItemsLoader$ = this.batchItemsLoaderSubject.asObservable();

  private claimsListDataSubject =  new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();
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
    public financialClaimsDataService: FinancialClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  getClaimsType(router : Router)
  {
    return router.url.split('/')?.filter(element => element === FinancialClaimTypeCode.Dental || element ===FinancialClaimTypeCode.Medical)[0];    
  }

  loadFinancialClaimsProcessListGrid(){
    this.financialClaimsDataService.loadFinancialClaimsProcessListService().subscribe({
      next: (dataResponse) => {
        this.financialClaimsProcessDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   


  loadFinancialClaimsBatchListGrid(){
    this.financialClaimsDataService.loadFinancialClaimsBatchListService().subscribe({
      next: (dataResponse) => {
        this.financialClaimsBatchDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadFinancialClaimsAllPaymentsListGrid(){
    this.financialClaimsDataService.loadFinancialClaimsAllPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.financialClaimsAllPaymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }

  loadBatchItemsListGrid(paymentId: string, param: GridFilterParam){
    this.batchItemsLoaderSubject.next(true);
    this.financialClaimsDataService.loadBatchItemsListService(paymentId, param).subscribe({
      next: (dataResponse: any) => {

        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };

        this.batchItemsDataSubject.next(gridView);
        this.batchItemsLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.batchItemsLoaderSubject.next(false);
      },
    });  
  }
  loadReconcileListGrid(){
    this.financialClaimsDataService.loadReconcileListService().subscribe({
      next: (dataResponse) => {
        this.batchReconcileDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
  
  loadClaimsListGrid(){
    this.financialClaimsDataService.loadClaimsListService().subscribe({
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

  loadServicesByPayment(paymentId: string, params:GridFilterParam){
    return this.financialClaimsDataService.loadServicesByPayment(paymentId, params);
  }


  loadBatchLogListGrid(batchId: string, params:GridFilterParam){
    this.paymentByBatchGridLoaderSubject.next(true);
    this.financialClaimsDataService.loadPaymentsByBatch(batchId, params).subscribe({
      next: (dataResponse) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };

        this.paymentsByBatchDataSubject.next(gridView);
        this.paymentByBatchGridLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.paymentByBatchGridLoaderSubject.next(false);
      },
    });  
  }
}