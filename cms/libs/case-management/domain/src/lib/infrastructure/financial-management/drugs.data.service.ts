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


  loadDrugList(vendorId: string, skipCount: number, maxResultCount: number, sort: string, sortType: string, filters:any) : Observable<any> {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/vendors/${vendorId}/drugs?SortType=${sortType}&Sorting=${sort}&SkipCount=${skipCount}&MaxResultCount=${maxResultCount}&Filter=${filters}`, null
    );
  }

  addDrug(dto: any) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/drugs`,
      dto
    );
  }

  loadRefundLogList() : Observable<any> {
    return this.http.get<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/refund/history`   );
  }

}
