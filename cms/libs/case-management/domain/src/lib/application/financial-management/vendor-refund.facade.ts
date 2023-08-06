import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject, catchError, of } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialVendorRefundDataService } from '../../infrastructure/financial-management/vendor-refund.data.service';
import { Pharmacy } from '@cms/case-management/domain';

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
  
  /** Private properties **/
  private medicalProviderSearchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  public pharmaciesSubject = new BehaviorSubject<any>([]);
  
  private clientSearchLoaderVisibilitySubject = new BehaviorSubject<boolean>(false);
  public clientSubject = new BehaviorSubject<any>([]);
 
  /** Public properties **/
  medicalProviderSearchLoaderVisibility$= this.medicalProviderSearchLoaderVisibilitySubject.asObservable();
  pharmacies$ = this.pharmaciesSubject.asObservable();

  clientSearchLoaderVisibility$= this.clientSearchLoaderVisibilitySubject.asObservable();
  clients$ = this.clientSubject.asObservable();

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
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
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

  searchPharmacies(searchText: string) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorRefundDataService.searchPharmacies(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} #${vendor.vendorNbr ?? ''} ${vendor.address1 ?? ''} ${vendor.address2 ?? ''} ${vendor.cityCode ?? ''} ${vendor.stateCode ?? ''} ${vendor.zip ?? ''}`;
        });
        this.pharmaciesSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {  
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      },
    });
  }

  loadClientBySearchText(text : string): void {
    this.clientSearchLoaderVisibilitySubject.next(true);
    if(text){
      this.financialVendorRefundDataService.loadClientBySearchText(text).subscribe({
      
        next: (caseBySearchTextResponse) => {
          this.clientSubject.next(caseBySearchTextResponse);
          this.clientSearchLoaderVisibilitySubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)    
        },
      });
    }
    else{
      this.clientSubject.next(null);
      this.clientSearchLoaderVisibilitySubject.next(false);
    }
  }

  public saveMedicalClaim(data: any){
    return this.financialVendorRefundDataService.saveMedicalClaim(data).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    );
  }

  public updateMedicalClaim(data: any){
    return this.financialVendorRefundDataService.updateMedicalClaim(data).pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    );
  }
}