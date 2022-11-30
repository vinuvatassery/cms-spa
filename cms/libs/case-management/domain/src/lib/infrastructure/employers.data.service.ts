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
  clientCaseEligibilityId = '2FC20F89-460B-4BED-8321-681A21DA912D';
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) {}

  /** Public methods **/
  loadEmployers() {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${this.clientCaseEligibilityId}`
    );
  }
  loadEmployersDetails(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.get<ClientEmployer>(
      `${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }
  createClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.post(
      `${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers`,
      clientEmployer
    );
  }

  updateClientEmployer(clientEmployer: ClientEmployer) {
    return this.http.put(
      `${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers`,
      clientEmployer
    );
  }

  deleteClientEmployer(
    clientCaseEligibilityId: string,
    clientEmployerId: string
  ) {
    return this.http.delete(
      `${this.configurationProvider.appSettings.caseApiUrl}case-management/client-employers/${clientCaseEligibilityId}/${clientEmployerId}`
    );
  }
}
