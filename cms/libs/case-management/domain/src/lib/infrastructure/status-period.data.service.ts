/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from "@cms/shared/util-core";
@Injectable({ providedIn: 'root' })
export class StatusPeriodDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
  }

  /** Public methods **/
  loadStatusPeriod(caseId:any,clientId:any,showHistorical:any,gridDataRefinerValue:any) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${caseId}/status-periods?clientId=${clientId}&showHistorical=${showHistorical}&SkipCount=${gridDataRefinerValue.skipCount}&MaxResultCount=${gridDataRefinerValue.pagesize}`);
  }
}
