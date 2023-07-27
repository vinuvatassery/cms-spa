/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DrugsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/


  loadDrugsListService (vendorId: string, skipCount: number, maxResultCount: number, sort: string, sortType: string) : Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/manufacturers/${vendorId}/drugs?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}`
    );
  }
  loadManufacturerList() {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/financial-management/vendors/manufacturers`
    );
  }
}
