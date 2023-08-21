import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialFundingSourceDataService } from '../../infrastructure/financial-management/financial-funding-source.data.service';


@Injectable({ providedIn: 'root' })
export class FinancialFundingSourceFacade {
 

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialFundingSourceFacade = 'invoiceID';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialFundingSourceFacade,
  }];
 

  private financialFundingSourceFacadeDataSubject = new Subject<any>();
  financialFundingSourceFacadeData$ = this.financialFundingSourceFacadeDataSubject.asObservable();
 
 
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
    public financialFundingSourceDataService: FinancialFundingSourceDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadFinancialFundingSourceFacadeListGrid(){
    this.financialFundingSourceDataService. loadFinancialFundingSourceFacadeListService().subscribe({
      next: (dataResponse) => {
        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
        this.financialFundingSourceFacadeDataSubject.next(gridView);
        this.hideLoader();
      }},
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.hideLoader(); 
      },
    });  
  }   

  // loadAllFundingSourceAsync(){
  //   this.financialFundingSourceDataService.loadAllFundingSourceAsync().subscribe({
  //     next: (dataResponse) => {
  //       this.financialFundingSourceFacadeDataSubject.next(dataResponse);
  //       this.hideLoader();
  //     },
  //     error: (err) => {
  //       this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
  //       this.hideLoader();
  //     },
  //   });
  // }

}