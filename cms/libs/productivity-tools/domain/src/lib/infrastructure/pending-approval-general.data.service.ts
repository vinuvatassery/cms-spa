import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
/** External libraries **/ 

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadApprovalsGeneral() {
   return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general`);
  }
}
