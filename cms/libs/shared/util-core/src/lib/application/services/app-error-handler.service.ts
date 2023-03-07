/** Angular **/
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
/** Services **/
import { NotificationService } from '../../api/services/notification.service';

/* Application-wide error handler that adds a UI notification to the error handling
 * provided by the default Angular ErrorHandler.
 */
@Injectable()
export class AppErrorHandler extends ErrorHandler {
  /** Constructor **/
  constructor(private readonly notificationsService: NotificationService) {
    super();
  }

  /** Public methods **/
  override handleError(error: Error | HttpErrorResponse) {
    super.handleError(error);
  }
}
