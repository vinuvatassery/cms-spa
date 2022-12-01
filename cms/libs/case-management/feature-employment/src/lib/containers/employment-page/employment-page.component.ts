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
import { NavigationType, StatusFlag } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentPageComponent implements OnInit, OnDestroy {
  /** Public Properties */

  employers$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;

  isEmployed = true;
  isEmployedFlag = StatusFlag.Yes;
  clientCaseEligibilityId = 'B7D1A86D-833E-4981-8957-6A189F0FC846';

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
  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  loadEmployers(): void {
    this.employmentFacade.loadEmployers(this.clientCaseEligibilityId);
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
      if (this.isEmployed) {
        this.isEmployedFlag = StatusFlag.Yes;
      } else {
        this.isEmployedFlag = StatusFlag.No;
      }
      this.employmentFacade
        .unEmploymentUpdate(this.clientCaseEligibilityId, this.isEmployedFlag)
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => {
            console.error('err', err);
          },
        });
      return this.employmentFacade.save();
    }
    return of(false);
  }

  /** Internal event methods **/
  onUnEmployedClicked() {
    this.isEmployed = !this.isEmployed;
  }

  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Employment',
      completed: 15,
      total: 31,
    });
  }
}
