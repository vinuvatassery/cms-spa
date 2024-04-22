/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { DirectMessage } from '../entities/direct-message';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class DirectMessageDataService {
  /** Constructor **/
  constructor(private readonly http: HttpClient, 
    private readonly configurationProvider: ConfigurationProvider
    ) {}

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

  loadDirectMessagesLists(param:any)  {
    return this.http.put<any>(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/direct-messages`,param);
  }
  getTokenCommunicationUserIdsAndThreadIdIfExist(clientId:string){
  return this.http.get(
    `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/direct-messages/clients/${clientId}`,);
  }

  saveChatThreadDetails(payload:any){
    return this.http.post(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/direct-messages/chat-thread`, payload);
    }

    uploadAttachments(uploadRequest:any){
      return this.http.post(
        `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/direct-messages/attachment`, uploadRequest);
      }
  
}

