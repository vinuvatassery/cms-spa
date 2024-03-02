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

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  /** Private properties **/
  private todoSubject = new Subject<Todo[]>();
  private searchSubject = new Subject<any>();
  private todoGridSubject = new Subject<any>();
  private todoCreateSubject = new Subject<any>();

  /** Public properties **/
  todo$ = this.todoSubject.asObservable();
  search$ = this.searchSubject.asObservable();
  todoGrid$ = this.todoGridSubject.asObservable();
  createTodo$ = this.todoCreateSubject.asObservable();
  signalrReminders$!: Observable<any>;

  /** Constructor **/
  constructor(
    private readonly todoDataService: TodoDataService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService,
    private readonly loaderService: LoaderService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private loggingService : LoggingService
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

  loadTodoGrid(payload:any): void {
    this.todoDataService.loadTodoGrid(payload).subscribe({
      next: (todoGridResponse: any) => {
        this.todoGridSubject.next(todoGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }

  createTodoItem(payload:any){
    this.loaderService.show()
    this.todoDataService.createTodoItem(payload).subscribe({
      next: (todoGridResponse: any) => {
        this.loaderService.hide()
        this.todoCreateSubject.next(true);
        this.showHideSnackBar(SnackBarNotificationType.SUCCESS , todoGridResponse.message)    
      },
      error: (err) => {
        this.loaderService.hide()
        this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
      },
    })
  }
}
