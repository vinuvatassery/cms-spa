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
   
    private batchLogsDataLoaderSubject = new BehaviorSubject<boolean>(false);
    batchLogsDataLoader$ = this.batchLogsDataLoaderSubject.asObservable();
  
   
    public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
    public sortValue = 'startDate'
    public sortType = 'asc'
    public sort: SortDescriptor[] = [{
      field: this.sortValue,
    }];
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any, source :  NotificationSource  = NotificationSource.API)
  {
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;
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
 
  loadBatchLogsList(interfaceTypeCode: string, paginationParameters: any){
    this.batchLogsDataLoaderSubject.next(true);
    this.service.loadBatchLogsList(interfaceTypeCode, paginationParameters).subscribe({
      next: (dataResponse:any) => {
        debugger
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.activityEventLogListSubject.next(gridView);
        this.batchLogsDataLoaderSubject.next(false);
      },
      error: (err) => {
        debugger
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)  ;
        this.batchLogsDataLoaderSubject.next(false);
      },
    });
   
  
  }

}
