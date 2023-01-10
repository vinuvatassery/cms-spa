/** Angular **/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
/** External libraries **/
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
/** Data services **/
import { EligibilityChecklistAnswerDataService } from '../infrastructure/eligibility-checklist-answer.data.service';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
@Injectable({ providedIn: 'root' })
export class EligibilityChecklistAnswerFacade {
  /** Constructor**/
  constructor(private readonly eligibilityChecklistAnswerDataService: EligibilityChecklistAnswerDataService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private configurationProvider: ConfigurationProvider) { }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  showLoader() {
    this.loaderService.show();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  /** Public methods **/
  saveEligibilityChecklistAnswer(eligibilityChecklistAnswerData: any): Observable<any> {
    return this.eligibilityChecklistAnswerDataService.saveEligibilityChecklistAnswer(eligibilityChecklistAnswerData);
  }

  getEligibilityChecklistAnswers(clientCaseEligibilityId: string) {
    return this.eligibilityChecklistAnswerDataService.getEligibilityChecklistAnswers(clientCaseEligibilityId)
  }
  updateEligibilityChecklistAnswer(eligibilityChecklistAnswerData: any) {
    return this.eligibilityChecklistAnswerDataService.updateEligibilityChecklistAnswer(eligibilityChecklistAnswerData);
  }
 
}
