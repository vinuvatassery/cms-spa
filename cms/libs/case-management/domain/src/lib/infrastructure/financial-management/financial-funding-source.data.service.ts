/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class FinancialFundingSourceDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  loadFinancialFundingSourceFacadeListService() {
    return of([
      {
        id: 1,
        fundingSource: 'Address `',
        fundingName: 'address2',
        isActive: false,
      },
      {
        id: 1,
        fundingSource: 'Address `',
        fundingName: 'address2',
        isActive: true,
      },
    ]);
  }
  loadFundingSourceList(
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ){
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/funding-sources?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
  }
  removeFundingSource(fundingSourceId: string) {
    return this.http.delete(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/funding-sources/${fundingSourceId}`);
  }

  addFundingSource(fundingSource: any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/funding-sources`, fundingSource
    );
  }

  updateFundingSource(fundingSource: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/funding-sources`, fundingSource
    );
  }


  loadFundingSourceLookup( ) {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/funding-sources/lookup`);
  }
}
