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
  loadcontacts(vendorAddressId: string,skip: any, pageSize: any, sortBy: any, sortType: any, filters:any) {
    const VendorContactsPageAndSortedRequestDto =
    {
      SortType : sortType,
      Sorting : sortBy,
      SkipCount : skip,
      MaxResultCount : pageSize,
      Filter : filters
    }

    return this.http.post<any>(`${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors/addresses/${vendorAddressId}/contacts`,VendorContactsPageAndSortedRequestDto);
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
  loadVendorMailCodes(vendorId: string) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/${vendorId}/addresses`
    );
  }
  loadVendorAllContacts(vendorId: string) {
    return this.http.get<any>(`${this.configurationProvider.appSettings.caseApiUrl}` + `/financial-management/vendors/${vendorId}/active-contacts`);
  }
}
