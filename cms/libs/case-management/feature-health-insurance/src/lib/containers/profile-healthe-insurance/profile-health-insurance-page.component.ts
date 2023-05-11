/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientProfileTabs, HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';


@Component({
  selector: 'case-management-profile-health-insurance-page',
  templateUrl: './profile-health-insurance-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHealthInsurancePageComponent implements OnInit,OnDestroy {

  constructor(
    private route: ActivatedRoute,  
    private readonly router: Router,
    private formBuilder: FormBuilder,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly loaderService: LoaderService,
    private readonly ref: ChangeDetectorRef
  ) { }

  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  healthInsuranceForm!: FormGroup;
  copayPaymentForm!: FormGroup;
  premiumPaymentForm!: FormGroup;
  tabId! : any
  clientId: any;
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  closeDeleteModal: boolean = false;
  isHistoricalDataLoad:boolean = false;

  ngOnInit(): void {  
    this.routeChangeSubscription();
    this.loadQueryParams()
    this.buildForm();
    this.buildCopayPaymentForm();
    this.buildPremiumPaymentForm();
  }

  /** Private properties **/
  get clientProfileTabs(): typeof ClientProfileTabs {
    return ClientProfileTabs;
  }
  loadQueryParams()
  {    
    this.clientId = this.route.snapshot.queryParams['id'];
    this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id'];
    this.clientCaseId = this.route.snapshot.queryParams['cid'];  
    this.tabId = this.route.snapshot.queryParams['tid']; 
    this.tabIdSubject.next(this.tabId);
    this.isHistoricalDataLoad = false;
  }

  private routeChangeSubscription() {
    this.tabChangeSubscription$ = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {    
          this.loadQueryParams()  
      });
  }

   /** Private Methods **/
   private buildForm() {
    this.healthInsuranceForm = this.formBuilder.group({
      clientInsurancePolicyId: [''],
      insuranceType: [''],
      insuranceStartDate: [''],
      insuranceEndDate: [''],
      insuranceIdNumber: [''],
      insuranceCarrierName: [''],
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
      medicareBeneficiaryIdNbr: [''],
      medicareCoverageTypeCode: [''],
      medicarePartAStartDate: [''],
      medicarePartBStartDate: [''],
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
      copyOfSummary: ['']
    });

  }
  private buildCopayPaymentForm() {
    this.copayPaymentForm = this.formBuilder.group({
      serviceProviderName: [''],
      serviceDescription: [''],
      insurancePlanId: [''],
      insurancePolicyId: [''],
      paymentAmount: [''],
      type: [''],
      serviceStartDate: [''],
      serviceEndDate: [''],
      entryDate: [''],
      comment: [''],
    });
  }

  buildPremiumPaymentForm(){
    this.premiumPaymentForm = this.formBuilder.group({
      serviceProviderName: [''],
      serviceDescription: [''],
      insurancePlanId: [''],
      insurancePolicyId: [''],
      premiumAmount: [''],
      type: [''],
      reversal: [''],
      coverageStartDate: [''],
      coverageEndDate: [''],
      entryDate: [''],
      comment: [''],
    });
  }
  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }
 
  loadHealthInsuranceHandle(gridDataRefinerValue: any): void {
    let typeParam ={type:'INSURANCEDEPENDENTS',insuranceStatusType:this.tabId};
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sortColumn: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    this.insurancePolicyFacade.loadMedicalHealthPlans(
      this.clientId,
      this.isHistoricalDataLoad? null: this.clientCaseEligibilityId,
      typeParam,
      gridDataRefiner.skipcount,
      gridDataRefiner.maxResultCount,
      gridDataRefiner.sortColumn,
      gridDataRefiner.sortType
    );
  }
  deleteInsurancePolicy(insurancePolicyId: any) {
    if (insurancePolicyId != undefined) {
      this.loaderService.show();
      this.closeDeleteModal = false;
      this.insurancePolicyFacade.deleteInsurancePolicy(insurancePolicyId).subscribe({
        next: () => {
          this.closeDeleteModal = true;
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            pagesize: this.insurancePolicyFacade.gridPageSizes[0]?.value,
            sortColumn: 'creationTime',
            sortType: 'asc',
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy deleted successfully");
          this.loaderService.hide();
          this.ref.detectChanges();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    }

  }
  copyInsurancePolicy(insurancePolicyId: any) {
    if (insurancePolicyId != undefined) {
      this.loaderService.show();
      this.closeDeleteModal = false;
      this.insurancePolicyFacade.copyInsurancePolicy(insurancePolicyId).subscribe({
        next: () => {
          this.closeDeleteModal = true;
          const gridDataRefinerValue = {
            skipCount: this.insurancePolicyFacade.skipCount,
            pagesize: this.insurancePolicyFacade.gridPageSizes[0]?.value,
            sortColumn: 'creationTime',
            sortType: 'asc',
          };
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy copied successfully");
          this.loaderService.hide();
          this.ref.detectChanges();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    }
  }
  loadHistoricalData(isLoadHistoricalData:boolean){
    this.isHistoricalDataLoad =isLoadHistoricalData;
    const gridDataRefinerValue = {
      skipCount: this.insurancePolicyFacade.skipCount,
      pagesize: this.insurancePolicyFacade.gridPageSizes[0]?.value,
      sortColumn: 'creationTime',
      sortType: 'asc',
    };
    this.loadHealthInsuranceHandle(gridDataRefinerValue);
  }

  loadCopayEventHandle(gridDataRefinerValue: any) {
    this.insurancePolicyFacade.loadCoPaysAndDeductibles(this.clientId, this.clientCaseId, this.clientCaseEligibilityId, gridDataRefinerValue);
  }
  loadPremiumPaymentEventHandle(gridDataRefinerValue: any) {
    this.insurancePolicyFacade.loadPremiumPayments(this.clientId, this.clientCaseId, this.clientCaseEligibilityId, gridDataRefinerValue);
  }
}


