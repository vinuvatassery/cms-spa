import { ConfigurationProvider } from "@cms/shared/util-core";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class HivVerificationApprovalService {

  /** Constructor **/
  constructor(
    private readonly http: HttpClient,
    private configurationProvider: ConfigurationProvider
  ) { }

  getHivVerificationApproval() {
    return this.http.get(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/hiv-verification`
    );
  }

  updateHivVerificationApproval(hivVerification: any) {
    return this.http.put<any>(
      `${this.configurationProvider.appSettings.caseApiUrl}/financial-management/approvals/hiv-verification`,
      hivVerification
    );
  }
}