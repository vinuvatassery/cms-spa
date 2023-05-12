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
  premiumPaymentForm!: FormGroup;
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;
  paymentRequest !: PaymentRequest;
  paymentRequestType$ = this.lovFacade.premiumPaymentType$;
  paymentReversal$ = this.lovFacade.premiumPaymentReversal$;
  monthOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
  };
  yearOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
  };
  isVendorLoading$ = this.vendorFacade.isVendorLoading$;
  carrierNames$ = this.vendorFacade.paymentRequestVendors$;
  isPlanLoading: boolean = false;
  isInsurancePoliciesLoading: boolean = false;
  insurancePlanList!: any;
  insurancePoliciesList!: any;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };    /** Constructor **/
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

  ngOnInit(): void {
    let monthFromDate = this.getDay(new Date(), 'en-US', this.monthOptions);
    let yearFromDate = this.getDay(new Date(), 'en-US', this.yearOptions);
    this.buildPremiumPaymentForm();
    if (this.tabStatus == ClientProfileTabs.HEALTH_INSURANCE_PREMIUM_PAYMENTS) {
      this.loadServiceProviderName(InsuranceStatusType.healthInsurance, 'VENDOR_PAYMENT_REQUEST', this.clientId, this.caseEligibilityId);
    }
    else {
      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance, 'VENDOR_PAYMENT_REQUEST', this.clientId, this.caseEligibilityId);
    }
  }

  private getDay(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
  }

  savePaymentDetailsClicked() {
    //this.validateForm();
    //if (this.premiumPaymentForm.valid) {
      //this.populatePaymentRequest();
      let premiumPaymentData=this.premiumPaymentForm.value;
      premiumPaymentData["txtDate"]=new Date();;
      premiumPaymentData["clientId"] = this.clientId;
      premiumPaymentData["clientCaseEligibilityId"] = this.caseEligibilityId;
      this.insurancePolicyFacade.showLoader();
      this.insurancePolicyFacade.savePaymentRequest(premiumPaymentData).subscribe({
        next: () => {
          this.insurancePolicyFacade.hideLoader();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    //}
  }
  resetForm() {
    this.premiumPaymentForm.reset();
    this.premiumPaymentForm.updateValueAndValidity();
  }

  // validateForm() {
  //   this.premiumPaymentForm.markAllAsTouched();
  //   this.premiumPaymentForm.controls['vendorId'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['premiumAmount'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['type'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['reversal'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['serviceEndDate'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['entryDate'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['serviceDescription'].setValidators([Validators.required,]);
  //   this.premiumPaymentForm.controls['comment'].setValidators([Validators.required,]);

  //   this.premiumPaymentForm.controls['vendorId'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['premiumAmount'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['type'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['reversal'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['serviceEndDate'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['entryDate'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['serviceDescription'].updateValueAndValidity();
  //   this.premiumPaymentForm.controls['comments'].updateValueAndValidity();
  // }
  populatePaymentRequest() {
    this.paymentRequest = new PaymentRequest()
    this.paymentRequest.clientId = this.clientId;
    this.paymentRequest.paymentTypeCode = this.premiumPaymentForm.controls['type'].value;
    this.paymentRequest.amountRequested = this.premiumPaymentForm.controls['premiumAmount'].value;
  }

  private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.vendorFacade.loadPaymentRequestVendors(type, vendorType, clientId, clientCaseligibilityId);
  }

  public serviceProviderNameChange(value: string): void {
    //this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    if (value) {
      this.isInsurancePoliciesLoading = true;
      this.insurancePolicyFacade.loadInsurancePoliciesByProviderId(value, this.clientId, this.caseEligibilityId, (this.tabStatus == ClientProfileTabs.DENTAL_INSURANCE_PREMIUM_PAYMENTS) ? ClientProfileTabs.DENTAL_INSURANCE_STATUS : ClientProfileTabs.HEALTH_INSURANCE_STATUS).subscribe({
        next: (data: any) => {
          data.forEach((policy: any) => {
            policy["policyValueField"] = policy.insuranceCarrierName + " - " + policy.insurancePlanName;
          });
          this.insurancePoliciesList = data;
          this.isInsurancePoliciesLoading = false;
          this.changeDetector.detectChanges();
        },
        error: (err) => {
          this.isInsurancePoliciesLoading = false;
          this.changeDetector.detectChanges();
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
    }
  }


  setPremiumPaymentForm() {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.premiumPaymentForm.controls['serviceStartDate'].setValue(firstDay);
    this.premiumPaymentForm.controls['serviceEndDate'].setValue(lastDay);
    this.premiumPaymentForm.controls['serviceTypeCode'].setValue('INSURANCE_PREMIUM');
    this.premiumPaymentForm.controls['serviceDescription'].setValue('Insurance Premium');
    this.premiumPaymentForm.controls['entryDate'].setValue(date);
    this.premiumPaymentForm.controls['entryDate'].disable();
    this.premiumPaymentForm.controls['serviceDescription'].disable();

  }

  buildPremiumPaymentForm(){
    this.premiumPaymentForm = this.formBuilder.group({
      vendorId: [''],
      clientInsurancePolicyId: [''],
      serviceDescription: [''],
      serviceTypeCode: [''],
      amountRequested: [''],
      paymentTypeCode: [''],
      reversalTypeCode: [''],
      serviceStartDate: [''],
      serviceEndDate: [''],
      entryDate: [''],
      comments: [''],
    });
    
    this.setPremiumPaymentForm();
  }
}
