/** Angular **/
import { Injectable } from '@angular/core';
import {
  ConfigurationProvider,
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  NotificationSource,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';

/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Cer } from '../entities/cer';
/** Data services **/
import { CerDataService } from '../infrastructure/cer.data.service';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CerTrackingFacade {
  /** Private properties **/
  private cerSubject = new BehaviorSubject<Cer[]>([]);
  private cerGridSubject = new BehaviorSubject<any>([]);
  private ddlCerSubject = new BehaviorSubject<any>([]);
  private cerTrackingListSubject = new Subject<any>();
  private cerTrackingDatesListSubject = new Subject<any>();
  private cerTrackingCountSubject = new Subject<any>();
  private sendResponseSubject = new Subject<boolean>();
  /** Public properties **/
  cer$ = this.cerSubject.asObservable();
  cerGrid$ = this.cerGridSubject.asObservable();
  ddlCer$ = this.ddlCerSubject.asObservable();
  cerTrackingList$ = this.cerTrackingListSubject.asObservable();
  cerTrackingDates$ = this.cerTrackingDatesListSubject.asObservable();
  cerTrackingCount$ = this.cerTrackingCountSubject.asObservable();
  sendResponse$ = this.sendResponseSubject.asObservable();
  public gridPageSizes =
    this.configurationProvider.appSettings.gridPageSizeValues;
  public skipCount = this.configurationProvider.appSettings.gridSkipCount;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public sortValue = 'clientFullName';
  public sortType = 'asc';
  public sort: SortDescriptor[] = [
    {
      field: this.sortValue,
      dir: 'asc',
    },
  ];
  /** Constructor**/
  constructor(
    private readonly cerDataService: CerDataService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider
  ) {}

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }
  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  /** Public methods **/

  getCerTrackingList(
    trackingDate: Date,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ): void {  
    this.cerDataService
      .getCerTrackingList(
        trackingDate,
        skipcount,
        maxResultCount,
        sort,
        sortType
      )
      .subscribe({
        next: (cerTrackingResponse: any) => {
          if (cerTrackingResponse) {            
            const gridView = {
              data: cerTrackingResponse['items'],
              total: cerTrackingResponse['totalCount'],
            };

            this.cerTrackingListSubject.next(gridView);
          }
        },
        error: (err) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }


  getCerTrackingDatesList(): void {   
    this.cerDataService.getCerTrackingDatesList().subscribe({
      next: (cerTrackingDatesResponse: any) => {
        if (cerTrackingDatesResponse) {
          this.cerTrackingDatesListSubject.next(cerTrackingDatesResponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  } 

  getCerTrackingDateCounts(trackingDate : Date): void {
    this.cerDataService.getCerTrackingDateCounts(trackingDate).subscribe({
      next: (cerTrackingCountResponse: any) => {
        if (cerTrackingCountResponse) {
          this.cerTrackingCountSubject.next(cerTrackingCountResponse);
        }
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }

  loadCer(): void {
    this.cerDataService.loadCer().subscribe({
      next: (cerResponse) => {
        this.cerSubject.next(cerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadCerGrid(): void {
    this.cerDataService.loadCerGrid().subscribe({
      next: (cerGridResponse) => {
        this.cerGridSubject.next(cerGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadDdlCer(): void {
    this.cerDataService.loadDdlCer().subscribe({
      next: (ddlCerResponse) => {
        this.ddlCerSubject.next(ddlCerResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  sendCerCount(cerId: any){
    this.cerDataService.sendCerCounts(cerId)
    .subscribe({
      next: (sendCerCountResp: any) => {
        if(!sendCerCountResp?? false){
         this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, 'Something went wrong while sending CER.', NotificationSource.UI);
        }
        this.sendResponseSubject.next(sendCerCountResp);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
    });
  }
}
