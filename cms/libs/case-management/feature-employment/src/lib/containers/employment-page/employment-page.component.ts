/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component,  OnDestroy,  OnInit, ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { catchError, filter, first, forkJoin, mergeMap, of, Subscription, tap } from 'rxjs';
/** Internal libraries **/
import {  WorkflowFacade,  CompletionStatusFacade,  EmploymentFacade, NavigationType, StatusFlag} from '@cms/case-management/domain';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
@Component({
  selector: 'case-management-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentPageComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Public Methods */
  employmentList$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  employmentStatus$ = this.employmentFacade.employmentStatusGet$;
  pageSizes = this.employmentFacade.gridPageSizes;
  clientCaseEligibilityId: any;
  employerListCount : any;
  clientId: any;
  clientCaseId: any;
  sessionId!: string;
  isEmpListGridLoaderShow = false;
  isEmployedGridDisplay = true;
  isEmployedFlag!: StatusFlag;

  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;
  private employeeSubscription$ = this.employmentFacade.employers$;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private readonly router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private readonly cdr: ChangeDetectorRef

  ) {}

  /** Lifecycle Hooks */

  ngOnInit() {
    this.loadCase();
    this.addSaveSubscription();
    this.employerSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addDiscardChangesSubscription();
    this.employmentList$.subscribe((emp:any) => {
      this.employerListCount = emp.total});
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
  }

  ngAfterViewInit(){
    this.workflowFacade.enableSaveButton();
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
        this.cdr.detectChanges();
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
    if (!(this.isEmployedGridDisplay ?? false)) {
      this.pageSizes = this.employmentFacade.gridPageSizes;
      this.employmentFacade.loadEmployers(
        this.clientId,
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
        tap(() => this.workflowFacade.disableSaveButton()),
        mergeMap((navigationType: NavigationType) =>
          forkJoin([of(navigationType), this.save()])
        )
      )
      .subscribe(([navigationType, isSaved]) => {
        if (isSaved) {
          this.checkBoxSubscription.unsubscribe();
          this.workflowFacade.navigate(navigationType);
          this.employmentFacade.hideLoader();
        } else {
          this.workflowFacade.enableSaveButton();
        }
        this.employmentFacade.hideLoader();
      });
  }

  // save and continue subscription save method
  private save() {
    this.isEmployedFlag = (this.isEmployedGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No;
      this.employmentFacade.showLoader();
      if(this.isEmployedGridDisplay === false && this.employerListCount <= 0){
        this.employmentFacade.employmentValidSubject.next(false);
        return  of(false);
      }else{
        this.employmentFacade.employmentValidSubject.next(true);
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
  }

  private employerSubscription(){
    this.employeeSubscription$.subscribe((emp:any) => {
          this.employmentFacade.updateWorkFlowCount(emp?.total <= 0 && !this.isEmployedGridDisplay ? StatusFlag.No: StatusFlag.Yes);
    });
  }

  // unemployment checkbox click
  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
    if(this.isEmployedGridDisplay ?? false){
      this.employmentFacade.updateWorkFlowCount(StatusFlag.Yes);
    }
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      this.save().subscribe((response: any) => {
        if (response) {
          this.loaderService.hide();
          this.workflowFacade.handleSendNewsLetterpopup(statusResponse, this.clientCaseId)
        }
      })
    });
  }

  private addSaveForLaterValidationsSubscription(): void {
    this.saveForLaterValidationSubscription = this.workflowFacade.saveForLaterValidationClicked$.subscribe((val) => {
      if (val) {
        this.checkValidations()
        this.workflowFacade.showSaveForLaterConfirmationPopup(true);
      }
    });
  }

  
  checkValidations(){
    this.isEmployedFlag = (this.isEmployedGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No;
    this.employmentFacade.showLoader();
    if(this.isEmployedGridDisplay === false && this.employerListCount <= 0){
      this.employmentFacade.employmentValidSubject.next(false);
      return false;
    }
    return true;
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
     if(response){
      this.loadEmploymentStatus();
     }
    });
  }
}
