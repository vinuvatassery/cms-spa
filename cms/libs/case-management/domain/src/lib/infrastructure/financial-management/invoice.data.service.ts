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

 
  loadInvoiceListService() {
    return of([
      {
        Batch: 'XXXXXXXXXX `',
        InvoiceID:'1', 
        ClientName: 'Donna Summer',
        NameOnPrimaryInsuranceCard: 'Donna Summer',
        MemberID: 'XX/XX/XXXX',
        ServiceCount: '5',
        TotalCost: '9000',
        by: 'No',
      },
    ]);
  }

}
