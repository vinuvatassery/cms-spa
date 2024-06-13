/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,EventEmitter,Output, ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  PaymentRequest,
  HealthInsurancePolicyFacade,
  VendorFacade,
  InsuranceStatusType,
  ClientProfileTabs,
  EntityTypeCode,
  ServiceSubTypeCode
} from '@cms/case-management/domain';
import { SnackBarNotificationType, ConfigurationProvider } from '@cms/shared/util-core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
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

  @Output() closePremiumPaymentEvent = new EventEmitter();
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
  commentCharactersCount!: number;
  commentCounter!: string;
  commentMaxLength = 300;
  commentNote = '';
  serviceSubTypeCode !:any;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  statusEndDateIsGreaterThanStartDate: boolean = true;
  startDateIsFutureDate: boolean = false;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  public min: Date = new Date(1917, 0, 1);
  public maxDate = new Date(9999,12,31);
  public serviceStartDateValidator =true;
  public coverageEndDateValidator =true;
  /** Constructor **/
  constructor(
    private formBuilder: FormBuilder,
    private lovFacade: LovFacade,
    private changeDetector: ChangeDetectorRef,
    public intl: IntlService,
    public readonly clientDocumentFacade: ClientDocumentFacade,
    private readonly insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly vendorFacade: VendorFacade,
    private configurationProvider: ConfigurationProvider,
    private readonly elementRef: ElementRef,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.premiumPaymentForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.buildPremiumPaymentForm();
    this.commentCounterInitiation();
    if (this.tabStatus == ClientProfileTabs.HEALTH_INSURANCE_PREMIUM_PAYMENTS) {
      this.serviceSubTypeCode =    ServiceSubTypeCode.medicalPremium
      this.loadServiceProviderName(InsuranceStatusType.healthInsurance, 'VENDOR_PAYMENT_REQUEST', this.clientId, this.caseEligibilityId);
    }
    else {
      this.serviceSubTypeCode =    ServiceSubTypeCode.dentalPremium
      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance, 'VENDOR_PAYMENT_REQUEST', this.clientId, this.caseEligibilityId);
    }
  }

  savePaymentDetailsClicked() {
    this.validateForm();
    if (this.premiumPaymentForm.valid) {
      this.populatePaymentRequest();
      this.insurancePolicyFacade.showLoader();
      this.insurancePolicyFacade.savePaymentRequest(this.paymentRequest).subscribe({
        next: () => {
          this.insurancePolicyFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Insurance premium payment saved successfully.'
          );
          this.insurancePolicyFacade.triggeredPremiumPaymentSaveSubject.next(true);
          this.insurancePolicyFacade.hideLoader();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.triggeredPremiumPaymentSaveSubject.next(true);
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    } else {
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.premiumPaymentForm, this.elementRef.nativeElement, null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
    }
  }
  resetForm() {
    this.premiumPaymentForm.reset();
    this.premiumPaymentForm.updateValueAndValidity();
  }

  validateForm() {
    this.premiumPaymentForm.markAllAsTouched();
    this.premiumPaymentForm.controls['vendorId'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['clientInsurancePolicyId'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['serviceDescription'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['serviceTypeCode'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['amountRequested'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['paymentTypeCode'].setValidators([Validators.required,]);

    this.premiumPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);
    this.premiumPaymentForm.controls['entryDate'].setValidators([Validators.required,]);

    this.premiumPaymentForm.controls['vendorId'].updateValueAndValidity();
    this.premiumPaymentForm.controls['clientInsurancePolicyId'].updateValueAndValidity();
    this.premiumPaymentForm.controls['serviceDescription'].updateValueAndValidity();
    this.premiumPaymentForm.controls['serviceTypeCode'].updateValueAndValidity();
    this.premiumPaymentForm.controls['amountRequested'].updateValueAndValidity();
    this.premiumPaymentForm.controls['paymentTypeCode'].updateValueAndValidity();
    this.premiumPaymentForm.controls['reversalTypeCode'].updateValueAndValidity();
    this.premiumPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
    this.premiumPaymentForm.controls['entryDate'].updateValueAndValidity();
  }
  populatePaymentRequest() {
    this.paymentRequest = new PaymentRequest()
    this.paymentRequest.clientId = this.clientId;
    this.paymentRequest.clientCaseEligibilityId =  this.caseEligibilityId;
    this.paymentRequest.entityId = this.premiumPaymentForm.controls['vendorId'].value;
    this.paymentRequest.entityTypeCode = EntityTypeCode.Vendor.toUpperCase();
    this.paymentRequest.clientInsurancePolicyId = this.premiumPaymentForm.controls['clientInsurancePolicyId'].value;
    this.paymentRequest.serviceTypeCode = this.premiumPaymentForm.controls['serviceTypeCode'].value;
    this.paymentRequest.serviceSubTypeCode = this.serviceSubTypeCode
    this.paymentRequest.amountRequested = this.premiumPaymentForm.controls['amountRequested'].value;
    this.paymentRequest.paymentTypeCode = this.premiumPaymentForm.controls['paymentTypeCode'].value;
    this.paymentRequest.paymentRequestTypeCode = 'Expense'
    this.paymentRequest.txtDate = this.intl.formatDate(this.premiumPaymentForm.controls['entryDate'].value, this.dateFormat);
    this.paymentRequest.reversalTypeCode = this.premiumPaymentForm.controls['reversalTypeCode'].value;
    this.paymentRequest.serviceStartDate = this.intl.formatDate(this.premiumPaymentForm.controls['serviceStartDate'].value, this.dateFormat);
    this.paymentRequest.serviceEndDate = this.intl.formatDate(this.premiumPaymentForm.controls['serviceEndDate'].value, this.dateFormat);
    this.paymentRequest.comments = this.premiumPaymentForm.controls['comments'].value;

  }

  private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.vendorFacade.loadPaymentRequestVendors(type, vendorType, clientId, clientCaseligibilityId);
  }

  public serviceProviderNameChange(value: string): void {
    if (value) {
      this.isInsurancePoliciesLoading = true;
      this.insurancePolicyFacade.loadInsurancePoliciesByProviderId(value, this.clientId, this.caseEligibilityId, (this.tabStatus == ClientProfileTabs.DENTAL_INSURANCE_PREMIUM_PAYMENTS) ? ClientProfileTabs.DENTAL_INSURANCE_STATUS : ClientProfileTabs.HEALTH_INSURANCE_STATUS).subscribe({
        next: (data: any) => {
          data.forEach((policy: any) => {
            if(policy.insuranceIdNumber !== null){
              policy["policyValueField"] = '['+policy.insuranceIdNumber+ "] - [" + policy.insurancePlanName +']';
            }
            else{
              policy["policyValueField"] =  '[' + policy.insurancePlanName +']';
            }
          });
          this.insurancePoliciesList = data;
          this.isInsurancePoliciesLoading = false;
          if(data.length ===1){
            this.premiumPaymentForm.controls['clientInsurancePolicyId'].setValue(data[0].clientInsurancePolicyId);
           }
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

  private commentCounterInitiation() {
    this.commentCharactersCount = this.commentNote
      ? this.commentNote.length
      : 0;
    this.commentCounter = `${this.commentCharactersCount}/${this.commentMaxLength}`;
  }

  commentValueChange(event: any): void {
    this.commentCharactersCount = event.length;
    this.commentCounter = `${this.commentCharactersCount}/${this.commentMaxLength}`;
  }

  closePremiumPayment(){
    this.closePremiumPaymentEvent.emit(true);
  }
  setPremiumPaymentForm() {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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


  endDateValueChange(date: Date) {
    this.statusEndDateIsGreaterThanStartDate = false;

  }
  startDateOnChange() {
    this.startDateIsFutureDate = false;
    if(this.premiumPaymentForm.controls['serviceStartDate'].value > new Date()){
      this.startDateIsFutureDate = true;
      this.premiumPaymentForm.controls['serviceStartDate'].setErrors({ 'incorrect': true });
    }
    else if (this.premiumPaymentForm.controls['serviceEndDate'].value !== null) {
      this.endDateOnChange();
    }
  }
  endDateOnChange() {
    this.statusEndDateIsGreaterThanStartDate = true;
    if (this.premiumPaymentForm.controls['serviceStartDate'].value === null) {
      this.premiumPaymentForm.controls['serviceStartDate'].markAllAsTouched();
      this.premiumPaymentForm.controls['serviceStartDate'].setValidators([Validators.required]);
      this.premiumPaymentForm.controls['serviceStartDate'].updateValueAndValidity();

      this.statusEndDateIsGreaterThanStartDate = false;
    }
    else if (this.premiumPaymentForm.controls['serviceEndDate'].value !== null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.premiumPaymentForm.controls['serviceStartDate'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.premiumPaymentForm.controls['serviceEndDate'].value
        )
      );

      if (startDate > endDate) {
        this.premiumPaymentForm.controls['serviceEndDate'].setErrors({ 'incorrect': true });
        this.statusEndDateIsGreaterThanStartDate = false;
      }
      else {
        this.statusEndDateIsGreaterThanStartDate = true;
        this.premiumPaymentForm.controls['serviceEndDate'].setErrors(null);
      }
    }
  }
  
  dateValidate(type: any) {
    
    const serviceStartDate = this.premiumPaymentForm.controls['serviceStartDate'].value;
    const coverageEndDate = this.premiumPaymentForm.controls['serviceEndDate'].value;
    switch (type.toUpperCase()) {
      case "SERVICESTARTDATE":
        this.premiumPaymentForm.controls['serviceStartDate'].setErrors(null);
        this.serviceStartDateValidator = true;
        if(serviceStartDate < this.min || serviceStartDate > this.maxDate){
          this.serviceStartDateValidator = false;
          this.premiumPaymentForm.controls['serviceStartDate'].setErrors({ 'incorrect': true });
          return;
         
        }
        
        break;
      case "COVERAGEENDDATE":
        this.premiumPaymentForm.controls['serviceEndDate'].setErrors(null);
        this.coverageEndDateValidator = true;
        if(coverageEndDate < this.min || coverageEndDate > this.maxDate){
          this.coverageEndDateValidator = false;
          this.premiumPaymentForm.controls['serviceEndDate'].setErrors({ 'incorrect': true });
          return;
         
        }
        break
    }

    
  }
}
