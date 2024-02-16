/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Event } from '../entities/event';
import { ConfigurationProvider } from "@cms/shared/util-core";

@Injectable({ providedIn: 'root' })
export class EventDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  loadEvents(): Observable<Event[]> {
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

  loadEventsData() {
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/events`)

  }

  loadDdlEvents() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }
}
