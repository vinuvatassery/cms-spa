/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
/** Entities **/
import { ConfigurationProvider } from "@cms/shared/util-core";

@Injectable({ providedIn: 'root' })
export class EventDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,
    private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  loadEventLogs(params: any, entityId:string) {
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/${entityId}/by-entity-id`, params);
  }

  loadEventsData() {
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/events`)

  }

  addEventData(eventData : any) {
    let eventFormData = this.bindFormData(eventData);
    return this.http.post(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/`, eventFormData)

  }

  loadEventLog(eventLogId:any){
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/event-logs/${eventLogId}`)
  }

  loadNotificationEmail(eventLogId:any){
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/email?eventLogId=${eventLogId}`)
  }

  loadNotificationLetter(eventLogId:any){
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/letter?eventLogId=${eventLogId}`)
  }

  loadNotificationSms(eventLogId:any){
    return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/events/${eventLogId}/sms`)
  }

  loadAttachmentPreview(attachmentId: any, attachmentType:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/${attachmentType}/log-attachment/${attachmentId}`, null
      , {
        responseType: 'blob'
      });
  }

  reSentEmailNotification(eventLogId:any)
  {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/re-send/${eventLogId}`, null);
  }

  reSentLetterNotification(eventLogId:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/re-print/${eventLogId}`,null,
      {responseType: 'blob'}
    )
  }

  reSendSmsNotification(eventLogId:any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/notifications/events/${eventLogId}/re-send-sms`,null);
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
    eventFormData.append("sourceEntityId", event?.sourceEntityId ?? '');
    eventFormData.append("sourceEntityTypeCode", event?.sourceEntityTypeCode ?? '');

    return eventFormData;
  }
}
