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
  loadStatusPeriod(caseId: any, clientId: any, showHistorical: any, gridDataRefinerValue: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${caseId}/status-periods?clientId=${clientId}&showHistorical=${showHistorical}`, gridDataRefinerValue);
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

  loadRamSellInfo(clientId: string,clientCaseEligibilityId:any=null) {
    return this.http.get<any[]>(
      `${this.configurationProvider.appSettings.sysInterfaceApiUrl}` 
      + `/system-interface/ramsell/clients/${clientId}?clientCaseEligibilityId=${clientCaseEligibilityId}`
    );
  }
}
