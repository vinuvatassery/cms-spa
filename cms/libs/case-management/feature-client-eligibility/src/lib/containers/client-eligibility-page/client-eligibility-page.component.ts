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
      homeAddressProofChecklistId: ['E85074D6-6BA2-4F7C-8CE8-120FE5C9DBFE'],
      homeAddressProof: [''],
      incomeChecklistId: ['06FEDE81-4784-48A9-99FB-3151E0FB98CB'],
      income: [''],
    });
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$
      .pipe(
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.save()])
        )
      )
      .subscribe(([navigationType, isSaved]:any) => {
        if (isSaved) {
          this.workflowFacade.navigate(navigationType);
        }
      });
  }

  private save() {
    debugger
    if (this.eligibilityForm.valid) {
      // this.ShowLoader();
      // let caseEligibilityFlagsData = this.insuranceFlagForm.value;
      // caseEligibilityFlagsData["clientCaseEligibilityId"] = this.clientCaseEligibilityId;
      // caseEligibilityFlagsData["clientId"] = this.clientId;
      return of(false);

    }
    return of(false)
  }
}
