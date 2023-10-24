/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadClaimsListService(pharmacyId: string, paginationParameters: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pharmacies/${pharmacyId}/claims`,paginationParameters);
  }

}
