import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackBarNotificationText, SnackBarNotificationType } from '../../enums/snack-bar-notification-type.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationSnackbarService {
    
      snackbarSubject = new Subject<any>();
      snackbar$ = this.snackbarSubject.asObservable();
      subscribeNotification(){

      }
      manageSnackBar(type : SnackBarNotificationType , subtitle : any)
      {    
        let subtitleText = subtitle;
        const titleText = (type== SnackBarNotificationType.SUCCESS) ? SnackBarNotificationText.SUCCESS : SnackBarNotificationText.ERROR
        if(type == SnackBarNotificationType.ERROR)
        {
          const err= subtitle;          
          subtitleText =err?.error?.error;
        
        }
        const snackbarMessage: any = {
          subtitle: subtitleText,
          type: type,
        };
        this.snackbarSubject.next(snackbarMessage);
      
      }
}
