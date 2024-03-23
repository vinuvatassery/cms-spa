import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialPcaDataService } from '../../infrastructure/financial-management/financial-pca.data.service';
import { GridFilterParam } from '../../entities/grid-filter-param';
import { PcaDetails } from '../../entities/financial-management/pca-details';



@Injectable({ providedIn: 'root' })
export class FinancialPcaFacade {


  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialPcaSetup = 'pcaCode';
  public sortPcaSetupList: SortDescriptor[] = [{
    field: this.sortValueFinancialPcaSetup,
  }];

  public sortValueFinancialPcaAssignment = 'batch';
  public sortPcaAssignmentList: SortDescriptor[] = [{
    field: this.sortValueFinancialPcaAssignment,
  }];

  public sortValueFinancialPcaReassignment = 'pcaCode';
  public sortPcaReassignmentList: SortDescriptor[] = [{
    field: this.sortValueFinancialPcaReassignment,
  }];

  public sortValueFinancialPcaReport = 'pcaCode';
  public sortFinancialPcaReportList: SortDescriptor[] = [{
    field: this.sortValueFinancialPcaReport,
  }];

  public sortValuePcaObject = 'batch';
  public sortPcaObjectList: SortDescriptor[] = [{
    field: this.sortValuePcaObject,
  }];



  private financialPcaSetupDataSubject = new Subject<any>();
  financialPcaSetupData$ = this.financialPcaSetupDataSubject.asObservable();

  private financialPcaSetupLoaderSubject = new BehaviorSubject<any>(false);
  financialPcaSetupLoader$ = this.financialPcaSetupLoaderSubject.asObservable();

  private financialPcaDetailDataSubject = new BehaviorSubject<any>(false);
  financialPcaDetailData$ = this.financialPcaDetailDataSubject.asObservable();

  private pcaActionIsSuccessSubject = new Subject<any>();
  pcaActionIsSuccess$ = this.pcaActionIsSuccessSubject.asObservable();

  private pcaDataSubject = new BehaviorSubject<PcaDetails | null>(null);
  pcaData$ = this.pcaDataSubject.asObservable();

  private financialPcaReassignmentDataSubject = new Subject<any>();
  financialPcaReassignmentData$ = this.financialPcaReassignmentDataSubject.asObservable();

  private financialPcaReportDataSubject = new Subject<any>();
  financialPcaReportData$ = this.financialPcaReportDataSubject.asObservable();

  private financialPcaReportLoaderSubject = new BehaviorSubject<any>(false);
  financialPcaReportLoader$ = this.financialPcaReportLoaderSubject.asObservable();

  private financialPcaSubReportDataSubject = new Subject<any>();
  financialPcaSubReportData$ = this.financialPcaSubReportDataSubject.asObservable();


  private getPcaAssignmentByIdSubject = new Subject<any>();
  getPcaAssignmentById$ = this.getPcaAssignmentByIdSubject.asObservable();

  private pcaReassignmentByFundSourceIdSubject = new Subject<any>();
  pcaReassignmentByFundSourceId$ = this.pcaReassignmentByFundSourceIdSubject.asObservable();

  private pcaReassignmentCountSubject = new Subject<any>()
  pcaReassignmentCount$ = this.pcaReassignmentCountSubject.asObservable();

  private notPcaDataSubject = new Subject<PcaDetails | null>();
  notpcaData$ = this.notPcaDataSubject.asObservable()


    /** Public properties **/

  // handling the snackbar & loader
  snackbarMessage!: SnackBar;
  snackbarSubject = new Subject<SnackBar>();

  showLoader() { this.loaderService.show(); }
  hideLoader() { this.loaderService.hide(); }

  errorShowHideSnackBar(subtitle: any) {
    this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, subtitle, NotificationSource.UI)
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
    public financialPcaDataService: FinancialPcaDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

