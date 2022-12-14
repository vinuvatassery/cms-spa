/** Angular **/
import { ChangeDetectionStrategy,  Component,  OnDestroy,  OnInit,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { filter, first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import {  WorkflowFacade,  CompletionStatusFacade,  EmploymentFacade,} from '@cms/case-management/domain';
/** Enums **/
import { NavigationType, StatusFlag } from '@cms/case-management/domain';
import { LoaderService, NotificationSnackbarService } from '@cms/shared/util-core';

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
  pageSizes = this.employmentFacade.gridPageSizes;
  clientCaseEligibilityId: any;
  clientId: any;
  clientCaseId: any;
  sessionId!: string;
  isEmpListGridLoaderShow = false;
  isEmployedGridDisplay = true;
  isEmployedFlag!: StatusFlag;
  employmentSnackbar$ = this.notificationSnackbarService.snackbar$;
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;

  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private readonly notificationSnackbarService : NotificationSnackbarService
  ) {}

  /** Lifecycle Hooks */

  ngOnInit() {
    this.loadEmploymentStatus();
    this.addSaveSubscription();
    this.loadCase();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
  }
  // loading case details like session id, eligibility id , clientid and clientcaseid
  loadCase() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
        this.clientCaseEligibilityId = JSON.parse(
          session.sessionData
        ).clientCaseEligibilityId;
        this.clientId = JSON.parse(session.sessionData).clientId;
        this.loadEmploymentStatus();
      });
  }
  updateCompletionStatus(status: any) {
    this.completionStatusFacade.updateCompletionStatus(status);
  }
  /** Internal event methods **/
  // loading the unemployment status
  private loadEmploymentStatus(): void {
    this.employmentFacade.loadEmploymentStatus(this.clientCaseEligibilityId);
    this.checkBoxSubscription = this.employmentStatus$
      .pipe(filter((x) => typeof x === 'boolean'))
      .subscribe((x: boolean) => {
        this.isEmployedGridDisplay = x;
      });
  }
  // loading the employment list in grid
  loadEmploymentsHandle(gridDataRefinerValue: any): void {
    this.isEmpListGridLoaderShow = true;
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sort: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    if ((this.isEmployedGridDisplay ?? false) == false) {
      this.pageSizes = this.employmentFacade.gridPageSizes;
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
  // workflow save and continue subscription
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

  // save and continue subscription save method
  private save() {
    this.isEmployedFlag =
      this.isEmployedGridDisplay == true ? StatusFlag.Yes : StatusFlag.No;
    this.employmentFacade.unEmploymentUpdate(
      this.clientCaseEligibilityId,
      this.isEmployedFlag
    );
    return of(this.employmentFacade.employersStatus$);
  }

  // unemployment checkbox click
  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
  }
}
