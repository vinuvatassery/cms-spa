/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/ 
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubEventTypes, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** Entities **/
import {  Subject } from 'rxjs';
import { Todo } from '../entities/todo';
/** Data services **/
import { TodoDataService } from '../infrastructure/todo.data.service';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';
import { LovFacade } from '@cms/system-config/domain';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  /** Private properties **/
  private todoSubject = new Subject<Todo[]>();
  private searchSubject = new Subject<any>();
  private todoGridSubject = new Subject<any>();
  private curdAlertSubject = new Subject<any>();
  private todoGetSubject = new Subject<any>();
  private loadAlertGridSubject = new Subject<any>();
  /** Public properties **/
  todo$ = this.todoSubject.asObservable();
  search$ = this.searchSubject.asObservable();
  todoGrid$ = this.todoGridSubject.asObservable();
  curdAlert$ = this.curdAlertSubject.asObservable();
  getTodo$ = this.todoGetSubject.asObservable();
  loadAlertGrid$ = this.loadAlertGridSubject.asObservable();
  signalrReminders$!: Observable<any>;

 
  /** Constructor **/
  constructor(
    private readonly todoDataService: TodoDataService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService,
    private lovFacade : LovFacade
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
    this.todoDataService.loadAlerts(payload,alertTypeCode).subscribe({
      next: (todoGridResponse: any) => {
        this.todoGridSubject.next(todoGridResponse);
      },
      error: (err) => {
        console.error('err', err);
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
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)    
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
        this.loadAlertGridSubject.next(true);  
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
            this.loadAlertGridSubject.next(true);
          },
          error: (err) => {
            this.loaderService.hide()
            this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
            
          },
        })
      
  }

  deleteAlert(alertId:any):any {
      this.loaderService.show()
      this.todoDataService.deleteAlert(alertId).subscribe({
        next: (todoGridResponse: any) => {
          this.loaderService.hide()
          this.curdAlertSubject.next(true);
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)   
          this.loadAlertGridSubject.next(true);
        },
        error: (err) => {
          this.loaderService.hide()
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
        },
      })
   
}

  
}
