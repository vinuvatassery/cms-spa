/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';


@Injectable({ providedIn: 'root' })
export class ReviewQuestionResponseDataService {
    /** Constructor**/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** pubic methods**/
    
    getReviewQuestionResponseByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        return this.http.get(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${clientCaseEligibilityId}/checklist-responses`
        );
    }
    saveReviewQuestionResponse(clientCaseEligibilityId:string,reviewQuestionResponse: any) {
        return this.http.post(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${clientCaseEligibilityId}/checklist-responses`, reviewQuestionResponse);
      }
    
      updateReviewQuestionResponse(clientCaseEligibilityId:string,reviewQuestionResponse: any) {
        return this.http.put(`${this.configurationProvider.appSettings.caseApiUrl}/case-management/eligibility-periods/${clientCaseEligibilityId}/checklist-responses`, reviewQuestionResponse);
      }
}
