/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class InsuranceProviderDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadInsuranceProviderListService() {
    return of([
      {
        ProviderName: 'A Provider Name',
        ActivePlans:'XX',
        ActiveClients: 'XX',
        By: 'No',
      },
    ]);
  }
  loadProviderClientsListGrid(
    providerId:any,
    tabCode:any,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string) {
  return this.http.get<any>(
    `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/providers/${providerId}/clients?tabCode=${tabCode}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`);
  }

}
