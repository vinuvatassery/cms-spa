/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { State } from '@progress/kendo-data-query';
import { GridFilterParam } from '../../entities/grid-filter-param';

@Injectable({ providedIn: 'root' })
export class PaymentsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadPaymentsListService(vendorId: string, paginationParameters: GridFilterParam) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/payment-batches`
      , paginationParameters);
  }

  loadPaymentBatchSubListService(batchId: string, paginationParameters: State) {
    const sorting = this.getSortingParams(paginationParameters);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payment-batches/${batchId}/payments?SkipCount=${paginationParameters?.skip}&MaxResultCount=${paginationParameters?.take}${sorting}`);
  }

  getSortingParams(paginationParameters: State) {
    let sorting = '';
    if (paginationParameters?.sort && paginationParameters?.sort?.length > 0 && paginationParameters?.sort[0]) {
      sorting = `&Sorting=${paginationParameters?.sort[0]?.field}&SortType=${paginationParameters?.sort[0]?.dir ?? 'asc'}`;
    }

    return sorting;
  }



  loadPaymentsAddressListService() {
    return of([
      {
        MailCode: 'XXXXXXXXXX `',
        NameCheck: '1',
        NameEnvelope: '3',
        PaymentMethod: '1,000.00',
        PaymentRunDate: 'XX/XX/XXXX',
        AcceptCombinedPayments: 'Yes',
        AcceptsReports: 'Pending',
        Address1: 'No',
        Address2: 'XXXXX',
        City: 'XXXXX',
        State: 'XXXXX',
        Zip: 'XXXXX',
        SpecialHandling: 'XXXXX',
        EffectiveDates: 'XXXXX',
        by: 'No',
      },
    ]);
  }

  loadPaymentPanel(vendorId: any, batchId: any) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/batches/${batchId}`);
  }
  updatePaymentPanel(vendorId: any, batchId: any, paymentPanel: any) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/${vendorId}/batches/${batchId}`
      , paymentPanel);
  }

  loadPaymentDetails(paymentId: string, type: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/payments/${paymentId}?type=${type}`);
  }
}
