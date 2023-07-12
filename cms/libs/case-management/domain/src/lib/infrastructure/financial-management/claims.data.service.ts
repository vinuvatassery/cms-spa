/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core'; 

@Injectable({ providedIn: 'root' })
export class ClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadClaimsListService() {
    return of([
      {
        Batch: 'MMDDYYYY_XXX `',
        Item:'XX', 
        PharmacyName: 'Pharmacy Name #123',
        PaymentMethod: 'SPOTS',
        ClientName: 'Yes',
        PrimaryInsuranceCard: 'FName LName',
        MemberID: 'Member ID',
        By: 'By',
      },
    ]);
  }

}
