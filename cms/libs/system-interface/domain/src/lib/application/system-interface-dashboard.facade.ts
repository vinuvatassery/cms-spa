import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SystemInterfaceDashboardService } from '../infrastructure/system-interface-dashboard.service';
import { SnackBarNotificationType, NotificationSource, LoaderService, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';
import { SystemInterfaceActivityStatusCode } from '../enums/system-interface-status-type-code';
import { SystemInterfaceActivityStatusCodeDescription } from '../enums/system-interface-status-type-code.description';
import { SystemInterfaceEecProcessTypeCode } from '../enums/system-interface-eec-process-type-code';

@Injectable({ providedIn: 'root' })
export class SystemInterfaceDashboardFacade {
  private ClientRecordSendChartSubject = new Subject<any>();

  public ClientRecordSendChart$ =
    this.ClientRecordSendChartSubject.asObservable();
  private cardsRequestChartSubject = new Subject<any>();
  public cardsRequestChart$ =
    this.cardsRequestChartSubject.asObservable();
  private activityEventLogListSubject = new Subject<any>();
  activityEventLogLists$ =    this.activityEventLogListSubject.asObservable();

  private prescriptionsFillsSubject = new Subject<any>();
  prescriptionsFills$ =    this.prescriptionsFillsSubject.asObservable();

  private batchLogExceptionListSubject = new Subject<any>();
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

  }

  prescriptionsFillsCard() {
    this.systemInterfaceDashboardService.getPrescriptionsFills().subscribe({
      next: (prescriptionsFills:any) => {
        this.prescriptionsFillsSubject.next(prescriptionsFills);
      },

      error: (err:any) => {
        console.error('err', err);
      },
    });
  }
  loadClientRecordSendChart(days:number,isCardRequest:boolean) {
    this.systemInterfaceDashboardService.getClientSendCardsinfo(days,isCardRequest).subscribe({
      next: (ClientRecordSendChart:any) => {
        
        this.ClientRecordSendChartSubject.next(ClientRecordSendChart);
      },

      error: (err:any) => {
        console.error('err', err);
      },
    });
  }

  loadCardsRequestChart(days:number,isCardRequest:boolean) {
    this.systemInterfaceDashboardService.getCardsRequestinfo(days,isCardRequest).subscribe({
      next: (cardsRequestChart) => {
        this.cardsRequestChartSubject.next(cardsRequestChart);
      },

      error: (err) => {       
        console.error('err', err);
      },
    });
  }

  loadBatchLogsList(interfaceTypeCode: string, displayAll: boolean, paginationParameters: any) {
    this.batchLogsDataLoaderSubject.next(true);
    this.service.loadBatchLogsList(interfaceTypeCode, displayAll, paginationParameters).subscribe({
      next: (dataResponse: any) => {
        const gridView: any = {
          data: dataResponse['items'],
          total: dataResponse?.totalCount,
        };
        this.activityEventLogListSubject.next(gridView);
        this.batchLogsDataLoaderSubject.next(false);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        this.batchLogsDataLoaderSubject.next(false);
      },
    });
  }

  getBatchLogExceptionsLists(fileId: string, interfaceTypeCode: string, processTypeCode: string, params: any) {

    return this.systemInterfaceDashboardService.getBatchlogsExceptions(fileId, interfaceTypeCode, processTypeCode, params);

  }

  getStatusArray(): string[]{
    return Object.values(SystemInterfaceActivityStatusCode)
  }

  getStatusDescriptionArray(): string[]{
    return Object.values(SystemInterfaceActivityStatusCodeDescription)
  }

  getEecProcessTypeCodeArray(): string[]{
    return Object.values(SystemInterfaceEecProcessTypeCode)
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

  getDocumentDownload(fileId: string) {
    return this.systemInterfaceDashboardService.getDocumentDownload(fileId).subscribe({
      next: (dataResponse: any) => {

      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });;
  }
  // ----------------------------------

  getClientDocumentsViewDownload(clientDocumentId: string) {
    return this.service.getDocumentDownload(clientDocumentId);
  }

  viewOrDownloadFile(documentId: string, documentName: string) {
    if (documentId === undefined || documentId === '') {
      return;
    }
    this.loaderService.show()
    this.getClientDocumentsViewDownload(documentId).subscribe({
      next: (data: any) => {

        const fileUrl = window.URL.createObjectURL(data);
        window.open(fileUrl, "_blank");
        const downloadLink = document.createElement('a');
        downloadLink.href = fileUrl;
        downloadLink.download = documentName;
        downloadLink.click();
        this.loaderService.hide();
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.showHideSnackBar(SnackBarNotificationType.ERROR, error)
      }
    })
  }

}
