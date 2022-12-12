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
  /** Public Methods */
  employmentList$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  employmentStatus$ = this.employmentFacade.employmentStatusGet$;
  clientCaseId!: string;
  sessionId!: string;
  isEmpListGridLoaderShow = false;

  /** Private properties **/
  private saveClickSubscription!: Subscription;
  clientId = 1;
  clientCaseEligibilityId = 'B7D1A86D-833E-4981-8957-6A189F0FC846';
  isEmployedGridDisplay = true;
  isEmployedFlag!: StatusFlag;

  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade
  ) {}

  /** Lifecycle Hooks */
 
  ngOnInit() {
    this.loadEmploymentStatus();
    this.addSaveSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }

  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }

  private loadEmploymentStatus(): void {
    this.employmentFacade.loadEmploymentStatus(this.clientCaseEligibilityId);
    //   this.checkBoxSubscription=
    //   this.employmentStatus$.pipe(filter(x=> typeof x === 'boolean')).subscribe((x: boolean)=>  {
    //   this.isEmployedGridDisplay = x
    //  });
  }

  loadEmploymentsHandle(gridDataRefinerValue: any): void {
    this.isEmpListGridLoaderShow = true;
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    // if((this.isEmployedGridDisplay ?? false) == false)
    // {
    this.employmentFacade.loadEmployers(
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sort,
      gridDataRefiner.sortType
    );
    this.isEmpListGridLoaderShow = false;

    // }
  }

  /** Internal event methods **/
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
    this.isEmployedFlag =
      this.isEmployedGridDisplay == true ? StatusFlag.Yes : StatusFlag.No;
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

  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
  }

  onChangeCounterClick() {
    this.updateCompletionStatus({
      name: 'Employment',
      completed: 15,
      total: 31,
    });
  }
}
