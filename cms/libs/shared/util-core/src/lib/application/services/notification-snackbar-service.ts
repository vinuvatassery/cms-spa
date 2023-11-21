import { Injectable } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';
import { ConfigurationProvider } from '../../api/providers/configuration.provider';
import { NotificationSource, SnackBarNotificationText, SnackBarNotificationType } from '../../enums/snack-bar-notification-type.enum';



@Injectable({
  providedIn: 'root',
})
export class NotificationSnackbarService {
 
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

      manageSnackBar(type : SnackBarNotificationType , errorBody : any,source :  NotificationSource  = NotificationSource.API)
      { 
        
        let subtitleText = errorBody;
        const titleText = (type== SnackBarNotificationType.SUCCESS) ? 
                            SnackBarNotificationText.SUCCESS 
                          : (type== SnackBarNotificationType.ERROR) ? 
                            SnackBarNotificationText.ERROR
                          : SnackBarNotificationText.WARNING
        
        if(type == SnackBarNotificationType.ERROR && source == NotificationSource.API)
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
          type: type,
        };
        this.filterManager.next(snackbarMessage);

      }
}
