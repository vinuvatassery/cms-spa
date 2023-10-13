import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationProvider } from '@cms/shared/util-core';
/** External libraries **/ 
import { of } from 'rxjs/internal/observable/of';

@Injectable({ providedIn: 'root' })
export class PendingApprovalGeneralService {
  /** Constructor **/
  constructor(private readonly http: HttpClient,private configurationProvider: ConfigurationProvider) {}

  /** Public methods **/
  loadApprovalsGeneral() {
   return this.http.get(`${this.configurationProvider.appSettings.productivityToolsApiUrl}/productivity-tools/approvals/general`);
  }
}
