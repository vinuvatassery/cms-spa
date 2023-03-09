import { Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { SnackBarNotificationText, SnackBarNotificationType } from '../../enums/snack-bar-notification-type.enum';
@Injectable({
  providedIn: 'root',
})
export class NotificationSnackbarService {
 
  filterManager: Subject<any> = new Subject<any>();  
  snackbarSubject = new Subject<any>();
  snackbar$ = this.snackbarSubject.asObservable();

     constructor()
     {
      this.filterManager
      .pipe(debounceTime(300))      
      .subscribe(
        (snackbarMessage) => 
        {
          this.snackbarSubject.next(snackbarMessage);
        } ); 
     }  

      manageSnackBar(type : SnackBarNotificationType , errorBody : any)
      {      
        let subtitleText = errorBody;
        const titleText = (type== SnackBarNotificationType.SUCCESS) ? SnackBarNotificationText.SUCCESS : SnackBarNotificationText.ERROR
        
        if(type == SnackBarNotificationType.ERROR)
        {         
          const errorData= errorBody;     
          let errorMessage =''          
          //In case of fluent validation result from API
          if(errorData?.error?.isValid === false)
          {
            errorData?.error?.errors?.forEach((item : any)=> {
              errorMessage += item?.errorMessage+' ';
            });    
            
            subtitleText = errorMessage
          }
          else
          {            
              subtitleText = errorBody?.error?.error?.message
          } 
        }

        const snackbarMessage: any = {
          title: titleText,
          subtitle: subtitleText,
          type: type,
        };
        this.filterManager.next(snackbarMessage);

      }
      errorSnackBar( subtitle : any)
      {
        const snackbarMessage: any = {
          title: SnackBarNotificationType.ERROR,
          subtitle: subtitle,
          type: SnackBarNotificationType.ERROR,
        };
        this.snackbarSubject.next(snackbarMessage);
      }
      warningSnackBar( subtitle : any)
      {
        const snackbarMessage: any = {
          title: SnackBarNotificationType.WARNING,
          subtitle: subtitle,
          type: SnackBarNotificationType.WARNING,
        };
        this.snackbarSubject.next(snackbarMessage);
      }
}
