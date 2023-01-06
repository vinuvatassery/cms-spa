/** Angular **/
import { ChangeDetectionStrategy, Component,  OnDestroy,  OnInit,} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import {  WorkflowFacade,  CompletionStatusFacade,  EmploymentFacade,} from '@cms/case-management/domain';
/** Enums **/
import { NavigationType, StatusFlag } from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
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

  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    
  ) {}

  /** Lifecycle Hooks */

  ngOnInit() {
    this.loadCase();
    this.addSaveSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
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
          this.employmentFacade.hideLoader();
        }
        this.employmentFacade.hideLoader();
      });
  }

  // save and continue subscription save method
  private save() {
    this.isEmployedFlag =
      this.isEmployedGridDisplay == true ? StatusFlag.Yes : StatusFlag.No;
      this.employmentFacade.showLoader();
    return this.employmentFacade
      .unEmploymentUpdate(this.clientCaseEligibilityId, this.isEmployedFlag)
      .pipe(

        catchError((err: any) => {
          if (err?.error) { 
            this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err); 
          }
          return of(false);
        }),
      )
  }

  // unemployment checkbox click
  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
    if(this.isEmployedGridDisplay === true){
      this.employmentFacade.updateWorkFlowCount(StatusFlag.Yes);
    }
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.pipe(
      mergeMap((statusResponse: boolean) =>
        forkJoin([of(statusResponse), this.save()])
      ),
    ).subscribe(([statusResponse, isSaved]) => {
      if (isSaved) {
        this.loaderService.hide();
        this.router.navigate([`/case-management/cases/case360/${this.clientCaseId}`])
      }
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        if(this.checkValidations()){
          this.workflowFacade.showSaveForLaterConfirmationPopup(true);
        }
      }
    });
  }

  checkValidations(){
    // As no validation is there for the Employement Checkbox,returning true to complete save for later process.
    return true;
  }

}
