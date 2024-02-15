import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject, catchError, of } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { Router } from '@angular/router';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { Pharmacy } from '../../entities/client-pharmacy';
import { PaymentBatchName } from '../../entities/financial-management/Payment-details';
import { BatchClaim } from '../../entities/financial-management/batch-claim';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { FinancialClaimTypeCode } from '../../enums/financial-claim-types';
import { FinancialClaimsDataService } from '../../infrastructure/financial-management/financial-claims.data.service';
import { IntlService } from '@progress/kendo-angular-intl';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class FinancialClaimsFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'desc';
  public selectedClaimsTab = 1

  public sortValueFinancialClaimsProcess = 'creationTime';
  public sortProcessList: SortDescriptor[] = [
    {
      field: this.sortValueFinancialClaimsProcess,
    },
  ];

  public sortValueFinancialInvoiceProcess = 'serviceStartDate';
  public sortInvoiceList: SortDescriptor[] = [
    {
      field: this.sortValueFinancialInvoiceProcess,
    },
  ];

  public sortValueFinancialClaimsBatch = 'creationTime';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueFinancialClaimsBatch,
    dir : 'desc'
  }];

  public sortValueFinancialClaimsPayments = 'batchNumber';
  public sortPaymentsList: SortDescriptor[] = [
    {
      field: this.sortValueFinancialClaimsPayments,
    },
  ];

  public sortValueBatchLog = 'creationTime';
  public sortBatchLogList: SortDescriptor[] = [{
    field: this.sortValueBatchLog, dir: 'desc'
  }];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [
    {
      field: this.sortValueClaims,
    },
  ];

  public sortValueBatchItem = 'creationTime';
  public sortBatchItemList: SortDescriptor[] = [{
    field: this.sortValueBatchItem, dir: 'desc'
  }];

  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [
    {
      field: this.sortValueReconcile,
    },
  ];

  public sortValueReconcilePaymentBreakout = 'invoiceNbr';
  public sortReconcilePaymentBreakoutList: SortDescriptor[] = [
    {
      field: this.sortValueReconcilePaymentBreakout,
    },
  ];

  public sortValueRecentClaimList = 'entryDate';
  public sortRecentClaimList: SortDescriptor[] = [{
    field: this.sortValueRecentClaimList,
  }];

  public serviceCostFlag = false;
  private showExceedMaxBenefitExceptionSubject = new Subject<any>();
  private showIneligibleExceptionSubject = new Subject<any>();
  private showBridgeUppExceptionSubject = new Subject<any>();
  private showDuplicatePaymentExceptionSubject = new Subject<any>();
  public showDuplicatePaymentHighlightSubject = new Subject<any>();
  showExceedMaxBenefitException$ = this.showExceedMaxBenefitExceptionSubject.asObservable();
  showIneligibleException$ = this.showIneligibleExceptionSubject.asObservable();
  showBridgeUppException$ = this.showBridgeUppExceptionSubject.asObservable();
  showDuplicatePaymentException$ = this.showDuplicatePaymentExceptionSubject.asObservable();
  showDuplicatePaymentExceptionHighlight$ = this.showDuplicatePaymentHighlightSubject.asObservable();



  private financialClaimsProcessDataSubject = new Subject<any>();
  financialClaimsProcessData$ =
    this.financialClaimsProcessDataSubject.asObservable();

  private financialClaimsInvoiceSubject = new Subject<any>();
  financialClaimsInvoice$ = this.financialClaimsInvoiceSubject.asObservable();

  private financialClaimsBatchDataSubject =  new Subject<any>();
  financialClaimsBatchData$ = this.financialClaimsBatchDataSubject.asObservable();

  private financialClaimsAllPaymentsDataLoaderSubject = new Subject<any>();
  financialClaimsAllPaymentsDataLoader$ =
    this.financialClaimsAllPaymentsDataLoaderSubject.asObservable();
  private financialClaimsAllPaymentsDataSubject = new Subject<any>();
  financialClaimsAllPaymentsData$ =
    this.financialClaimsAllPaymentsDataSubject.asObservable();

  private paymentsByBatchDataSubject =  new Subject<any>();
  private paymentByBatchGridLoaderSubject =  new BehaviorSubject<boolean>(false);
  paymentBatchNameSubject  =  new Subject<PaymentBatchName>();
  paymentsByBatchData$ = this.paymentsByBatchDataSubject.asObservable();
  paymentByBatchGridLoader$ = this.paymentByBatchGridLoaderSubject.asObservable();
  paymentBatchName$ = this.paymentBatchNameSubject.asObservable();
  private batchLogDataSubject = new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchReconcileDataSubject = new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private letterContentSubject = new Subject<any>();
  letterContentList$ = this.letterContentSubject.asObservable();

  private letterContentLoaderSubject = new Subject<any>();
  letterContentLoader$ = this.letterContentLoaderSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  private batchItemsLoaderSubject =  new BehaviorSubject<any>(false);
  batchItemsData$ = this.batchItemsDataSubject.asObservable();
  batchItemsLoader$ = this.batchItemsLoaderSubject.asObservable();

  private claimsListDataSubject = new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject = new Subject<any>();
  reconcileBreakoutSummary$ =
    this.reconcileBreakoutSummaryDataSubject.asObservable();

  private medicalClaimByCpt = new Subject<any>();
  medicalClaimByCpt$ = this.medicalClaimByCpt.asObservable();

  private searchCTPCodeSubject = new Subject<any>;
  public searchCTPCode$ = this.searchCTPCodeSubject.asObservable();

  private medicalProviderSearchLoaderVisibilitySubject = new Subject<boolean>;
  medicalProviderSearchLoaderVisibility$= this.medicalProviderSearchLoaderVisibilitySubject.asObservable();

  public pharmaciesSubject = new Subject<any>;
  pharmacies$ = this.pharmaciesSubject.asObservable();

  private clientSearchLoaderVisibilitySubject = new Subject<boolean>;
  clientSearchLoaderVisibility$= this.clientSearchLoaderVisibilitySubject.asObservable();

  public clientSubject = new BehaviorSubject<any>([]);
  clients$ = this.clientSubject.asObservable();

  private CPTCodeSearchLoaderVisibilitySubject = new Subject<boolean>;
  CPTCodeSearchLoaderVisibility$ =
    this.CPTCodeSearchLoaderVisibilitySubject.asObservable();

  private reconcilePaymentBreakoutListDataSubject =  new Subject<any>();
  reconcilePaymentBreakoutList$ = this.reconcilePaymentBreakoutListDataSubject.asObservable();
  private deleteClaimsSubject =  new Subject<any>();
  deleteClaims$ = this.deleteClaimsSubject.asObservable();

  private batchClaimsSubject =  new Subject<any>();
  batchClaims$ = this.batchClaimsSubject.asObservable();

  private recentClaimListDataSubject =  new Subject<any>();
  recentClaimsGridLists$ = this.recentClaimListDataSubject.asObservable();

  private unbatchEntireBatchSubject =  new Subject<any>();
  unbatchEntireBatch$ = this.unbatchEntireBatchSubject.asObservable();

  private unbatchClaimsSubject =  new Subject<any>();
  unbatchClaims$ = this.unbatchClaimsSubject.asObservable();

  private warrantNumberChangeSubject = new Subject<any>();
  warrantNumberChange$ = this.warrantNumberChangeSubject.asObservable();

  private warrantNumberChangeLoaderSubject = new Subject<any>();
  warrantNumberChangeLoader$ = this.warrantNumberChangeLoaderSubject.asObservable();

  claimsRecentClaimsProfilePhotoSubject = new Subject();
  claimsBathcPaymentProfilePhotoSubject = new Subject();
  dentalClaimAllPaymentClaimsProfilePhotoSubject = new Subject();
  claimsServiceProfileSubject = new Subject();
  medicalClaimsProfilePhotoSubject = new Subject();
  /** Private properties **/

  /** Public properties **/

  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showLoader() {
    this.loaderService.show();
  }
  hideLoader() {
    this.loaderService.hide();
  }

  errorShowHideSnackBar(subtitle: any) {
    this.notificationSnackbarService.manageSnackBar(
      SnackBarNotificationType.ERROR,
      subtitle,
      NotificationSource.UI
    );
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  /** Constructor**/
  constructor(
    public financialClaimsDataService: FinancialClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
    public intl: IntlService,
    private readonly userManagementFacade: UserManagementFacade,
  ) {}

  /** Public methods **/

  getClaimsType(router : Router)
  {
    return router.url.split('/')?.filter(element => element === FinancialClaimTypeCode.Dental || element ===FinancialClaimTypeCode.Medical)[0];
  }

  loadFinancialClaimsProcessListGrid(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter: string,
    claimsType: string
  ) {
    filter = JSON.stringify(filter);
    this.financialClaimsDataService.loadFinancialClaimsProcessListService(skipcount,  maxResultCount,  sort,  sortType, filter , claimsType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.financialClaimsProcessDataSubject.next(gridView);
        this.loadMedicalClaimsProcessDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  loadMedicalClaimsProcessDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.medicalClaimsProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadFinancialClaimsInvoiceListService(paymentRequestId : string, skipcount: number,  maxResultCount: number,  sort: string,  sortType: string,claimsType : string){

    this.financialClaimsDataService.loadFinancialClaimsInvoiceListService(paymentRequestId,skipcount,  maxResultCount,  sort,  sortType,claimsType)
    .subscribe({
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


  loadFinancialClaimsAllPaymentsListGrid(skipCount: number,  maxResultCount: number,  sort: string,  sortType: string, filter : string, claimsType : string){
    filter = JSON.stringify(filter);
    this.financialClaimsAllPaymentsDataLoaderSubject.next(true);
    this.financialClaimsDataService.loadFinancialClaimsAllPaymentsListService(skipCount, maxResultCount, sort, sortType, filter, claimsType).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse["items"],
          total: dataResponse["totalCount"]
        };
        this.financialClaimsAllPaymentsDataSubject.next(gridView);
        this.loadDentalClaimsAllPaymentDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
        this.financialClaimsAllPaymentsDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.financialClaimsAllPaymentsDataLoaderSubject.next(false);
      },
    });
  }

  loadDentalClaimsAllPaymentDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.dentalClaimAllPaymentClaimsProfilePhotoSubject.next(data);
          }
        },
      });
    }
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
        this.loadPaymentsDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.batchItemsLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.batchItemsLoaderSubject.next(false);
      },
    });
  }

  loadPaymentsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.claimsServiceProfileSubject.next(data);
          }
        },
      });
    }
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

  loadEachLetterTemplate(claimsType:any,templateParams:any){
    this.letterContentLoaderSubject.next(true);
    this.financialClaimsDataService.loadEachLetterTemplate(claimsType,templateParams).subscribe({
      next: (dataResponse:any) => {
        this.letterContentSubject.next(dataResponse);
        this.letterContentLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.letterContentLoaderSubject.next(false);
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

  loadReconcilePaymentBreakoutSummary(data:any){
    this.loaderService.show(); 
    this.financialClaimsDataService.loadReconcilePaymentBreakoutSummaryService(data).subscribe({
      next: (dataResponse) => {
        this.reconcileBreakoutSummaryDataSubject.next(dataResponse);
        this.loaderService.hide(); 
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
      },
    });
  }

  loadReconcilePaymentBreakoutListGrid(data:any) {
    this.loaderService.show(); 
    data.filter=JSON.stringify(data.filter);
    this.financialClaimsDataService
      .loadReconcilePaymentBreakoutListService(data)
      .subscribe({
        next: (dataResponse) => {
          this.reconcilePaymentBreakoutListDataSubject.next(dataResponse);
          if (dataResponse) {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.reconcilePaymentBreakoutListDataSubject.next(gridView);
            this.loaderService.hide();
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  searchcptcode(cptcode: string) {
    this.CPTCodeSearchLoaderVisibilitySubject.next(true);
    return this.financialClaimsDataService.searchcptcode(cptcode).subscribe({
      next: (response: any[]) => {
        response?.forEach((cptcodes: any) => {
          cptcodes.cptCode1 = `${cptcodes.cptCode1 ?? ''}`;
        });
        this.searchCTPCodeSubject.next(response);
        this.CPTCodeSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.CPTCodeSearchLoaderVisibilitySubject.next(false);
        this.snackbarService.manageSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  getMedicalClaimByPaymentRequestId(event: any, typeCode: string) {
    return this.financialClaimsDataService
      .getMedicalClaimByPaymentRequestId(event,typeCode)
      .pipe(
        catchError((err: any) => {
          this.loaderService.hide();
          this.notificationSnackbarService.manageSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
          if (!(err?.error ?? false)) {
            this.loggingService.logException(err);
            this.hideLoader();
          }
          return of(false);
        })
      );
  }

  public saveMedicalClaim(data: any, typeCode : string){
    return this.financialClaimsDataService.saveMedicalClaim(data,typeCode).pipe(
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

  getPcaCode(params: any){
    return this.financialClaimsDataService.getPcaCode(params);
  }

  public updateMedicalClaim(data: any, typeCode : string){
    return this.financialClaimsDataService.updateMedicalClaim(data,typeCode).pipe(
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

  searchProvidorsById(vendoraddressId: string, typeCode: string) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialClaimsDataService.searchProvidorsById(vendoraddressId, typeCode).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''}`;
        });
        this.pharmaciesSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    });
  }
  searchPharmacies(searchText: string, typeCode: string) {
    this.medicalProviderSearchLoaderVisibilitySubject.next(true);
    return this.financialClaimsDataService.searchPharmacies(searchText, typeCode).subscribe({
      next: (response: Pharmacy[]) => {
        response?.forEach((vendor:any) => {
          vendor.providerFullName = `${vendor.vendorName ?? ''} ${vendor.tin ?? ''}`;
        });
        this.pharmaciesSubject.next(response);
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
      },
      error: (err) => {
        this.medicalProviderSearchLoaderVisibilitySubject.next(false);
        this.snackbarService.manageSnackBar(SnackBarNotificationType.ERROR, err);
        this.loggingService.logException(err);
      }
    });
  }
loadRecentClaimListGrid(recentClaimsPageAndSortedRequestDto:any){
    recentClaimsPageAndSortedRequestDto.filter = JSON.stringify(recentClaimsPageAndSortedRequestDto.filter);
    this.financialClaimsDataService.loadRecentClaimListService(recentClaimsPageAndSortedRequestDto).subscribe({
      next: (dataResponse) => {
        this.recentClaimListDataSubject.next(dataResponse);
        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
          this.recentClaimListDataSubject.next(gridView);
          this.loadRecentClaimsDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }

  loadRecentClaimsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.by))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.claimsRecentClaimsProfilePhotoSubject.next(data);
          }
        },
      });
    }
  }

  loadServicesByPayment(paymentId: string, params:GridFilterParam, claimType:string){
    return this.financialClaimsDataService.loadServicesByPayment(paymentId, params, claimType);
  }


  loadBatchLogListGrid(batchId: string, isReconciled: boolean, params:GridFilterParam, claimType:string){
    this.paymentByBatchGridLoaderSubject.next(true);
    this.financialClaimsDataService.loadPaymentsByBatch(batchId, isReconciled, params, claimType).subscribe({
      next: (dataResponse) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.paymentsByBatchDataSubject.next(gridView);
        this.loadClaimsBatchDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.paymentByBatchGridLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.paymentByBatchGridLoaderSubject.next(false);
      },
    });
  }

  loadClaimsBatchDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.claimsBathcPaymentProfilePhotoSubject.next(data);
          }
        },
      });
    }
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
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  formatDateString(originalDate: string): string {
   // Parse the ISO 8601 formatted date
   const dateObject: Date = new Date(originalDate);

   // Check if the date is valid
   if (isNaN(dateObject.getTime())) {
     return 'Invalid Date';
   }

   // Format the date as needed
   const formattedDate: string = dateObject.toLocaleDateString('en-US', {
     day: '2-digit',
     month: '2-digit',
     year: 'numeric',
   });

   return formattedDate;
  }
  loadClientBySearchText(text : string): void {
    this.clientSearchLoaderVisibilitySubject.next(true);
    if(text){
      this.financialClaimsDataService.loadClientBySearchText(text).subscribe({

        next: (caseBySearchTextResponse) => {
          caseBySearchTextResponse?.forEach((data:any) => {
            
            let date =this.formatDateString(data.dob); 
            data.providerFullName = `${data.clientFullName ?? ''} `+' '+`${data.clientId?? ''}  `+' '+`${date?? ''}` +' '+`${data.ssn?? ''}`;
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
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  unbatchEntireBatch(paymentRequestBatchIds: string[], claimsType: string) {
    this.showLoader();
    return this.financialClaimsDataService
      .unbatchEntireBatch(paymentRequestBatchIds, claimsType)
      .subscribe({
        next: (response:any) => {
          this.unbatchEntireBatchSubject.next(response);
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

  unbatchClaims(paymentRequestIds: string[], claimsType: string) {
    this.showLoader();
    return this.financialClaimsDataService
      .unbatchClaims(paymentRequestIds, claimsType)
      .subscribe({
        next: (response:any) => {
          this.unbatchClaimsSubject.next(response);
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

  loadPrintAdviceLetterData(isReconciled: boolean, batchId:any,printAdviceLetterData: any,claimsType:any) {
    return this.financialClaimsDataService.getPrintAdviceLetterData(isReconciled, batchId,printAdviceLetterData,claimsType);
  }

  reconcilePaymentsAndLoadPrintLetterContent(reconcileData: any, claimsType:any) {
    return this.financialClaimsDataService.reconcilePaymentsAndLoadPrintAdviceLetterContent(reconcileData, claimsType);
}

viewAdviceLetterData(printAdviceLetterData: any, claimsType:any) {
  return this.financialClaimsDataService.viewPrintAdviceLetterData(printAdviceLetterData,claimsType);
}
loadExceededMaxBenefit(serviceCost: number, clientId: number, indexNumber: any, typeCode : string,clientCaseEligibilityId : string, paymentRequestId:string){
  this.showLoader();
  this.financialClaimsDataService.checkExceededMaxBenefit(serviceCost,clientId, typeCode,clientCaseEligibilityId, paymentRequestId).subscribe({
    next: (serviceCostResponse:any)=>{
      this.serviceCostFlag =  serviceCostResponse;
      let response = {
        flag: serviceCostResponse?.status == 0 ? false : true,
        indexNumber: indexNumber
      }
      this.showExceedMaxBenefitExceptionSubject.next(response);
    },
    error: (err:any) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
    },
  })
  this.hideLoader();
}
checkIneligibleException(startDtae: any,endDate: any, clientId: number, indexNumber: any, typeCode : string){
  this.showLoader();
  this.financialClaimsDataService.checkIneligibleException(startDtae,endDate,clientId,typeCode).subscribe({
    next: (data:any)=>{
      const flag =  data;
      let response = {
        flag: flag?.status == 0 ? false : true,
        indexNumber: indexNumber
      }
      this.showIneligibleExceptionSubject.next(response);
    },
    error: (err:any) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
    },
  })
  this.hideLoader();
}
checkGroupException(startDtae: any,endDate: any, clientId: number,cptCode:any, indexNumber: any, typeCode : string){
  this.showLoader();
  this.financialClaimsDataService.checkGroupException(startDtae,endDate,clientId,cptCode,typeCode).subscribe({
    next: (data:any)=>{
      const flag =  data;
      let response = {
        flag: flag?.status == 0 ? false : true,
        indexNumber: indexNumber
      }
      this.showBridgeUppExceptionSubject.next(response);
    },
    error: (err:any) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
    },
  })
  this.hideLoader();
}
checkDuplicatePaymentException(params: any){
  this.showLoader();
  this.financialClaimsDataService.checkDuplicatePaymentException(params).subscribe({
    next: (data:any)=>{
      const flag =  data;
      let response = {
        flag: flag?.status == 0 ? false : true,
        indexNumber: params.indexNumber
      }
      this.showDuplicatePaymentExceptionSubject.next(response);
    },
    error: (err:any) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
    },
  })
  this.hideLoader();
}
deleteClaimService(tpaInvoiceId: any, typeCode: string) {
  return this.financialClaimsDataService
    .deleteClaimService(tpaInvoiceId,typeCode)
    .pipe(
      catchError((err: any) => {
        this.loaderService.hide();
        this.notificationSnackbarService.manageSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
        if (!(err?.error ?? false)) {
          this.loggingService.logException(err);
          this.hideLoader();
        }
        return of(false);
      })
    );
}

loadFinancialClaimsInvoiceList(paymentRequestId : string, skipcount: number,  maxResultCount: number,  sort: string,  sortType: string,claimsType : string){
  return this.financialClaimsDataService.loadFinancialClaimsInvoiceListService(paymentRequestId,skipcount,  maxResultCount,  sort,  sortType,claimsType) 
}

  CheckWarrantNumber(batchId:any,warrantNumber:any,vendorId:any, claimsType:any){
    this.warrantNumberChangeLoaderSubject.next(true);
    this.financialClaimsDataService.CheckWarrantNumber(batchId,warrantNumber,vendorId,claimsType).subscribe({
      next: (dataResponse:any) => {       
        this.warrantNumberChangeSubject.next(dataResponse);
        this.warrantNumberChangeLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.warrantNumberChangeLoaderSubject.next(false);
      },
    });
  }
}
