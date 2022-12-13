/** Angular **/
import { ChangeDetectionStrategy,  Component,  OnDestroy,  OnInit,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { filter, first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import {  WorkflowFacade,  CompletionStatusFacade,  EmploymentFacade,} from '@cms/case-management/domain';
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
  clientCaseEligibilityId = this.workflowFacade.clientCaseEligibilityId;
  clientId = this.workflowFacade.clientId;
  clientCaseId = this.workflowFacade.clientCaseId;
  sessionId!: string;
  isEmpListGridLoaderShow = false;
  isEmployedGridDisplay = true;
  isEmployedFlag!: StatusFlag;
  
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;


  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private route: ActivatedRoute
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
    this.checkBoxSubscription = this.employmentStatus$
      .pipe(filter((x) => typeof x === 'boolean'))
      .subscribe((x: boolean) => {
        this.isEmployedGridDisplay = x;
      });
  }

  loadEmploymentsHandle(gridDataRefinerValue: any): void {
    this.isEmpListGridLoaderShow = true;
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    if ((this.isEmployedGridDisplay ?? false) == false) {
      this.employmentFacade.loadEmployers(
        this.clientCaseEligibilityId,
        gridDataRefiner.skipcount,
        gridDataRefiner.maxResultCount,
        gridDataRefiner.sort,
        gridDataRefiner.sortType
      );
      this.isEmpListGridLoaderShow = false;
    }
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
          this.checkBoxSubscription.unsubscribe();
          this.workflowFacade.navigate(navigationType);
        }
      });
  }

  private save() {
    this.isEmployedFlag =
      this.isEmployedGridDisplay == true ? StatusFlag.Yes : StatusFlag.No;
    this.employmentFacade.unEmploymentUpdate(
      this.clientCaseEligibilityId,
      this.isEmployedFlag
    );
    return of(this.employmentFacade.employersStatus$);
  }

  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
  }
}
