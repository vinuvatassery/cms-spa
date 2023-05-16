/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { ReviewQuestionAnswer } from '../entities/review-question-answer';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

/** External libraries **/
import { ReviewQuestionAnswerDataService } from '../infrastructure/review-question-answer.data.service';

@Injectable({ providedIn: 'root' })
export class ReviewQuestionAnswerFacade {

    private reviewQuestionAnswersSubject = new BehaviorSubject<ReviewQuestionAnswer[]>([]);
    reviewQuestionAnswers$ = this.reviewQuestionAnswersSubject.asObservable();

    /** Constructor**/
    constructor(
        private readonly reviewQuestionAnswerDataService: ReviewQuestionAnswerDataService,
        private readonly loaderService: LoaderService,
        private readonly loggingService: LoggingService,
        private readonly snackbarService: NotificationSnackbarService) { }

    /** Public methods **/

    showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
        if (type == SnackBarNotificationType.ERROR) {
            const err = subtitle;
            this.loggingService.logException(err)
        }
        this.snackbarService.manageSnackBar(type, subtitle)

    }

    getReviewQuestionAnswerByQuestionTypeCode(questionTypeCode: string) {
        this.loaderService.show();
        this.reviewQuestionAnswerDataService.getReviewQuestionAnswerByQuestionTypeCode(questionTypeCode).subscribe({
            next: (response) => {
                this.loaderService.hide();               
                this.reviewQuestionAnswersSubject.next(response);
            },
            error: (err) => {
                this.loaderService.hide();
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }

}
