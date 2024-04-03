import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { Router } from '@angular/router';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { BatchPremium } from '../../entities/financial-management/batch-premium';
import { InsurancePremium, InsurancePremiumDetails, PolicyPremiumCoverage } from '../../entities/financial-management/client-insurance-plan';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { FinancialPremiumTypeCode } from '../../enums/financial-premium-types';
import { FinancialPremiumsDataService } from '../../infrastructure/financial-management/financial-premiums.data.service';
import { UserManagementFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class FinancialPremiumsFacade {


  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';
  public selectedClaimsTab = 1

  public sortValueFinancialPremiumsProcess = 'clientFullName';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsProcess,
  }];

  public sortValueFinancialPremiumsBatch = 'creationTime';
  public sortBatchList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsBatch,
  }];

  public sortValueFinancialPremiumsPayments = 'itemNumber';
  public sortPaymentsList: SortDescriptor[] = [{
    field: this.sortValueFinancialPremiumsPayments,
  }];

  public sortValueBatchLog = 'itemNbr';
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

  public sortValueReconcilePaymentBreakout = 'creationTime';
  public sortReconcilePaymentBreakoutList: SortDescriptor[] = [
    {
      field: this.sortValueReconcilePaymentBreakout,
    },
  ];

  public sortValueRecentPremiumList = 'creationTime';
  public sortRecentPremiumList: SortDescriptor[] = [{
    field: this.sortValueRecentPremiumList,
  }];

  private financialPremiumPaymentLoaderSubject = new Subject<boolean>();
  financialPremiumPaymentLoader$ = this.financialPremiumPaymentLoaderSubject.asObservable();

  private financialPremiumsProcessDataSubject = new Subject<any>();
  financialPremiumsProcessData$ = this.financialPremiumsProcessDataSubject.asObservable();

  private financialPremiumsBatchDataLoaderSubject = new Subject<boolean>();
  financialPremiumsBatchDataLoader$ = this.financialPremiumsBatchDataLoaderSubject.asObservable();

  private financialPremiumsBatchDataSubject =  new Subject<any>();
  financialPremiumsBatchData$ = this.financialPremiumsBatchDataSubject.asObservable();

  private financialPremiumsAllPaymentsDataSubject =  new Subject<any>();
  financialPremiumsAllPaymentsData$ = this.financialPremiumsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject =  new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

  private batchLogServicesDataSubject =  new Subject<any>();
  batchLogServicesData$ = this.batchLogServicesDataSubject.asObservable();

  private batchReconcileDataSubject =  new Subject<any>();
  reconcileDataList$ = this.batchReconcileDataSubject.asObservable();

  private batchItemsDataSubject =  new Subject<any>();
  batchItemsData$ = this.batchItemsDataSubject.asObservable();

  private batchItemsLoaderSubject =  new BehaviorSubject<any>(false);
  batchItemsLoader$ = this.batchItemsLoaderSubject.asObservable();

  private premiumsListDataSubject =  new Subject<any>();
  premiumsListData$ = this.premiumsListDataSubject.asObservable();

  private reconcileBreakoutListDataSubject =  new Subject<any>();
  reconcileBreakoutList$ = this.reconcileBreakoutListDataSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject = new Subject<any>();
  reconcileBreakoutSummary$ =this.reconcileBreakoutSummaryDataSubject.asObservable();

  paymentBatchNameSubject  =  new Subject<any>();
  paymentBatchName$ = this.paymentBatchNameSubject.asObservable();

  batchPremiumSubject  =  new Subject<any>();
  batchPremium$ = this.batchPremiumSubject.asObservable();

  private unbatchEntireBatchSubject =  new Subject<any>();
  unbatchEntireBatch$ = this.unbatchEntireBatchSubject.asObservable();

  private unbatchPremiumsSubject =  new Subject<any>();
  unbatchPremiums$ = this.unbatchPremiumsSubject.asObservable();

  public clientsSortValue = 'clientFullName'
  public clientSort: SortDescriptor[] = [{
    field: this.clientsSortValue,
  }];
  private insurancePlansSubject = new Subject<any>();
  insurancePlans$ =this.insurancePlansSubject.asObservable();

  private insurancePlansLoaderSubject = new BehaviorSubject<any>(false);
  insurancePlansLoader$ =this.insurancePlansLoaderSubject.asObservable();

  private insuranceCoverageDatesSubject = new Subject<any>();
  insuranceCoverageDates$ =this.insuranceCoverageDatesSubject.asObservable();

  private insuranceCoverageDatesLoaderSubject = new BehaviorSubject<any>(false);
  insuranceCoverageDatesLoader$ =this.insuranceCoverageDatesSubject.asObservable();

  private premiumActionResponseSubject = new Subject<any>();
  premiumActionResponse$ =this.premiumActionResponseSubject.asObservable();

  private insuranceReportsResponseSubject = new Subject<any>();
  insuranceReportsResponse$ =this.insuranceReportsResponseSubject.asObservable();

  private existingCoverageDatesSubject = new Subject<any>();
  existingCoverageDates$ =this.existingCoverageDatesSubject.asObservable();

  private recentPremiumListDataSubject =  new Subject<any>();
  recentPremiumGridLists$ = this.recentPremiumListDataSubject.asObservable();

  private recentPremiumLoaderSubject = new Subject<any>();
  recentPremiumLoader$ = this.recentPremiumLoaderSubject.asObservable();

  private insurancePremiumSubject = new Subject<InsurancePremiumDetails>();
  insurancePremium$ =this.insurancePremiumSubject.asObservable();

  private paymentByBatchGridLoaderSubject =  new BehaviorSubject<boolean>(false);
  paymentByBatchGridLoader$ = this.paymentByBatchGridLoaderSubject.asObservable();

  private warrantNumberChangeSubject = new Subject<any>();
  warrantNumberChange$ = this.warrantNumberChangeSubject.asObservable();

  private warrantNumberChangeLoaderSubject = new Subject<any>();
  warrantNumberChangeLoader$ = this.warrantNumberChangeLoaderSubject.asObservable();

  private letterContentSubject = new Subject<any>();
  letterContentList$ = this.letterContentSubject.asObservable();

  private letterContentLoaderSubject = new Subject<any>();
  letterContentLoader$ = this.letterContentLoaderSubject.asObservable();

  premiumProcessListProfilePhotoSubject = new Subject();
  premiumAllPaymentsPremiumSubject = new Subject();


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
    private readonly loaderService: LoaderService,
    private readonly userManagementFacade: UserManagementFacade,
  ) { }

  /** Public methods **/

  getPremiumType(router : Router)
  {
    return router.url.split('/')?.filter(element => element === FinancialPremiumTypeCode.Dental || element ===FinancialPremiumTypeCode.Medical)[0]
  }

  loadFinancialPremiumsBatchListGrid(parms: GridFilterParam, claimsType: string
    ) {
      this.financialPremiumsBatchDataLoaderSubject.next(true);
      this.financialPremiumsDataService
        .loadFinancialPremiumsBatchListService(
          parms,
          claimsType
        )
        .subscribe({
          next: (dataResponse) => {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.financialPremiumsBatchDataSubject.next(gridView);
            this.financialPremiumsBatchDataLoaderSubject.next(false);
          },
          error: (err) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            this.financialPremiumsBatchDataLoaderSubject.next(false);
          },
        });
    }

  loadFinancialPremiumsAllPaymentsListGrid(params: GridFilterParam, claimsType: string){
      this.financialPremiumPaymentLoaderSubject.next(true);
      this.financialPremiumsDataService.loadFinancialPremiumsAllPaymentsListService(params, claimsType).subscribe({
        next: (dataResponse) => {
          const gridView = {
            data: dataResponse["items"],
            total: dataResponse["totalCount"],
            lovs: dataResponse["lovs"],
            acceptsReportsCount: dataResponse['acceptReportsFlagQueryCount'],
          };
          this.financialPremiumsAllPaymentsDataSubject.next(gridView);
          this.loadPremiumAllPaymentDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
          this.loadPremiumAllPaymentDistinctUserIdsAndProfilePhoto(dataResponse["items"]);
          this.financialPremiumPaymentLoaderSubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.financialPremiumPaymentLoaderSubject.next(false);
        },
      });
  }

  loadPremiumAllPaymentDistinctUserIdsAndProfilePhoto(data: any[]) {
    const distinctUserIds = Array.from(new Set(data?.map(user => user.creatorId))).join(',');
    if(distinctUserIds){
      this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            this.premiumAllPaymentsPremiumSubject.next(data);
          }
        },
      });
    }
  }

  loadBatchName(batchId: string){
    this.financialPremiumsDataService.loadBatchName(batchId).subscribe({
      next: (dataResponse) => {
        this.paymentBatchNameSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
      },
    });
  }


  loadBatchLogListGrid(isReconciled: boolean, premiumType : string ,batchId : string, paginationParameters : any){
    this.paymentByBatchGridLoaderSubject.next(true);

    this.financialPremiumsDataService.loadBatchLogListService(isReconciled, premiumType ,batchId ,paginationParameters ).subscribe({
      next: (dataResponse : any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
          acceptsReportsCount: dataResponse['acceptReportsFlagQueryCount'],
        };
        this.batchLogDataSubject.next(gridView);
        this.hideLoader();
        this.paymentByBatchGridLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
        this.paymentByBatchGridLoaderSubject.next(false);
      },
    });
  }

  loadPremiumServicesByPayment(premiumType : string ,paymentId : string, paginationParameters : any) {
    this.financialPremiumsDataService.loadPremiumServicesByPayment(premiumType ,paymentId ,paginationParameters )
    .subscribe({
      next: (dataResponse : any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.batchLogServicesDataSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader();
      },
    });
  }

  loadPremiumSubListServicesByPayment(premiumType : string ,paymentId : string, paginationParameters : any) {
    return this.financialPremiumsDataService.loadPremiumServicesByPayment(premiumType ,paymentId ,paginationParameters )
  }

  loadBatchItemsListGrid(batchId: any, paymentId: any, premiumType: string, params: GridFilterParam){
    this.batchItemsLoaderSubject.next(true);
    this.financialPremiumsDataService.loadBatchItemsListService(batchId, paymentId, premiumType, params).subscribe({
      next: (dataResponse) => {
        this.batchItemsDataSubject.next(dataResponse.items);
        this.batchItemsLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.batchItemsLoaderSubject.next(false);
        this.hideLoader();
      },
    });
  }

  loadReconcileListGrid(batchId:any,premiumType:any,event:any){
    this.financialPremiumsDataService.loadReconcileListService(batchId,premiumType,event).subscribe({
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

  loadInsurancePremiumBreakoutSummary(data:any){
    this.financialPremiumsDataService.loadInsurancePremiumBreakoutSummaryService(data).subscribe({
      next: (dataResponse) => {
        this.reconcileBreakoutSummaryDataSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
      },
    });
  }

  loadInsurancePremiumBreakoutList(data:any) {
    data.filter=JSON.stringify(data.filter);
    this.financialPremiumsDataService
      .loadInsurancePremiumBreakoutListService(data)
      .subscribe({
        next: (dataResponse) => {
          this.reconcileBreakoutListDataSubject.next(dataResponse);
          if (dataResponse) {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.reconcileBreakoutListDataSubject.next(gridView);
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
    }


  loadPremiumPrintAdviceLetterData(isReconciled: boolean, printAdviceLetterData: any, premiumType: any) {
    return this.financialPremiumsDataService.loadPremiumPrintAdviceLetterData(isReconciled, printAdviceLetterData, premiumType);
  }

  reconcilePaymentsAndLoadPrintLetterContent(reconcileData: any, premiumType:any) {
    return this.financialPremiumsDataService.reconcilePaymentsAndLoadPrintAdviceLetterContent(reconcileData, premiumType);
}

viewAdviceLetterData(printAdviceLetterData: any, premiumType:any) {
  return this.financialPremiumsDataService.viewPrintAdviceLetterData(printAdviceLetterData, premiumType);
}

loadMedicalPremiumList(
  skipcount: number,
  maxResultCount: number,
  sort: string,
  sortType: string,
  filter:any,
  premiumType: string){
  this.financialPremiumsDataService.loadMedicalPremiumList( skipcount,
    maxResultCount,
    sort,
    sortType,
    filter,premiumType ).subscribe({
    next: (dataResponse) => {
      if (dataResponse) {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
          acceptsReportsQueryCount: dataResponse['acceptsReportsQueryCount'],
        };
      this.financialPremiumsProcessDataSubject.next(gridView);
      this.loadPremiumProcessListDistinctUserIdsAndProfilePhoto(dataResponse['items']);
      this.loadPremiumProcessListDistinctUserIdsAndProfilePhoto(dataResponse['items']);
    }},
    error: (err) => {
      this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
    },
  });
}

loadPremiumProcessListDistinctUserIdsAndProfilePhoto(data: any[]) {
  const distinctUserIds = Array.from(new Set(data?.map(user => user.createdId))).join(',');
  if(distinctUserIds){
    this.userManagementFacade.getProfilePhotosByUserIds(distinctUserIds)
    .subscribe({
      next: (data: any[]) => {
        if (data.length > 0) {
          this.premiumProcessListProfilePhotoSubject.next(data);
        }
      },
    });
  }
}

batchPremium(batchPremiums: BatchPremium, claimsType: string) {
  this.showLoader();
  return this.financialPremiumsDataService
    .batchClaims(batchPremiums, claimsType)
    .subscribe({
      next: (response:any) => {
        this.batchPremiumSubject.next(response);
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

    loadInsurancePlans(client: any, type: string){
      this.insurancePlansLoaderSubject.next(true);
      if(!client.clientId || !client.eligibilityId){
        this.insurancePlansSubject.next([]);
        this.insurancePlansLoaderSubject.next(false);
        return;
      }
      this.financialPremiumsDataService.loadInsurancePlans(client.clientId, client.eligibilityId, type)
      .subscribe({
        next: (dataResponse) => {
            this.insurancePlansLoaderSubject.next(false);
            this.insurancePlansSubject.next(dataResponse);
            this.loadInsurancePlansCoverageDates(client.clientId);
        },
        error: (err) => {
          this.insurancePlansLoaderSubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    loadInsurancePlansCoverageDates(clientId: number){
      this.insuranceCoverageDatesLoaderSubject.next(true);
      this.financialPremiumsDataService.loadInsurancePlansCoverageDates(clientId)
      .subscribe({
        next: (dataResponse) => {
            this.insuranceCoverageDatesLoaderSubject.next(false);
            this.insuranceCoverageDatesSubject.next(dataResponse);
        },
        error: (err) => {
          this.insuranceCoverageDatesLoaderSubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    getExistingPremiums(clientId: number, type:string, premiums: PolicyPremiumCoverage[]){
      this.insurancePlansLoaderSubject.next(true);
      this.financialPremiumsDataService.getExistingPremiums(clientId, type, premiums)
      .subscribe({
        next: (dataResponse) => {
            this.insurancePlansLoaderSubject.next(false);
            this.existingCoverageDatesSubject.next(dataResponse);
        },
        error: (err) => {
          this.insurancePlansLoaderSubject.next(false);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    savePremiums(type:string, premiums: InsurancePremium[]){
      this.showLoader();
      const clientId = premiums[0]?.clientId;
      this.financialPremiumsDataService.savePremiums(clientId, type, premiums)
      .subscribe({
        next: (response) => {
          this.premiumActionResponseSubject.next(true);
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }


    loadRecentPremiumListGrid(recentPremiumsPageAndSortedRequestDto:any){
      this.recentPremiumLoaderSubject.next(true);
      recentPremiumsPageAndSortedRequestDto.filter = JSON.stringify(recentPremiumsPageAndSortedRequestDto.filter);
      this.financialPremiumsDataService.loadRecentPremiumListService(recentPremiumsPageAndSortedRequestDto).subscribe({
        next: (dataResponse) => {
          this.recentPremiumListDataSubject.next(dataResponse);
          if (dataResponse) {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.recentPremiumListDataSubject.next(gridView);
          }
          this.recentPremiumLoaderSubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
          this.recentPremiumLoaderSubject.next(false);
        },
      });
    }

    loadRecentPremiumsByClient(data:any,clientId:any){
      this.recentPremiumLoaderSubject.next(true);
      data.filter = JSON.stringify(data.filter);

      this.financialPremiumsDataService.loadRecentPremiumsByClient(data,clientId).subscribe({
        next: (dataResponse) => {
          this.recentPremiumListDataSubject.next(dataResponse);
          if (dataResponse) {
            const gridView = {
              data: dataResponse['items'],
              total: dataResponse['totalCount'],
            };
            this.recentPremiumListDataSubject.next(gridView);
          }
          this.recentPremiumLoaderSubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
          this.recentPremiumLoaderSubject.next(false);
        },
      });
    }

    loadPremium(type: string, premiumId: string){
      this.financialPremiumsDataService.loadPremium(type, premiumId)
      .subscribe({
        next: (dataResponse) => {
            this.insurancePremiumSubject.next(dataResponse);
            this.loadInsurancePlansCoverageDates(dataResponse?.clientId);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    updatePremium(type: string, premiumId: string, premiums:any){
      this.showLoader();
      this.financialPremiumsDataService.updatePremium(type, premiumId, premiums)
      .subscribe({
        next: (response) => {
          this.premiumActionResponseSubject.next(true);
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    unbatchEntireBatch(paymentRequestBatchIds: string[], premiumType: string) {
      this.showLoader();
      return this.financialPremiumsDataService
        .unbatchEntireBatch(paymentRequestBatchIds, premiumType)
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

    unbatchPremiums(paymentRequestIds: string[], premiumType: string) {
      this.showLoader();
      return this.financialPremiumsDataService
        .unbatchPremium(paymentRequestIds, premiumType)
        .subscribe({
          next: (response:any) => {
            this.unbatchPremiumsSubject.next(response);
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


    loadPremiumAdjustments(type: string, paymentId: string, params: GridFilterParam){
      return this.financialPremiumsDataService.loadPremiumAdjustments(type, paymentId, params);
    }


   deletePremiumPayment(type: string, paymentId: string){
      this.showLoader();
      this.financialPremiumsDataService.deletePremium(type, paymentId)
      .subscribe({
        next: (response: any) => {
          this.premiumActionResponseSubject.next(true);
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
        },
        error: (err) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

    removeSelectedPremiums(selectedPremiumPayments: any, premiumsType: any) {
      return this.financialPremiumsDataService.removeSelectedPremiums(selectedPremiumPayments, premiumsType);
    }

    checkWarrantNumber(batchId:any,warrantNumber:any,vendorId:any,premiumType:any){
      this.warrantNumberChangeLoaderSubject.next(true);
      this.financialPremiumsDataService.checkWarrantNumber(batchId,warrantNumber,vendorId,premiumType).subscribe({
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

    loadEachLetterTemplate(premiumssType:any,templateParams:any){
      this.letterContentLoaderSubject.next(true);
      this.financialPremiumsDataService.loadEachLetterTemplate(premiumssType,templateParams).subscribe({
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

    SendInsuranceVendorReports(vendorPayment: any){
      this.showLoader();
      this.financialPremiumsDataService.sendInsuranceVendorReports(vendorPayment)
      .subscribe({
        next: (response: any) => {
          this.insuranceReportsResponseSubject.next(true);
          this.hideLoader();
          if(response.status==1){
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
          }else{
            this.showHideSnackBar(SnackBarNotificationType.ERROR, response?.message);
          }

        },
        error: (err: any) => {
          this.hideLoader();
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      })
    }

}
