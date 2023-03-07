/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientCase } from '../entities/client-case';
@Injectable({ providedIn: 'root' })
export class SearchDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient, private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  
  loadCaseBySearchText(text : string) {     
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/clients/search/key=${text}`
    );   

}

}
