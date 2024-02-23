import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import {
  ConfigurationProvider, DocumentFacade,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { FinancialPharmacyClaimsDataService } from '../../infrastructure/financial-management/pharmacy-claims.data.service';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { BatchPharmacyClaims } from '../../entities/financial-management/batch-pharmacy-claims';
import { Vendor } from '../../entities/vendor';
import { Client } from '../../entities/client';
import { PharmacyClaims } from '../../entities/financial-management/pharmacy-claim';
import { Drug } from '../../entities/drug';
import { DrugCategoryCode } from '../../enums/drug-category-code.enum';
import { PaymentBatchName } from '../../entities/financial-management/Payment-details';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class FinancialPharmacyClaimsFacade {
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'desc';

  public selectedClaimsTab = 1
  batchClaimsSubject  =  new Subject<any>();
  batchClaims$ = this.batchClaimsSubject.asObservable();

  deleteClaimsSubject  =  new Subject<any>();
  deleteClaims$ = this.deleteClaimsSubject.asObservable();

  private unbatchEntireBatchSubject =  new Subject<any>();
  unbatchEntireBatch$ = this.unbatchEntireBatchSubject.asObservable();
 
  private unbatchClaimSubject =  new Subject<any>();
  unbatchClaims$ = this.unbatchClaimSubject.asObservable();
 
  private warrantNumberChangeSubject = new Subject<any>();
  warrantNumberChange$ = this.warrantNumberChangeSubject.asObservable();

  private warrantNumberChangeLoaderSubject = new Subject<any>();
  warrantNumberChangeLoader$ = this.warrantNumberChangeLoaderSubject.asObservable();
  

  public sortValuePharmacyClaimsProcess = 'creationTime';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValuePharmacyClaimsProcess,
  }];

  public sortValuePharmacyClaimsBatch = 'creationTime';
  public sortBatchList: SortDescriptor[] = [
    {
      field: this.sortValuePharmacyClaimsBatch,
    },
  ];

  public sortValuePharmacyClaimsPayments = 'batchName';
  public sortPaymentsList: SortDescriptor[] = [
    {
      field: this.sortValuePharmacyClaimsPayments,
    },
  ];

  public sortValueBatchLog = 'vendorName';
  public sortBatchLogList: SortDescriptor[] = [
    {
      field: this.sortValueBatchLog,
    },
  ];

  public sortValueClaims = 'batch';
  public sortClaimsList: SortDescriptor[] = [
    {
      field: this.sortValueClaims,
    },
  ];

  public sortValueBatchItem = 'vendorName';
  public sortBatchItemList: SortDescriptor[] = [
    {
      field: this.sortValueBatchItem,
    },
  ];

  public sortValueReconcile = 'vendorName';
  public sortReconcileList: SortDescriptor[] = [
    {
      field: this.sortValueReconcile,
    },
  ];
  public sortValueReconcileBreakout = 'clientName';
  public sortReconcileBreakoutList: SortDescriptor[] = [
    {
      field: this.sortValueReconcileBreakout,
    },
  ];
  public sortValueRecentClaimList = 'fillDate';
  public sortRecentClaimList: SortDescriptor[] = [{
    field: this.sortValueRecentClaimList,
  }];
  public showDuplicatePaymentHighlightSubject = new Subject<any>();
  showDuplicatePaymentExceptionHighlight$ = this.showDuplicatePaymentHighlightSubject.asObservable();

  private pharmacyClaimsProcessDataSubject = new Subject<any>();
  pharmacyClaimsProcessData$ = this.pharmacyClaimsProcessDataSubject.asObservable();

  private pharmacyClaimsProcessLoaderSubject = new BehaviorSubject<boolean>(true);
  pharmacyClaimsProcessLoader$ = this.pharmacyClaimsProcessLoaderSubject.asObservable();

  private pharmacyClaimsBatchDataSubject = new Subject<any>();
  pharmacyClaimsBatchData$ = this.pharmacyClaimsBatchDataSubject.asObservable();
  private pharmacyClaimsBatchLoaderSubject = new Subject<any>();
  pharmacyClaimsBatchLoader$ = this.pharmacyClaimsBatchLoaderSubject.asObservable();

  private pharmacyClaimsAllPaymentsDataSubject = new Subject<any>();
  pharmacyClaimsAllPaymentsData$ = this.pharmacyClaimsAllPaymentsDataSubject.asObservable();

  private pharmacyClaimsAllPaymentsLoaderSubject = new BehaviorSubject<any>(false);
  pharmacyClaimsAllPaymentsLoader$ = this.pharmacyClaimsAllPaymentsLoaderSubject.asObservable();

  private batchReconcileDataSubject = new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject = new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

  private claimsListDataSubject = new Subject<any>();
  claimsListData$ = this.claimsListDataSubject.asObservable();

  private addPharmacyClaimDataSubject = new Subject<any>();
  addPharmacyClaim$ = this.addPharmacyClaimDataSubject.asObservable();

  private editPharmacyClaimDataSubject = new Subject<any>();
  editPharmacyClaim$ = this.editPharmacyClaimDataSubject.asObservable();

  private getPharmacyClaimDataSubject = new Subject<any>();
  getPharmacyClaim$ = this.getPharmacyClaimDataSubject.asObservable();

  searchPharmaciesDataSubject = new Subject<any>();
  searchPharmacies$ = this.searchPharmaciesDataSubject.asObservable();

  private searchPharmaciesLoaderDataSubject = new Subject<any>();
  searchPharmaciesLoader$ = this.searchPharmaciesLoaderDataSubject.asObservable();

  searchClientsDataSubject = new Subject<any>();
  searchClients$ = this.searchClientsDataSubject.asObservable();

  private searchClientLoaderDataSubject = new Subject<any>();
  searchClientLoader$ = this.searchClientLoaderDataSubject.asObservable();

  private searchDrugsDataSubject = new Subject<any>();
  searchDrugs$ = this.searchDrugsDataSubject.asObservable();

  private searchDrugsLoaderDataSubject = new Subject<any>();
  searchDrugsLoader$ = this.searchDrugsLoaderDataSubject.asObservable();


  private paymentsByBatchDataSubject =  new Subject<any>();
  private paymentByBatchGridLoaderSubject =  new BehaviorSubject<boolean>(false);
    batchLogData$ = this.paymentsByBatchDataSubject.asObservable();

  paymentByBatchGridLoader$ = this.paymentByBatchGridLoaderSubject.asObservable();
  private recentClaimListDataSubject =  new Subject<any>();
  recentClaimsGridLists$ = this.recentClaimListDataSubject.asObservable();

  private letterContentSubject = new Subject<any>();
  letterContentList$ = this.letterContentSubject.asObservable();

  private letterContentLoaderSubject = new Subject<any>();
  letterContentLoader$ = this.letterContentLoaderSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject = new Subject<any>();
  reconcileBreakoutSummary$ =
    this.reconcileBreakoutSummaryDataSubject.asObservable();

  private reconcilePaymentBreakoutListDataSubject =  new Subject<any>();
  reconcilePaymentBreakoutList$ = this.reconcilePaymentBreakoutListDataSubject.asObservable();

  private reconcilePaymentBreakoutListLoaderDataSubject =  new Subject<any>();
  reconcilePaymentBreakoutLoaderList$ = this.reconcilePaymentBreakoutListLoaderDataSubject.asObservable();

  paymentBatchNameSubject  =  new Subject<PaymentBatchName>();
  paymentBatchName$ = this.paymentBatchNameSubject.asObservable();

  pharmacyClaimsProcessListProfilePhotoSubject = new Subject();
  pharmacyClaimnsAllPaymentsProfilePhotoSubject = new Subject();
  pharmacyBreakoutProfilePhotoSubject = new Subject();
  pharmacyRecentClaimsProfilePhotoSubject = new Subject();
  pharmacyRecentClaimsProfilePhoto$ = this.pharmacyRecentClaimsProfilePhotoSubject.asObservable();
  pharmacyBatchDetailProfilePhotoSubject = new Subject();
  pharmacyBatchListDetailProfilePhotoSubject = new Subject();
  pharmacyClaimsRecentProfilePhotoSubject = new Subject();
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
    public financialPharmacyClaimsDataService: FinancialPharmacyClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService,
    private readonly documentFacade: DocumentFacade,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/
   loadPharmacyClaimsProcessListGrid(params: GridFilterParam){
    this.pharmacyClaimsProcessLoaderSubject.next(true);
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsProcessListService(params).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'] as PharmacyClaims,
          total: dataResponse['totalCount'],
        };
        this.pharmacyClaimsProcessDataSubject.next(gridView);
        this.loadDistinctUserIdsAndProfilePhoto(dataResponse['items']);
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
    });
  }

  loadDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.pharmacyClaimsProcessListProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 


  addPharmacyClaim(data: any) {
    this.showLoader();
    this.financialPharmacyClaimsDataService.addPharmacyClaim(data).subscribe({
      next: (dataResponse) => {
        this.addPharmacyClaimDataSubject.next(dataResponse);
        this.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          dataResponse?.message
        );
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  exportPharmacyClaimAllPayments(params: any){
    const fileName = 'pharmacy-claims-all-payments'
    this.documentFacade.getExportFile(params,`claims/pharmacies/payments`, fileName);
  }

  exportPharmacyClaimsProcessListGrid(params: any){
    const fileName = 'pharmacy-claims-process'
    this.documentFacade.getExportFile(params,`claims/pharmacies` , fileName);
  }

  exportPharmacyClaimsBatchListGrid(params: any){
    const fileName = 'pharmacy-claims-batches'
    this.documentFacade.getExportFile(params,`claims/pharmacy/batches` , fileName);
  }

  updatePharmacyClaim(data: any) {
    this.showLoader();
    this.financialPharmacyClaimsDataService
      .updatePharmacyClaim(data)
      .subscribe({
        next: (dataResponse) => {
          this.editPharmacyClaimDataSubject.next(dataResponse);
          this.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            dataResponse?.message
          );
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  getPharmacyClaim(paymentRequestId: string) {
    this.showLoader();
    this.financialPharmacyClaimsDataService
      .getPharmacyClaim(paymentRequestId)
      .subscribe({
        next: (dataResponse) => {
          this.getPharmacyClaimDataSubject.next(dataResponse);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  searchPharmacies(searchText: string) {
    this.searchPharmaciesLoaderDataSubject.next(true);
    this.financialPharmacyClaimsDataService
      .searchPharmacies(searchText)
      .subscribe({
        next: (dataResponse : Vendor) => {


        Object.values(dataResponse).forEach((key) => {

          key.fullCustomName = key?.vendorName + ' '+ key?.tin ?? ''+ ' '+ key?.mailCode ?? '' + ' '+ key?.address
       
        });
          this.searchPharmaciesDataSubject.next(dataResponse);
          this.searchPharmaciesLoaderDataSubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.searchPharmaciesLoaderDataSubject.next(false);
        },
      });
  }

  searchClients(searchText: string) {
    this.searchClientLoaderDataSubject.next(true);
    this.financialPharmacyClaimsDataService
    .searchClients(searchText)
    .subscribe({
      next: (dataResponse : Client) => {
        Object.values(dataResponse).forEach((key) => {

          key.fullCustomName = key?.clientFullName + ' '+ key?.clientId + ' '+ (key?.ssn ?? '') + ' '+ key?.dob
       
        });
        this.searchClientsDataSubject.next(dataResponse);
        this.searchClientLoaderDataSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.searchClientLoaderDataSubject.next(false);
      },
    });
  }

  searchDrug(ndcCode: string, isClientRestricted :any) {
    this.searchDrugsLoaderDataSubject.next(true);
    this.financialPharmacyClaimsDataService
    .searchDrug(ndcCode)
    .subscribe({
      next: (dataResponse : Drug) => {
        let drugs :any =[]
      
          Object.values(dataResponse).forEach((key) => {
            key.displayNdcCode = key?.ndcNbr?.replace(/\D/g, '').replace(/^(\d{5})/, '$1-').replace(/-(\d{4})/, '-$1-')

            if(isClientRestricted === true)
            {
              
              if(key?.drugTypeCode === DrugCategoryCode.OpportunisticInfection  
                || key?.drugTypeCode === DrugCategoryCode.Hepatitis 
                || key?.drugTypeCode === DrugCategoryCode.Hiv)
              {               
                drugs.push(key)
              }
            }
            else
            {
              drugs.push(key)
            }
          });
        
        
        this.searchDrugsDataSubject.next(drugs);
        this.searchDrugsLoaderDataSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.searchDrugsLoaderDataSubject.next(false);
      },
    });
  }




  loadPharmacyClaimsBatchListGrid(params: any) {
    this.pharmacyClaimsBatchLoaderSubject.next(true);
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsBatchListService(params).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.pharmacyClaimsBatchDataSubject.next(gridView);
        this.pharmacyClaimsBatchLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.pharmacyClaimsBatchLoaderSubject.next(false);
      },
    });
  }

  loadPharmacyClaimsAllPaymentsListGrid(params: any) {
    this.pharmacyClaimsAllPaymentsLoaderSubject.next(true);
    this.financialPharmacyClaimsDataService
      .loadPharmacyClaimsAllPaymentsListService(params)
      .subscribe({
        next: (dataResponse) => {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
            spotsPaymentsQueryCount: dataResponse['spotsPaymentsQueryCount'],
          };
          this.pharmacyClaimsAllPaymentsLoaderSubject.next(false);
          this.pharmacyClaimsAllPaymentsDataSubject.next(gridView);
          this.loadDistinctUsersAndProfilePhoto(dataResponse['items']);
          this.hideLoader();
        },
        error: (err) => {
          this.pharmacyClaimsAllPaymentsLoaderSubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  loadDistinctUsersAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.pharmacyClaimnsAllPaymentsProfilePhotoSubject.next(data);
          }
        },
      });
    }
  }

    loadBatchLogListGrid(batchId: string, isReconciled: boolean, params: GridFilterParam, claimType: string) {
        this.paymentByBatchGridLoaderSubject.next(true);
        this.financialPharmacyClaimsDataService.loadPaymentsByBatch(batchId, isReconciled, params, claimType).subscribe({
            next: (dataResponse) => {
                const gridView: any = {
                    data: dataResponse['items'],
                    total: dataResponse?.totalCount,
                    spotsPaymentsQueryCount: dataResponse['spotsPaymentsQueryCount'],
                };

                this.paymentsByBatchDataSubject.next(gridView);
                this.pharmacyBatchLogListUserIdsAndProfilePhotos(dataResponse['items']);
                this.paymentByBatchGridLoaderSubject.next(false);
            },
            error: (err) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
                this.paymentByBatchGridLoaderSubject.next(false);
            },
        });
    }

    pharmacyBatchLogListUserIdsAndProfilePhotos(data: any[]) {
      const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
      if(distinctUserIds){
        this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
        .subscribe({
          next: (data: any[]) => {
            if (data.length > 0) {
              this.pharmacyBatchDetailProfilePhotoSubject.next(data);
            }
          },
        });
      }
    }

  loadBatchItemsListGrid() {
    this.financialPharmacyClaimsDataService
      .loadBatchItemsListService()
      .subscribe({
        next: (dataResponse: any) => {
          this.batchItemsDataSubject.next(dataResponse);
          this.loadPharmacyBatchItemsDistinctUserIdsAndProfilePhoto(dataResponse?.data);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  loadPharmacyBatchItemsDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.pharmacyBatchListDetailProfilePhotoSubject.next(data);
          }
        },
      });
    }
  } 

  loadReconcileListGrid(batchId:any,paginationParameters:any){
    this.financialPharmacyClaimsDataService.loadReconcileListService(batchId,paginationParameters).subscribe({
      next: (dataResponse:any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.batchReconcileDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  } 

  unbatchEntireBatch(paymentRequestBatchIds: string) {
    this.showLoader();
    return this.financialPharmacyClaimsDataService
      .unbatchEntireBatch(paymentRequestBatchIds)
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

  unbatchPremiums(paymentRequestIds: string) {
    this.showLoader();
    return this.financialPharmacyClaimsDataService
      .unbatchClaim(paymentRequestIds)
      .subscribe({
        next: (response:any) => {
          this.unbatchClaimSubject.next(response);
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
        this.batchClaimsSubject.next(false);
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
}

    loadPharmacyPrescriptionsServices(batchId: string, params: GridFilterParam, claimType: string) {
        return this.financialPharmacyClaimsDataService.loadPharmacyPrescriptionsServices(batchId, params, claimType);
    }
 deleteClaims(batchPharmacyClaims: BatchPharmacyClaims) {
  this.showLoader();
  return this.financialPharmacyClaimsDataService
    .deleteClaims(batchPharmacyClaims)
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
deletebatches(batchPharmacyClaims: BatchPharmacyClaims) {
  this.showLoader();
  
  return this.financialPharmacyClaimsDataService
    .deleteClaims(batchPharmacyClaims)
    .subscribe({
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
loadRecentClaimListGrid(recentClaimsPageAndSortedRequestDto:any){
  recentClaimsPageAndSortedRequestDto.filter = JSON.stringify(recentClaimsPageAndSortedRequestDto.filter);
  this.financialPharmacyClaimsDataService.loadRecentClaimListService(recentClaimsPageAndSortedRequestDto).subscribe({
    next: (dataResponse) => {
      this.recentClaimListDataSubject.next(dataResponse);
      if (dataResponse) {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.recentClaimListDataSubject.next(gridView);
        this.pharmacyRecentGridDistinctUserIdsAndProfilePhoto(dataResponse['items']);
      }
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
    },
  });
}

pharmacyRecentGridDistinctUserIdsAndProfilePhoto(data: any[]) {
  const distinctUserIds = Array.from(new Set(data?.map(user => user.by))).join(',');
  if(distinctUserIds){
    this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.pharmacyRecentClaimsProfilePhotoSubject.next(data);
        }
      },
    });
  }
} 

loadEachLetterTemplate(templateParams:any){
  this.letterContentLoaderSubject.next(true);
  this.financialPharmacyClaimsDataService.loadEachLetterTemplate(templateParams).subscribe({
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

loadPrintAdviceLetterData(printAdviceLetterData: any) {
  return this.financialPharmacyClaimsDataService.getPrintAdviceLetterData(printAdviceLetterData);
}

viewAdviceLetterData(printAdviceLetterData: any) {
  return this.financialPharmacyClaimsDataService.viewPrintAdviceLetterData(printAdviceLetterData);
}

reconcilePaymentsAndLoadPrintLetterContent(reconcileData: any) {
  return this.financialPharmacyClaimsDataService.reconcilePaymentsAndLoadPrintAdviceLetterContent(reconcileData);
}

loadReconcilePaymentBreakoutSummary(data:any){ 
  this.financialPharmacyClaimsDataService.loadReconcilePaymentBreakoutSummaryService(data).subscribe({
    next: (dataResponse) => {
      this.reconcileBreakoutSummaryDataSubject.next(dataResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
    },
  });
}

loadReconcilePaymentBreakoutListGrid(data:any) {
  this.reconcilePaymentBreakoutListLoaderDataSubject.next(true);
  data.filter=JSON.stringify(data.filter);
  this.financialPharmacyClaimsDataService
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
          this.loadBreakoutPanelDistinctUserIdsAndProfilePhoto(dataResponse['items']);
          this.reconcilePaymentBreakoutListLoaderDataSubject.next(false);
        }
      },
      error: (err) => {
        this.reconcilePaymentBreakoutListLoaderDataSubject.next(false);
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
}

loadBreakoutPanelDistinctUserIdsAndProfilePhoto(data: any[]) {
  const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
  if(distinctUserIds){
    this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.pharmacyBreakoutProfilePhotoSubject.next(data);
        }
      },
    });
  }
} 

loadBatchName(batchId: string){
  this.financialPharmacyClaimsDataService.loadBatchName(batchId).subscribe({
    next: (dataResponse) => {
      this.paymentBatchNameSubject.next(dataResponse);
    },
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
    },
  });
}

}
