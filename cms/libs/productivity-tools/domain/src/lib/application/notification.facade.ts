/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubEventTypes } from '@cms/shared/util-core';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  /** Public properties **/
  signalrGeneralNotifications$!: Observable<any>;

  /** Constructor **/
  constructor(
    private readonly signalrEventHandlerService: SignalrEventHandlerService
  ) {
    this.loadSignalrGeneralNotifications();
  }

  /** Private methods **/
  private loadSignalrGeneralNotifications() {
    this.signalrGeneralNotifications$ =
      this.signalrEventHandlerService.signalrNotificationsObservable(
        HubEventTypes.GeneralNotification
      );
  }
}
