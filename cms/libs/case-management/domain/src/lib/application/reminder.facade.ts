import { Injectable } from '@angular/core';
/** Providers **/
import { LoaderService, NotificationSnackbarService, SnackBarNotificationType, LoggingService } from '@cms/shared/util-core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
/** Data services **/
import { ReminderService } from '../infrastructure/reminder.service';
import {Reminder } from '../entities/reminder';

@Injectable({ providedIn: 'root' })
export class ReminderFacade {
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
    private  reminderService: ReminderService,
    private loggingService: LoggingService,
    private readonly loaderService: LoaderService,
    private readonly snackbarService: NotificationSnackbarService,
  ) { }

   saveReminder(reminder: Reminder) {    
      return this.reminderService.saveReminder(reminder);
  }
}
