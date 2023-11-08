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

@Injectable({ providedIn: 'root' })
export class FinancialPharmacyClaimsFacade {
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortType = 'asc';

  batchClaimsSubject  =  new Subject<any>();
  batchClaims$ = this.batchClaimsSubject.asObservable();


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

  public sortValuePharmacyClaimsPayments = 'batch';
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

  private pharmacyClaimsProcessDataSubject = new Subject<any>();
  pharmacyClaimsProcessData$ = this.pharmacyClaimsProcessDataSubject.asObservable();

  private pharmacyClaimsProcessLoaderSubject = new BehaviorSubject<boolean>(true);
  pharmacyClaimsProcessLoader$ = this.pharmacyClaimsProcessLoaderSubject.asObservable();

  private pharmacyClaimsBatchDataSubject = new Subject<any>();
  pharmacyClaimsBatchData$ = this.pharmacyClaimsBatchDataSubject.asObservable();
  private pharmacyClaimsBatchLoaderSubject = new Subject<any>();
  pharmacyClaimsBatchLoader$ = this.pharmacyClaimsBatchLoaderSubject.asObservable();

  private pharmacyClaimsAllPaymentsDataSubject = new Subject<any>();
  pharmacyClaimsAllPaymentsData$ =
    this.pharmacyClaimsAllPaymentsDataSubject.asObservable();

  private batchLogDataSubject = new Subject<any>();
  batchLogData$ = this.batchLogDataSubject.asObservable();

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
    private readonly documentFacade: DocumentFacade
  ) { }

  /** Public methods **/
  loadPharmacyClaimsProcessListGrid(params: GridFilterParam){
    this.pharmacyClaimsProcessLoaderSubject.next(true);
    this.financialPharmacyClaimsDataService.loadPharmacyClaimsProcessListService(params).subscribe({
      next: (dataResponse) => {
        const gridView = {
          data: dataResponse['items'],
          total: dataResponse['totalCount'],
        };
        this.pharmacyClaimsProcessDataSubject.next(gridView);
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.pharmacyClaimsProcessLoaderSubject.next(false);
      },
    });
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

          key.fullCustomName = key?.vendorName + ' '+ key?.tin + ' '+ key?.mailCode + ' '+ key?.address

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

          key.fullCustomName = key?.clientFullName + ' '+ key?.clientId + ' '+ key?.ssn + ' '+ key?.dob

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

  searchDrug(ndcCode: string) {
    this.searchDrugsLoaderDataSubject.next(true);
    this.financialPharmacyClaimsDataService
    .searchDrug(ndcCode)
    .subscribe({
      next: (dataResponse) => {
        this.searchDrugsDataSubject.next(dataResponse);
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

  loadPharmacyClaimsAllPaymentsListGrid() {
    this.financialPharmacyClaimsDataService
      .loadPharmacyClaimsAllPaymentsListService()
      .subscribe({
        next: (dataResponse) => {
          this.pharmacyClaimsAllPaymentsDataSubject.next(dataResponse);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }

  loadBatchLogListGrid() {
    this.financialPharmacyClaimsDataService
      .loadBatchLogListService()
      .subscribe({
        next: (dataResponse) => {
          this.batchLogDataSubject.next(dataResponse);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }
  loadBatchItemsListGrid() {
    this.financialPharmacyClaimsDataService
      .loadBatchItemsListService()
      .subscribe({
        next: (dataResponse) => {
          this.batchItemsDataSubject.next(dataResponse);
          this.hideLoader();
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.hideLoader();
        },
      });
  }
  loadReconcileListGrid(){
    this.financialPharmacyClaimsDataService.loadReconcileListService().subscribe({
      next: (dataResponse) => {
        this.batchReconcileDataSubject.next(dataResponse);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
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
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.hideLoader();
      },
    });
}


}
