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
        , payload : any)
      { 
      
        const snackbarMessage: any = {
          payload:payload,
          type: type
        };
        this.filterManager.next(snackbarMessage);

      }
}
