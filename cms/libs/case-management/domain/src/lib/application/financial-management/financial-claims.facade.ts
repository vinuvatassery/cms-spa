import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialClaimsDataService } from '../../infrastructure/financial-management/financial-claims.data.service';
import { Router } from '@angular/router';
import { FinancialClaimTypeCode } from '../../enums/financial-claim-types';

@Injectable({ providedIn: 'root' })
export class FinancialClaimsFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialClaimsProcess = 'invoiceNbr';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsProcess,
  }];

  public sortValueFinancialInvoiceProcess = 'serviceStartDate';
  public sortInvoiceList: SortDescriptor[] = [{
    field: this.sortValueFinancialInvoiceProcess,
  }];

  public sortValueFinancialClaimsBatch = 'batchName';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsBatch,
  }];

  public sortValueFinancialClaimsPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsPayments,
  }];

  public sortValueBatchLog = 'vendorName';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog,
  }];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [{
    field: this.sortValueClaims,
  }];


  public sortValueBatchItem = 'vendorName';
  public sortBatchItemList: SortDescriptor[] = [{
    field: this.sortValueBatchItem,
  }];


  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [{
    field: this.sortValueReconcile,
  }];

  public sortValueReconcilePaymentBreakout = 'invoiceNbr';
  public sortReconcilePaymentBreakoutList: SortDescriptor[] = [{
    field: this.sortValueReconcilePaymentBreakout,
  }];

  private financialClaimsProcessDataSubject = new Subject<any>();
  financialClaimsProcessData$ = this.financialClaimsProcessDataSubject.asObservable();

  private financialClaimsInvoiceSubject = new Subject<any>();
  financialClaimsInvoice$ = this.financialClaimsInvoiceSubject.asObservable();

  private financialClaimsBatchDataSubject =  new Subject<any>();
  financialClaimsBatchData$ = this.financialClaimsBatchDataSubject.asObservable();  

  private financialClaimsAllPaymentsDataSubject =  new Subject<any>();
  financialClaimsAllPaymentsData$ = this.financialClaimsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

  private claimsListDataSubject =  new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject =  new Subject<any>();
  reconcileBreakoutSummary$ = this.reconcileBreakoutSummaryDataSubject.asObservable();
  
  private reconcilePaymentBreakoutListDataSubject =  new Subject<any>();
  reconcilePaymentBreakoutList$ = this.reconcilePaymentBreakoutListDataSubject.asObservable();
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

  loadFinancialClaimsProcessListGrid(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string,claimsType : string){
    filter = JSON.stringify(filter);
    this.financialClaimsDataService.loadFinancialClaimsProcessListService(skipcount,  maxResultCount,  sort,  sortType, filter , claimsType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.financialClaimsProcessDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   

  loadFinancialClaimsInvoiceListService(paymentRequestId : string, skipcount: number,  maxResultCount: number,  sort: string,  sortType: string,claimsType : string){
    
    this.financialClaimsDataService.loadFinancialClaimsInvoiceListService(paymentRequestId,skipcount,  maxResultCount,  sort,  sortType,claimsType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.financialClaimsInvoiceSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   



  loadFinancialClaimsBatchListGrid(skipcount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string, claimsType : string){
    filter = JSON.stringify(filter);
    this.financialClaimsDataService.loadFinancialClaimsBatchListService(skipcount,  maxResultCount,  sort,  sortType,filter,claimsType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.financialClaimsBatchDataSubject.next(gridView);
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


  loadBatchLogListGrid(){
    this.financialClaimsDataService.loadBatchLogListService().subscribe({
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
  loadBatchItemsListGrid(){
    this.financialClaimsDataService.loadBatchItemsListService().subscribe({
      next: (dataResponse) => {
        this.batchItemsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
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

  loadReconcilePaymentBreakoutSummary(batchId: string, entityId: string){    
    this.showLoader();
    this.financialClaimsDataService.loadReconcilePaymentBreakoutSummaryService(batchId,entityId).subscribe({
      next: (dataResponse) => {
        this.reconcileBreakoutSummaryDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  } 

  loadReconcilePaymentBreakoutListGrid(batchId: string, entityId: string,skipcount: number, pagesize: number, sort: any, sortType: any){
    this.showLoader();
    this.financialClaimsDataService.loadReconcilePaymentBreakoutListService(batchId,entityId,skipcount,pagesize,sort,sortType).subscribe({
      next: (dataResponse) => {
        this.reconcilePaymentBreakoutListDataSubject.next(dataResponse);
        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
          this.reconcilePaymentBreakoutListDataSubject.next(gridView);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  } 
}