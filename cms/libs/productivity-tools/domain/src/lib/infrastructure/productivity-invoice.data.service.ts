/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core'; 
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductivityInvoiceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/
 
  loadInvoiceListService(data:any): Observable<any> {
    const invoiceRequestDto =
    {          
      SortType : data.sortType,
      Sorting : data.sort,
      SkipCount : data.skipCount,
      MaxResultCount : data.pageSize,
      Filter : data.filter
    }
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general/invoice-details?exceptionId=${data.exceptionId}`,invoiceRequestDto
    );
  }
}
