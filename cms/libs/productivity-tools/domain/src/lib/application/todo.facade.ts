/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
/** Enums **/
import { HubMethodTypes } from '@cms/shared/util-core';
/** Entities **/
import { Todo } from '../entities/todo';
/** Data services **/
import { TodoDataService } from '../infrastructure/todo.data.service';
/** Services **/
import { SignalrEventHandlerService } from '@cms/shared/util-common';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  /** Private properties **/
  private todoSubject = new BehaviorSubject<Todo[]>([]);
  private searchSubject = new BehaviorSubject<any>([]);
  private todoGridSubject = new BehaviorSubject<any>([]);

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
      this.signalrEventHandlerService.signalrNotifications(
        HubMethodTypes.Reminder
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

  loadTodosearch(): void {
    this.todoDataService.loadTodosearch().subscribe({
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
