/** Angular **/
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, OnDestroy, OnInit, AfterViewInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
/** External libraries **/
import { debounceTime, distinctUntilChanged, first, forkJoin, mergeMap, of, pairwise, startWith, Subscription, tap } from 'rxjs';
/** Internal libraries **/
import { WorkflowFacade, HealthInsurancePolicyFacade, HealthInsurancePolicy, CompletionChecklist, NavigationType, InsuranceStatusType, GridFilterParam, FinancialVendorFacade, ContactFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { StatusFlag } from '@cms/shared/ui-common';
import { LovFacade } from '@cms/system-config/domain';
import { DialogService } from '@progress/kendo-angular-dialog';


@Component({
  selector: 'case-management-health-insurance-page',
  templateUrl: './health-insurance-page.component.html',
  styleUrls: ['./health-insurance-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthInsurancePageComponent implements OnInit, OnDestroy, AfterViewInit {


  healthInsuranceForm!: FormGroup;
  insuranceFlagForm!: FormGroup;
  healthInsurancePolicy!: HealthInsurancePolicy;

  sessionId: any = "";
  clientId: any;
  clientCaseEligibilityId: string = "";
  clientCaseId: any;
  currentInsurance: string = "";
  groupPolicyEligible: string = "";
  showTable: boolean = false;
  closeDeleteModal: boolean = false;
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  medicalHealthPlans$ = this.insurancePolicyFacade.medicalHealthPlans$;
  isInsuranceAvailable: boolean = false;
  isCerForm = false;
  prevClientCaseEligibilityId!: string;
  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  priorityCodeType$ = this.lovFacade.priorityCodeType$;
  workflowTypeCode:any;
  vendorId: any;
  providerDetailsDialog: any;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
  /** Private properties **/
  private saveClickSubscription !: Subscription;
  private loadSessionSubscription!: Subscription;
  private saveForLaterClickSubscription !: Subscription;
  private saveForLaterValidationSubscription !: Subscription;
  private healthInsuranceStatusSubscription !: Subscription;
  /** Constructor **/
  constructor(private workflowFacade: WorkflowFacade,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private readonly ref: ChangeDetectorRef,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly router: Router,
    private lovFacade: LovFacade,   
    private dialogService: DialogService, 
    private readonly financialVendorFacade: FinancialVendorFacade, 
    public contactFacade: ContactFacade,
    

  ) { }

  /** Lifecycle Hooks **/
  ngOnInit(): void {
    this.buildForm();
    this.buildInsuranceFlagForm();
    this.addSaveSubscription();
    this.loadSessionData();
    this.insuranceFlagFormChangeSubscription();
    this.addSaveForLaterSubscription();
    this.addSaveForLaterValidationsSubscription();
    this.addHealthInsuranceStatusSubscription();
    this.loadHealthInsuranceLovs();
    this.loadHealthInsuranceLovs();
  }

  ngOnDestroy(): void {
    this.saveClickSubscription.unsubscribe();
    this.loadSessionSubscription.unsubscribe();
    this.saveForLaterClickSubscription.unsubscribe();
    this.saveForLaterValidationSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.workflowFacade.enableSaveButton();
  }

  ShowHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.HideLoader();
  }



  private loadHealthInsuranceLovs() {
    this.lovFacade.getHealthInsuranceTypeLovs();
    this.lovFacade.getPremiumFrequencyLovs();
    this.lovFacade.getCaseCodeLovs();
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
      insuranceStartDate: [''],
      insuranceEndDate: [''],
      insuranceIdNumber: [''],
      insuranceProviderName: [''],
      metalLevel: [{}],
      insurancePlanName: [''],
      aptcFlag: [''],
      aptcMonthlyAmt: [''],
      careassistPayingPremiumFlag: [''],
      premiumPaidThruDate: [''],
      nextPremiumDueDate: [''],
      premiumAmt: [''],
      premiumFrequencyCode: [''],
      paymentIdNbr: [''],
      paymentIdNbrSameAsInsuranceIdNbrFlag: [''],
      groupPlanType: [''],
      insuranceGroupId: [''],
      medicareBeneficiaryIdNbr: [''],
      medicareCoverageTypeCode: [''],
      medicarePartAStartDate: [''],
      medicarePartBStartDate: [''],
      medicareEndDate:[''],
      onQmbFlag: [''],
      onLisFlag: [''],
      othersCoveredOnPlanFlag: [''],
      othersCoveredOnPlan: this.formBuilder.array([]),
      newOthersCoveredOnPlan: this.formBuilder.array([]),
      othersCoveredOnPlanSaved: [[]],
      othersCoveredOnPlanSelection: [''],
      isClientPolicyHolderFlag: [''],
      policyHolderFirstName: [''],
      policyHolderLastName: [''],
      proofOfPremium: [''],
      copyOfInsuranceCard: [''],
      copyOfSummary: [''],
      cerReviewType:[''],
      insuranceVendorAddressId:[''],
      vendorAddressId:[''],
      insuranceTypeCode:['']
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
      tap(() => this.workflowFacade.disableSaveButton()),
      mergeMap((navigationType: NavigationType) =>
        forkJoin([of(navigationType), this.saveAndContinue(), this.validateCerReviewStatus()])
      ),
    ).subscribe(([navigationType, isSaved, isReviewPending]) => {
      if(isReviewPending){
        this.HideLoader();
        this.workflowFacade.enableSaveButton();
        this.notificationSnackbarService.manageSnackBar(SnackBarNotificationType.ERROR, 'Insurance Review not complete', NotificationSource.UI);
      }
      else if (isSaved) {
       this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Health Insurance status updated');
        this.workflowFacade.navigate(navigationType);
        this.HideLoader();
      } else {
        this.workflowFacade.enableSaveButton();
      }
    });
  }
  private saveAndContinue() {
    if (this.insuranceFlagForm.controls['currentInsuranceFlag'].value == StatusFlag.No) {
      this.insurancePolicyFacade.showInsuranceRequiredSubject.next(false);
    }
    else {
      if (!this.isInsuranceAvailable) { this.insurancePolicyFacade.showInsuranceRequiredSubject.next(true); }
    }
    if (this.checkValidations() &&
      ((this.insuranceFlagForm.controls['currentInsuranceFlag'].value == StatusFlag.Yes && this.isInsuranceAvailable) ||
        this.insuranceFlagForm.controls['currentInsuranceFlag'].value == StatusFlag.No)) {
      this.save();
      return of(true);
    }
    else {
      return of(false);
    }
  }
  private save() {
    if (this.insuranceFlagForm.valid) {
      this.ShowLoader();
      let caseEligibilityFlagsData = this.insuranceFlagForm.value;
      if (caseEligibilityFlagsData.currentInsuranceFlag == StatusFlag.No) {
        return this.insurancePolicyFacade.deleteInsurancePolicyByEligibilityId(this.clientCaseEligibilityId);
      }
      return of(true);
    }
    return of(false)
  }

  private validateCerReviewStatus(){
    if(!this.isCerForm)
    {
       return of(false);
    }
    else
    {
     return this.insurancePolicyFacade.validateCerReviewStatus(this.clientCaseEligibilityId);
    }
  }

  validateForm() {
    this.insuranceFlagForm.markAllAsTouched();
    this.insuranceFlagForm.controls['currentInsuranceFlag'].setValidators([
      Validators.required,
    ]);
    this.insuranceFlagForm.controls['currentInsuranceFlag'].updateValueAndValidity();
    this.insuranceFlagForm.controls['groupPolicyEligibleFlag'].setValidators([
      Validators.required,
    ]);
    this.insuranceFlagForm.controls['groupPolicyEligibleFlag'].updateValueAndValidity();
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
    Object.keys(this.insuranceFlagForm.controls).forEach(key => {
      if (prev && curr) {
        if (prev[key] !== curr[key]) {
          let item: CompletionChecklist = {
            dataPointName: key,
            status: curr[key] ? StatusFlag.Yes : StatusFlag.No
          };
          completedDataPoints.push(item);
        }
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  private adjustAttributeInit() {
    this.adjustInsurancePlansAttributes(this.insuranceFlagForm?.get('currentInsuranceFlag')?.value ?? StatusFlag.No);
    this.updateInitialCompletionCheckList();
  }

  private adjustInsurancePlansAttributes(status: StatusFlag) {
    const data: CompletionChecklist = {
      dataPointName: 'insurance_plans_required',
      status: status
    };

    this.workflowFacade.updateBasedOnDtAttrChecklist([data]);
  }

  private updateInitialCompletionCheckList() {
    let completedDataPoints: CompletionChecklist[] = [];
    Object.keys(this.insuranceFlagForm.controls).forEach(key => {
      if (this.insuranceFlagForm?.get(key)?.value && this.insuranceFlagForm?.get(key)?.valid) {
        let item: CompletionChecklist = {
          dataPointName: key,
          status: StatusFlag.Yes
        };

        completedDataPoints.push(item);
      }
    });

    if (completedDataPoints.length > 0) {
      this.workflowFacade.updateChecklist(completedDataPoints);
    }
  }

  loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowTypeCode = this.route.snapshot.queryParams['wtc'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId;
          this.prevClientCaseEligibilityId = JSON.parse(session.sessionData)?.prevClientCaseEligibilityId;
          if (this.prevClientCaseEligibilityId) {
            this.isCerForm = true;
          }
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            maxResultCount: this.insurancePolicyFacade.gridPageSizes[0]?.value,           
            sortColumn: 'creationTime',
            sortType: 'asc',
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.loadInsurancePolicyFlags();
        }
      });

  }

  loadInsurancePolicyFlags() {
    this.insurancePolicyFacade.medicalHealthPolicy$.subscribe((policy: any) => {
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
      this.adjustAttributeInit();
    })
  }

  patchInsurancePolicyFlags(insurancePolicy: any) {
    this.insuranceFlagForm?.get('currentInsuranceFlag')?.setValue(insurancePolicy?.currentInsuranceFlag)
    this.insuranceFlagForm?.get('groupPolicyEligibleFlag')?.setValue(insurancePolicy?.groupPolicyEligibleFlag)
  }

  onGroupInsuranceChange() {
    this.ShowLoader()
    this.saveHealthInsuranceFlag().subscribe({
      next: (response: any) => {
        this.HideLoader();
      },
      error: (err: any) => {
        this.HideLoader();
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  onCurrentInsuranceChange(currentInsuranceValue: string) {
    this.ShowLoader()
    this.adjustInsurancePlansAttributes(currentInsuranceValue == StatusFlag.Yes ? StatusFlag.Yes : StatusFlag.No);
    this.saveHealthInsuranceFlag().subscribe({
      next: (response: any) => {
        this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, 'Health Insurance flags updated');
        if (currentInsuranceValue == StatusFlag.Yes) {
          this.showTable = true;
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            maxResultCount: this.insurancePolicyFacade.gridPageSizes[0]?.value,      
            sortColumn: 'creationTime',
            sortType: 'asc',
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
      error: (err: any) => {
        this.HideLoader();
        this.ShowHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  saveHealthInsuranceFlag() {
    let caseEligibilityFlagsData = this.insuranceFlagForm.value;
    caseEligibilityFlagsData["clientCaseEligibilityId"] = this.clientCaseEligibilityId;
    caseEligibilityFlagsData["clientId"] = this.clientId;
    return this.insurancePolicyFacade.saveInsuranceFlags(caseEligibilityFlagsData)
  }

  loadHealthInsuranceHandle(gridDataRefinerValue: any): void {
    let typeParam = { type: 'INSURANCE', insuranceStatusType: 'ALL' }
    const gridFilterParam = new GridFilterParam(gridDataRefinerValue.skipCount, gridDataRefinerValue.maxResultCount, gridDataRefinerValue.sortColumn, gridDataRefinerValue.sortType, JSON.stringify(gridDataRefinerValue.filter));   
    this.insurancePolicyFacade.loadMedicalHealthPlans(
      this.clientId,
      this.clientCaseEligibilityId,
      typeParam,
      true,
      gridFilterParam      
    );
  }

  deleteInsurancePolicy(insurancePolicyId: any) {
 
    if (insurancePolicyId != undefined) {
      this.ShowLoader();
      this.closeDeleteModal = false;
      this.insurancePolicyFacade.deleteInsurancePolicy(insurancePolicyId).subscribe({
        next: () => {
          this.closeDeleteModal = true;
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            pageSize: this.insurancePolicyFacade.gridPageSizes[0]?.value,         
            sortColumn: 'creationTime',
            sortType: 'asc',
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy deleted successfully");
          this.HideLoader();
          this.ref.detectChanges();
          this.insurancePolicyFacade.triggerPriorityPopupSubject.next(true);
        },
        error: (error: any) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    }

  }

  removeInsurancePolicy(value: any) {
    if (value?.currentInsurancePolicyId != undefined) {
      this.ShowLoader();
      this.closeDeleteModal = false;
      this.insurancePolicyFacade.deleteInsurancePolicy(value?.currentInsurancePolicyId ,value?.endDate, this.isCerForm).subscribe({
        next: () => {
          this.closeDeleteModal = true;
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            pageSize: this.insurancePolicyFacade.gridPageSizes[0]?.value,         
            sortColumn: 'creationTime',
            sortType: 'asc',
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.ShowHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy removed successfully");
          this.HideLoader();
          this.insurancePolicyFacade.triggerPriorityPopupSubject.next(true);
          this.ref.detectChanges();
        },
        error: (error: any) => {
          this.ShowHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    }

  }

  private addSaveForLaterSubscription(): void {
    this.saveForLaterClickSubscription = this.workflowFacade.saveForLaterClicked$.subscribe((statusResponse: any) => {
      if (this.checkValidations()) {
        this.save().subscribe((response: any) => {
          if (response) {
            this.workflowFacade.saveForLaterCompleted(true)  
            this.loaderService.hide();  
          }
        })
      }
      else {
        this.workflowFacade.saveForLaterCompleted(true)  
      }
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

  private addHealthInsuranceStatusSubscription(): void {
    this.healthInsuranceStatusSubscription = this.medicalHealthPlans$.subscribe((res) => {
      if (res?.data?.length > 0) {
        this.isInsuranceAvailable = true;
        if (this.insuranceFlagForm.controls['currentInsuranceFlag'].value == 'Y') {
          this.insurancePolicyFacade.showInsuranceRequiredSubject.next(false);
        }
      }
      else {
        this.isInsuranceAvailable = false;
      }
    });
  }

  checkValidations() {
    this.validateForm();
    this.ref.detectChanges();
    return this.insuranceFlagForm.valid;
  }

  getPolicies(event:any){
    this.insurancePolicyFacade.getHealthInsurancePolicyPriorities(this.clientId, this.clientCaseEligibilityId, InsuranceStatusType.healthInsurance);
   }
   onProviderNameClick(event: any) {
    this.vendorId = event;
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation: {
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });
  }
  onCloseViewProviderDetailClicked(result: any) {
    if (result) {
      this.providerDetailsDialog.close();
    }
  }

  getProviderPanel(event: any) {
    this.financialVendorFacade.getProviderPanel(event);
  }

  updateProviderProfile(event: any) {
    this.financialVendorFacade.updateProviderPanel(event);
  }

  OnEditProviderProfileClick() {
    this.contactFacade.loadDdlStates();
    this.lovFacade.getPaymentMethodLov();
  }

}



