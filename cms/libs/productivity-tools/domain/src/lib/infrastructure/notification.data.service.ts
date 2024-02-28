/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Notification } from '../entities/notification';

@Injectable({ providedIn: 'root' })
export class NotificationDataService {
  /** Constructor **/
  constructor(private readonly httpClient: HttpClient) {}

  /** Public methods **/
  loadNotifications(): Observable<Notification[]> {
    return of([
      { id: '1', name: 'Lorem ipsum', text: 'Lorem ipsum dolor sit amet' },
      {
        id: '2',
        name: 'At vero eos',
        text: 'At vero eos et accusam et justo duo dolores',
      },
      {
        id: '3',
        name: 'Duis autem',
        text: 'Duis autem vel eum iriure dolor in hendrerit',
      },
    ]);
  }
}
