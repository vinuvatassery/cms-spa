/** Angular **/
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
/** External libraries **/
import { first, forkJoin, mergeMap, of, Subscription } from 'rxjs';
/** Facades **/
import { WorkflowFacade, HealthInsuranceFacade, CaseFacade, HealthInsurancePolicyFacade, healthInsurancePolicy } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';
/** Enums **/
import { NavigationType } from '@cms/case-management/domain';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

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

  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly healthFacade: HealthInsuranceFacade,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.buildInsuranceFlagForm();
    this.addSaveSubscription();
    this.loadSessionData();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
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
      wantHelpBuyingPremium:[''],
      aptcFlag:[''],
      aptcMonthlyAmt:[''],
      
      

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
      caseEligibilityFlagsData["clientCaseEligibilityId"] = this.clientCaseEligibilityId;
      caseEligibilityFlagsData["clientId"] = this.clientId;
      return this.healthFacade.saveInsuranceFlags(caseEligibilityFlagsData);

    }
    return of(false)
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
      if (policy.currentInsuranceFlag && policy.groupPolicyEligibleFlag) {
        this.currentInsurance = policy.currentInsuranceFlag;
        this.groupPolicyEligible = policy.groupPolicyEligibleFlag;
        this.patchInsurancePolicyFlags(policy);
        if (this.currentInsurance == 'Y') {
          this.showTable = true;
        }
        else{
          this.showTable = false;
        }
        this.ref.detectChanges();
      }
    })
  }

  patchInsurancePolicyFlags(insurancePolicy: any) {
    this.insuranceFlagForm?.get('currentInsuranceFlag')?.setValue(insurancePolicy?.currentInsuranceFlag)
    this.insuranceFlagForm?.get('groupPolicyEligibleFlag')?.setValue(insurancePolicy?.groupPolicyEligibleFlag)
  }

  onCurrentInsuranceChange(currentInsuranceValue: string) {
    if (currentInsuranceValue == 'Y') {
      this.showTable = true;
    }
    else {
      this.showTable = false;
    }
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
}



