/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core'; 
import { State } from '@progress/kendo-data-query';

@Injectable({ providedIn: 'root' })
export class VendorInsurancePlanDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

 
  loadVendorInsuranceProviderListGrid(vendorId:string, pageParameters: State) {
    const sorting = this.getSortingParams(pageParameters);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/insurances-providers?SkipCount=${pageParameters?.skip}&MaxResultCount=${pageParameters?.take}${sorting}`);
  }

  loadVendorInsurancePlan(providerId:string, pageParameters: State) {
    const sorting = this.getSortingParams(pageParameters);
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/insurances-providers/${providerId}/insurance-plans?SkipCount=${pageParameters?.skip}&MaxResultCount=${pageParameters?.take}${sorting}`);
  }

  getSortingParams(paginationParameters: State) {
    let sorting = '';
    if (paginationParameters?.sort && paginationParameters?.sort?.length > 0 && paginationParameters?.sort[0]) {
      sorting = `&Sorting=${paginationParameters?.sort[0]?.field}&SortType=${paginationParameters?.sort[0]?.dir ?? 'desc'}`;
    }

    return sorting;
  }

}
