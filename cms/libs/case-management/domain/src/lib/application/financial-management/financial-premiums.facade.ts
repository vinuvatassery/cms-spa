import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialPremiumsDataService } from '../../infrastructure/financial-management/financial-premiums.data.service';
import { Router } from '@angular/router';
import { FinancialPremiumTypeCode } from '../../enums/financial-premium-types';
import { InsurancePremium, PolicyPremiumCoverage } from '../../entities/financial-management/client-insurance-plan';


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

  public sortValueReconcilePaymentBreakout = 'invoiceNbr';
  public sortReconcilePaymentBreakoutList: SortDescriptor[] = [
    {
      field: this.sortValueReconcilePaymentBreakout,
    },
  ];

  public sortValueRecentPremiumList = 'creationTime';
  public sortRecentPremiumList: SortDescriptor[] = [{
    field: this.sortValueRecentPremiumList,
  }];

  private financialPremiumsProcessDataSubject = new Subject<any>();
  financialPremiumsProcessData$ = this.financialPremiumsProcessDataSubject.asObservable();

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

  private premiumsListDataSubject =  new Subject<any>();
  premiumsListData$ = this.premiumsListDataSubject.asObservable();

  private reconcileBreakoutListDataSubject =  new Subject<any>();
  reconcileBreakoutList$ = this.reconcileBreakoutListDataSubject.asObservable();

  private reconcileBreakoutSummaryDataSubject = new Subject<any>();
  reconcileBreakoutSummary$ =this.reconcileBreakoutSummaryDataSubject.asObservable();

  paymentBatchNameSubject  =  new Subject<any>();
  paymentBatchName$ = this.paymentBatchNameSubject.asObservable();

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

  private existingCoverageDatesSubject = new Subject<any>();
  existingCoverageDates$ =this.existingCoverageDatesSubject.asObservable();

  private recentPremiumListDataSubject =  new Subject<any>();
  recentPremiumGridLists$ = this.recentPremiumListDataSubject.asObservable();

  private recentPremiumLoaderSubject = new Subject<any>();
  recentPremiumLoader$ = this.recentPremiumLoaderSubject.asObservable();
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

  loadBatchLogListGrid(premiumType : string ,batchId : string,paginationParameters : any){
    this.financialPremiumsDataService.loadBatchLogListService(premiumType ,batchId ,paginationParameters ).subscribe({
      next: (dataResponse : any) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
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

  loadPremiumServicesByPayment(premiumType : string ,paymentId : string,paginationParameters : any) {
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

  loadPremiumServicesByPayment(premiumType : string ,paymentId : string,paginationParameters : any) {
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

  loadMedicalPremiumPrintAdviceLetterData(batchId: any, printAdviceLetterData: any, premiumType: any) {
    return this.financialPremiumsDataService.loadMedicalPremiumPrintAdviceLetterData(batchId, printAdviceLetterData, premiumType);
  }

  reconcilePaymentsAndLoadPrintLetterContent(batchId: any, reconcileData: any, premiumType:any) {
    return this.financialPremiumsDataService.reconcilePaymentsAndLoadPrintAdviceLetterContent(batchId, reconcileData, premiumType);
}

viewAdviceLetterData(batchId:any,printAdviceLetterData: any, premiumType:any) {
  return this.financialPremiumsDataService.viewPrintAdviceLetterData(batchId, printAdviceLetterData, premiumType);
}

    loadInsurancePlans(clientId: number){
      this.insurancePlansLoaderSubject.next(true);
      this.financialPremiumsDataService.loadInsurancePlans(clientId)
      .subscribe({
        next: (dataResponse) => {
            this.insurancePlansLoaderSubject.next(false);
            this.insurancePlansSubject.next(dataResponse);
            this.loadInsurancePlansCoverageDates(clientId);
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
}
