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

  saveBillingAddress(paymentAddress:any,vendorId:any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/address`, paymentAddress);
  }

  updateBillingAddress(paymentAddress:any,vendorId:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/address`, paymentAddress);
  }

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

  loadBillingPaymentsAddressListService(params:any) : Observable<any> {
    return this.http.get<any>(
     `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/address?isShowHistoricalData=${params.isShowHistoricalData}&VendorId=${params.vendorId}&VendorTypeCode=${params.vendorTypeCode}&SortType=${params.sortType}&Sorting=${params.sort}&SkipCount=${params.skipcount}&MaxResultCount=${params.maxResultCount}&Filter=${params.filters}`
    );
  }

  getPaymentsAddressContacts(addressId: string) {
    return this.http.get<any>(
     `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${addressId}/payment-contact`
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
