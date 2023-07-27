/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { DirectMessage } from '../entities/direct-message';

@Injectable({ providedIn: 'root' })
export class DirectMessageDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadDirectMessages(): Observable<DirectMessage[]> {
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

  loadDirectMessagesLists()  {
    return of([
      { id: 1, 
        from: 'Lorem ipsum', 
        unreadMessage: 'Lorem ipsum dolor sit amet', 
        lastReceived: '22/22/2023' },
        { id: 1, 
          from: 'Lorem ipsum', 
          unreadMessage: 'Lorem ipsum dolor sit amet', 
          lastReceived: '22/22/2023' },

      
    ]);
  }
}
