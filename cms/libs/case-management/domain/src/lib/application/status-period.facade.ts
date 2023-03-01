/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** Data services **/
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { StatusPeriodDataService } from '../infrastructure/status-period.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class StatusPeriodFacade {
  /** Private properties **/
  private statusPeriodSubject = new BehaviorSubject<any>([]);

  /** Public properties **/
  statusPeriod$ = this.statusPeriodSubject.asObservable();
  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  public sortValue = 'StatusStart'
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
}
