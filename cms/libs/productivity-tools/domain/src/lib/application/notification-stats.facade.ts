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
  private getStatsSubject = new Subject<any>();
  private updateStatsSubject = new Subject<any>();
  private resetStatsSubject = new Subject<any>();
  private directMessageStatsSubject = new Subject<any>();
  /** Public properties **/
  getStats$ = this.getStatsSubject.asObservable();
  updateStats$ = this.updateStatsSubject.asObservable();
  resetStats$ = this.resetStatsSubject.asObservable();
  directMessageStats$ = this.directMessageStatsSubject.asObservable();
  /** Constructor **/
  constructor(private readonly notificationStatsDataService: NotificationStatsDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService) {}

  /** Public methods **/

  getStats(entityId:string, statsTypeCode:string): void {
    this.notificationStatsDataService.getStats(entityId, statsTypeCode).subscribe({
      next: (statsResponse) => {
        this.getStatsSubject.next(statsResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  updateStats(entityId:string, entityTypeCode:string, statsTypeCode:string = ''): void {
    this.notificationStatsDataService.updateStats(entityId, entityTypeCode, statsTypeCode).subscribe({
      next: (statsResponse) => {
        const response = {
            data: statsResponse,
            statsTypeCode: statsTypeCode
          };
        this.updateStatsSubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  resetStats(entityId:string, statsTypeCode:string): void {
    this.notificationStatsDataService.resetStats(entityId, statsTypeCode).subscribe({
      next: (statsResponse) => {
        const response = {
            data: statsResponse,
            statsTypeCode: statsTypeCode
          };
        this.resetStatsSubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
  directMessageStats(entityId:string, statsTypeCode:string): void {
    this.notificationStatsDataService.directMessageStats(entityId).subscribe({
      next: (statsResponse) => {
        const response = {
            data: statsResponse,
            statsTypeCode: statsTypeCode
          };
        this.directMessageStatsSubject.next(response);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
