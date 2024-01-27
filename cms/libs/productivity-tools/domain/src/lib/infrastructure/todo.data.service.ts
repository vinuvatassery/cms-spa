/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Todo } from '../entities/todo';

@Injectable({ providedIn: 'root' })
export class TodoDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadTodo(): Observable<Todo[]> {
    return of([
      { id: 1, name: 'Lorem ipsum', description: 'Lorem ipsum dolor sit amet' },
      {
        id: 2,
        name: 'At vero eos',
        description: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: 3,
        name: 'Duis autem',
        description: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }

  loadToDoSearch() {
    return of([
      { name: 'Donna Summer', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'David Miller', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'Philip David', id: 'XXXX', urn: 'XXX-XX-XXXX' },
      { name: 'Mike Flex', id: 'XXXX', urn: 'XXX-XX-XXXX' },
    ]);
  }

  loadTodoGrid() {
    return of([
      {
        Title: 'House Inspection',
        TodoItemFor: 'John Sakariya',
        Type: 'Client',
        Description:
          'Lorem With Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Certification',
        TodoItemFor: 'David Miller',
        Type: 'Client',
        Description: 'Lorem With Custom Template. .',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'House Inspection',
        TodoItemFor: 'Drill Kole',
        Type: 'Client',
        Description: 'Lorem With Custom Template.Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Documentation',
        TodoItemFor: 'Rock Pedels',
        Type: 'Client',
        Description:
          'Lorem With Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
      {
        Title: 'Housing Search',
        TodoItemFor: 'Sakariya Pothen',
        Type: 'Service Provider',
        Description: 'Custom Template. Editor Preview Both. Project.',
        DueDate: '01-03-2022',
      },
    ]);
  }
}
