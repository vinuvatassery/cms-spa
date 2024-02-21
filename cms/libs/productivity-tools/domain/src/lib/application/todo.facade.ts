/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/ 
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubEventTypes } from '@cms/shared/util-core';
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

  /** Public properties **/
  todo$ = this.todoSubject.asObservable();
  search$ = this.searchSubject.asObservable();
  todoGrid$ = this.todoGridSubject.asObservable();
  signalrReminders$!: Observable<any>;

  /** Constructor **/
  constructor(
    private readonly todoDataService: TodoDataService,
    private readonly signalrEventHandlerService: SignalrEventHandlerService
  ) {
    this.loadSignalrReminders();
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

  loadTodoGrid(): void {
    this.todoDataService.loadTodoGrid().subscribe({
      next: (todoGridResponse: any) => {
        this.todoGridSubject.next(todoGridResponse);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
