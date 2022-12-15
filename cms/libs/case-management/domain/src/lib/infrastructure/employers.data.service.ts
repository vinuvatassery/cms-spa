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
  ) {}

  /** Public methods **/

  ///get employment status  for checkbox
  loadEmploymentStatusService(clientCaseEligibilityId: string) {
    return this.http.get<ClientEmployer[]>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers/${clientCaseEligibilityId}/employer-status`
    );
  }

  // geting the list of employer
  loadEmploymentService(
    clientCaseEligibilityId: string,
    skipcount: number,
    maxResultCount: number,
    sort: string,
    sortType: string
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        // `/case-management/client-employers/${clientCaseEligibilityId}`
        `/case-management/client-employers?clientCaseEligibilityId=${clientCaseEligibilityId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
  }
  // geting the  employer details
  loadEmployersDetailsService(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }

  // Adding new employer
  createClientNewEmployerService(clientEmployer: ClientEmployer) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers`,
      clientEmployer
    );
  }
  
  // updating the employer
  updateClientEmployerService(clientEmployer: ClientEmployer) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers`,
      clientEmployer
    );
  }
  
  // removing the employer
  removeClientEmployerService(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }
  
  // updating the unemployment status
  employmentStatusUpdateService(
    clientCaseEligibilityId: string,
    isEmployed: string
  ) {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}` +
        `/case-management/client-employers/${clientCaseEligibilityId}/${isEmployed}`,
      ''
    );
  }
}
