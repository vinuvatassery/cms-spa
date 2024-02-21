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

  addEventData(eventData : any) {
    let eventFormData = this.bindFormData(eventData);
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/`, eventFormData)

  }

  loadDdlEvents() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  private bindFormData(event: any): FormData {
    const eventFormData = new FormData();
    eventFormData.append("clientId", `${event?.clientId}` ?? '');
    eventFormData.append("clientCaseEligibilityId", event?.clientCaseEligibilityId ?? '');
    eventFormData.append("eventId", event?.eventId ?? '');
    eventFormData.append("eventLogDesc", event?.eventLogDesc ?? '');
    eventFormData.append("attachmentTypeCode", event?.attachmentTypeCode ?? '');
    eventFormData.append("attachment", event?.attachment ?? '');
    eventFormData.append("attachmentNote", event?.attachmentNote ?? '');
    eventFormData.append("entityId", event?.entityId ?? null);
    eventFormData.append("entityTypeCode", event?.entityTypeCode ?? '');
    eventFormData.append("parentEventLogId", event?.parentEventLogId ?? '');
    eventFormData.append("isSubEvent", event?.isSubEvent ?? '');

    return eventFormData;
  }
}
