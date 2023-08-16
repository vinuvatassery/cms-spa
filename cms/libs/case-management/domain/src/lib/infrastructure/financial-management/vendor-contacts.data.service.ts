/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class VendorContactsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadContactsListService() {
    return of([
      {
        name:'Address `',
        jobTitle:'address2',
        phoneNumber:'address2',
        emailAddress:'address2',
        startDate:'address2',
        by:'by',
      },
    ]);
  }
  loadcontacts(vendorAddressId: string) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors/addresses/${vendorAddressId}/contacts`);
  }
  saveContactAddress(contact: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/contacts`, contact);
  }
  removeContactAddress(vendorContactId: string,) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/contacts/${vendorContactId}`);
  }
  deactiveContactAddress(vendorContactId: string) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/contacts/${vendorContactId}/deactivate`, null);
  }
  getContactAddress(vendorContactId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/contacts/${vendorContactId}`);
  }
  updateContactAddress(contact: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/contacts`, contact);
  }
  loadVendorMailCodes(vendorId: number) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/${vendorId}/addresses`
    );
  }
  loadVendorAddress(vendorId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/${vendorId}/address`
    );
  }
  loadVendorEmail(vendorId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/${vendorId}/email`
    );
  }
}
