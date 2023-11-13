import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialVendorRefundDataService } from '../../infrastructure/financial-management/vendor-refund.data.service';
import { Pharmacy } from '../../entities/client-pharmacy';
 
@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundFacade {
 
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';
  public sortValueRefundProcess = 'creationTime';
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
 
  public sortValueClaims = 'invoiceId';
  public sortClaimsList: SortDescriptor[] = [{
    field: this.sortValueClaims,
  }];
 
  public sortValuePremiums = 'insuranceCarrier';
  public sortPremiumsList: SortDescriptor[] = [{
    field: this.sortValuePremiums,
  }];
 
 
  public sortValueClientClaims = 'clientId';
  public sortClientClaimsList: SortDescriptor[] = [{
    field: this.sortValueClientClaims,
  }];
 
  public sortValuePharmacyPayment = 'clientId';
  public sortPharmacyPaymentList: SortDescriptor[] = [{
    field: this.sortValuePharmacyPayment,
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
  private medicalProviderSearchLoaderVisibilitySubject = new Subject<boolean>;
  medicalProviderSearchLoaderVisibility$= this.medicalProviderSearchLoaderVisibilitySubject.asObservable();
 
  
 
  private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimsListData$ = this.clientClaimsListDataSubject.asObservable();
  private clientSearchLoaderVisibilitySubject = new Subject<boolean>;
  clientSearchLoaderVisibility$= this.clientSearchLoaderVisibilitySubject.asObservable();
  public clientSubject = new BehaviorSubject<any>([]);
  clients$ = this.clientSubject.asObservable();
 
  private pharmacyPaymentsListDataSubject =  new Subject<any>();
  pharmacyPaymentsListData$ = this.pharmacyPaymentsListDataSubject.asObservable();
  public pharmaciesSubject = new Subject<any>;
  pharmacies$ = this.pharmaciesSubject.asObservable();
  public vendorsSubject = new Subject<any>;
  vendors$ = this.vendorsSubject.asObservable();
  /** Private properties **/
 
  /** Public properties **/
 
  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();
  public selectedClaimsTab = 1
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
  
  private financialPremiumsProcessDataSubject = new Subject<any>();
  financialPremiumsProcessData$ = this.financialPremiumsProcessDataSubject.asObservable();
  loadMedicalPremiumList(
    skipcount: number,
    maxResultCount: number,
    sort: any,
    sortType: string,
    filter:string){
      debugger
    
    this.financialVendorRefundDataService.loadMedicalPremiumList( skipcount,
      maxResultCount,
      sort,
      sortType,
      filter).subscribe({
      next: (dataResponse) => {
        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
            acceptsCombinedPaymentsCount: dataResponse['acceptsCombinedPaymentsQueryCount'],
          };
        this.financialPremiumsProcessDataSubject.next(gridView);
      }},
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadClientClaimsListGrid(){
    this.financialVendorRefundDataService.loadClientClaimsListService().subscribe({
      next: (dataResponse) => {
        this.clientClaimsListDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });  
  }
 
  loadPharmacyPaymentsListGrid(){
    this.financialVendorRefundDataService.loadPharmacyPaymentsListService().subscribe({
      next: (dataResponse) => {
        this.pharmacyPaymentsListDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }
  loadFinancialRefundProcessListGrid(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter: string,
  ) {
    filter = JSON.stringify(filter);
    this.financialVendorRefundDataService.loadFinancialRefundProcessListService(skipcount,  maxResultCount,  sort,  sortType, filter).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.vendorRefundProcessDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });  
  }
  
  loadClientBySearchText(text : string): void {
    debugger;
    this.clientSearchLoaderVisibilitySubject.next(true);
    if(text){
      this.financialVendorRefundDataService.loadClientBySearchText(text).subscribe({
        next: (caseBySearchTextResponse) => {
          caseBySearchTextResponse?.forEach((client:any) => {
            client.clientNames = `${client.clientFullName ?? ''} ${client.clientId?? ''}  ${client.ssn?? ''}`;
          });
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
  loadPharmacyBySearchText(searchText: string,) {
    debugger;
   this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorRefundDataService.loadPharmacyBySearchText(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''}`;
        });
        this.pharmaciesSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.loggingService.logException(err);
      }
    });
  }
  loadvendorBySearchText(searchText: string,) {
    debugger;
   this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorRefundDataService.loadvendorBySearchText(searchText).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          debugger
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''}`;
        });
        this.vendorsSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.loggingService.logException(err);
      }
    });
  }
}
