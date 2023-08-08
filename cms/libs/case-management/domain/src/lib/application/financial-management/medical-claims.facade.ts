import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject, catchError, of } from 'rxjs';
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


  public sortValueBatchItem = 'vendorName';
  public sortBatchItemList: SortDescriptor[] = [{
    field: this.sortValueBatchItem,
  }];


  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [{
    field: this.sortValueReconcile,
  }];

  private medicalClaimsProcessDataSubject = new Subject<any>();
  medicalClaimsProcessData$ = this.medicalClaimsProcessDataSubject.asObservable();

  private medicalClaimsBatchDataSubject =  new Subject<any>();
  medicalClaimsBatchData$ = this.medicalClaimsBatchDataSubject.asObservable();  

  private medicalClaimsAllPaymentsDataSubject =  new Subject<any>();
  medicalClaimsAllPaymentsData$ = this.medicalClaimsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

  private claimsListDataSubject =  new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private medicalClaimByCpt = new Subject<any>();
  medicalClaimByCpt$ = this.medicalClaimByCpt.asObservable();
  
  private searchCTPCodeSubject = new BehaviorSubject<any>([]);
  public searchCTPCode$ =this.searchCTPCodeSubject.asObservable();

  private CPTCodeSearchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  CPTCodeSearchLoaderVisibility$= this.CPTCodeSearchLoaderVisibilitySubject.asObservable();

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
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
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
  loadBatchItemsListGrid(){
    this.financialMedicalClaimsDataService.loadBatchItemsListService().subscribe({
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
    this.financialMedicalClaimsDataService.loadReconcileListService().subscribe({
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

  getMedicalClaimByPaymentRequestId(event: any){
    return this.financialMedicalClaimsDataService.getMedicalClaimByPaymentRequestId(event).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    )
  }

  searchcptcode(cptcode: string){
this.CPTCodeSearchLoaderVisibilitySubject.next(true);
    return this.financialMedicalClaimsDataService.searchcptcode(cptcode).subscribe({
      next: (response: any[]) => {
        response?.forEach((cptcodes:any) => {
          cptcodes.cptCode1 = `${cptcodes.cptCode1 ?? ''}`;
        });
        this.searchCTPCodeSubject.next(response);
        this.CPTCodeSearchLoaderVisibilitySubject .next(false);
      },
      error: (err) => {  
        this.CPTCodeSearchLoaderVisibilitySubject .next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    })

  }
}