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
import { PaymentBatchName } from '../../entities/financial-management/Payment-details';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { BatchClaim } from '../../entities/financial-management/batch-claim';

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

  private paymentsByBatchDataSubject =  new Subject<any>();
  private paymentByBatchGridLoaderSubject =  new BehaviorSubject<boolean>(false);
  paymentBatchNameSubject  =  new Subject<PaymentBatchName>();
  paymentsByBatchData$ = this.paymentsByBatchDataSubject.asObservable();
  paymentByBatchGridLoader$ = this.paymentByBatchGridLoaderSubject.asObservable();
  paymentBatchName$ = this.paymentBatchNameSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  private batchItemsLoaderSubject =  new BehaviorSubject<any>(false);
  batchItemsData$ = this.batchItemsDataSubject.asObservable();
  batchItemsLoader$ = this.batchItemsLoaderSubject.asObservable();

  private claimsListDataSubject =  new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject =  new Subject<any>();
  reconcileBreakoutSummary$ = this.reconcileBreakoutSummaryDataSubject.asObservable();

  private reconcilePaymentBreakoutListDataSubject =  new Subject<any>();
  reconcilePaymentBreakoutList$ = this.reconcilePaymentBreakoutListDataSubject.asObservable();

  private deleteClaimsSubject =  new Subject<any>();
  deleteClaims$ = this.deleteClaimsSubject.asObservable();

  private batchClaimsSubject =  new Subject<any>();
  batchClaims$ = this.batchClaimsSubject.asObservable();
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



  loadFinancialClaimsBatchListGrid(skipCount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string, claimsType : string){
    filter = JSON.stringify(filter);
    this.financialClaimsDataService.loadFinancialClaimsBatchListService(skipCount,  maxResultCount,  sort,  sortType,filter,claimsType).subscribe({
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

  loadBatchItemsListGrid(paymentId: string, param: GridFilterParam, claimType:string){
    this.batchItemsLoaderSubject.next(true);
    this.financialClaimsDataService.loadBatchItemsListService(paymentId, param, claimType).subscribe({
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
  loadReconcileListGrid(batchId:any,claimsType:any,event:any){
    this.financialClaimsDataService.loadReconcileListService(batchId,claimsType,event).subscribe({
      next: (dataResponse:any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.batchReconcileDataSubject.next(gridView);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
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

  loadServicesByPayment(paymentId: string, params:GridFilterParam, claimType:string){
    return this.financialClaimsDataService.loadServicesByPayment(paymentId, params, claimType);
  }


  loadBatchLogListGrid(batchId: string, params:GridFilterParam, claimType:string){
    this.paymentByBatchGridLoaderSubject.next(true);
    this.financialClaimsDataService.loadPaymentsByBatch(batchId, params, claimType).subscribe({
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

    loadBatchName(batchId: string){
    this.financialClaimsDataService.loadBatchName(batchId).subscribe({
      next: (dataResponse) => {
        this.paymentBatchNameSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  deleteClaims(batchClaims: any, claimsType: string) {
    this.showLoader();
    return this.financialClaimsDataService.deleteClaims(batchClaims, claimsType).subscribe({
      next: (response:any) => {
        this.deleteClaimsSubject.next(response);
        if (response.status) {
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  batchClaims(batchClaims: BatchClaim, claimsType: string) {
    this.showLoader();
    return this.financialClaimsDataService
      .batchClaims(batchClaims, claimsType)
      .subscribe({
        next: (response:any) => {
          this.batchClaimsSubject.next(response);
          if (response.status) {
            this.notificationSnackbarService.manageSnackBar(
              SnackBarNotificationType.SUCCESS,
              response.message
            );
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadPrintAdviceLetterData(printAdviceLetterData: any) {
    return this.financialClaimsDataService.getPrintAdviceLetterData(printAdviceLetterData);
  }
  
  reconcilePaymentsAndLoadPrintLetterContent(batchId: any, reconcileData: any) {
    return this.financialClaimsDataService.reconcilePaymentsAndLoadPrintAdviceLetterContent(batchId, reconcileData);
}
}
