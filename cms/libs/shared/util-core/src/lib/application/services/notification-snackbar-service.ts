import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SnackBarNotificationText, SnackBarNotificationType } from '../../enums/snack-bar-notification-type.enum';

@Injectable({
  providedIn: 'root',
})
export class NotificationSnackbarService {
    
      snackbarSubject = new Subject<any>();
      snackbar$ = this.snackbarSubject.asObservable();
     
      manageSnackBar(type : SnackBarNotificationType , subtitle : any)
      {    
        let subtitleText = subtitle;
        const titleText = (type== SnackBarNotificationType.SUCCESS) ? SnackBarNotificationText.SUCCESS : SnackBarNotificationText.ERROR
        
        if(type == SnackBarNotificationType.ERROR)
        {
         
          const err= subtitle;     
          let errorMessage =''
          
          //In case of fluent validation result from API
          if(err?.isValid === false)
          {
            err?.errors.forEach((item : any)=> {
              errorMessage += item?.errorMessage+' ';
            });           
          }
          else
          {
             //exception plugin result DTO
              errorMessage =  err?.error?.details == null ? err?.error?.message : err?.error?.details
          }
          subtitleText = errorMessage ;        
        }

        const snackbarMessage: any = {
          title: titleText,
          subtitle: subtitleText,
          type: type,
        };
        this.snackbarSubject.next(snackbarMessage);
      
      }
}
