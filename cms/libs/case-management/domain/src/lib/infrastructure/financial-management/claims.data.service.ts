/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { State } from '@progress/kendo-data-query';
import { GridFilterParam } from '@cms/case-management/domain';

@Injectable({ providedIn: 'root' })
export class ClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadClaimsListService(pharmacyId: string, paginationParameters: GridFilterParam) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pharmacies/${pharmacyId}/claims`,paginationParameters);
  }

}
