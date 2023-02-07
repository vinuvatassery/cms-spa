/** Angular **/
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType,
} from '@cms/shared/util-core';
import { CompletionChecklist, ReviewQuestionResponseFacade, StatusFlag } from '@cms/case-management/domain';
import {
  WorkflowFacade,
} from '@cms/case-management/domain';

@Component({
  selector: 'case-management-client-eligibility-page',
  templateUrl: './client-eligibility-page.component.html',
  styleUrls: ['./client-eligibility-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEligibilityPageComponent implements OnInit, OnDestroy {
  private saveClickSubscription!: Subscription;
  eligibilityForm!: FormGroup;
  formSubmited!: boolean;
  savedAnswersList: any = [];
  questoinsResponse: any = [];
  /** Constructor **/
  constructor(
    private readonly workflowFacade: WorkflowFacade,
    private readonly reviewQuestionResponseFacade: ReviewQuestionResponseFacade,
    private readonly formBuilder: FormBuilder,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService
  ) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }
  private buildForm() {
    this.eligibilityForm = this.formBuilder.group({
      clientCaseEligibilityId: [''],
    });
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

  private createWorkflowChecklist(value: any){
    const completionChecklist: CompletionChecklist[] = [];
      if(value){
        value?.forEach((que:any) => {
          let isAllChildQueAnswered = true;
          if(que?.responseAnswerId && que?.childQuestions?.length > 0){
            var isChildRespRequired = que?.answers?.findIndex((ans:any) => ans?.answerCode === 'NO' && ans?.reviewQuestionAnswerId === que?.responseAnswerId) !== -1;
            if(isChildRespRequired){
              isAllChildQueAnswered = que?.childQuestions?.findIndex((chdQue:any) => chdQue?.responseAnswerId != undefined) !== -1;
            }
          }
          const item: CompletionChecklist = {
            dataPointName: que?.reviewQuestionId,
            status: que?.responseAnswerId && isAllChildQueAnswered === true ? StatusFlag.Yes :  StatusFlag.No
          };
          completionChecklist.push(item);
        });

        if(completionChecklist?.length > 0){
          this.workflowFacade.replaceChecklist(completionChecklist);
        }
      }
  }



  getQuestionsResponse(value: any) {
    this.questoinsResponse = value;
    this.createWorkflowChecklist(value);
  }

  private save() {
    this.formSubmited = true;
    this.ref.detectChanges();
    let questions = JSON.parse(JSON.stringify(this.questoinsResponse));
    let inValid = false;
    questions.forEach((parent: any) => {
      if (parent.answerCode === 'NO') {
        parent.childQuestions.forEach((child: any) => {
          if (child.answerCode === 'YES' && child.notes?.length < 1) {
            inValid = true;
          }
          questions.push(child);
        });
      }
      delete parent.childQuestions;
      delete parent.answers;
    });

    if (!inValid && !questions.some((m: any) => m?.responseAnswerId === undefined)) {
      this.formSubmited = false;
      this.loaderService.show();
      this.saveAndUpdate(questions).subscribe(
        (data: any) => {
          if (data.length > 0) {
            data.forEach((el: any) => {
              let ques = this.questoinsResponse.find((m:any) => m.reviewQuestionAnswerId === el.reviewQuestionAnswerId);
              if (ques !== undefined)
                ques.reviewQuestionResponseId = el.reviewQuestionResponseId;

            });
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Eligibility checklist save successfully');
            this.loaderService.hide();
          }
        },
        (error: any) => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, error);
          this.loaderService.hide();
        }
      );
    }
  }
  saveAndUpdate(questoinsResponse: any) {
    if (questoinsResponse.some((m: any) => m.reviewQuestionResponseId !== undefined)) {

      return this.reviewQuestionResponseFacade.updateReviewQuestionResponse(questoinsResponse);
    }

    else {
      return this.reviewQuestionResponseFacade.saveReviewQuestionResponse(questoinsResponse)

    }


  }
}
