import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialPremiumsDataService } from '../../infrastructure/financial-management/financial-premiums.data.service';
import { Router } from '@angular/router';
import { FinancialPremiumTypeCode } from '../../enums/financial-premium-types';


@Injectable({ providedIn: 'root' })
export class FinancialPremiumsFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialPremiumsProcess = 'invoiceID';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsProcess,
  }];

  public sortValueFinancialPremiumsBatch = 'batch';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsBatch,
  }];

  public sortValueFinancialPremiumsPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsPayments,
  }];

  public sortValueBatchLog = 'vendorName';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog,
  }];

  public sortValuePremiums = 'batch';
  public sortPremiumsList: SortDescriptor[] = [{
    field: this.sortValuePremiums,
  }];


  public sortValueBatchItem = 'vendorName';
  public sortBatchItemList: SortDescriptor[] = [{
    field: this.sortValueBatchItem,
  }];


  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [{
    field: this.sortValueReconcile,
  }];

  private financialPremiumsProcessDataSubject = new Subject<any>();
  financialPremiumsProcessData$ = this.financialPremiumsProcessDataSubject.asObservable();

  private financialPremiumsBatchDataSubject =  new Subject<any>();
  financialPremiumsBatchData$ = this.financialPremiumsBatchDataSubject.asObservable();  

  private financialPremiumsAllPaymentsDataSubject =  new Subject<any>();
  financialPremiumsAllPaymentsData$ = this.financialPremiumsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

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
    public financialPremiumsDataService: FinancialPremiumsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  getPremiumType(router : Router)
  {
    return router.url.split('/')?.filter(element => element === FinancialPremiumTypeCode.Dental || element ===FinancialPremiumTypeCode.Medical)[0]
  }

  loadFinancialPremiumsProcessListGrid(){
    this.financialPremiumsDataService.loadFinancialPremiumsProcessListService().subscribe({
      next: (dataResponse) => {
        this.financialPremiumsProcessDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   


  loadFinancialPremiumsBatchListGrid(){
    this.financialPremiumsDataService.loadFinancialPremiumsBatchListService().subscribe({
      next: (dataResponse) => {
        this.financialPremiumsBatchDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadFinancialPremiumsAllPaymentsListGrid(){
    this.financialPremiumsDataService.loadFinancialPremiumsAllPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.financialPremiumsAllPaymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadBatchLogListGrid(){
    this.financialPremiumsDataService.loadBatchLogListService().subscribe({
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
    this.financialPremiumsDataService.loadBatchItemsListService().subscribe({
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
    this.financialPremiumsDataService.loadReconcileListService().subscribe({
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
  
  loadPremiumsListGrid(){
    this.financialPremiumsDataService.loadPremiumsListService().subscribe({
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