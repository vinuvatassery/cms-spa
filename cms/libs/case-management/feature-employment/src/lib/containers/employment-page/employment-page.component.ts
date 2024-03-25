/** Angular **/
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { catchError, first, forkJoin, mergeMap, of, Subscription, tap } from 'rxjs';
/** Internal libraries **/
import { WorkflowFacade, CompletionStatusFacade, EmploymentFacade, NavigationType, CompletionChecklist, WorkflowTypeCode } from '@cms/case-management/domain';
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { IntlService } from '@progress/kendo-angular-intl';
import { StatusFlag } from '@cms/shared/ui-common';
@Component({
  selector: 'case-management-employment-page',
  templateUrl: './employment-page.component.html',
  styleUrls: ['./employment-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmploymentPageComponent implements OnInit, OnDestroy, AfterViewInit {
  /** Public Methods */
  public formUiStyle: UIFormStyle = new UIFormStyle();
  employmentList$ = this.employmentFacade.employers$;
  completeStaus$ = this.completionStatusFacade.completionStatus$;
  employmentStatus$ = this.employmentFacade.employmentStatusGet$;
  pageSizes = this.employmentFacade.gridPageSizes;
  clientCaseEligibilityId: any;
  employerListCount: any;
  clientId: any;
  clientCaseId: any;
  sessionId!: string;
  isEmpListGridLoaderShow = false;
  isEmployedGridDisplay = true;
  isEmployedFlag!: StatusFlag;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  prevEmploymentList$ = this.employmentFacade.prvEmployers$;
  prvEmployers!: any[];
  hasAdditionalEmployersFlag!: string;
  hasAdditionalEmployersFlagRequired: boolean = false;
  currentDate = new Date();
  workflowTypeCode:any;
  /** Private properties **/
  private saveClickSubscription!: Subscription;
  private checkBoxSubscription!: Subscription;
  private employeeSubscription$ = this.employmentFacade.employers$;
  private prvEmployerSubscription$!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private discardChangesSubscription !: Subscription;
  /** Constructor */
  constructor(
    private employmentFacade: EmploymentFacade,
    private completionStatusFacade: CompletionStatusFacade,
    private workflowFacade: WorkflowFacade,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private readonly cdr: ChangeDetectorRef,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly router: Router,
  ) { }

  /** Lifecycle Hooks */

  ngOnInit() {
    this.loadCase();
    this.addSaveSubscription();
    this.employerSubscription();
    this.prevEmployerSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addDiscardChangesSubscription();
    this.employmentList$.subscribe((emp: any) => {
      this.employerListCount = emp.total
    });
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
    this.discardChangesSubscription.unsubscribe();
    this.prvEmployerSubscription$.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  // loading case details like session id, eligibility id , clientid and clientcaseid
  loadCase() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId);
    this.workflowFacade.sessionDataSubject$
      .pipe(first((sessionData) => sessionData.sessionData != null))
      .subscribe((session: any) => {
        this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
        this.clientCaseEligibilityId = JSON.parse(
          session.sessionData
        ).clientCaseEligibilityId;
        this.clientId = JSON.parse(session.sessionData).clientId;
        this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;
        if (this.prevClientCaseEligibilityId) {
          this.isCerForm = true;
          this.loadExistingEmployers();
        }
        this.loadEmploymentStatus();
      });
  }

  /** Internal event methods **/
  // loading the unemployment status
  private loadEmploymentStatus(): void {
    this.employmentFacade.loadEmploymentStatus(this.clientCaseEligibilityId);
    this.checkBoxSubscription = this.employmentStatus$
      //.pipe(filter((x) => typeof x === 'boolean'))
      .subscribe((flags: any) => {
        if (this.isCerForm) {
          this.hasAdditionalEmployersFlag = flags.hasAdditionalEmployersFlag;
          this.isEmployedGridDisplay = flags.hasAdditionalEmployersFlag !== StatusFlag.Yes;
          this.onAdditionalEmployersClicked();
        }
        else {
          this.isEmployedGridDisplay = flags.unemployedFlag === StatusFlag.Yes;
        }
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
    if (!(this.isEmployedGridDisplay ?? false) || this.isCerForm) {
      this.pageSizes = this.employmentFacade.gridPageSizes;
      this.employmentFacade.loadEmployers(
        this.clientId,
        this.clientCaseEligibilityId,
        gridDataRefiner.skipcount,
        gridDataRefiner.maxResultCount,
        gridDataRefiner.sort,
        gridDataRefiner.sortType,
        'New'
      );
      this.isEmpListGridLoaderShow = false;
    }
  }

  loadExistingEmployers() {
    this.employmentFacade.loadPrevEmployers(
      this.clientId,
      this.clientCaseEligibilityId,
    );
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
          this.employmentFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, 'Employment status updated')
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
    const isValid = this.validateEmployment()
    if (!isValid) {
      return of(false);
    } else {
      this.employmentFacade.showLoader();
      const employmentData = this.getEmploymentData();
      return this.employmentFacade
        .employmentUpdate(this.clientCaseEligibilityId, employmentData)
        .pipe(
          catchError((err: any) => {
            if (err?.error) {
              this.employmentFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
            }
            return of(false);
          }),
        )
    }
  }

  private getEmploymentData() {
    let oldEmployerStatuses: any[] = [];
    if (this.isCerForm) {
      this.prvEmployers.forEach((emp: any) => {
        const endDate = emp.endDate ? this.intl.formatDate(emp.endDate, this.configProvider.appSettings.dateFormat) : null;
        const oldEmployer = {
          clientEmployerId: emp.clientEmployerId,
          cerReviewStatusCode: emp.cerReviewStatusCode,
          endDate: emp.cerReviewStatusCode =="ACTIVE"? null : endDate,
          concurrencyStamp: emp.concurrencyStamp,
        };

        oldEmployerStatuses.push(oldEmployer);
      });
    }

    const employmentData = {
      isCer: this.isCerForm,
      unemployedFlag: (this.isEmployedGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No,
      hasAdditionalEmployersFlag: this.hasAdditionalEmployersFlag,
      oldEmployerStatuses: oldEmployerStatuses
    }

    return employmentData;
  }

  private validateEmployment() {
    let isValid = true;
    this.employmentFacade.employmentValidSubject.next(true);
    this.hasAdditionalEmployersFlagRequired = false;
    if (this.isCerForm) {
      isValid = this.employmentFacade.validateOldEmployers(this.prvEmployers);
      if (!this.hasAdditionalEmployersFlag) {
        this.hasAdditionalEmployersFlagRequired = true;
        isValid = false;
      }
    }
    const isNewEmployeeListRequired = ((this.isEmployedGridDisplay === false && !this.isCerForm) || (this.hasAdditionalEmployersFlag == StatusFlag.Yes && this.isCerForm)) && this.employerListCount <= 0;
    if (isNewEmployeeListRequired) {
      this.employmentFacade.employmentValidSubject.next(false);
      isValid = false;
    }

    return isValid;
  }

  private employerSubscription() {
    this.employeeSubscription$.subscribe((emp: any) => {
      this.employmentFacade.updateWorkFlowCount(emp?.total <= 0 && !this.isEmployedGridDisplay ? StatusFlag.No : StatusFlag.Yes);
    });
  }

  private prevEmployerSubscription() {
    this.prvEmployerSubscription$ = this.prevEmploymentList$.subscribe((emp: any) => {
      const isPrvEmployersNull = !this.prvEmployers;
      if (emp) {
        emp.forEach((e: any) => {
          e.dateOfHire =  e.dateOfHire ? new Date(e.dateOfHire) : e.dateOfHire;
          e.endDate = e.endDate ? new Date(e.endDate) : e.endDate;
        });
        
        this.cdr.detectChanges();
      }

      this.prvEmployers = emp;
      if (isPrvEmployersNull) {
        this.onOldEmployerChange(true);
      }
    });
  }

  onOldEmployerChange(isAddToChecklist: boolean = false) {
    const dataPointCounts: CompletionChecklist[] = [];
    this.prvEmployers.forEach((emp: any) => {
      let status = emp.cerReviewStatusCode === "ACTIVE" || (emp.cerReviewStatusCode === "INACTIVE" && emp.endDate) ? StatusFlag.Yes : StatusFlag.No;
      const dataPoint: CompletionChecklist = { dataPointName: emp.clientEmployerId, status: status };
      dataPointCounts.push(dataPoint);
    });

    if (dataPointCounts?.length > 0) {
      if (isAddToChecklist) {
        this.workflowFacade.addDynamicDataPoints(dataPointCounts);
      }
      else {
        this.workflowFacade.updateChecklist(dataPointCounts, true);
      }
    }
  }


  // unemployment checkbox click
  onUnEmployedClicked() {
    this.isEmployedGridDisplay = !this.isEmployedGridDisplay;
    if (this.isEmployedGridDisplay ?? false) {
      this.employmentFacade.updateWorkFlowCount(StatusFlag.Yes);
    }
  }

  onAdditionalEmployersClicked() {
    const dataPoint: CompletionChecklist = {
      dataPointName: 'additionalEmployers',
      status: this.hasAdditionalEmployersFlag
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([dataPoint]);
    if (this.hasAdditionalEmployersFlag === StatusFlag.Yes) {
      this.employmentFacade.updateWorkFlowCount(this.employerListCount > 0 ? StatusFlag.Yes : StatusFlag.No);
    }
  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      this.save().subscribe((response: any) => {
        if (response) {
          this.loaderService.hide();
          if (this.workflowTypeCode === WorkflowTypeCode.NewCase) {
            this.router.navigate(['/case-management/case-detail/application-review/send-letter'], {
              queryParamsHandling: "preserve"
            });
          }
          else
          {
            this.router.navigate(['/case-management/cer-case-detail/application-review/send-letter'], {
              queryParamsHandling: "preserve"
            });
          }
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


  checkValidations() {
    this.isEmployedFlag = (this.isEmployedGridDisplay ?? false) ? StatusFlag.Yes : StatusFlag.No;
    this.employmentFacade.showLoader();
    if (this.isEmployedGridDisplay === false && this.employerListCount <= 0) {
      this.employmentFacade.employmentValidSubject.next(false);
      this.employmentFacade.hideLoader();
      return false;
    }
    this.employmentFacade.hideLoader();
    return true;
  }

  private addDiscardChangesSubscription(): void {
    this.discardChangesSubscription = this.workflowFacade.discardChangesClicked$.subscribe((response: any) => {
      if (response) {
        this.loadEmploymentStatus();
      }
    });
  }
}
