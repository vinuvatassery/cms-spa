/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class PaymentsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadPaymentsListService() {
    return of([
      {
        Batch: 'XXXXXXXXXX `',
      Item:'1', 
      ItemCount: '3',
      TotalAmount: '1,000.00',
      DatePmtRequested: 'XX/XX/XXXX',
      DatePmtSent: 'Yes',
      PmtStatus: 'Pending',
      Warrant: 'No',
      PCA: 'XXXXX',
      by: 'No',
      },
    ]);
  }

}
