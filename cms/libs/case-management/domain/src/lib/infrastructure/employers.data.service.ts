/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
/** External libraries **/
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
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
  loadEmployers(clientCaseEligibilityId : string, skipcount : number,maxResultCount : number ,sort : string, sortType : string) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      // `/case-management/client-employers/${clientCaseEligibilityId}`
      `/case-management/client-employers?clientCaseEligibilityId=${clientCaseEligibilityId}&SortType=${sortType}&Sorting=${sort}&SkipCount=${skipcount}&MaxResultCount=${maxResultCount}`
    );
  }
  loadEmployersDetails(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }
  createClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-employers`,
      clientEmployer
    );
  }

  updateClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-employers`,
      clientEmployer
    );
  }

  deleteClientEmployer(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }


  unEmploymentChecked(
    clientCaseEligibilityId: string,
    isEmployed: string
  ) {
    return this.http.patch(
      `${this.configurationProvider.appSettings.caseApiUrl}`+
      `/case-management/client-employers/${clientCaseEligibilityId}/${isEmployed}`, ''
    );
  }
}
