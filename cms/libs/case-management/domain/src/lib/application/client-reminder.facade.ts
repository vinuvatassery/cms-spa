import { Injectable } from '@angular/core';
/** Providers **/
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
/** Data services **/
import { ClientReminderService } from '../infrastructure/client-reminder.service';
import { ClientReminder } from '../entities/client-reminder';

@Injectable({ providedIn: 'root' })
export class ClientReminderFacade {
  /** Private properties **/
 
  /** Public properties **/
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.snackbarService.manageSnackBar(type,subtitle)
    this.hideLoader();
       
  }
  hideLoader()
  {
    this.loaderService.hide();
  }
  /** Constructor**/
  constructor(
    private  clientReminderService: ClientReminderService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
  ) { }

   saveClientReminder(clientReminder: ClientReminder) {    
      return this.clientReminderService.saveClientReminder(clientReminder);
  }
}
