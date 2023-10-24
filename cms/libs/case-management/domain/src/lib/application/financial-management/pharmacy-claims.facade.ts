import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, DocumentFacade, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialPharmacyClaimsDataService } from '../../infrastructure/financial-management/pharmacy-claims.data.service';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { BatchPharmacyClaims } from '../../entities/financial-management/batch-pharmacy-claims';

@Injectable({ providedIn: 'root' })
export class FinancialPharmacyClaimsFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  batchClaimsSubject  =  new Subject<any>();
  batchClaims$ = this.batchClaimsSubject.asObservable();


  public sortValuePharmacyClaimsProcess = 'creationTime';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValuePharmacyClaimsProcess,
  }];

  public sortValuePharmacyClaimsBatch = 'batch';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValuePharmacyClaimsBatch,
  }];

  public sortValuePharmacyClaimsPayments = 'batch';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValuePharmacyClaimsPayments,
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

  private pharmacyClaimsProcessDataSubject = new Subject<any>();
  pharmacyClaimsProcessData$ = this.pharmacyClaimsProcessDataSubject.asObservable();

  private pharmacyClaimsProcessLoaderSubject = new BehaviorSubject<boolean>(true);
  pharmacyClaimsProcessLoader$ = this.pharmacyClaimsProcessLoaderSubject.asObservable();

  private pharmacyClaimsBatchDataSubject =  new Subject<any>();
  pharmacyClaimsBatchData$ = this.pharmacyClaimsBatchDataSubject.asObservable();  

  private pharmacyClaimsAllPaymentsDataSubject =  new Subject<any>();
  pharmacyClaimsAllPaymentsData$ = this.pharmacyClaimsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

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
    public financialPharmacyClaimsDataService: FinancialPharmacyClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly documentFacade: DocumentFacade
  ) { }

  /** Public methods **/
  loadPharmacyClaimsProcessListGrid(params: GridFilterParam){
    this.pharmacyClaimsProcessLoaderSubject.next(true);
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsProcessListService(params).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.pharmacyClaimsProcessDataSubject.next(gridView);
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
    });  
  }   


  exportPharmacyClaimsProcessListGrid(params: any){
    const fileName = 'pharmacy-claims-process'
    this.documentFacade.getExportFile(params,`claims/pharmacies` , fileName);
  }

  loadPharmacyClaimsBatchListGrid(){
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsBatchListService().subscribe({
      next: (dataResponse) => {
        this.pharmacyClaimsBatchDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadPharmacyClaimsAllPaymentsListGrid(){
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsAllPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.pharmacyClaimsAllPaymentsDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadBatchLogListGrid(){
    this.financialPharmacyClaimsDataService.loadBatchLogListService().subscribe({
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
    this.financialPharmacyClaimsDataService.loadBatchItemsListService().subscribe({
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
    this.financialPharmacyClaimsDataService.loadReconcileListService().subscribe({
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
  
 loadPrescriptions(paymentId: string, params: GridFilterParam){
  return  this.financialPharmacyClaimsDataService.loadPrescriptions(paymentId, params);
 }

 batchClaims(batchPharmacyClaims: BatchPharmacyClaims) {
  this.showLoader();
  return this.financialPharmacyClaimsDataService
    .batchClaims(batchPharmacyClaims)
    .subscribe({
      next: (response:any) => {
        this.batchClaimsSubject.next(response);
        if (response.status) {
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
        }
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
}

 
}