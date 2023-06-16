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
  loadcontacts( mailcode:string) { return this.http.get<any>( `${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendorprofile/${mailcode}/getcontacts`);
   }
  saveContactAddress(contact: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendorprofile/vendoraddresscontact`, contact);
  }
  removeContactAddress(vendorContactId: string,) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendorprofile/${vendorContactId}/vendorcontact`);
  }
  deactiveContactAddress(vendorContactId: string) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendorprofile/${vendorContactId}/deactivatevendorcontact`,null);
  }
  getContactAddress(vendorContactId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendorprofile/getcontact/${vendorContactId}`);
  }
  updateContactAddress(contact:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendorprofile/vendoraddresscontact`,contact);
  }
}
