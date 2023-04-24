/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientProfileTabs, HealthInsurancePolicyFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';
import { LoaderService, LoggingService, NotificationSnackbarService, SnackBarNotificationType } from '@cms/shared/util-core';


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
  tabId! : any
  clientId: any;
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  closeDeleteModal: boolean = false;

  ngOnInit(): void {  
    this.routeChangeSubscription();
    this.loadQueryParams()
    this.buildForm();
    //this.getQueryParam();
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
    const gridDataRefinerValue = {
      skipCount: this.insurancePolicyFacade.skipCount,
      pagesize: this.insurancePolicyFacade.gridPageSizes[0]?.value,
      sortColumn: 'creationTime',
      sortType: 'asc',
    };
    this.loadHealthInsuranceHandle(gridDataRefinerValue);
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
  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }
  // getQueryParam() {
  //   this.clientId = this.route.snapshot.queryParams['id']; 
  //   this.clientCaseId = this.route.snapshot.queryParams['cid']; 
  //   this.clientCaseEligibilityId = this.route.snapshot.queryParams['e_id']; 
  // }
  loadHealthInsuranceHandle(gridDataRefinerValue: any): void {
    debugger;
    const gridDataRefiner = {
      skipcount: gridDataRefinerValue.skipCount,
      maxResultCount: gridDataRefinerValue.pagesize,
      sortColumn: gridDataRefinerValue.sortColumn,
      sortType: gridDataRefinerValue.sortType,
    };
    this.insurancePolicyFacade.loadMedicalHealthPlans(
      this.clientId,
      this.clientCaseEligibilityId,
      'INSURANCEDEPENDENTS',
      this.tabId,
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
    debugger
  }
}



