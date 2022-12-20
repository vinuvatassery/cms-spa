/** Angular **/
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
/** Facades **/
import { HealthInsuranceFacade, HealthInsurancePolicyFacade,healthInsurancePolicy } from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa'
import { FormGroup,FormBuilder, Validators } from '@angular/forms';
import { LovFacade } from '@cms/system-config/domain';
import { InsurancePlanFacade ,WorkflowFacade} from '@cms/case-management/domain';
import { ActivatedRoute } from '@angular/router';
import { Subscription,first } from 'rxjs';

@Component({
  selector: 'case-management-medical-premium-detail',
  templateUrl: './medical-premium-detail.component.html',
  styleUrls: ['./medical-premium-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumDetailComponent implements OnInit,OnChanges  {
 currentDate = new Date();
 public isaddNewInsuranceProviderOpen = false;
 public isaddNewInsurancePlanOpen = false;
 public formUiStyle : UIFormStyle = new UIFormStyle();
  /** Input properties **/
  @Input() dialogTitle!: string;
  @Input() insuranceType!: string;
  @Input() healthInsuranceForm: FormGroup;

  /** Output properties **/
  @Output() isCloseInsuranceModal = new EventEmitter();
  @Output() editRedirect = new EventEmitter<string>();

  /** Private properties **/
  private loadSessionSubscription!: Subscription;

  /** Public properties **/
  ddlMedicalHealthInsurancePlans$ =
  this.healthFacade.ddlMedicalHealthInsurancePlans$;

  insuranceTypeList$ = this.lovFacade.insuranceTypelov$;

  ddlMedicalHealthPlanMetalLevel$ =
    this.healthFacade.ddlMedicalHealthPlanMetalLevel$;
  ddlMedicalHealthPalnPremiumFrequecy$ =
    this.healthFacade.ddlMedicalHealthPalnPremiumFrequecy$;
  ddlInsuranceType!: string;
  isEditViewPopup!: boolean;
  isDeleteEnabled!: boolean;
  isSubmitted: boolean=false;
  isViewContentEditable!: boolean;
  isToggleNewPerson!: boolean;
  isOpenDdl = false;
  insurancePlans: Array<any> = [];
  healthInsurancePolicy!:healthInsurancePolicy;
  clientCaseId!: any;
  clientCaseEligibilityId!: any
  sessionId!: any;
  clientId!:any;

  /** Constructor **/
  constructor(private readonly healthFacade: HealthInsuranceFacade,
     private formBuilder: FormBuilder,
     private lovFacade: LovFacade,
     private insurancePlanFacade:InsurancePlanFacade,
     private insurancePolicyFacade: HealthInsurancePolicyFacade,
     private route: ActivatedRoute,
     private workflowFacade: WorkflowFacade) {
    this.healthInsuranceForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(): void {   
    this.validateFormMode();
    this.loadSessionData();
    this.loadLovs();
    this.loadDdlMedicalHealthInsurancePlans();
    this.loadDdlMedicalHealthPlanMetalLevel();
    this.loadDdlMedicalHealthPalnPremiumFrequecy();
    this.viewSelection();
  }
  ngOnChanges() {
  }
  ngOnDestroy(): void {
    this.loadSessionSubscription.unsubscribe();
  }
  /** Private methods **/
  private loadLovs(){
    this.lovFacade.getInsuranceTypeLovs()
  }
  private validateFormMode(){
    if(this.dialogTitle ==='Add'){
      this.resetForm();
      this.resetValidators();
    }

  }
  resetForm(){
    this.healthInsuranceForm.reset();
    this.healthInsuranceForm.updateValueAndValidity();
  }
  private loadDdlMedicalHealthInsurancePlans() {
    this.healthFacade.loadDdlMedicalHealthInsurancePlans();
  }
  private loadSessionData() {
    this.sessionId = this.route.snapshot.queryParams['sid'];
    this.workflowFacade.loadWorkFlowSessionData(this.sessionId)
    this.loadSessionSubscription = this.workflowFacade.sessionDataSubject$.pipe(first(sessionData => sessionData.sessionData != null))
      .subscribe((session: any) => {
        if (session !== null && session !== undefined && session.sessionData !== undefined) {
          this.clientCaseId = JSON.parse(session.sessionData).ClientCaseId;
          this.clientCaseEligibilityId = JSON.parse(session.sessionData).clientCaseEligibilityId;
          this.clientId = JSON.parse(session.sessionData).clientId; 
        }
      });

  }
  private loadDdlMedicalHealthPlanMetalLevel() {
    this.healthFacade.loadDdlMedicalHealthPlanMetalLevel();
  }

  private loadDdlMedicalHealthPalnPremiumFrequecy() {
    this.healthFacade.loadDdlMedicalHealthPalnPremiumFrequecy();
  }

  private viewSelection() {
    this.isToggleNewPerson = false;
    switch (this.dialogTitle) {
      case 'View':
        this.isEditViewPopup = true;
        this.conditionsInsideView();
        this.isViewContentEditable = true;
        break;
      case 'Add':
        this.isDeleteEnabled = false;
        this.isViewContentEditable = false;
        break;
      case 'Edit':
        this.conditionsInsideView();
        this.isDeleteEnabled = true;
        this.isViewContentEditable = false;
        break;
      default:
        break;
    }
  }

  private conditionsInsideView() {
    this.ddlInsuranceType = this.insuranceType;
    this.isOpenDdl = true;
  }
 
  private validateForm(){  
   const QualifiedHealthPlanRequiredFields:Array<string> = ['insuranceStartDate','insuranceEndDate','insuranceIdNumber','insuranceCarrierName','aptcFlag'];
      this.resetValidators();
      this.healthInsuranceForm.updateValueAndValidity(); 
      if(this.ddlInsuranceType ==='QUALIFIED_HEALTH_PLAN'){
        QualifiedHealthPlanRequiredFields.forEach((key:string) => {
          this.healthInsuranceForm.controls[key].setValidators([Validators.required]); 
          this.healthInsuranceForm.controls[key].updateValueAndValidity();
        });
        if(this.healthInsuranceForm.controls["aptcFlag"].value==='Y'){
          this.healthInsuranceForm.controls["aptcMonthlyAmt"].setValidators([Validators.required]);
          this.healthInsuranceForm.controls["aptcMonthlyAmt"].updateValueAndValidity();
        }
      } 
      if(this.ddlInsuranceType ==='COBRA'  || this.ddlInsuranceType ==='OFF_EXCHANGE_PLAN' )  { 
        this.healthInsuranceForm.controls["insuranceStartDate"].setValidators([Validators.required]); 
        this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();
    
        this.healthInsuranceForm.controls["insuranceEndDate"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();    
      
        this.healthInsuranceForm.controls["insuranceIdNumber"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();     

        this.healthInsuranceForm.controls["insuranceCarrierName"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
      
        this.healthInsuranceForm.controls["insurancePlanName"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["insurancePlanName"].updateValueAndValidity();

        // if(this.ddlInsuranceType ==='QUALIFIED_HEALTH_PLAN'){
        //   this.healthInsuranceForm.controls["aptcFlag"].setValidators([Validators.required]);
        //   this.healthInsuranceForm.controls["aptcFlag"].updateValueAndValidity();
        //   if(this.healthInsuranceForm.controls["aptcFlag"].value==='Y'){
        //     this.healthInsuranceForm.controls["aptcMonthlyAmt"].setValidators([Validators.required]);
        //     this.healthInsuranceForm.controls["aptcMonthlyAmt"].updateValueAndValidity();
        //   }
        // }
        


        
        
      }
      if(this.ddlInsuranceType ==='QUALIFIED_HEALTH_PLAN' || this.ddlInsuranceType ==='OFF_EXCHANGE_PLAN'){
        this.healthInsuranceForm.controls["metalLevel"].setValidators([Validators.required]);
        this.healthInsuranceForm.controls["metalLevel"].updateValueAndValidity();
      }
      
  }
  private resetValidators(){
    Object.keys(this.healthInsuranceForm.controls).forEach((key:string) => {
      this.healthInsuranceForm.controls[key].clearValidators(); 
    this.healthInsuranceForm.controls[key].updateValueAndValidity();
    });
    
    // this.healthInsuranceForm.controls["insuranceStartDate"].clearValidators(); 
    // this.healthInsuranceForm.controls["insuranceStartDate"].updateValueAndValidity();

    // this.healthInsuranceForm.controls["insuranceEndDate"].clearValidators();
    // this.healthInsuranceForm.controls["insuranceEndDate"].updateValueAndValidity();    
  
    // this.healthInsuranceForm.controls["insuranceIdNumber"].clearValidators();
    // this.healthInsuranceForm.controls["insuranceIdNumber"].updateValueAndValidity();     

    // this.healthInsuranceForm.controls["insuranceCarrierName"].clearValidators();
    // this.healthInsuranceForm.controls["insuranceCarrierName"].updateValueAndValidity();
  
    // this.healthInsuranceForm.controls["insurancePlanName"].clearValidators();
    // this.healthInsuranceForm.controls["insurancePlanName"].updateValueAndValidity();
  }
  
  private populateInsurancePolicy(){
    {
      this.healthInsurancePolicy = new healthInsurancePolicy();
      this.healthInsurancePolicy.clientId = this.clientId;
      this.healthInsurancePolicy.insuranceCarrierId=this.healthInsuranceForm.controls["insuranceCarrierName"].value;
      this.healthInsurancePolicy.clientCaseEligibilityId=this.clientCaseEligibilityId;
      this.healthInsurancePolicy.insurancePlanId=this.healthInsuranceForm.controls["insurancePlanName"].value;
      this.healthInsurancePolicy.clientMaximumId='C8D095E5-5C5B-44A3-A6BA-379282AC1BFF';
      this.healthInsurancePolicy.healthInsuranceTypeCode=this.ddlInsuranceType;
      this.healthInsurancePolicy.insuranceIdNbr=this.healthInsuranceForm.controls["insuranceIdNumber"].value;
      this.healthInsurancePolicy.insuranceGroupPlanTypeCode='P';
      this.healthInsurancePolicy.priorityCode='Y';
      this.healthInsurancePolicy.policyHolderFirstName= null;
      this.healthInsurancePolicy.policyHolderLastName= null;
      this.healthInsurancePolicy.metalLevelCode= this.healthInsuranceForm.controls["metalLevel"].value?.lovCode;
      this.healthInsurancePolicy.premiumAmt= 0,
      this.healthInsurancePolicy.startDate= new Date(this.healthInsuranceForm.controls["insuranceStartDate"].value);
      this.healthInsurancePolicy.endDate=new Date(this.healthInsuranceForm.controls["insuranceEndDate"].value);
      this.healthInsurancePolicy.careassistPayingPremiumFlag='Y';
      this.healthInsurancePolicy.premiumPaidThruDate=new Date();
      this.healthInsurancePolicy.premiumFrequencyCode='string';
      this.healthInsurancePolicy.nextPremiumDueDate=new Date();
      this.healthInsurancePolicy.paymentIdNbrSameAsInsuranceIdNbrFlag='Y';
      this.healthInsurancePolicy.paymentIdNbr='string';
      if(this.healthInsuranceForm.controls["aptcFlag"].value==='Y'){
        this.healthInsurancePolicy.aptcFlag='Y';
      }else{
        this.healthInsurancePolicy.aptcNotTakingFlag=this.healthInsuranceForm.controls["aptcFlag"].value;
      }
      
      
      this.healthInsurancePolicy.aptcMonthlyAmt= this.healthInsuranceForm.controls["aptcMonthlyAmt"].value,
      this.healthInsurancePolicy.othersCoveredOnPlanFlag='Y';
      this.healthInsurancePolicy.isClientPolicyHolderFlag='Y';
      this.healthInsurancePolicy.medicareBeneficiaryIdNbr='string';
      this.healthInsurancePolicy.medicareCoverageTypeCode='string';
      this.healthInsurancePolicy.medicarePartAStartDate=new Date();
      this.healthInsurancePolicy.medicarePartBStartDate=new Date();
      this.healthInsurancePolicy.onQmbFlag='Y';
      this.healthInsurancePolicy.onLisFlag='Y';
      this.healthInsurancePolicy.paymentGroupNumber= 0,
      this.healthInsurancePolicy.insuranceFirstName='string';
      this.healthInsurancePolicy.insuranceLastName='string';
      this.healthInsurancePolicy.oonException= 0,
      this.healthInsurancePolicy.oonStartDate=new Date();
      this.healthInsurancePolicy.oonEndDate=new Date();
      this.healthInsurancePolicy.oonPharmacy='string';
      this.healthInsurancePolicy.oonDrugs='string';
      this.healthInsurancePolicy.concurrencyStamp='string';
      this.healthInsurancePolicy.activeFlag='Y'
    }

  }
  /** Internal event methods **/
  onHealthInsuranceTypeChanged() {
    this.ddlInsuranceType = this.healthInsuranceForm.controls['insuranceType'].value ;
    this.isOpenDdl = true;
  }

  onModalCloseClicked() {
    this.isCloseInsuranceModal.emit();
  }
  onRedirectModalClicked() {
    this.isViewContentEditable = false;
    this.isEditViewPopup = false;
    this.isDeleteEnabled = true;
    this.editRedirect.emit('edit');
  }
  onToggleNewPersonClicked() {
    this.isToggleNewPerson = !this.isToggleNewPerson;
  }



  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.isaddNewInsuranceProviderOpen = true;
  }

  public addNewInsurancePlanClose(): void {
    this.isaddNewInsurancePlanOpen = false;
  }

  public addNewInsurancePlanOpen(): void {
    this.isaddNewInsurancePlanOpen = true;
  }
  insuranceCarrierNameChange(value:string){
    this.insurancePlanFacade.loadInsurancePlanByProviderId(value).subscribe((data:any) => {
      this.insurancePlans=[];
      if (!Array.isArray(data)) return;
      this.insurancePlans=data;
    });
  }
  save(){
    this.isSubmitted=true;
    this.validateForm();
    if(this.healthInsuranceForm.valid){
       //this.insurancePolicy.saveHealthInsurancePolicy()
       this.populateInsurancePolicy();
       this.insurancePolicyFacade.saveHealthInsurancePolicy(this.healthInsurancePolicy).subscribe(data=>{
        this.onModalCloseClicked();
       })
    }
  }
}
