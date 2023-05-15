/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ClientEmployer } from '../entities/client-employer';

@Injectable({ providedIn: 'root' })
export class EmployersDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

  ///get employment status  for checkbox
  loadEmploymentStatusService(clientCaseEligibilityId: string) {
    return this.http.get<ClientEmployer[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/eligibility-periods/${clientCaseEligibilityId}/employers`
    );
  }

  // geting the list of employer
  loadEmploymentService(
    clientId: any,
    clientCaseEligibilityId: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string,
    isOld: boolean = false
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/employers?clientCaseEligibilityId=${clientCaseEligibilityId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}&IsOldEmployers=${isOld}`
    );
  }
  // geting the  employer details
  loadEmployersDetailsService(
    clientId: any,
    clientEmployerId: string
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/employers/${clientEmployerId}`
    );
  }

  // Adding new employer
  createClientNewEmployerService(clientId: any, clientEmployer: ClientEmployer) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/employers`,
      clientEmployer
    );
  }

  // updating the employer
  updateClientEmployerService(clientId: any, clientEmployer: ClientEmployer, clientEmployerId: string) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/employers/${clientEmployerId}`,
      clientEmployer
    );
  }

  // removing the employer
  removeClientEmployerService(
    clientId: any,
    clientEmployerId: string
  ) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
      `/case-management/clients/${clientId}/employers/${clientEmployerId}`
    );
  }

  // updating the employment data.
  employmentUpdateService(clientCaseEligibilityId: string, employmentData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${clientCaseEligibilityId}/employers`, employmentData);
  }
}
