/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { State } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class ClaimsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadClaimsListService(pharmacyId: string, paginationParameters: State) {
    const sorting = this.getSortingParams(paginationParameters);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pharmacies/${pharmacyId}/claims?SkipCount=${paginationParameters?.skip}&MaxResultCount=${paginationParameters?.take}${sorting}`);

  }

  getSortingParams(paginationParameters: State) {
    let sorting = '';
    if (paginationParameters?.sort && paginationParameters?.sort?.length > 0 && paginationParameters?.sort[0]) {
      console.log(paginationParameters?.sort[0]);
      sorting = `&Sorting=${paginationParameters?.sort[0]?.field}&SortType=${paginationParameters?.sort[0]?.dir ?? 'asc'}`;
    }

    return sorting;
  }
}
