/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Reminder } from '../entities/reminder';

@Injectable({ providedIn: 'root' })
export class ReminderService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
     private readonly configurationProvider:
      ConfigurationProvider
      ) 
      { }

  /** Public methods **/
  saveReminder(reminder: Reminder) {  
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${reminder.linkedItemId}/reminder`,
      reminder,
    )
  }
}
