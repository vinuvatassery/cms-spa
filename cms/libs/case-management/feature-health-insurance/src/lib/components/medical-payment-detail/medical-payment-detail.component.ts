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
  copayPaymentForm!: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  paymentRequestType$ = this.lovFacade.paymentRequestType$;

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
    this.buildCoPaymentForm();
    if(this.tabStatus=='hlt-ins-co-pay'){
      this.loadServiceProviderName(InsuranceStatusType.healthInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
    else{
      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
  }

  // savePaymentDetailsClicked() {
  //   this.copayPaymentForm.markAllAsTouched();
  //   this.copayPaymentForm.controls['serviceProviderName'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['paymentAmount'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['type'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['serviceEndDate'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['entryDate'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['serviceDescription'].setValidators([Validators.required,]);
  //   this.copayPaymentForm.controls['comment'].setValidators([Validators.required,]);

  //   this.copayPaymentForm.controls['serviceProviderName'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['paymentAmount'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['type'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['serviceEndDate'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['entryDate'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['serviceDescription'].updateValueAndValidity();
  //   this.copayPaymentForm.controls['comment'].updateValueAndValidity();


  //   if (this.copayPaymentForm.valid) {
  //     alert("success");
  //     console.log("teaette", this.copayPaymentForm);
  //   } else {
  //     alert("fail")
  //   }
  // };
  resetForm() {
    this.copayPaymentForm.reset();
    this.copayPaymentForm.updateValueAndValidity();
  }

  private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.vendorFacade.loadPaymentRequestVendors(type, vendorType, clientId, clientCaseligibilityId);
  }

  public serviceProviderNameChange(value: string): void {
    //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    if(value){
      this.isInsurancePoliciesLoading=true;
      this.insurancePolicyFacade.loadInsurancePoliciesByProviderId(value,this.clientId,this.caseEligibilityId,(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_COPAY) ?  ClientProfileTabs.DENTAL_INSURANCE_STATUS: ClientProfileTabs.HEALTH_INSURANCE_STATUS  ).subscribe({
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

  setCoPaymentForm() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.copayPaymentForm.controls['serviceStartDate'].setValue(firstDay);
    this.copayPaymentForm.controls['serviceEndDate'].setValue(lastDay);
    this.copayPaymentForm.controls['serviceTypeCode'].setValue('TPA');
    this.copayPaymentForm.controls['serviceDescription'].setValue('TPA');
    this.copayPaymentForm.controls['entryDate'].setValue(date);
    this.copayPaymentForm.controls['entryDate'].disable();
    this.copayPaymentForm.controls['serviceDescription'].disable();

  }

  buildCoPaymentForm(){
    this.copayPaymentForm = this.formBuilder.group({
      vendorId: [''],
      clientInsurancePolicyId: [''],
      serviceDescription: [''],
      serviceTypeCode: [''],
      amountRequested: [''],
      paymentTypeCode: [''],
      serviceStartDate: [''],
      serviceEndDate: [''],
      entryDate: [''],
      comments: [''],
    });
    
    this.setCoPaymentForm();
  }

  savePaymentDetailsClicked() {
    //this.validateForm();
    //if (this.premiumPaymentForm.valid) {
      //this.populatePaymentRequest();
      let coPaymentData=this.copayPaymentForm.value;
      coPaymentData["txtDate"]=new Date();
      coPaymentData["clientId"] = this.clientId;
      coPaymentData["clientCaseEligibilityId"] = this.caseEligibilityId;
      this.insurancePolicyFacade.showLoader();
      this.insurancePolicyFacade.savePaymentRequest(coPaymentData).subscribe({
        next: () => {
          this.insurancePolicyFacade.hideLoader();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    //}
  }
}
