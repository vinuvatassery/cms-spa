/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** Entities **/
import { Event } from '../entities/event';
/** Data services **/
import { EventDataService } from '../infrastructure/event.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';
import { NotificationStatsFacade } from './notification-stats.facade';
import { StatsTypeCode } from '../enums/stats-type-code.enum';


@Injectable({ providedIn: 'root' })
export class EventLogFacade {
  /** Private properties **/
  private eventsSubject = new Subject<any>();
  private eventsDataSubject = new Subject<any>();
  private addEventDataSubject = new Subject<any>();
  private notificationEmailSubject = new Subject<any>();
  private notificationLetterSubject = new Subject<any>();

  /** Public properties **/
  events$ = this.eventsSubject.asObservable();
  eventsdata$ = this.eventsDataSubject.asObservable();
  addEventdata$ = this.addEventDataSubject.asObservable();
  notificationEmail$ = this.notificationEmailSubject.asObservable();
  notificationLetter$ = this.notificationLetterSubject.asObservable();

  /** Constructor **/
  constructor(private readonly eventDataService: EventDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly notificationStatsFacade : NotificationStatsFacade) {}

  /** Public methods **/

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any, title : string = '')
  {
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;
        this.loggingService.logException(err)
      }
        this.notificationSnackbarService.manageSnackBar(type, subtitle, NotificationSource.API, title)
        this.hideLoader();
  }

  showLoader()
  {
    this.loaderService.show();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }

  loadEventLogs(params: any, entityId:string): void {
    this.eventDataService.loadEventLogs(params,entityId).subscribe({
      next: (eventResponse) => {
        this.eventsSubject.next(eventResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadEventsData(): void {
    this.eventDataService.loadEventsData().subscribe({
      next: (eventResponse) => {
        this.eventsDataSubject.next(eventResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  addEventData(eventData : any): void {
    this.showLoader()
    this.eventDataService.addEventData(eventData).subscribe({
      next: (response : any) => {
        this.hideLoader()
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS, response[1].message, response[0].message);
        this.addEventDataSubject.next(response);
        if(eventData?.sourceEntityId && eventData?.sourceEntityTypeCode)
          this.notificationStatsFacade.resetStats(eventData.sourceEntityId, StatsTypeCode.EventLog);
      },
      error: (err) => {
        this.hideLoader()
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadNotificationEmail(eventLogId:any){
    debugger
    this.showLoader();
    this.eventDataService.loadNotificationEmail(eventLogId).subscribe({
      next: (response : any) => {
        this.hideLoader()
        this.notificationEmailSubject.next(response);        
      },
      error: (err) => {
        this.hideLoader()
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }

  loadNotificationLetter(eventLogId:any){
    debugger
    this.showLoader();
    this.eventDataService.loadNotificationLetter(eventLogId).subscribe({
      next: (response : any) => {
        this.hideLoader()
        this.notificationLetterSubject.next(response);        
      },
      error: (err) => {
        this.hideLoader()
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });

  }

  reSentEmailNotification(eventLogId:any)
  {
    return this.eventDataService.reSentEmailNotification(eventLogId);
  }

  reSentLetterNotification(eventLogId: any)
  {
    return this.eventDataService.reSentLetterNotification(eventLogId);
  }

  loadAttachmentPreview(attachmentId: any, attachmentType:any) {
    return this.eventDataService.loadAttachmentPreview(attachmentId,attachmentType);
  }

}
