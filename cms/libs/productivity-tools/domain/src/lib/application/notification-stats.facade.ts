/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** Data services **/
import { NotificationStatsDataService } from '../infrastructure/notification-stats.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class NotificationStatsFacade {
  /** Private properties **/
  private statsSubject = new Subject<any>();
   private updateStatsSubject = new Subject<any>();
//   private eventsDataSubject = new Subject<any>();
//   private addEventDataSubject = new Subject<any>();

  /** Public properties **/
    stats$ = this.statsSubject.asObservable();
    updateStats$ = this.updateStatsSubject.asObservable();
//   eventsdata$ = this.eventsDataSubject.asObservable();
//   addEventdata$ = this.addEventDataSubject.asObservable();

  /** Constructor **/
  constructor(private readonly notificationStatsDataService: NotificationStatsDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService) {}

  /** Public methods **/

//   showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
//   {
//       if(type == SnackBarNotificationType.ERROR)
//       {
//         const err= subtitle;
//         this.loggingService.logException(err)
//       }
//         this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
//         this.hideLoader();
//   }

//   showLoader()
//   {
//     this.loaderService.show();
//   }

//   hideLoader()
//   {
//     this.loaderService.hide();
//   }

  getStats(entityId:string, statsTypeCode:string = ''): void {
    this.notificationStatsDataService.getStats(entityId, statsTypeCode).subscribe({
      next: (statsResponse) => {
        this.statsSubject.next(statsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  updateStats(entityId:string, entityTypeCode:string, statsTypeCode:string): void {
    this.notificationStatsDataService.updateStats(entityId, entityTypeCode, statsTypeCode).subscribe({
      next: (statsResponse) => {
        this.updateStatsSubject.next(statsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

//   loadDdlEvents() {
//     this.eventDataService.loadDdlEvents().subscribe({
//       next: (eventDdl) => {
//         this.ddlEventsSubject.next(eventDdl);
//       },
//       error: (err) => {
//         console.error('err', err);
//       },
//     });
//   }

//   addEventData(eventData : any): void {
//     this.showLoader()
//     this.eventDataService.addEventData(eventData).subscribe({
//       next: (response : any) => {
//         this.hideLoader()
//         this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response[1].message, response[0].message);
//         this.addEventDataSubject.next(response);
//       },
//       error: (err) => {
//         this.hideLoader()
//         this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
//       },
//     });
//   }
}
