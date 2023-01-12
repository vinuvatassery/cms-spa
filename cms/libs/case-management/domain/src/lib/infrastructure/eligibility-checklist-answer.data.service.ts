/** Angular **/
import { Injectable } from '@angular/core';
/** External libraries **/
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs/internal/observable/of';
import { ConfigurationProvider } from '@cms/shared/util-core';

@Injectable({ providedIn: 'root' })
export class EligibilityChecklistAnswerDataService {
  /** Constructor**/
  constructor(private readonly http: HttpClient
    ,private configurationProvider: ConfigurationProvider) {}

  getEligibilityChecklistAnswers(clientCaseEligibilityId: string) {
    return this.http.get(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/eligibility/${clientCaseEligibilityId}/checklist`);
  }

  saveEligibilityChecklistAnswer(eligibilityChecklistAnswerData: any) {
    return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/eligibility/checklist`, eligibilityChecklistAnswerData);
  }

  updateEligibilityChecklistAnswer(eligibilityChecklistAnswerData: any) {
    return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/cases/eligibility/checklist`, eligibilityChecklistAnswerData);
  }
}
