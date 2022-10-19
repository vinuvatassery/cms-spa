/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
/** Entities **/
import { Search } from '../entities/search';
@Injectable({ providedIn: 'root' })
export class SearchDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient) {}

  /** Public methods **/
  loadSearch(): Observable<Search[]> {
    return of([
      {
        id: 10001,
        name: 'Donna Summer',
        dob: '09-01-1956',
        ssn: '456-78-9876',
      },
      {
        id: 10002,
        name: 'David Miller',
        dob: '10-11-1956',
        ssn: '156-78-4576',
      },
      {
        id: 10003,
        name: 'Philip David',
        dob: '11-01-1996',
        ssn: '766-08-5676',
      },
      { id: 10004, name: 'Mike Flex', dob: '12-23-1956', ssn: '456-78-9876' },
    ]);
  }
}
