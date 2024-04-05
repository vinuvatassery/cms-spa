/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/ 
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { ConfigurationProvider, HubEventTypes, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** Entities **/
import {  Subject } from 'rxjs';
import { Todo } from '../entities/todo';
/** Data services **/
import { TodoDataService } from '../infrastructure/todo.data.service';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { LovFacade } from '@cms/system-config/domain';
import { NotificationStatsFacade } from './notification-stats.facade';
import { StatsTypeCode } from '../enums/stats-type-code.enum';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  /** Private properties **/
  private todoSubject = new Subject<Todo[]>();
  private searchSubject = new Subject<any>();
  private todoGridSubject = new Subject<any>();
  private curdAlertSubject = new Subject<any>();
  private todoGetSubject = new Subject<any>();
  private loadAlertGridSubject = new Subject<any>();
  private loadTodoListSubject = new Subject<any>();
  private clientTodoAndRemindersSubject = new Subject<any>();
  private bannerAlertListSubject = new Subject<any>();
  private clientTodoAndRemindersLoaderSubject = new Subject<any>();
  private dismissAlertSubject = new Subject<any>
  /** Public properties **/
  todo$ = this.todoSubject.asObservable();
  search$ = this.searchSubject.asObservable();
  curdAlert$ = this.curdAlertSubject.asObservable();
  dismissAlert$ = this.dismissAlertSubject.asObservable();
  todoGrid$ = this.todoGridSubject.asObservable();
  getTodo$ = this.todoGetSubject.asObservable();
  loadAlertGrid$ = this.loadAlertGridSubject.asObservable();
  loadTodoList$ = this.loadTodoListSubject.asObservable();
  signalrReminders$!: Observable<any>;
  clientTodoAndReminders$ = this.clientTodoAndRemindersSubject.asObservable()
  clientTodoAndRemindersLoader$ = this.clientTodoAndRemindersLoaderSubject.asObservable()
  bannerAlertList$ =  this.bannerAlertListSubject.asObservable();
   public gridPageSizes = this.configurationProvider.appSettings.gridPageSizeValues;
  /** Constructor **/
  constructor(
    private readonly todoDataService: TodoDataService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly notificationStatsFacade : NotificationStatsFacade,
    private loggingService : LoggingService,
    private lovFacade : LovFacade,
    private configurationProvider: ConfigurationProvider,
  ) {
    this.loadSignalrReminders();
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
  private loadSignalrReminders() {
    this.signalrReminders$ =
      this.signalrEventHandlerService.signalrNotificationsObservable(
        HubEventTypes.Reminder
      );
  }

  /** Public methods **/
  loadTodo(): void {
    this.todoDataService.loadTodo().subscribe({
      next: (todoResponse) => {
        this.todoSubject.next(todoResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadToDoSearch(): void {
    this.todoDataService.loadToDoSearch().subscribe({
      next: (searchResponse: any) => {
        this.searchSubject.next(searchResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  loadAlerts(payload:any,alertTypeCode:any): void {
    this.todoDataService.loadAlerts(payload,alertTypeCode.alertType).subscribe({
      next: (todoGridResponse: any) => {
        const gridView: any = {
          data: todoGridResponse.items,
          total:todoGridResponse.totalCount,
        }; 
        this.todoGridSubject.next(gridView); 
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  getTodoItem(payload:any){
    this.loaderService.show()
    this.todoDataService.getTodoItem(payload).subscribe({
      next: (todoGridResponse: any) => {
        this.loaderService.hide()
        this.todoGetSubject.next(todoGridResponse);
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  createAlertItem(payload:any){
    this.loaderService.show()
    this.todoDataService.createAlertItem(payload).subscribe({
      next: (todoGridResponse: any) => {
        this.loaderService.hide() 
        this.curdAlertSubject.next(true);
        this.todoGridSubject.next(true);
        this.loadTodoListSubject.next(true); 
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message);
        if(payload.entityId && payload.entityTypeCode)
          this.notificationStatsFacade.updateStats(payload.entityId, payload.entityTypeCode, StatsTypeCode.Alert);
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  
  updateAlertItem(payload:any){
    this.loaderService.show()
    this.todoDataService.updateAlertItem(payload).subscribe({
      next: (todoGridResponse: any) => {
        this.loaderService.hide() 
        this.curdAlertSubject.next(true);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)  
        this.loadTodoListSubject.next(true); 
        this.loadAlertGridSubject.next(true); 
        this.todoGridSubject.next(true); 
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }

  markAlertAsDone(alertId:any):any { 
        this.loaderService.show()
        this.todoDataService.markAlertAsDone(alertId).subscribe({
          next: (todoGridResponse: any) => {
            this.loaderService.hide()
            this.curdAlertSubject.next(true);
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)
            this.loadTodoListSubject.next(true);    
            this.loadAlertGridSubject.next(true);
            this.bannerAlertListSubject.next(true);
            this.todoGridSubject.next(true);
          },
          error: (err) => {
            this.loaderService.hide()
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
            
          },
        })
      
  }

  deleteAlert(alertId:any, deleteFromOutlookCalender:any='N'):any {
      this.loaderService.show()
      this.todoDataService.deleteAlert(alertId,deleteFromOutlookCalender).subscribe({
        next: (todoGridResponse: any) => {
          this.loaderService.hide()
          this.curdAlertSubject.next(true);
          if(todoGridResponse.status == 0){
            this.showHideSnackBar(SnackBarNotificationType.ERROR , todoGridResponse.message)
          }else {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)  
            this.loadTodoListSubject.next(true);  
            this.loadAlertGridSubject.next(true);
            this.bannerAlertListSubject.next(true);
            this.todoGridSubject.next(true);
          }
          
        },
        error: (err) => {
          this.loaderService.hide()
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      })
   
}

  todoAndRemindersByClient(clientId:any):any {
    this.clientTodoAndRemindersLoaderSubject.next(true)
  this.todoDataService.todoAndReminderByClient(clientId).subscribe({
    next: (clientsTodoReminders: any) => {
      this.clientTodoAndRemindersSubject.next(clientsTodoReminders);
     this.clientTodoAndRemindersLoaderSubject.next(false)

    },
    error: (err) => {
      
      this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
    },
  })
}

  loadAlertsBanner(payload:any): void {
    this.loaderService.show();
    this.todoDataService.loadAlertsBanner(payload).subscribe({
      next: (todoGridResponse: any) => {
        const bannerList: any = {
          data: todoGridResponse.items,
          total:todoGridResponse.totalCount,
        }; 
        this.loaderService.hide() 
        this.bannerAlertListSubject.next(bannerList);
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }

  dismissAlert(alertId:any){
    
    this.todoDataService.dismissAlert(alertId).subscribe({
      next: (alertResponse: any) => {    
        this.dismissAlertSubject.next(alertResponse.message);
      },
      error: (err) => {
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  loadAlertsData(): void {
    this.todoDataService.loadAlertsData().subscribe({
      next: (todoGridResponse: any) => {
        const gridView: any = {
          data: todoGridResponse.items,
          total:todoGridResponse.totalCount,
        }; 
        this.loadTodoListSubject.next(gridView); 
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    });
  }
  
}
