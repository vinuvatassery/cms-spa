/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class InvoiceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/
 
  loadInvoiceListService(vendorId:any,state:any,tabCode:any,sortValue:any,sortType:any) {  
    const filter = state.filter === null? '' :JSON.stringify(state.filter?.filters);
    return this.http.post<any>(      
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/invoices?vendorId=${vendorId}&tabCode=${tabCode}&skipCount=
      ${state.skip}&maxResultCount=${state.take}&SortType=${sortType}&Sorting=${sortValue}&Filter=${filter}`,null);   
      
     
    }
    loadPaymentRequestServices(dataItem:any,vendorId:any,vendorType:any) {  
    return this.http.get<any>(      
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/invoices/${dataItem.invoiceNbr}/services?vendorId=${vendorId}&vendorType=
      ${vendorType}&paymentRequestBatchId=${dataItem.batchId}&clientId=${dataItem.clientId}`);      
    }

}
