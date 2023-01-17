/** Angular **/
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
/** External libraries **/
import { debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription } from 'rxjs';
/** Facades **/
import { WorkflowFacade, HealthInsuranceFacade, CaseFacade, HealthInsurancePolicyFacade, healthInsurancePolicy, CompletionChecklist, StatusFlag } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'case-management-health-insurance-page',
  templateUrl: './health-insurance-page.component.html',
  styleUrls: ['./health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthInsurancePageComponent implements OnInit, OnDestroy {


  healthInsuranceForm!: FormGroup;
  insuranceFlagForm!: FormGroup;
  healthInsurancePolicy!: healthInsurancePolicy;

  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  currentInsurance: string = "";
  groupPolicyEligible: string = "";
  showTable: boolean = false;
  closeDeleteModal:boolean=false;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly healthFacade: HealthInsuranceFacade,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly router :Router
    ) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.buildInsuranceFlagForm();
    this.addSaveSubscription();
    this.loadSessionData();
    this.insuranceFlagFormChangeSubscription();
	this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }
  ShowHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.HideLoader();
  }

  ShowLoader() {
    this.loaderService.show();
  }

  HideLoader() {
    this.loaderService.hide();
  }


  /** Private Methods **/
  private buildForm() {
    this.healthInsuranceForm = this.formBuilder.group({
      clientInsurancePolicyId: [''],
      insuranceType: [''],
      insuranceStartDate:[''],
      insuranceEndDate:[''],
      insuranceIdNumber:[''],
      insuranceCarrierName:[''],
      metalLevel:[{}],
      insurancePlanName:[''],
      aptcFlag:[''],
      aptcMonthlyAmt:[''],
      careassistPayingPremiumFlag:[''],
      premiumPaidThruDate:[''],
      nextPremiumDueDate:[''],
      premiumAmt:[''],
      premiumFrequencyCode:[''],
      paymentIdNbr:[''],
      paymentIdNbrSameAsInsuranceIdNbrFlag:[''],
      groupPlanType:[''],
      medicareBeneficiaryIdNbr: [''],
      medicareCoverageTypeCode:[''],
      medicarePartAStartDate:[''],
      medicarePartBStartDate:[''],
      onQmbFlag:[''],
      onLisFlag:['']



    });

  }

  private buildInsuranceFlagForm() {
    this.insuranceFlagForm = this.formBuilder.group({
      currentInsuranceFlag: [null],
      groupPolicyEligibleFlag: [null]
    });
  }

  private addSaveSubscription(): void {
    this.saveClickSubscription = this.workflowFacade.saveAndContinueClicked$.pipe(
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.save()])
      ),
    ).subscribe(([navigationType, isSaved]) => {
      if (isSaved) {
        this.workflowFacade.navigate(navigationType);
        this.HideLoader();
      }
    });
  }

  private save() {
    if (this.insuranceFlagForm.valid) {
      this.ShowLoader();
      let caseEligibilityFlagsData = this.insuranceFlagForm.value;
      if(caseEligibilityFlagsData.currentInsuranceFlag==StatusFlag.No){
        return this.healthFacade.deleteInsurancePolicyByEligibilityId(this.clientCaseEligibilityId);
      }
      return of(true);
    }
    return of(false)
  }

  private insuranceFlagFormChangeSubscription() {
    this.insuranceFlagForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        startWith(null),
        pairwise()
      )
      .subscribe(([prev, curr]: [any, any]) => {
        this.updateFormCompleteCount(prev, curr);
      });
  }

  private updateFormCompleteCount(prev: any, curr: any) {
    let completedDataPoints: CompletionChecklist[] = [];
    if (prev && curr) {
        if (prev['currentInsuranceFlag'] != curr['currentInsuranceFlag']) {
            const item: CompletionChecklist = {
                dataPointName: 'currentInsuranceFlag',
                status: curr['currentInsuranceFlag'] === StatusFlag.No ? StatusFlag.Yes : StatusFlag.No
            };

            completedDataPoints.push(item);
        }
        if (prev['groupPolicyEligibleFlag'] !== curr['groupPolicyEligibleFlag']) {
          const item: CompletionChecklist = {
                dataPointName: 'groupPolicyEligibleFlag',
                status: curr['groupPolicyEligibleFlag'] ? StatusFlag.Yes : StatusFlag.No
            };

            completedDataPoints.push(item);
        }
    }

    if (completedDataPoints.length > 0) {
        this.workflowFacade.updateChecklist(completedDataPoints);
    }
}

  loadSessionData() {
    //this.loaderService.show();
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;

          const gridDataRefinerValue = {
            skipCount: this.healthFacade.skipCount,
            pagesize: this.healthFacade.gridPageSizes[0]?.value
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.loadInsurancePolicyFlags();
        }
      });

  }

  loadInsurancePolicyFlags() {
    this.healthFacade.medicalHealthPolicy$.subscribe((policy: any) => {
      if (policy.currentInsuranceFlag) {
        this.currentInsurance = policy.currentInsuranceFlag;
        if (this.currentInsurance == StatusFlag.Yes) {
          this.showTable = true;
        }
        else {
          this.showTable = false;
        }
      }
      if (policy.groupPolicyEligibleFlag) {
        this.groupPolicyEligible = policy.groupPolicyEligibleFlag;
      }
      this.patchInsurancePolicyFlags(policy);
      this.ref.detectChanges();
    })
  }

  patchInsurancePolicyFlags(insurancePolicy: any) {
    this.insuranceFlagForm?.get('currentInsuranceFlag')?.setValue(insurancePolicy?.currentInsuranceFlag)
    this.insuranceFlagForm?.get('groupPolicyEligibleFlag')?.setValue(insurancePolicy?.groupPolicyEligibleFlag)
  }

  onGroupInsuranceChange(){
    this.ShowLoader()
    this.saveHealthInsuranceFlag().subscribe({
      next:(response:any)=>{
        this.HideLoader();
      },
      error:(err:any)=>{
        this.HideLoader();
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err) ; 
      }
    });
  }

  onCurrentInsuranceChange(currentInsuranceValue: string) {
    this.ShowLoader()
    this.saveHealthInsuranceFlag().subscribe({
      next:(response:any)=>{
        if (currentInsuranceValue == StatusFlag.Yes) {
          this.showTable = true;
          const gridDataRefinerValue = {
            skipCount: this.healthFacade.skipCount,
            pagesize: this.healthFacade.gridPageSizes[0]?.value
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.loadInsurancePolicyFlags();
        }
        else {
          this.showTable = false;
        }
        this.HideLoader();
        this.ref.detectChanges();
      },
      error:(err:any)=>{
        this.HideLoader();
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR , err);
      }
    });
  }

  saveHealthInsuranceFlag(){
    let caseEligibilityFlagsData = this.insuranceFlagForm.value;
    caseEligibilityFlagsData["clientCaseEligibilityId"] = this.clientCaseEligibilityId;
    caseEligibilityFlagsData["clientId"] = this.clientId;
    return this.healthFacade.saveInsuranceFlags(caseEligibilityFlagsData)
  }

  loadHealthInsuranceHandle(gridDataRefinerValue: any): void {
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize
    };
    this.healthFacade.loadMedicalHealthPlans(
      this.clientId,
      this.clientCaseEligibilityId,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount
    );
  }

  delteInsurancePolicy(insurancePolicyId:any) {
    if (insurancePolicyId != undefined) {
      this.ShowLoader();
      this.closeDeleteModal=false;
      this.healthFacade.deleteInsurancePolicy(insurancePolicyId).subscribe((response: any) => {
        this.closeDeleteModal=true;
        this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy deleted successfully");
        this.HideLoader();
        this.ref.detectChanges();
      },(error) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
        })
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
    return this.insuranceFlagForm.valid;
  }
}



