/** Angular **/
import { Injectable } from '@angular/core';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
  ConfigurationProvider
} from '@cms/shared/util-core';
import {  Observable } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** Data services **/
import { Counties } from '../entities/counties';
import { State } from '../entities/state';
import { ZipCodeDataService } from '../infrastructure/zip-code.data.service';
import { SystemConfigFinancialDataService } from '../infrastructure/sysconfig-financials.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemConfigFinancialFacade {
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  public sortValueFunds = 'creationTime'; 
  public sortFundsGrid: SortDescriptor[] = [{
    field: this.sortValueFunds,
  }];

  public sortValueExpenseType = 'creationTime'; 
  public sortExpenseTypeGrid: SortDescriptor[] = [{
    field: this.sortValueExpenseType,
  }];

  public sortValueIncomeType = 'creationTime'; 
  public sortIncomeTypeGrid: SortDescriptor[] = [{
    field: this.sortValueIncomeType,
  }];

  public sortValueIndex = 'creationTime'; 
  public sortIndexGrid: SortDescriptor[] = [{
    field: this.sortValueIndex,
  }];

  public sortValuePcaCode = 'creationTime'; 
  public sortPcaCodeGrid: SortDescriptor[] = [{
    field: this.sortValuePcaCode,
  }];


  private loadFundsServiceSubject = new BehaviorSubject<any>([]);
  loadFundsService$ = this.loadFundsServiceSubject.asObservable();

  private loadIndexListsServiceSubject = new BehaviorSubject<any>([]);
  loadIndexListsService$ = this.loadIndexListsServiceSubject.asObservable();

  private loadExpenseTypeListsServiceSubject = new BehaviorSubject<any>([]);
  loadExpenseTypeListsService$ =
    this.loadExpenseTypeListsServiceSubject.asObservable();

    private loadIncomeTypeListsServiceSubject = new BehaviorSubject<any>([]);
    loadIncomeTypeListsService$ =
      this.loadIncomeTypeListsServiceSubject.asObservable();


      private loadPcaCodeListsServiceSubject = new BehaviorSubject<any>([]);
      loadPcaCodeListsService$ =
        this.loadPcaCodeListsServiceSubject.asObservable();

  /** Constructor **/
  constructor(
    private readonly zipCodeDataService: ZipCodeDataService,
    private readonly configurationProvider: ConfigurationProvider,
    private readonly systemConfigFinancialDataService: SystemConfigFinancialDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService
  ) {}

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getStates(): Observable<State[]> {
    return this.zipCodeDataService.getSates();
  }

  getCounties(stateCode: string): Observable<Counties[]> {
    return this.zipCodeDataService.getCounties(stateCode);
  }

  loadFunds() {
    this.systemConfigFinancialDataService.loadFundsListsService().subscribe({
      next: (response) => {
        this.loadFundsServiceSubject.next(response);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadIndexLists() {
    this.systemConfigFinancialDataService.loadIndexListsService().subscribe({
      next: (loadIndexListsService) => {
        this.loadIndexListsServiceSubject.next(loadIndexListsService);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadExpenseTypeLists() {
    this.systemConfigFinancialDataService
      .loadExpenseTypeListsService()
      .subscribe({
        next: (loadExpenseTypeListsService) => {
          this.loadExpenseTypeListsServiceSubject.next(
            loadExpenseTypeListsService
          );
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadIncomeTypeLists() {
    this.systemConfigFinancialDataService
      .loadIncomeTypeListsService()
      .subscribe({
        next: (loadIncomeTypeListsService) => {
          this.loadIncomeTypeListsServiceSubject.next(
            loadIncomeTypeListsService
          );
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  loadPcaCodeLists() {
    this.systemConfigFinancialDataService
      .loadPcaCodeListsService()
      .subscribe({
        next: (loadPcaCodeListsService) => {
          this.loadPcaCodeListsServiceSubject.next(
            loadPcaCodeListsService
          );
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }
}
