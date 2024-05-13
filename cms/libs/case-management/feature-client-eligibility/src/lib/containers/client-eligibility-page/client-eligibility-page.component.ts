/** Angular **/
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Subscription, first } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import {
  CompletionChecklist,
  ReviewQuestionResponseFacade,
  SmokingCessationFacade,
  WorkflowFacade,
} from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'case-management-client-eligibility-page',
  templateUrl: './client-eligibility-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEligibilityPageComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private saveClickSubscription!: Subscription;
  eligibilityForm!: FormGroup;
  formSubmited!: boolean;
  isSaveAndContinueAcceptance!: boolean;
  savedAnswersList: any = [];
  questoinsResponse: any = [];
  acceptedApplicationStatus = true;
  cerNote!: any;
  cerNoteData=""
  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;

  private saveForLaterValidationSubscription!: Subscription;
  private saveForLaterClickSubscription!: Subscription;
  /** Constructor **/
  constructor(
    private readonly workflowFacade: WorkflowFacade,
    private readonly reviewQuestionResponseFacade: ReviewQuestionResponseFacade,
    private readonly formBuilder: FormBuilder,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly smokingCessationFacade: SmokingCessationFacade,
    private readonly route: ActivatedRoute
  ) {}

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.loadSessionData()
    this.buildForm();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription?.unsubscribe();
    this.saveForLaterClickSubscription?.unsubscribe();
  }
  private buildForm() {
    this.eligibilityForm = this.formBuilder.group({
      clientCaseEligibilityId: [''],
    });
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription =
      this.workflowFacade.saveAndContinueClicked$.subscribe((data: any) => {
        this.save();
      });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription =
      this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
        if (val) {          
          this.formSubmited = true;
          this.ref.detectChanges();
          let questions = JSON.parse(JSON.stringify(this.questoinsResponse));
          questions.forEach((parent: any) => {
            if (parent.answerCode === 'NO') {
              parent.childQuestions.forEach((child: any) => {
                questions.push(child);
              });
            }
            delete parent.childQuestions;
            delete parent.answers;
          });
          this.saveAndUpdate(questions, this.cerNote);
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);         
        }
      });
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription =
      this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
        this.workflowFacade.saveForLaterCompleted(true)  
              this.loaderService.hide();
              this.workflowFacade.handleSendNewsLetterpopup(statusResponse)        
      });
  }

  private createWorkflowChecklist(value: any) {
    const completionChecklist: CompletionChecklist[] = [];
    if (value) {
      value?.forEach((que: any) => {
        let isAllChildQueAnswered = true;
        const isChildRespRequired =
          que?.responseAnswerId &&
          que?.childQuestions?.length > 0 &&
          que?.answers?.findIndex(
            (ans: any) =>
              ans?.answerCode === 'NO' &&
              ans?.reviewQuestionAnswerId === que?.responseAnswerId
          ) !== -1;
        if (isChildRespRequired) {
          isAllChildQueAnswered =
            que?.childQuestions?.findIndex(
              (chdQue: any) =>
                chdQue?.responseAnswerId != undefined && chdQue?.notes
            ) !== -1;
        }
        const item: CompletionChecklist = {
          dataPointName: que?.reviewQuestionId,
          status:
            que?.responseAnswerId && isAllChildQueAnswered
              ? StatusFlag.Yes
              : StatusFlag.No,
        };
        completionChecklist.push(item);
      });

      if (completionChecklist?.length > 0) {
        this.workflowFacade.replaceChecklist(completionChecklist);
      }
    }
  }

  getQuestionsResponse(value: any) {
    this.questoinsResponse = value;
    this.createWorkflowChecklist(value);
  }
  cerNoteResponse(value: any) {
    this.cerNote = value;
  }
  private save() {
    this.formSubmited = true;
    this.ref.detectChanges();
    let questions = JSON.parse(JSON.stringify(this.questoinsResponse));
    let inValid = false;
    questions.forEach((parent: any) => {
      if (parent.answerCode === 'NO') {
        parent.childQuestions.forEach((child: any) => {
          inValid = child.answerCode === 'YES' && child.notes?.length < 1;
          questions.push(child);
        });
      }
      delete parent.childQuestions;
      delete parent.answers;
    });

    const isAllQuestionsAnswered =
      !inValid &&
      !questions.some((m: any) => m?.responseAnswerId === undefined);
    if (isAllQuestionsAnswered) {
      this.formSubmited = false;
      this.loaderService.show();
      this.saveAndUpdate(questions, this.cerNote).subscribe({
        next: (data: any) => {
          if (data?.length > 0) {
            data.forEach((el: any) => {
              let ques = this.questoinsResponse.find(
                (m: any) =>
                  m.reviewQuestionAnswerId === el.reviewQuestionAnswerId
              );
              if (ques)
                ques.reviewQuestionResponseId = el.reviewQuestionResponseId;
            });         
            this.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Eligibility checklist save successfully'
            );       
            this.isSaveAndContinueAcceptance = !this.acceptedApplicationStatus;
            this.ref.detectChanges();
          }
          this.loaderService.hide();
        },
        error: (error: any) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, error);
          this.loaderService.hide();
        },
      });
    }
  }
  saveAndUpdate(questoinsResponse: any, clientNote: any) {    
    if (clientNote) {
      this.smokingCessationFacade
        .createSmokingCessationNote(clientNote)
        .subscribe({
          next: (x: any) => {
            if (questoinsResponse.some((m: any) => m.reviewQuestionResponseId !== undefined)) 
            {
              return this.reviewQuestionResponseFacade.updateReviewQuestionResponse(questoinsResponse);
            } else {
              return this.reviewQuestionResponseFacade.saveReviewQuestionResponse(questoinsResponse);
            }       
            
          },
          error: (error: any) => {
            this.loaderService.hide();
            this.loggingService.logException(error);
          },
        });
    }   

    if (questoinsResponse.some((m: any) => m.reviewQuestionResponseId !== undefined)) 
    {
      return this.reviewQuestionResponseFacade.updateReviewQuestionResponse(
        questoinsResponse
      );
    } else {
      return this.reviewQuestionResponseFacade.saveReviewQuestionResponse(
        questoinsResponse
      );
    }
  }


  saveQuestionResponse(questoinsResponse : any)
  {
    if (questoinsResponse.some((m: any) => m.reviewQuestionResponseId !== undefined)) 
    {
      return this.reviewQuestionResponseFacade.updateReviewQuestionResponse(
        questoinsResponse
      );
    } else {
      return this.reviewQuestionResponseFacade.saveReviewQuestionResponse(
        questoinsResponse
      );
    }
  }

  changeApplicationAcceptedStatus(value: any) {
    this.acceptedApplicationStatus = value;
  }
  changeIsSaveAndContinueAcceptance() {
    this.isSaveAndContinueAcceptance = false;
  }

  loadSessionData() {   
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          const sessionData = JSON.parse(session.sessionData);
          this.clientCaseId = sessionData.ClientCaseId;
          this.clientCaseEligibilityId = sessionData.clientCaseEligibilityId;
          this.clientId = sessionData.clientId;     
          
          this.loadClientNote()   
        }
      });
  }

  loadClientNote() {
    this.loaderService.show();
    this.smokingCessationFacade.loadClientNote(this.clientCaseEligibilityId, this.clientId).subscribe({
        next: response => {          
          this.cerNoteData = response?.note ?? ""
        
          this.loaderService.hide();        },
        error: error => {     
          this.loggingService.logException({ name: SnackBarNotificationType.ERROR, message: error });
          this.loaderService.hide();
          
        }

      });

  }
}
