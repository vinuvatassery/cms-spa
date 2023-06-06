/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ProvidersDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/
  getProviders(skipcount: number,maxResultCount: number,sort: string,sortType: string,providerTypeCode: string)
  {
    return this.http.get<any>(
        `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/financial-management/providers/?ProviderTypeCode=${providerTypeCode}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
      );
  }
}
