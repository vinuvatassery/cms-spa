import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Todo } from '../entities/todo';
import { TodoDataService } from '../infrastructure/todo.data.service';

@Injectable({ providedIn: 'root' })
export class TodoFacade {
  private todoListSubject = new BehaviorSubject<Todo[]>([]);
  todoList$ = this.todoListSubject.asObservable();

  constructor(private todoDataService: TodoDataService) {}

  load(): void {
    this.todoDataService.load().subscribe({
      next: (todoList) => {
        this.todoListSubject.next(todoList);
      },
      error: (err) => {
        console.error('err', err);
      },
    });
  }
}
