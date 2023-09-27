/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';
import { GridFilterParam } from '../../entities/grid-filter-param';
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
    params: GridFilterParam) {
     
  return this.http.post<any>(
    `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${providerId}/clients?vendorTypeCode=${tabCode}&SortType=${params.sortType}&Sorting=${params.sorting}&SkipCount=${params.skipCount}&MaxResultCount=${params.maxResultCount}&Filter=${params.filter?? ''}`,null);
  }

}
