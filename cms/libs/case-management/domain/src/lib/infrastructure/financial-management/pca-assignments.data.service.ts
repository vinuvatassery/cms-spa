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
  loadFinancialPcaAssignmentListService(pcaAssignmentGridArguments : any) {
    return this.http.post<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/list`,pcaAssignmentGridArguments);
  }
  loadObjectCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/object-codes`);
  }

  loadGroupCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/group-codes`);
  }

  loadPcaCodes() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/pca-codes`);
  }

  loadPcaDates() {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/dates`);
  }

  assignPca(assignPcaRequest : any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments`,assignPcaRequest);
  }

  editAssignedPca(assignPcaRequest : any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments`,assignPcaRequest);
  }

  getPcaAssignment(pcaAssignmentId : string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/${pcaAssignmentId}`);
  }

  pcaAssignmentPriorityUpdate(pcaAssignmentPriorityArguments : any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/pca-assignments/priority`,pcaAssignmentPriorityArguments);
  }

}