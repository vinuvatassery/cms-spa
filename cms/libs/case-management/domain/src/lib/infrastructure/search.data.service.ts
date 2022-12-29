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
  loadSearch(): Observable<Search[]> {
    return of([
      {
        id: 1001,
        name: 'Donna Summer',
        dob: '09-01-1956',
        ssn: '456-78-9876',
      },
      {
        id: 1002,
        name: 'David Miller',
        dob: '10-11-1956',
        ssn: '156-78-4576',
      },
      {
        id: 1003,
        name: 'Philip David',
        dob: '11-01-1996',
        ssn: '766-08-5676',
      },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Benjamin William Oliver Noah', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
      { id: 1004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },


    ]);
  }
  loadCaseBySearchText(text : string) {     
    return this.http.get<ClientCase[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-case/SearchText=${text}`
    );   

}

}
