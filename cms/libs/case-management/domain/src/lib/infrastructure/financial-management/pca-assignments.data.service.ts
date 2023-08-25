/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class PcaAssignmentsDataService {
  /** Constructor**/
  constructor(
    private readonly http: HttpClient,
    private readonly configurationProvider: ConfigurationProvider
  ) { }

  /** Public methods **/

  loadObjectCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/object-codes`);
  }

  loadGroupCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/group-codes`);
  }

  loadPcaCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/pca-codes`);
  }

  loadPcaDates(pcaId : string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/dates`);
  }

  assignPca(assignPcaRequest : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments`,assignPcaRequest);
  }

}