import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SystemInterfaceDashboardService } from '../infrastructure/system-interface-dashboard.service';
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceDashboardFacade {
  private ClientRecordSendChartSubject = new Subject<any>();

  public ClientRecordSendChart$ =
    this.ClientRecordSendChartSubject.asObservable();
  private cardsRequestChartSubject = new Subject<any>();
  public cardsRequestChart$ =
    this.cardsRequestChartSubject.asObservable();
  private activityEventLogListSubject = new BehaviorSubject<any>([]);
  activityEventLogLists$ =
    this.activityEventLogListSubject.asObservable();

  private batchLogExceptionListSubject = new BehaviorSubject<any>([]);
  batchLogExcptionLists$ = this.batchLogExceptionListSubject.asObservable();

  private batchLogsDataLoaderSubject = new BehaviorSubject<boolean>(false);
  batchLogsDataLoader$ = this.batchLogsDataLoaderSubject.asObservable();

  // weblogs --------------------------
  private webLogListSubject = new Subject<any>();
  webLogLists$ = this.webLogListSubject.asObservable();
  private webLogsDataLoaderSubject = new BehaviorSubject<boolean>(false);
  webLogsDataLoader$ = this.webLogsDataLoaderSubject.asObservable();
  // ----------------------------------

  public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  public sortValue = 'startDate'
  public sortType = 'asc'
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any, source: NotificationSource = NotificationSource.API) {
    if (type === SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle, source)
    this.hideLoader();
  }

  /** Constructor**/
  constructor(private systemInterfaceDashboardService: SystemInterfaceDashboardService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider,
    private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    public intl: IntlService, private service: SystemInterfaceDashboardService) { }

  /** Public methods **/
  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  getEventLogLists(): void {

    this.systemInterfaceDashboardService.loadActivityLogListsServices().subscribe({
      next: (activityEventLogResponse) => {
        this.activityEventLogListSubject.next(activityEventLogResponse);

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)

      },
    });
  }

  loadClientRecordSendChart() {
    this.systemInterfaceDashboardService.getClientRecordSendChart().subscribe({
      next: (ClientRecordSendChart) => {
        this.ClientRecordSendChartSubject.next(ClientRecordSendChart);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCardsRequestChart() {
    this.systemInterfaceDashboardService.getCardsRequestChart().subscribe({
      next: (cardsRequestChart) => {
        this.cardsRequestChartSubject.next(cardsRequestChart);
      },

      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadBatchLogsList(interfaceTypeCode: string, displayAll: boolean, paginationParameters: any) {
    this.showLoader();
    this.batchLogsDataLoaderSubject.next(true);
    this.service.loadBatchLogsList(interfaceTypeCode, displayAll, paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.activityEventLogListSubject.next(gridView);
        this.batchLogsDataLoaderSubject.next(false);
        this.hideLoader();
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.batchLogsDataLoaderSubject.next(false);
        this.hideLoader();
      },
    });
  }

  getBatchLogExceptionsLists(fileId: string, processTypeCode: string, params: any): void {
    this.showLoader();
    this.systemInterfaceDashboardService.getBatchlogsExceptions(fileId, processTypeCode, params).subscribe({
      next: (batchlogExceptionResponse: any) => {
        const gridView: any = {
          data: batchlogExceptionResponse['items'],
          total: batchlogExceptionResponse?.totalCount,
        };
        this.batchLogExceptionListSubject.next(gridView);
        this.hideLoader();
      },
      error: (err) => {
        this.hideLoader();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)

      },
    });
  }

  // weblogs ----------------------------------
  loadWebLogsList(interfaceTypeCode: string, displayAll: boolean, params: any) {
    this.webLogsDataLoaderSubject.next(true);
    this.service.getRamsellInterfaceActivity(interfaceTypeCode, displayAll, params)
      .subscribe({
        next: (dataResponse: any) => {
          const gridView: any = {
            data: dataResponse['items'],
            total: dataResponse?.totalCount,
          };
          this.webLogListSubject.next(gridView);
          this.webLogsDataLoaderSubject.next(false);
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          this.webLogsDataLoaderSubject.next(false);
        },
      });
  }
  // ----------------------------------

}
