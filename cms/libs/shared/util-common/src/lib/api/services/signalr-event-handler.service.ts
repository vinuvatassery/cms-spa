/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
/** Enums **/
import { HubEventTypes, HubMethods, HubNames } from '@cms/shared/util-core';
/** Services **/
import { SignalrService } from '@cms/shared/util-signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrEventHandlerService {
  /** Private  properties **/
  private reminderSnackBars = new Subject<any>();
  remindersUnViewedCountSubject = new Subject<any>();
  /** Public properties **/
  reminderSnackBar$ = this.reminderSnackBars.asObservable();

  
  snackBarAlertIds:any[]=[]
  unviewedCount = 0;
  remindersUnViewedCount$  = this.remindersUnViewedCountSubject.asObservable();
  /** Constructor **/
  constructor(private readonly signalrService: SignalrService) {
    this.registerHubMethodHandlers();
  }

  /** Private methods **/
  private registerHubMethodHandlers() {
    // Register handlers for hub message methods.
    this.signalrService.registerHubMethodHandlers(HubNames.NotificationHub, [
      HubMethods.ReceiveNotification,
      // Register more handlers...
    ]);
  }

  private sendAckMessage(messageId: string, isAcknowledged: boolean) {
    // Retrieve the hub connection from the collection.
    const hubConnection = this.signalrService.getHubConnection(
      HubNames.NotificationHub
    );

    // Send an acknowledgment to update the status of the message in
    // the ALERT_LOG to 'SUCCEEDED'.
    if (hubConnection != null) {
      hubConnection.send(HubMethods.SendAckMessage, messageId, isAcknowledged);
    }
  }

  /** Public methods **/
  signalrNotificationsObservable(eventType: HubEventTypes) {
    return this.signalrService.signalrEvents$?.pipe(
      filter((event) => event.payload.eventType === eventType),
      map((event) => {       
        
        this.reminderSnackBars.next(event.payload)
        // Send an acknowledgment to update the status of the message (if Ack enabled).
        if (event.payload.isAckEnabled) {
          this.sendAckMessage(event.payload.messageId, true);
        }
        return event;
      })
    );
  }
}
