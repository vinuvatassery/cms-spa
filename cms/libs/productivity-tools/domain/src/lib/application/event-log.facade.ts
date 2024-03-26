/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs';
/** Entities **/
import { Event } from '../entities/event';
/** Data services **/
import { EventDataService } from '../infrastructure/event.data.service';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType, NotificationSource } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class EventLogFacade {
  /** Private properties **/
  private eventsSubject = new Subject<any>();
  private ddlEventsSubject = new Subject<any[]>();
  private eventsDataSubject = new Subject<any>();
  private addEventDataSubject = new Subject<any>();

  /** Public properties **/
  events$ = this.eventsSubject.asObservable();
  ddlEvents$ = this.ddlEventsSubject.asObservable();
  eventsdata$ = this.eventsDataSubject.asObservable();
  addEventdata$ = this.addEventDataSubject.asObservable();

  /** Constructor **/
  constructor(private readonly eventDataService: EventDataService,
    private loggingService : LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly loaderService: LoaderService) {}

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

  loadEvents(params: any, entityId:string): void {
    this.eventDataService.loadEvents(params,entityId).subscribe({
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

  loadDdlEvents() {
    this.eventDataService.loadDdlEvents().subscribe({
      next: (eventDdl) => {
        this.ddlEventsSubject.next(eventDdl);
      },
      error: (err) => {
        console.error('err', err);
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
      },
      error: (err) => {
        this.hideLoader()
        this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
      },
    });
  }
}
