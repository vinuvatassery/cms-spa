/** Angular **/
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild,  TemplateRef, } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientProfileTabs, HealthInsurancePolicyFacade, ClientFacade, GridFilterParam, FinancialVendorFacade, ContactFacade } from '@cms/case-management/domain';
import { filter, Subject, Subscription } from 'rxjs';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LovFacade } from '@cms/system-config/domain';


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
    private readonly ref: ChangeDetectorRef,
    private readonly clientFacade: ClientFacade,
    private dialogService: DialogService,    
    private readonly financialVendorFacade: FinancialVendorFacade,
    public contactFacade: ContactFacade,
    public lovFacade: LovFacade,
  ) { }

  tabChangeSubscription$ = new Subscription();
  tabIdSubject = new Subject<string>();
  tabId$ = this.tabIdSubject.asObservable();
  profileClientId!: number;
  clientCaseEligibilityId!: any;
  clientCaseId!: any;
  healthInsuranceForm!: FormGroup;
  copayPaymentForm!: FormGroup;
  tabId! : any
  clientId: any;
  triggerPriorityPopup$ = this.insurancePolicyFacade.triggerPriorityPopup$;
  closeDeleteModal: boolean = false;
  isHistoricalDataLoad:boolean = false;
  healthInsuranceProfilePhoto$ = this.insurancePolicyFacade.healthInsuranceProfilePhotoSubject;
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$;
  updateProviderPanelSubject$ =
  this.financialVendorFacade.updateProviderPanelSubject$;
  @ViewChild('providerDetailsTemplate', { read: TemplateRef })
  providerDetailsTemplate!: TemplateRef<any>;
  vendorId: any;
  providerDetailsDialog: any;

  ngOnInit(): void {
    this.routeChangeSubscription();
    this.loadQueryParams()
    this.buildForm();
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
      insuranceVendorAddressId:[''],
      vendorAddressId:[''],
      insuranceTypeCode:[''],

    });

  }

  ngOnDestroy(): void {
    this.tabChangeSubscription$.unsubscribe();
  }

  loadHealthInsuranceHandle(gridDataRefinerValue: any): void {
    let typeParam ={type:'INSURANCEDEPENDENTS',insuranceStatusType:this.tabId};
    const gridFilterParam = new GridFilterParam(gridDataRefinerValue.skipCount, gridDataRefinerValue.pageSize, gridDataRefinerValue.sortColumn, gridDataRefinerValue.sortType, JSON.stringify(gridDataRefinerValue.filter));   
    if(gridDataRefinerValue?.loadHistoricalData !== undefined){
      this.isHistoricalDataLoad = gridDataRefinerValue.loadHistoricalData;
    }
    this.insurancePolicyFacade.loadMedicalHealthPlans(
      this.clientId,
      this.clientCaseEligibilityId,
      typeParam,
      this.isHistoricalDataLoad,
      gridFilterParam
    );
  }

  deleteInsurancePolicy(insurancePolicyId: any, priority:any = null) {
    if (insurancePolicyId != undefined) {
      this.loaderService.show();
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
          this.clientFacade.runImportedClaimRules(this.clientId);
          this.loadHealthInsuranceHandle(gridDataRefinerValue);
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Insurance policy deleted successfully");
          this.loaderService.hide();
          this.ref.detectChanges();
          this.insurancePolicyFacade.triggerPriorityPopupSubject.next(true);
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
      pageSize: this.insurancePolicyFacade.gridPageSizes[0]?.value,
      sortColumn: 'creationTime',
      sortType: 'asc',
      loadHistoricalData:isLoadHistoricalData
    };
    this.loadHealthInsuranceHandle(gridDataRefinerValue);
  }

  loadCopayEventHandle(gridDataRefinerValue: any) {
    this.insurancePolicyFacade.loadCoPaysAndDeductibles(this.clientId, this.clientCaseId, this.clientCaseEligibilityId, gridDataRefinerValue);
  }
  loadPremiumPaymentEventHandle(gridDataRefinerValue: any) {
    this.insurancePolicyFacade.loadPremiumPayments(this.clientId, this.clientCaseId, this.clientCaseEligibilityId, gridDataRefinerValue);
  }
  
  getPolicies(event:any){
    this.insurancePolicyFacade.getHealthInsurancePolicyPriorities(this.clientId, this.clientCaseEligibilityId,this.tabId);
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


