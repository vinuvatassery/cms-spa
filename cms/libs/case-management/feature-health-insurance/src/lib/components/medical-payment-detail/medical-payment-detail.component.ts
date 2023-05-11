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
  HealthInsurancePolicyFacade,
  HealthInsurancePolicy,
  CarrierContactInfo,
  InsurancePlanFacade,
  StatusFlag,
  HealthInsurancePlan,
  DependentTypeCode,
  PriorityCode,
  InsuranceStatusType,
  VendorFacade,
  ClientProfileTabs
} from '@cms/case-management/domain';
import { UIFormStyle, UploadFileRistrictionOptions } from '@cms/shared/ui-tpa';
import { Lov, LovFacade, LovType } from '@cms/system-config/domain';
import { Subscription } from 'rxjs';
import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'case-management-medical-payment-detail',
  templateUrl: './medical-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isPaymentAddForm = true;
  @Input() copayPaymentForm: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  paymentReversal$ = this.lovFacade.paymentReversal$;

  isLoading$ = this.vendorFacade.isVendorLoading$;
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
    private configurationProvider: ConfigurationProvider,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly loggingService: LoggingService,
    private readonly snackbarService: NotificationSnackbarService,
    private readonly vendorFacade: VendorFacade,
    private readonly insurancePolicyFacade: HealthInsurancePolicyFacade,
    private insurancePlanFacade: InsurancePlanFacade,
  ) {
    this.copayPaymentForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(){
    if(this.tabStatus=='hlt-ins-co-pay'){
      this.loadServiceProviderName(InsuranceStatusType.healthInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
    else{
      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
  }

  savePaymentDetailsClicked() {
    this.copayPaymentForm.markAllAsTouched();
    this.copayPaymentForm.controls['serviceProviderName'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['paymentAmount'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['type'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceEndDate'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['entryDate'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceDescription'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['comment'].setValidators([Validators.required,]);

    this.copayPaymentForm.controls['serviceProviderName'].updateValueAndValidity();
    this.copayPaymentForm.controls['paymentAmount'].updateValueAndValidity();
    this.copayPaymentForm.controls['type'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceEndDate'].updateValueAndValidity();
    this.copayPaymentForm.controls['entryDate'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceDescription'].updateValueAndValidity();
    this.copayPaymentForm.controls['comment'].updateValueAndValidity();


    if (this.copayPaymentForm.valid) {
      alert("success");
      console.log("teaette", this.copayPaymentForm);
    } else {
      alert("fail")
    }
  };
  resetForm() {
    this.copayPaymentForm.reset();
    this.copayPaymentForm.updateValueAndValidity();
  }


  loadCopayPaymentDetails() {
    // this.bindValues(data);
  }

  bindValues(copayPaymentDetails: any) {
    this.copayPaymentForm.controls['serviceProviderName'].setValue(copayPaymentDetails.serviceProviderName);
    this.copayPaymentForm.controls['paymentAmount'].setValue(copayPaymentDetails.paymentAmount);
    this.copayPaymentForm.controls['type'].setValue(copayPaymentDetails.type);
    this.copayPaymentForm.controls['reversal'].setValue(copayPaymentDetails.reversal);
    this.copayPaymentForm.controls['coverageStartDate'].setValue(copayPaymentDetails.coverageStartDate != null ? new Date(copayPaymentDetails.coverageStartDate) : null);
    this.copayPaymentForm.controls['coverageEndDate'].setValue(copayPaymentDetails.coverageEndDate != null ? new Date(copayPaymentDetails.coverageEndDate) : null);
    this.copayPaymentForm.controls['entryDate'].setValue(copayPaymentDetails.entryDate != null ? new Date(copayPaymentDetails.entryDate) : null);
    this.copayPaymentForm.controls['serviceDescription'].setValue(copayPaymentDetails.serviceDescription);
    this.copayPaymentForm.controls['checkMailDate'].setValue(copayPaymentDetails.checkMailDate != null ? new Date(copayPaymentDetails.checkMailDate) : null);
    this.copayPaymentForm.controls['comment'].setValue(copayPaymentDetails.comment);
  }

  private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.vendorFacade.loadPaymentRequestVendors(type, vendorType, clientId, clientCaseligibilityId);
  }

  public serviceProviderNameChange(value: string): void {
    //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    if(value){
      this.isPlanLoading=true;
      this.insurancePlanFacade.loadInsurancePlanByProviderId(value).subscribe({
        next: (data: any) => {
          this.insurancePlanList=data;
          this.isPlanLoading=false;
        },
        error: (err) => {
          this.isPlanLoading=false;
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
    }
  }

  public insurancePlanNameChange(value: string): void {
    //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    if(value){
      this.isInsurancePoliciesLoading=true;
      this.insurancePolicyFacade.loadInsurancePoliciesByPlanId(value,this.clientId,this.caseEligibilityId,(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_COPAY) ?  ClientProfileTabs.DENTAL_INSURANCE_STATUS: ClientProfileTabs.HEALTH_INSURANCE_STATUS  ).subscribe({
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
