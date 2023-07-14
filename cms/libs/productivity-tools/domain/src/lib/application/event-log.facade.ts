/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Entities **/
import { Event } from '../entities/event';
/** Data services **/
import { EventDataService } from '../infrastructure/event.data.service';

@Injectable({ providedIn: 'root' })
export class EventLogFacade {
  /** Private properties **/
  private eventsSubject = new BehaviorSubject<Event[]>([]);
  private ddlEventsSubject = new BehaviorSubject<any[]>([]);

  /** Public properties **/
  events$ = this.eventsSubject.asObservable();
  ddlEvents$ = this.ddlEventsSubject.asObservable();

  /** Constructor **/
  constructor(private readonly eventDataService: EventDataService) {}

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


  // showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
  //   if (type == SnackBarNotificationType.ERROR) {
  //     const err = subtitle;
  //     this.loggingService.logException(err);
  //   }
  //   this.notificationSnackbarService.manageSnackBar(type, subtitle);
  // }
  
  //   loadEventLog(clientId:any, clientCaseEligibilityId:any){
  //       debugger;
  //       this.profileTabDataService.loadEventLog(clientId,clientCaseEligibilityId)  .subscribe({
  //           next: (data) => { 
  //               this.eventLogSubject.next(data); 
  //           },
  //           error: (err: any) => {
  //               this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
  //           },
  //         });
  //   }


}
