import { Injectable } from '@angular/core';
/** External libraries **/
import {  BehaviorSubject, Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialPcaDataService } from '../../infrastructure/financial-management/financial-pca.data.service';
import { GridFilterParam } from '../../entities/grid-filter-param';
 
 

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

  public sortValueFinancialPcaReassignment = 'batch';
  public sortPcaReassignmentList: SortDescriptor[] = [{
    field: this.sortValueFinancialPcaReassignment,
  }];

  public sortValueFinancialPcaReport = 'vendorName';
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

  private financialPcaAssignmentDataSubject =  new Subject<any>();
  financialPcaAssignmentData$ = this.financialPcaAssignmentDataSubject.asObservable();  

  private financialPcaReassignmentDataSubject =  new Subject<any>();
  financialPcaReassignmentData$ = this.financialPcaReassignmentDataSubject.asObservable();

  private financialPcaReportDataSubject =  new Subject<any>();
  financialPcaReportData$ = this.financialPcaReportDataSubject.asObservable();
 
 
 
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
    public financialPcaDataService: FinancialPcaDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/

 
  loadFinancialPcaSetupListGrid(params: GridFilterParam){
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.financialPcaSetupLoaderSubject.next(false); 
      },
    });  
  }   


  loadFinancialPcaAssignmentListGrid(){
    this.financialPcaDataService.loadFinancialPcaAssignmentListService().subscribe({
      next: (dataResponse) => {
        this.financialPcaAssignmentDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadFinancialPcaReassignmentListGrid(){
    this.financialPcaDataService.loadFinancialPcaReassignmentListService().subscribe({
      next: (dataResponse) => {
        this.financialPcaReassignmentDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }


  loadFinancialPcaReportListGrid(){
    this.financialPcaDataService.loadFinancialPcaReportListService().subscribe({
      next: (dataResponse) => {
        this.financialPcaReportDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }

 
}