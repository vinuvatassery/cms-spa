/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { ClaimsDataService } from '../../infrastructure/financial-management/claims.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class ClaimsFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'batchName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private claimsDataSubject = new BehaviorSubject<any>([]);
  private claimsDataLoaderSubject = new BehaviorSubject<boolean>(false);
  claimsData$ = this.claimsDataSubject.asObservable();
  claimsDataLoader$ = this.claimsDataLoaderSubject.asObservable();

  
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
    public claimsDataService: ClaimsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadClaimsListGrid(pharmacyId: string, paginationParameters: any){
    this.claimsDataLoaderSubject.next(true);
    this.claimsDataService.loadClaimsListService(pharmacyId, paginationParameters).subscribe({
      next: (dataResponse:any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.claimsDataSubject.next(gridView);
        this.claimsDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.claimsDataLoaderSubject.next(false);
      },
    });
   
  
  }
 
}
