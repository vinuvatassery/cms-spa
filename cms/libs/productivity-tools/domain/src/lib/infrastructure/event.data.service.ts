/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Event } from '../entities/event';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class EventDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadEvents(entityId: any, params: any): Observable<Event[]> {
    return this.http.post<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/${entityId}/by-entity-id`, params);
  }

  loadDdlEvents() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }
}
