/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class BillingAddressDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadBillingAddressListService( ) {
    return of([
      {
        address1: 'Address `',
        address2: 'address2',
        city: 'city',
        stateDesc: 'stateDesc',
        zip: 'zip',
        startDate: 'startDate',
        by: 'by',
      },
    ]);
  }

  loadBillingPaymentsAddressListService(vendorTypeCode: string, skipcount: number, maxResultCount: number, sort: string, sortType: string) : Observable<any> {
    return this.http.get<any>(
     `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/payment-address?VendorTypeCode=${vendorTypeCode}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
  }

  deactivatePaymentAddress(addressId:string){
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${addressId}/deactivate-payment-address`, {}
     );
  }

  deletePaymentAddress(addressId:string){
    return this.http.delete<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${addressId}/delete-payment-address`
     );
  }
}
