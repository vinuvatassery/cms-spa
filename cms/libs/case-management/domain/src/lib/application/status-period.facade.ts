/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Provider } from '../entities/provider';
/** Data services **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusPeriodDataService } from '../infrastructure/status-period.data.service';
import { SnackBar } from '@cms/shared/ui-common';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class StatusPeriodFacade {
  /** Private properties **/
  private statusPeriodSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  statusPeriod$ = this.statusPeriodSubject.asObservable();
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'ClientName'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
    dir: 'asc' 
  }];

  /** Constructor**/
  constructor(private readonly statusPeriodDataService: StatusPeriodDataService,
    private loggingService : LoggingService,
    private readonly loaderService: LoaderService ,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private configurationProvider : ConfigurationProvider,
    ) {}

  /** Public methods **/
  loadStatusPeriod(): void {
    this.statusPeriodDataService.loadStatusPeriod().subscribe({
      next: (statusPeriodResponse) => {
        this.statusPeriodSubject.next(statusPeriodResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
 
  save():Observable<boolean>{
    //TODO: save api call   
    return of(true);
  }
}
