/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** internal libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
//** entities **/
import { BatchClaim } from '../../entities/financial-management/batch-claim';

@Injectable({ providedIn: 'root' })
export class VendorClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  batchClaims(batchClaims: BatchClaim) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/claims/batch`, batchClaims);
  }
}
