/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubEventTypes, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { NotificationDataService } from '../infrastructure/notification.data.service';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationFacade {
  /** Public properties **/
  signalrGeneralNotifications$!: Observable<any>;
  private notificationAndReminderListSubject = new Subject<any>();
  notificationList$ = this.notificationAndReminderListSubject.asObservable();
  private alertSearchLoaderVisibilitySubject = new Subject<boolean>;
  alertSearchLoaderVisibility$= this.alertSearchLoaderVisibilitySubject.asObservable();
  /** Constructor **/
  constructor(
    private readonly notificationDataService: NotificationDataService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService
  ) {
    this.loadSignalrGeneralNotifications();
  }
  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {        
    if(type == SnackBarNotificationType.ERROR)
    {
       const err= subtitle;    
       this.loggingService.logException(err)
    }  
    this.notificationSnackbarService.manageSnackBar(type,subtitle)
    this.loaderService.hide();   
  }
  /** Private methods **/
  private loadSignalrGeneralNotifications() {
    this.signalrGeneralNotifications$ =
      this.signalrEventHandlerService.signalrNotificationsObservable(
        HubEventTypes.GeneralNotification
      );
  }

  loadNotificationsAndReminders(): void {
    this.notificationDataService.loadNotificationsAndReminders().subscribe({
      next: (todoGridResponse: any) => {
        this.notificationAndReminderListSubject.next(todoGridResponse);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  viewNotifications(notifictaions: any[]): Observable<any> {
       
    return this.notificationDataService.viewNotifictaions(notifictaions);
  }
  loadNotificatioBySearchText(text : string): void {
    this.loaderService.show()
    this.alertSearchLoaderVisibilitySubject.next(true);
    if(text){
      this.notificationDataService.searchNotifications(text).subscribe({
        next: (caseBySearchTextResponse) => {
          this.loaderService.hide();
          this.notificationAndReminderListSubject.next(caseBySearchTextResponse);
          this.alertSearchLoaderVisibilitySubject.next(false);
        },
        error: (err) => {
          this.loaderService.hide();
          this.showHideSnackBar(SnackBarNotificationType.ERROR , err)
        },
      });
    }
    else{
      this.notificationAndReminderListSubject.next(null);
      this.alertSearchLoaderVisibilitySubject.next(false);
    }
  } 
  
  SnoozeReminder(reminderId:any, duration:any, isFullDay= true){
    this.loaderService.show()
    this.notificationDataService.SnoozeReminder(reminderId,duration,isFullDay).subscribe({
      next: (snoozeResponse: any) => {
        this.loaderService.hide() 
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , snoozeResponse.message);
        this.loadNotificationsAndReminders();
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        
      },
    })
  }
}
