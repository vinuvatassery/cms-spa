/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class FinancialVendorRefundDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}
 

 
  loadVendorRefundProcessListService( ) {
    return of([
      {
        vendorName: 'Address `',
        Type:'address2', 
        clientName:'address2', 
        refundWarrant:'address2', 
        refundAmount:'address2', 
        depositDate:'address2', 
        depositMethod:'address2', 
        indexCode:'address2', 
        pca:'address2', 
        grant:'address2', 
        vp:'address2', 
        refundNote:'address2', 
        entryDate:'address2',  
        by: 'by',
      },
    ]);
  }

  
}
