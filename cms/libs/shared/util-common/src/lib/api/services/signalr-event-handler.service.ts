/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { filter } from 'rxjs/internal/operators/filter';
import { map } from 'rxjs/internal/operators/map';
/** Enums **/
import { HubMethodTypes } from '@cms/shared/util-core';
/** Services **/
import { SignalrService } from '@cms/shared/util-signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalrEventHandlerService {
  /** Private  properties **/
  private isGeneralNotificationEventNotInvoked = true;
  private isReminderEventNotInvoked = true;

  /** Constructor **/
  constructor(private readonly signalrService: SignalrService) {}

  /** Private methods **/
  private handleGeneralNotificationEvents() {
    if (this.isGeneralNotificationEventNotInvoked) {
      this.signalrService.registerCustomEvents(
        HubMethodTypes.GeneralNotification
      );
      this.isGeneralNotificationEventNotInvoked = false;
    }
    return this.signalrService.signalrNotifications$?.pipe(
      filter(
        (notification) =>
          notification.type === HubMethodTypes.GeneralNotification
      ),
      map((result) => {
        // custom logic goes here
        return result;
      })
    );
  }

  private handleReminderEvents() {
    if (this.isReminderEventNotInvoked) {
      this.signalrService.registerCustomEvents(HubMethodTypes.Reminder);
      this.isReminderEventNotInvoked = false;
    }
    return this.signalrService.signalrNotifications$?.pipe(
      filter((notification) => notification.type === HubMethodTypes.Reminder),
      map((result) => {
        //custom logic goes here
        return result;
      })
    );
  }

  /** Public methods **/
  signalrNotifications(type: HubMethodTypes) {
    let response: any;
    switch (type) {
      case HubMethodTypes.GeneralNotification:
        response = this.handleGeneralNotificationEvents();
        break;
      case HubMethodTypes.Reminder:
        response = this.handleReminderEvents();
        break;
    }
    return response;
  }
}