  loadFinancialPcaReassignmentListGrid(gridValuesInput: any) {
    this.financialPcaDataService.loadFinancialPcaReassignmentListService(gridValuesInput).subscribe({
      next: (dataResponse: any) => {
        const reassignmentGridData = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.financialPcaReassignmentDataSubject.next(reassignmentGridData);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }


  loadFinancialPcaReportListGrid(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter: string
  ) {
    this.financialPcaReportLoaderSubject.next(true)
    this.financialPcaDataService
      .loadFinancialPcaReportListService(
        skipcount,
        maxResultCount,
        sort,
        sortType,
        filter
      )
      .subscribe({
        next: (dataResponse) => {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
          this.financialPcaReportDataSubject.next(gridView);
          this.financialPcaReportLoaderSubject.next(false)
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.financialPcaReportLoaderSubject.next(false)
        },
      });
  }

  /* PCA setup */
  loadFinancialPcaSetupListGrid(params: GridFilterParam) {
    this.financialPcaSetupLoaderSubject.next(true);
    this.financialPcaDataService.loadFinancialPcaSetupListService(params).subscribe({
      next: (dataResponse) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };

        this.financialPcaSetupDataSubject.next(gridView);
        this.financialPcaSetupLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.financialPcaSetupLoaderSubject.next(false);
      },
    });
  }

  loadPcaById(pcaId: string){
    this.pcaDataSubject.next(null);
    this.financialPcaDataService.loadPcaById(pcaId).subscribe({
      next: (response) => {
        this.pcaDataSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
  savePca(pcaModel: PcaDetails) {
    this.showLoader();
    this.financialPcaDataService.savePca(pcaModel).subscribe({
      next: (response) => {
        this.pcaActionIsSuccessSubject.next('save');
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  updatePca(pcaId: string, pcaModel: PcaDetails) {
    this.showLoader();
    this.financialPcaDataService.updatePca(pcaId, pcaModel).subscribe({
      next: (response) => {
        this.pcaActionIsSuccessSubject.next('save');
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  deletePca(pcaId: string) {
    this.showLoader();
    this.financialPcaDataService.deletePca(pcaId).subscribe({
      next: (response) => {
        this.pcaActionIsSuccessSubject.next('remove');
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  loadFinancialPcaSubReportListGrid(data: any){
   return this.financialPcaDataService.loadFinancialPcaSubReportListService(data);
  }

  pcaReassignmentCount(){
    this.financialPcaDataService.pcaReassignmentCount().subscribe({
      next:(count: any) => {
        this.pcaReassignmentCountSubject.next(count);
      },
      error: (err: any) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getPcaAssignmentById(pcaAssignmentId: string) {
    this.showLoader();
    this.financialPcaDataService.getPcaAssignmentById(pcaAssignmentId).subscribe({
      next: (response) => {
        this.getPcaAssignmentByIdSubject.next(response);
        this.hideLoader();

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  updateReassignmentPca(pcaModel: PcaDetails) {
    this.showLoader();
    this.financialPcaDataService.updateReassignmentPca(pcaModel).subscribe({
      next: (response) => {
        this.pcaActionIsSuccessSubject.next('save');
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  getPcaReassignmentByFundSourceId(fundingSourceId: string) {
    this.showLoader();
    this.financialPcaDataService.getPcaReassignmentByFundSourceId(fundingSourceId).subscribe({
      next: (response) => {
        this.pcaReassignmentByFundSourceIdSubject.next(response);
        this.hideLoader();

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  getPcaUnAssignments(objectCodeId:any,pcaAssignmentId:any,groupCodeId:any){
  return   this.financialPcaDataService.getPcaUnAssignments(objectCodeId,pcaAssignmentId,groupCodeId);  
  }

  pcaReassignment(data: any) {
    this.showLoader();
    this.financialPcaDataService.pcaReassignment(data).subscribe({
      next: (response) => {
        this.pcaReassignmentCount();
        this.pcaActionIsSuccessSubject.next('reassignment');
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response?.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
 
    
   }
}
