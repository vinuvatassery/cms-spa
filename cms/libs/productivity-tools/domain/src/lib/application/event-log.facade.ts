/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import {  Subject } from 'rxjs'; 
/** Entities **/
import { Event } from '../entities/event';
/** Data services **/
import { EventDataService } from '../infrastructure/event.data.service';

@Injectable({ providedIn: 'root' })
export class EventLogFacade {
  /** Private properties **/
  private eventsSubject = new Subject<any>();
  private ddlEventsSubject = new Subject<any[]>();

  /** Public properties **/
  events$ = this.eventsSubject.asObservable();
  ddlEvents$ = this.ddlEventsSubject.asObservable();

  /** Constructor **/
  constructor(private readonly eventDataService: EventDataService) {}

  /** Public methods **/
  loadEvents(entityId: any, params: any): void {
    this.eventDataService.loadEvents(entityId, params).subscribe({
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
}
