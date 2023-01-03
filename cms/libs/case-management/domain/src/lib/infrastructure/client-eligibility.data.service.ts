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
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/client-case-eligibility/${clientCaseEligibilityId}/${clientId}`);
  }
}
