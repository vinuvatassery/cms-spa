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

  selectedRefundsTab = 1
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueRefundInformationGrid = 'creationTime';
  public sortValueEntryInformationGrid = 'entryDate';
  public sortRefundInformationGrid: SortDescriptor[] = [{
    field: this.sortValueRefundInformationGrid,
  }];


  public sortValueRefundProcess = 'creationTime';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueRefundProcess,
  }];

  public sortValueRefundBatch = 'batchName';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueRefundBatch,
  }];

  public sortValueRefundPayments = 'batchNumber';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueRefundPayments,
  }];

  public sortValueBatchLog = 'vendorName';
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
  private clientSearchLoaderVisibilitySubject = new Subject<boolean>;
  clientSearchLoaderVisibility$= this.clientSearchLoaderVisibilitySubject.asObservable();
  public clientSubject = new BehaviorSubject<any>([]);

  clients$ = this.clientSubject.asObservable();
  private medicalProviderSearchLoaderVisibilitySubject = new Subject<boolean>;

  medicalProviderSearchLoaderVisibility$= this.medicalProviderSearchLoaderVisibilitySubject.asObservable();
   public pharmaciesSubject = new Subject<any>;
  pharmacies$ = this.pharmaciesSubject.asObservable();

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


  private clientClaimsListDataSubject =  new Subject<any>();
  clientClaimsListData$ = this.clientClaimsListDataSubject.asObservable();


  private pharmacyPaymentsListDataSubject =  new Subject<any>();
  pharmacyPaymentsListData$ = this.pharmacyPaymentsListDataSubject.asObservable();

  private insuranceRefundInformationSubject =  new Subject<any>();
  insuranceRefundInformation$ = this.insuranceRefundInformationSubject.asObservable();


  private addUpdateInsuranceRefundClaimSubject =  new Subject<any>();
  addUpdateInsuranceRefundClaim$ = this.addUpdateInsuranceRefundClaimSubject.asObservable();



  private insuranceRefundInformationLoaderSubject = new BehaviorSubject<any>(false);
  insuranceRefundInformationLoader$ = this.insuranceRefundInformationLoaderSubject.asObservable();


  private deleteRefundsSubject =  new Subject<any>();
  deleteRefunds$ = this.deleteRefundsSubject.asObservable();

  private batchRefundsSubject =  new Subject<any>();
  batchRefunds$ = this.batchRefundsSubject.asObservable();

  private unbatchRefundsSubject =  new Subject<any>();
  unbatchRefunds$ = this.unbatchRefundsSubject.asObservable();

  public tpaVendorsSubject = new Subject<any>;
  tpavendors$ = this.tpaVendorsSubject.asObservable();
  
  public insurancevendorsSubject = new Subject<any>;
  insurancevendors$ = this.insurancevendorsSubject.asObservable();
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

  addInsuranceRefundClaim(data:any){
   
    this.financialVendorRefundDataService.addInsuranceRefundClaim(data).subscribe({
      next: (dataResponse:any) => {
        this.addUpdateInsuranceRefundClaimSubject.next(dataResponse);
        
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , dataResponse.message) 
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  getInsuranceRefundEditInformation(vendorId :any,clientId:any , paginationSortingDto:any){  
  this.loaderService.show();
  paginationSortingDto.filter = JSON.stringify(paginationSortingDto.filter);
    this.financialVendorRefundDataService.getInsuranceRefundEditInformation(vendorId,clientId,paginationSortingDto).subscribe({
      next: (dataResponse:any) => {
          const gridView = {
            data: dataResponse.items,
            total: dataResponse.totalCount,
          };
        this.financialPremiumsProcessDataSubject.next(gridView); 
          this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  updateInsuranceRefundEditInformation(paginationSortingDto:any){  
    this.loaderService.show();
    paginationSortingDto.filter = JSON.stringify(paginationSortingDto.filter);
      this.financialVendorRefundDataService.updateInsuranceRefundEditInformation(paginationSortingDto).subscribe({
        next: (dataResponse:any) => {
          this.addUpdateInsuranceRefundClaimSubject.next(dataResponse);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS , dataResponse.message)  ;
            this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
          this.hideLoader();
        },
      });
    }
  
  
  loadVendorRefundAllPaymentsListGrid(recentClaimsPageAndSortedRequestDto : any){
    this.financialVendorRefundDataService.loadVendorRefundAllPaymentsListService(recentClaimsPageAndSortedRequestDto).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount']
        };
        this.vendorRefundAllPaymentsDataSubject.next(gridView);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  loadBatchLogListGrid(loadBatchLogListRequestDto : any, batchId : string){
    this.financialVendorRefundDataService.loadBatchLogListService(loadBatchLogListRequestDto,batchId).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount']
        };
        this.batchLogDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  loadVendorRefundBatchListGrid(loadBatchListRequestDto : any){
    this.financialVendorRefundDataService.loadVendorRefundBatchListService(loadBatchListRequestDto).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount']
        };
        this.vendorRefundBatchDataSubject.next(gridView);
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
  private financialTpaDataSubject = new Subject<any>();
  tpaData$ = this.financialTpaDataSubject.asObservable();
  
  loadMedicalPremiumList(ClaimsPageAndSortedRequestDto:any){
    ClaimsPageAndSortedRequestDto.filter = JSON.stringify(ClaimsPageAndSortedRequestDto.filter);

this.loaderService.show();
    this.financialVendorRefundDataService.loadMedicalPremiumList(ClaimsPageAndSortedRequestDto).subscribe({
      next: (dataResponse) => {
        if (dataResponse) {
          
          this.loaderService.hide();
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
        this.financialPremiumsProcessDataSubject.next(gridView);
      }},
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadTPARefundList(ClaimsPageAndSortedRequestDto:any){
      
    ClaimsPageAndSortedRequestDto.filter = JSON.stringify(ClaimsPageAndSortedRequestDto.filter);
   this.loaderService.show();
    this.financialVendorRefundDataService.loadTPARefundList(ClaimsPageAndSortedRequestDto).subscribe({
      next: (dataResponse) => {
        if (dataResponse) {
          this.loaderService.hide();
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
            acceptsCombinedPaymentsCount: dataResponse['acceptsCombinedPaymentsQueryCount'],
          };
        this.financialTpaDataSubject.next(gridView);
      }},
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  loadInsurancevendorBySearchText(searchText: string,clientId:number) {
    
   this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialVendorRefundDataService.loadInsurancevendorBySearchText(searchText,clientId).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
            vendor.providerFullName = `${vendor.vendorName ?? ''}`;
        });
        this.insurancevendorsSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.loggingService.logException(err);
      }
    });
  } 
  loadTpavendorBySearchText(searchText: string,clientId:number) {
    
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
     return this.financialVendorRefundDataService.loadTpavendorBySearchText(searchText,clientId).subscribe({
       next: (response: Pharmacy[]) => {
         response?.forEach((vendor:any) => {
             vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''}`;
                  
         });
         this.tpaVendorsSubject.next(response);
         this.medicalProviderSearchLoaderVisibilitySubject.next(false);
       },
       error: (err) => {
         this.medicalProviderSearchLoaderVisibilitySubject.next(false);
         this.loggingService.logException(err);
       }
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

  deleteRefunds(paymentRequestIds: string[]) {
    this.showLoader();
    return this.financialVendorRefundDataService.deleteRefunds(paymentRequestIds).subscribe({
      next: (response:any) => {
        this.deleteRefundsSubject.next(response);
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

  batchRefunds(batchId: any) {
    this.showLoader();
    return this.financialVendorRefundDataService
      .batchRefunds(batchId)
      .subscribe({
        next: (response:any) => {
          this.batchRefundsSubject.next(response);
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

  unbatchRefund(paymentRequestIds: string[]) {
    this.showLoader();
    return this.financialVendorRefundDataService
      .unbatchRefunds(paymentRequestIds)
      .subscribe({
        next: (response:any) => {
          this.unbatchRefundsSubject.next(response);
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

  getInsuranceRefundInformation(insuranceRefundInformation :any){
    this.insuranceRefundInformationLoaderSubject.next(true)
    this.financialVendorRefundDataService.getInsurnaceRefundInformation(insuranceRefundInformation).subscribe({
      next: (dataResponse:any) => {
        const gridView = {
          data: dataResponse.items,
          total: dataResponse.totalCount,
        };
        this.insuranceRefundInformationSubject.next(gridView);
        this.hideLoader();
        this.insuranceRefundInformationLoaderSubject.next(false)
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
        this.insuranceRefundInformationLoaderSubject.next(false)
      },
      });
  }
  loadClientBySearchText(text : string): void {
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
  loadRefundClaimsListGrid(ClaimsPageAndSortedRequestDto:any) {
    this.showLoader();
    ClaimsPageAndSortedRequestDto.filter = JSON.stringify(ClaimsPageAndSortedRequestDto.filter);
    this.financialVendorRefundDataService. loadRefundClaimsService(ClaimsPageAndSortedRequestDto).subscribe({
      next: (dataResponse) => {
        this.clientClaimsListDataSubject.next(dataResponse);
        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
          this.clientClaimsListDataSubject.next(gridView);
          this.hideLoader();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.hideLoader();
      },
    });
  }
}
