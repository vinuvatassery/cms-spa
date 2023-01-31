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
import {  ReviewQuestionResponseFacade } from '@cms/case-management/domain';
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

  

  getQuestionsResponse(value: any) {
    this.questoinsResponse = value;
  }

  private save() {
    this.formSubmited = true;
    this.ref.detectChanges();
    let questions=JSON.parse(JSON.stringify(this.questoinsResponse));
    let inValid=false;
    questions.forEach((parent:any) => {
      if(parent.answerCode === 'NO'){
        parent.childQuestions.forEach((child:any) => {
          if(child.answerCode==='YES' && child.notes?.length<1){
            inValid=true;
          }
          questions.push(child);
        });
      }
      delete parent.childQuestions;
      delete parent.answers;
    });
   
    if (!inValid && !questions.some((m: any) => m?.responseAnswerId === undefined)) {
      this.formSubmited=false;
      this.loaderService.show();
      this.saveAndUpdate(questions).subscribe(
          (data:any) => {
            if (data.length> 0) {
              this.showHideSnackBar(SnackBarNotificationType.SUCCESS,'Eligibility checklist save successfully');
              this.loaderService.hide();
            }
          },
          (error:any) => {
            this.showHideSnackBar(SnackBarNotificationType.ERROR, error);
            this.loaderService.hide();
          }
        );
    }
  }
  saveAndUpdate(questoinsResponse: any) {
    if (!questoinsResponse.some((m: any) => m.reviewQuestionResponseId === undefined)) {
      
      return this.reviewQuestionResponseFacade.updateReviewQuestionResponse(questoinsResponse);
    }

    else {
      return this.reviewQuestionResponseFacade.saveReviewQuestionResponse(questoinsResponse)

    }


  }
}
