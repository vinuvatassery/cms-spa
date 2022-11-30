/** Angular **/

import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
/** Internal Libraries **/
import {
  WorkflowFacade,
  CompletionStatusFacade,
  EmploymentFacade,
} from '@cms/case-management/domain';
/** External libraries **/
import { forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentPageComponent implements OnInit, OnDestroy {
  /** Public Properties */
  isEmploymentGridDisplay = true;
  employers$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;

  clientCaseEligibilityId = 'C8EDF7EB-C301-4077-90FB-3739AB321ED0';
  isEmployed = 'Y';
  /** Private properties **/
  private saveClickSubscription!: Subscription;

  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade
  ) {}

  /** Lifecycle Hooks */
  ngOnInit() {
    this.loadEmployers();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  /** Private Methods */
  loadEmployers(): void {
    this.employmentFacade.loadEmployers(this.clientCaseEligibilityId);
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  /** Private Methods **/
  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$
      .pipe(
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.save()])
        )
      )
      .subscribe(([navigationType, isSaved]) => {
        if (isSaved) {
          this.workflowFacade.navigate(navigationType);
        }
      });
  }

  private save() {
    let isValid = true;
    // TODO: validate the form
    if (isValid) {
      return this.employmentFacade.save();
    }

    return of(false);
  }

  unEmploymentChecked() {
    if (!this.isEmploymentGridDisplay) {
      this.isEmployed = 'N';
    }
    this.employmentFacade
      .unEmploymentUpdate(this.clientCaseEligibilityId, this.isEmployed)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.error('err', err);
        },
      });
  }
  /** Internal event methods **/
  onUnEmployedClicked() {
    this.isEmploymentGridDisplay = !this.isEmploymentGridDisplay;
    this.unEmploymentChecked();
  }

  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Employment',
      completed: 15,
      total: 31,
    });
  }
}
