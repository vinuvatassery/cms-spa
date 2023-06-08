/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class ContactsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadContactsListService() {
    return of([
      {
        name: 'Address `',
        jobTitle:'address2', 
        phoneNumber:'address2', 
        emailAddress:'address2', 
        startDate:'address2', 
        by: 'by',
      },
    ]);
  }

}
