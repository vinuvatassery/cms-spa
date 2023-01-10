/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class ClientEligibilityDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient
    ,private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadDdlAcceptApplications() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlStatus() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  loadDdlGroups() {
    return of(['Value 1', 'Value 2', 'Value 3', 'Value 4']);
  }

  getEligibility(clientCaseEligibilityId: string, clientId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/clients/client/${clientId}/${clientCaseEligibilityId}`);
  }
  saveAcceptedApplication(acceptedApplication:any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/eligibility/application-eligibility`, acceptedApplication);
  }
  getAcceptedApplication(clientCaseId:string,clientCaseEligibilityId:string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${clientCaseId}/eligibility/${clientCaseEligibilityId}/application-eligibility`);
  }
  getClientEligibilityInfo(clientId: number, clientCaseId: string, clientCaseEligibilityId: string)
  {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/${clientCaseId}/clients/${clientId}/eligibility/${clientCaseEligibilityId}/info`);

  }
}
