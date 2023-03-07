/** Angular **/
import { Injectable } from '@angular/core';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
/** External libraries **/
import { ReviewQuestionResponseDataService } from '../infrastructure/review-question-response.data.service';

@Injectable({ providedIn: 'root' })
export class ReviewQuestionResponseFacade {


    private reviewQuestionResponseSubject = new BehaviorSubject([]);
   // userDataSource: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
    reviewQuestionResponse$ = this.reviewQuestionResponseSubject.asObservable();

    /** Constructor**/
    constructor(
        private readonly reviewQuestionResponseDataService: ReviewQuestionResponseDataService,
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

    getReviewQuestionResponseByClientCaseEligibilityId(clientCaseEligibilityId: string) {
        this.loaderService.show();
        this.reviewQuestionResponseDataService.getReviewQuestionResponseByClientCaseEligibilityId(clientCaseEligibilityId).subscribe({
            next: (response) => {
                this.loaderService.hide();
                this.reviewQuestionResponseSubject.next(response as []);
            },
            error: (err) => {
                this.loaderService.hide();
                this.showHideSnackBar(SnackBarNotificationType.ERROR, err)
            },
        });
    }

    saveReviewQuestionResponse(clientCaseEligibilityId:string,reviewQuestionResponse: any) : Observable<any> {
        return this.reviewQuestionResponseDataService.saveReviewQuestionResponse(clientCaseEligibilityId,reviewQuestionResponse);
      }
      updateReviewQuestionResponse(clientCaseEligibilityId:string,reviewQuestionResponse: any) : Observable<any> {
        return this.reviewQuestionResponseDataService.updateReviewQuestionResponse(clientCaseEligibilityId,reviewQuestionResponse);
      }

}
