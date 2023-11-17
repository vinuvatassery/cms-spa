import { Component, OnInit } from '@angular/core';
import { TodoFacade } from '@cms/productivity-tools/domain';

@Component({
  selector: 'productivity-tools-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
})
export class TodoComponent implements OnInit {
  todoList$ = this.todoFacade.todoList$;

  constructor(private todoFacade: TodoFacade) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.todoFacade.load();
  }
}
