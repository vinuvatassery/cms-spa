import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialMedicalClaimsDataService } from '../../infrastructure/financial-management/medical-claims.data.service';

@Injectable({ providedIn: 'root' })
export class FinancialMedicalClaimsFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueMedicalClaimsProcess = 'invoiceID';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueMedicalClaimsProcess,
  }];

  public sortValueMedicalClaimsBatch = 'batch';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueMedicalClaimsBatch,
  }];

  public sortValueMedicalClaimsPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueMedicalClaimsPayments,
  }];

  public sortValueBatchLog = 'vendorName';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog,
  }];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [{
    field: this.sortValueClaims,
  }];

  private medicalClaimsProcessDataSubject = new Subject<any>();
  medicalClaimsProcessData$ = this.medicalClaimsProcessDataSubject.asObservable();

  private medicalClaimsBatchDataSubject =  new Subject<any>();
  medicalClaimsBatchData$ = this.medicalClaimsBatchDataSubject.asObservable();  

  private medicalClaimsAllPaymentsDataSubject =  new Subject<any>();
  medicalClaimsAllPaymentsData$ = this.medicalClaimsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

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
    public financialMedicalClaimsDataService: FinancialMedicalClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadMedicalClaimsProcessListGrid(){
    this.financialMedicalClaimsDataService.loadMedicalClaimsProcessListService().subscribe({
      next: (dataResponse) => {
        this.medicalClaimsProcessDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   


  loadMedicalClaimsBatchListGrid(){
    this.financialMedicalClaimsDataService.loadMedicalClaimsBatchListService().subscribe({
      next: (dataResponse) => {
        this.medicalClaimsBatchDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadMedicalClaimsAllPaymentsListGrid(){
    this.financialMedicalClaimsDataService.loadMedicalClaimsAllPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.medicalClaimsAllPaymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadBatchLogListGrid(){
    this.financialMedicalClaimsDataService.loadBatchLogListService().subscribe({
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
    this.financialMedicalClaimsDataService.loadClaimsListService().subscribe({
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
}