import { Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ConfigurationProvider } from '../../api/providers/configuration.provider';
import { ReminderNotificationSource, ReminderSnackBarNotificationText, ReminderSnackBarNotificationType } from '../../enums/snack-bar-notification-type.enum';



@Injectable({
  providedIn: 'root',
})
export class ReminderNotificationSnackbarService {
 
  filterManager: Subject<any> = new Subject<any>();  
  snackbarSubject = new Subject<any>();
  snackbar$ = this.snackbarSubject.asObservable(); 

     constructor(private configurationProvider : ConfigurationProvider)
     {
      this.filterManager
      .pipe(debounceTime(300))      
      .subscribe(
        (snackbarMessage) => 
        {
          this.snackbarSubject.next(snackbarMessage);
        } ); 
     }  

      manageSnackBar(type : ReminderSnackBarNotificationType 
        , errorBody : any
        ,source :  ReminderNotificationSource  = ReminderNotificationSource.API)
      { 
        
        let subtitleText = errorBody;
        const titleText = (type== ReminderSnackBarNotificationType.SUCCESS) ? ReminderSnackBarNotificationText.SUCCESS : ReminderSnackBarNotificationText.ERROR
        
        if(type == ReminderSnackBarNotificationType.ERROR && source == ReminderNotificationSource.API)
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
              subtitleText = errorBody?.error?.error?.message ?? this.configurationProvider.appSettings.genericErrorMessage
          } 
        }

        const snackbarMessage: any = {
          title: titleText,
          subtitle: subtitleText,
          type: type
        };
        this.filterManager.next(snackbarMessage);

      }
}
