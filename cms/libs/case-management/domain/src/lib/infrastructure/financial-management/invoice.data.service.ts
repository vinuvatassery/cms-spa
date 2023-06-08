/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class InvoiceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadInvoiceListService(providerId:any,state:any,tabCode:any) {
    // return of([
    //   {
    //     Batch: 'XXXXXXXXXX `',
    //     InvoiceID:'1', 
    //     ClientName: 'Donna Summer',
    //     NameOnPrimaryInsuranceCard: 'Donna Summer',
    //     MemberID: 'XX/XX/XXXX',
    //     ServiceCount: '5',
    //     TotalCost: '9000',
    //     by: 'No',
    //   },
    // ]);
  return this.http.get<any>(      
    `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/providers/invoices?providerId=${providerId}&tabCode=${tabCode}&skipCount=
    ${state.skip}&maxResultCount=${state.take}`);      
  }
  loadPaymentRequestServices(invoiceNumber:any,vendorId:any,vendorType:any,paymentRequestBatchId:any,clientId:any) {  
  return this.http.get<any>(      
    `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/providers/invoices?invoiceNumber=${invoiceNumber}&vendorId=${vendorId}&vendorType=
    ${vendorType}&paymentRequestBatchId=${paymentRequestBatchId}&clientId=${clientId}`);      
  }

}
