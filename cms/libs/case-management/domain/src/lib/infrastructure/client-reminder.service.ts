/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientReminder } from '../entities/client-reminder';

@Injectable({ providedIn: 'root' })
export class ClientReminderService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
     private readonly configurationProvider:
      ConfigurationProvider
      ) 
      { }

  /** Public methods **/
  saveClientReminder(clientReminder: ClientReminder) {  
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/${clientReminder.linkedItemId}/reminder`,
      clientReminder,
    )
  }
}
