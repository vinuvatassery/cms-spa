/** Angular **/
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  forkJoin,
  mergeMap,
  of,
  Subscription
} from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LoaderService,
  LoggingService,
  NotificationSnackbarService,
  SnackBarNotificationType
} from '@cms/shared/util-core';
import { ActivatedRoute } from '@angular/router';
import { NavigationType } from '@cms/case-management/domain';
import { WorkflowFacade,EligibilityChecklistAnswerFacade } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-client-eligibility-page',
  templateUrl: './client-eligibility-page.component.html',
  styleUrls: ['./client-eligibility-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientEligibilityPageComponent implements OnInit, OnDestroy {
  private saveClickSubscription!: Subscription;
  eligibilityForm!: FormGroup;
  /** Constructor **/
  constructor(
    private workflowFacade: WorkflowFacade,
    private eligibilityChecklistAnswerFacade: EligibilityChecklistAnswerFacade,
    private formBuilder: FormBuilder,
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
      homeAddressProofChecklistId: ['E85074D6-6BA2-4F7C-8CE8-120FE5C9DBFE'],
      homeAddressProof: [''],
      incomeChecklistId: ['06FEDE81-4784-48A9-99FB-3151E0FB98CB'],
      income: [''],
      HivVerificationChecklistId: ['762C5BB4-6B1F-4F97-8791-B713A78B3CAD'],
      HivVerification: [''],
    });
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$
      .subscribe((data:any) => {
        this.save();
      });
  }

  private save() {
    if (this.eligibilityForm.valid) {
      const ChecklistAnswers = [];
      const clientCaseEligibilityId=this.eligibilityForm.controls['clientCaseEligibilityId'].value;
      ChecklistAnswers.push({clientCaseEligibilityId,EligibilityChecklistId:this.eligibilityForm.controls['homeAddressProofChecklistId'].value,Answer:this.eligibilityForm.controls['homeAddressProof'].value});
      ChecklistAnswers.push({clientCaseEligibilityId,EligibilityChecklistId:this.eligibilityForm.controls['incomeChecklistId'].value,Answer:this.eligibilityForm.controls['income'].value});
      ChecklistAnswers.push({clientCaseEligibilityId,EligibilityChecklistId:this.eligibilityForm.controls['HivVerificationChecklistId'].value,Answer:this.eligibilityForm.controls['HivVerification'].value});
      this.loaderService.show();
      this.eligibilityChecklistAnswerFacade.saveEligibilityChecklistAnswer(ChecklistAnswers).subscribe(
        data => {
          if(data===true){
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Eligibility checklist save successfully");
            this.loaderService.hide();
          }
        },
        error => {
          this.showHideSnackBar(SnackBarNotificationType.ERROR, error);
          this.loaderService.hide();
        }
       );
    }
  }
}
