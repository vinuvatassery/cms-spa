/** Angular **/
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  PaymentRequest,
  HealthInsurancePolicyFacade,
  VendorFacade,
  InsuranceStatusType,
  InsurancePlanFacade,
  ClientProfileTabs,
  StatusFlag
} from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'case-management-medical-premium-payment-detail',
  templateUrl: './medical-premium-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle(); 
  isPremiumPaymentAddForm = true;
  @Input() premiumPaymentForm: FormGroup; 
  @Input() caseEligibilityId: any;
  @Input() clientId:any;
  @Input() tabStatus:any;
  paymentRequest !: PaymentRequest;
  paymentRequestType$= this.lovFacade.premiumPaymentType$;
  paymentReversal$= this.lovFacade.premiumPaymentReversal$;
  isVendorLoading$ =this.vendorFacade.isVendorLoading$;
  carrierNames$ = this.vendorFacade.paymentRequestVendors$;
  isPlanLoading:boolean =false;
  isInsurancePoliciesLoading:boolean =false;
  insurancePlanList!: any;
  insurancePoliciesList!: any;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
    /** Constructor **/
    constructor(
      private formBuilder: FormBuilder,
      private lovFacade: LovFacade,
      private changeDetector: ChangeDetectorRef,
      public intl: IntlService,
      public readonly clientDocumentFacade: ClientDocumentFacade,
      private readonly insurancePolicyFacade: HealthInsurancePolicyFacade,
      private readonly vendorFacade: VendorFacade,
      private insurancePlanFacade: InsurancePlanFacade,
    ) {
      this.premiumPaymentForm = this.formBuilder.group({});
    }

    ngOnInit(){
      if(this.tabStatus==ClientProfileTabs.HEALTH_INSURANCE_PREMIUM_PAYMENTS){
        this.loadServiceProviderName(InsuranceStatusType.healthInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
      }
      else{
        this.loadServiceProviderName(InsuranceStatusType.dentalInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
      }
    }
    
    savePaymentDetailsClicked(){
      this.validateForm(); 
      if (this.premiumPaymentForm.valid) {
        this.populatePaymentRequest();
        this.insurancePolicyFacade.savePaymentRequest(this.paymentRequest).subscribe({
          next: () => {                       
            
          },
          error: (error: any) => {
            //this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
          }
        })
      }
    };
    resetForm() {
      this.premiumPaymentForm.reset();
      this.premiumPaymentForm.updateValueAndValidity();
    }
  
    validateForm(){
      this.premiumPaymentForm.markAllAsTouched();
      this.premiumPaymentForm.controls['serviceProviderName'].setValidators([  Validators.required,  ]); 
      this.premiumPaymentForm.controls['premiumAmount'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['type'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['reversal'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['coverageStartDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['coverageEndDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['entryDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['serviceDescription'].setValidators([  Validators.required,  ]);
      //this.premiumPaymentForm.controls['checkMailDate'].setValidators([  Validators.required,  ]);
      this.premiumPaymentForm.controls['comment'].setValidators([  Validators.required,  ]);

      this.premiumPaymentForm.controls['serviceProviderName'].updateValueAndValidity(); 
      this.premiumPaymentForm.controls['premiumAmount'].updateValueAndValidity();
      this.premiumPaymentForm.controls['type'].updateValueAndValidity();
      this.premiumPaymentForm.controls['reversal'].updateValueAndValidity();
      this.premiumPaymentForm.controls['coverageStartDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['coverageEndDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['entryDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['serviceDescription'].updateValueAndValidity();
      //this.premiumPaymentForm.controls['checkMailDate'].updateValueAndValidity();
      this.premiumPaymentForm.controls['comment'].updateValueAndValidity();
    }
     populatePaymentRequest(){
      this.paymentRequest = new PaymentRequest()
      this.paymentRequest.clientId= this.clientId;
      this.paymentRequest.paymentTypeCode =  this.premiumPaymentForm.controls['type'].value;
      this.paymentRequest.amountRequested = this.premiumPaymentForm.controls['premiumAmount'].value;
     }
    loadPremiumPaymentDetails(){
    // this.bindValues(data);
    }

    bindValues(premiumPaymentDetails: any) {
      this.premiumPaymentForm.controls['serviceProviderName'].setValue(premiumPaymentDetails.serviceProviderName);
      this.premiumPaymentForm.controls['premiumAmount'].setValue(premiumPaymentDetails.paymentAmount); 
      this.premiumPaymentForm.controls['type'].setValue(premiumPaymentDetails.type); 
      this.premiumPaymentForm.controls['reversal'].setValue(premiumPaymentDetails.reversal); 
      this.premiumPaymentForm.controls['coverageStartDate'].setValue(premiumPaymentDetails.coverageStartDate != null ? new Date(premiumPaymentDetails.coverageStartDate) : null);
      this.premiumPaymentForm.controls['coverageEndDate'].setValue(premiumPaymentDetails.coverageEndDate != null ? new Date(premiumPaymentDetails.coverageEndDate) : null  );
      this.premiumPaymentForm.controls['entryDate'].setValue(  premiumPaymentDetails.entryDate != null ? new Date(premiumPaymentDetails.entryDate) : null );
      this.premiumPaymentForm.controls['serviceDescription'].setValue(premiumPaymentDetails.serviceDescription);
      this.premiumPaymentForm.controls['checkMailDate'].setValue(premiumPaymentDetails.checkMailDate != null ? new Date(premiumPaymentDetails.checkMailDate) : null);
      this.premiumPaymentForm.controls['comment'].setValue(premiumPaymentDetails.comment);
    }

    private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
      this.vendorFacade.loadPaymentRequestVendors(type,vendorType,clientId,clientCaseligibilityId);
    }

    public serviceProviderNameChange(value: string): void {
      //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
      if(value){
        this.isPlanLoading=true;
        this.insurancePlanFacade.loadInsurancePlanByProviderId(value).subscribe({
          next: (data: any) => {
            this.insurancePlanList=data;
            this.isPlanLoading=false;
            this.changeDetector.detectChanges();
          },
          error: (err) => {
            this.isPlanLoading=false;
            this.changeDetector.detectChanges();
            this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          }
        });
      }
    }

    public insurancePlanNameChange(value: string): void {
      //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
      if(value){
        this.isInsurancePoliciesLoading=true;
        this.insurancePolicyFacade.loadInsurancePoliciesByPlanId(value,this.clientId,this.caseEligibilityId,(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_PREMIUM_PAYMENTS) ?  ClientProfileTabs.DENTAL_INSURANCE_STATUS: ClientProfileTabs.HEALTH_INSURANCE_STATUS  ).subscribe({
          next: (data: any) => {
            data.forEach((policy:any)=>{
              policy["policyValueField"]=policy.insuranceCarrierName+ " - " + policy.insurancePlanName;
            });
            this.insurancePoliciesList=data;
            this.isInsurancePoliciesLoading=false;
            this.changeDetector.detectChanges();
          },
          error: (err) => {
            this.isInsurancePoliciesLoading=false;
            this.changeDetector.detectChanges();
            this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
          }
        });
      }
    }
}
