/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Search } from '../entities/search';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientCase } from '../entities/client-case';
@Injectable({ providedIn: 'root' })
export class SearchDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient, private configurationProvider : ConfigurationProvider) {}

  /** Public methods **/
  
  loadCaseByHeaderSearchText(text : string) {     
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-search/SearchText=${text}`
    );   

}

}
