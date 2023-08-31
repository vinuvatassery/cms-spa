import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Internal libraries **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { FinancialFundingSourceDataService } from '../../infrastructure/financial-management/financial-funding-source.data.service';


@Injectable({ providedIn: 'root' })
export class FinancialFundingSourceFacade {



  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFinancialFundingSourceFacade = 'fundingSourceCode';
  public sortProcessList: SortDescriptor[] = [{
    field: this.sortValueFinancialFundingSourceFacade,
  }];


  private financialFundingSourceFacadeDataSubject = new Subject<any>();
  private addFundingSourceSubject = new Subject<any>();
  private updateFundingSourceSubject = new Subject<any>();
  private fundingSourceListSubject = new BehaviorSubject<any>([]);
  fundingSourceList$ = this.fundingSourceListSubject.asObservable();

  financialFundingSourceFacadeData$ = this.financialFundingSourceFacadeDataSubject.asObservable();

  addFundingSource$ = this.addFundingSourceSubject.asObservable();
  updateFundingSource$ = this.updateFundingSourceSubject.asObservable();

  private fundingSourceLookupSubject = new Subject<any>();
  fundingSourceLookup$ = this.fundingSourceLookupSubject.asObservable();

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
    public financialFundingSourceDataService: FinancialFundingSourceDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadFinancialFundingSourceFacadeListGrid() {
    this.financialFundingSourceDataService.loadFinancialFundingSourceFacadeListService().subscribe({
      next: (dataResponse) => {
        this.financialFundingSourceFacadeDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }

  addFundingSource(fundingSource: any) {
    this.showLoader();
    this.financialFundingSourceDataService.addFundingSource(fundingSource).subscribe({
      next: (dataResponse) => {
        this.addFundingSourceSubject.next(dataResponse);
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, `Added funding source successfully`);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    })
  }

  updateFundingSource(fundingSource: any) {
    this.showLoader();
    this.financialFundingSourceDataService.updateFundingSource(fundingSource).subscribe({
      next: (dataResponse) => {
        this.updateFundingSourceSubject.next(dataResponse);
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, `Updated funding source successfully`);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    })
  }
  loadFundingSourceLookup(){
    this.financialFundingSourceDataService.loadFundingSourceLookup().subscribe({
      next: (dataResponse) => {
        this.fundingSourceLookupSubject.next(dataResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
      },
    });
  }
  loadFundingSourceList(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    filter:any,){
      this.showLoader();
    this.financialFundingSourceDataService.loadFundingSourceList(
        skipcount,
        maxResultCount,
        sort,
        sortType,
        filter
    ).subscribe({
      next: (dataResponse) => {
        if (dataResponse) {
          this.hideLoader();
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
        this.fundingSourceListSubject.next(gridView);
      }},
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
  }
  removeFundingSource(fundingSourceId: string): void {
    this.showLoader();
    this.financialFundingSourceDataService.removeFundingSource(fundingSourceId).subscribe({
      next: (deleteResponse) => {
        if (deleteResponse ?? false) {
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Funding Source Removed Successfully')
          this.loadFinancialFundingSourceFacadeListGrid();
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

}
