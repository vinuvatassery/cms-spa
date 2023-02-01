/** Angular **/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/** External libraries **/
import { ConfigurationProvider } from '@cms/shared/util-core';
import { ReviewQuestionAnswer } from '../entities/review-question-answer';


@Injectable({ providedIn: 'root' })
export class ReviewQuestionAnswerDataService {
    /** Constructor**/
    constructor(private readonly http: HttpClient,
        private configurationProvider: ConfigurationProvider) { }

    /** pubic methods**/
    
    getReviewQuestionAnswerByQuestionTypeCode(questionTypeCode: string) {
        return this.http.get<ReviewQuestionAnswer[]>(
          `${this.configurationProvider.appSettings.caseApiUrl}/case-management/review-questions-answers/${questionTypeCode}`
        );
    }
}
