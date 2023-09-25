/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject, Subject } from 'rxjs';

/** internal libraries **/
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';
import { DrugsDataService } from '../../infrastructure/financial-management/drugs.data.service';
/** Providers **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DrugsFacade {

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'ndcNbr';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];

  private drugsDataSubject = new Subject<any>();
  drugsData$ = this.drugsDataSubject.asObservable();
  private drugDataLoaderSubject = new Subject<any>();
  drugDataLoader$ = this.drugDataLoaderSubject.asObservable();
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
    public drugsDataService: DrugsDataService,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private configurationProvider: ConfigurationProvider,
    private readonly loaderService: LoaderService
  ) { }

  /** Public methods **/
  loadDrugsListGrid(vendorId:string, skipCount: number, maxResultCount: number, sort: string, sortType: string, filters: any) {
    this.drugDataLoaderSubject.next(true);
    this.drugsDataService.loadDrugList(vendorId,skipCount,maxResultCount,sort,sortType,filters).subscribe({
      next: (dataResponse) => {
        this.drugsDataSubject.next(dataResponse);

        if (dataResponse) {
          const gridView = {
            data: dataResponse['items'],
            total: dataResponse['totalCount'],
          };
          this.drugsDataSubject.next(gridView);
          this.drugDataLoaderSubject.next(false);
        }
      },
      error: (err) => {
        this.drugsDataSubject.next(false);
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err);
        this.drugDataLoaderSubject.next(false);
      },
    });


  }


}
