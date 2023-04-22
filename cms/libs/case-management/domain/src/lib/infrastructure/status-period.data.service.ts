/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from "@cms/shared/util-core";
@Injectable({ providedIn: 'root' })
export class StatusPeriodDataService {

  private baseUrl = "/case-management";

  /** Constructor**/
  constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {
     
  }

  /** Public methods **/
  loadStatusPeriod(caseId:any,clientId:any,showHistorical:any,gridDataRefinerValue:any) {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${caseId}/status-periods?clientId=${clientId}&showHistorical=${showHistorical}&SkipCount=${gridDataRefinerValue.skipCount}&MaxResultCount=${gridDataRefinerValue.pagesize}`);
  }

  loadStatusGroupHistory(eligibilityId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/group-history`
    );
  }

  loadStatusFplHistory(eligibilityId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` + this.baseUrl +
      `/eligibility-periods/${eligibilityId}/fpl-history`
    );
  }

  loadRamSellInfo(clientId: string) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}` 
      + `/system-interface/ramsell/clients/${clientId}`
    );
  }
}
