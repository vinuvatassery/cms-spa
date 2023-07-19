/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs'; 
/** Entities **/
import { Event } from '../entities/event';
/** Data services **/
import { EventDataService } from '../infrastructure/event.data.service';
import { LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { EventLog } from '../entities/event-log';

@Injectable({ providedIn: 'root' })
export class EventLogFacade {
  /** Private properties **/
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private ddlEventsSubject = new BehaviorSubject<any[]>([]);
  private eventLogsSubject = new BehaviorSubject<EventLog[]>([]);
  private eventLogsCountSubject = new BehaviorSubject<any>(null);

  /** Public properties **/
  events$ = this.eventsSubject.asObservable();
  ddlEvents$ = this.ddlEventsSubject.asObservable();
  eventLogs$ = this.eventLogsSubject.asObservable();
  eventLogsCount$ = this.eventLogsCountSubject.asObservable();

  /** Constructor **/
  constructor(private readonly eventDataService: EventDataService, private loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService) {}

  /** Public methods **/
  loadEvents(): void {
    this.eventDataService.loadEvents().subscribe({
      next: (eventResponse) => {
        this.eventsSubject.next(eventResponse);
      },
      error: (err) => {
        console.error('err', err);
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


  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }
  
    loadEventLog(eventTypeCode:any){
        this.eventDataService.loadEventLog(eventTypeCode).subscribe({
            next: (data:EventLog[]) => { 
              if(data != null){
                this.eventLogsCountSubject.next(data.length);
                this.generateEventLogList(data);
              }
            },
            error: (err: any) => {
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            },
          });
    }

    updateEventLog(eventTypeCode:any){
       this.eventDataService.updateEventLog(eventTypeCode).subscribe({
          error: (err: any) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      },
       })
    }

    generateEventLogList(eventLog:EventLog[]){
      let parentItem = eventLog.filter(x=>x.eventLogParentId===null);
      let childItems = eventLog.filter(x=>x.eventLogParentId!==null);
      parentItem.forEach(x=>x.subLogs= childItems.filter(y=>y.eventLogParentId===x.eventLogId));
      this.eventLogsSubject.next(parentItem);
    }

}
