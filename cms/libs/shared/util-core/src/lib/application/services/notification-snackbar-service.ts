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

      manageSnackBar(type : SnackBarNotificationType , errorBody : any,source :  NotificationSource  = NotificationSource.API, primaryText: string = '')
      { 
        
        let subtitleText = errorBody;        
        //This is to implement primary (title) / secondary (subTitle) text in the snackbar messages.
        //If primaryText is passed in the main method, it will show primaryText as the titleText instead of Success/Error/Warning text.
        //If primaryText is not passed in the main method, it will show Success/Error/Warning text as the title based on the type. 
        //The secondary text will always be the errorBody parameter.
        const titleText = this.getTitleText(type, primaryText);
        
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

      getTitleText(type : SnackBarNotificationType, primaryText : string) {
        let titleText = '';
        if(primaryText != ''){
          titleText = primaryText;
        }
        else{
          switch(type){
            case SnackBarNotificationType.SUCCESS:
              titleText = SnackBarNotificationText.SUCCESS;
              break;
            case SnackBarNotificationType.ERROR:
              titleText = SnackBarNotificationText.ERROR;
              break;
            case SnackBarNotificationType.WARNING:
              titleText = SnackBarNotificationText.WARNING;
              break;
            default:
              titleText = SnackBarNotificationText.WARNING;
              break;
          }
        }
        return titleText;  
      }
}
