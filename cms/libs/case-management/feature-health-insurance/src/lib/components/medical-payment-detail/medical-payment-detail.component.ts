/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,EventEmitter,Output
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  HealthInsurancePolicyFacade,
  InsuranceStatusType,
  VendorFacade,
  ClientProfileTabs,
  PaymentRequest
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  LovFacade } from '@cms/system-config/domain';

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

  /* Input Properties */
  @Input() caseEligibilityId: any;
  @Input() clientId: any;
  @Input() tabStatus: any;

  /* Output Properties */
  @Output() closeCoPaymentDetailsEvent = new EventEmitter();

  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  commentCharactersCount!: number;
  commentCounter!: string;
  commentMaxLength = 300;
  commentNote = '';
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

  statusEndDateIsGreaterThanStartDate: boolean = true;
  paymentRequest !: PaymentRequest;
  dateFormat = this.configurationProvider.appSettings.dateFormat;

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
  ) {
    this.copayPaymentForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit(){
    this.buildCoPaymentForm();
    this.commentCounterInitiation();
    if(this.tabStatus=='hlt-ins-co-pay'){
      this.loadServiceProviderName(InsuranceStatusType.healthInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
    else{
      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
  }
  resetForm() {
    this.copayPaymentForm.reset();
    this.copayPaymentForm.updateValueAndValidity();
  }

  private loadServiceProviderName(type: string, vendorType: string, clientId: any, clientCaseligibilityId: any) {
    this.vendorFacade.loadPaymentRequestVendors(type, vendorType, clientId, clientCaseligibilityId);
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
  
  public serviceProviderNameChange(value: string): void {
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
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
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
    this.validateForm();
    if (this.copayPaymentForm.valid) {
      this.populatePaymentRequest();
      this.insurancePolicyFacade.showLoader();
      this.insurancePolicyFacade.savePaymentRequest(this.paymentRequest).subscribe({
        next: () => {
          if(this.tabStatus=='hlt-ins-co-pay'){
            this.insurancePolicyFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Medical payment saved successfully.'
            );
          }
          else{
            this.insurancePolicyFacade.showHideSnackBar(
              SnackBarNotificationType.SUCCESS,
              'Dental payment saved successfully.'
            );

          }
         
          this.insurancePolicyFacade.triggeredCoPaySaveSubject.next(true);
          this.insurancePolicyFacade.hideLoader();
        },
        error: (error: any) => {
          this.insurancePolicyFacade.showHideSnackBar(SnackBarNotificationType.ERROR, error)
        }
      })
    }
  }

  populatePaymentRequest() {
    this.paymentRequest = new PaymentRequest()
    this.paymentRequest.clientId = this.clientId;
    this.paymentRequest.clientCaseEligibilityId =  this.caseEligibilityId;    
    this.paymentRequest.vendorId = this.copayPaymentForm.controls['vendorId'].value;
    this.paymentRequest.clientInsurancePolicyId = this.copayPaymentForm.controls['clientInsurancePolicyId'].value;
    this.paymentRequest.serviceTypeCode = this.copayPaymentForm.controls['serviceTypeCode'].value;
    this.paymentRequest.amountRequested = this.copayPaymentForm.controls['amountRequested'].value;
    this.paymentRequest.paymentTypeCode = this.copayPaymentForm.controls['paymentTypeCode'].value;
    this.paymentRequest.txtDate = this.intl.formatDate(this.copayPaymentForm.controls['entryDate'].value, this.dateFormat); 
    this.paymentRequest.paymentRequestTypeCode = 'Expense'
    this.paymentRequest.serviceStartDate = this.intl.formatDate(this.copayPaymentForm.controls['serviceStartDate'].value, this.dateFormat); 
    this.paymentRequest.serviceEndDate = this.intl.formatDate(this.copayPaymentForm.controls['serviceEndDate'].value, this.dateFormat); 
    this.paymentRequest.comments = this.copayPaymentForm.controls['comments'].value;
  }

  validateForm(){
    this.copayPaymentForm.markAllAsTouched();  
    this.copayPaymentForm.controls['vendorId'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['clientInsurancePolicyId'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceDescription'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceTypeCode'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['amountRequested'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['paymentTypeCode'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);
    this.copayPaymentForm.controls['entryDate'].setValidators([Validators.required,]);

    this.copayPaymentForm.controls['vendorId'].updateValueAndValidity();
    this.copayPaymentForm.controls['clientInsurancePolicyId'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceDescription'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceTypeCode'].updateValueAndValidity();
    this.copayPaymentForm.controls['amountRequested'].updateValueAndValidity();
    this.copayPaymentForm.controls['paymentTypeCode'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceDescription'].updateValueAndValidity();
    this.copayPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
    this.copayPaymentForm.controls['entryDate'].updateValueAndValidity();
  }

  endDateValueChange(date: Date) {
    this.statusEndDateIsGreaterThanStartDate = false;

  }
  startDateOnChange() {
    if (this.copayPaymentForm.controls['serviceEndDate'].value !== null) {
      this.endDateOnChange();
    }
  }
  closeCoPaymentDetailsOpened(){
    this.closeCoPaymentDetailsEvent.emit(true);
  }
  endDateOnChange() {
    this.statusEndDateIsGreaterThanStartDate = true;
    if (this.copayPaymentForm.controls['serviceStartDate'].value === null) {
      this.copayPaymentForm.controls['serviceStartDate'].markAllAsTouched();
      this.copayPaymentForm.controls['serviceStartDate'].setValidators([Validators.required]);
      this.copayPaymentForm.controls['serviceStartDate'].updateValueAndValidity();
      
      this.statusEndDateIsGreaterThanStartDate = false;
    }
    else if (this.copayPaymentForm.controls['serviceEndDate'].value !== null) {
      const startDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.copayPaymentForm.controls['serviceStartDate'].value
        )
      );
      const endDate = this.intl.parseDate(
        Intl.DateTimeFormat('en-US').format(
          this.copayPaymentForm.controls['serviceEndDate'].value
        )
      );

      if (startDate > endDate) {
        this.copayPaymentForm.controls['serviceEndDate'].setErrors({ 'incorrect': true });
        this.statusEndDateIsGreaterThanStartDate = false;
      }
      else {
        this.statusEndDateIsGreaterThanStartDate = true;
        this.copayPaymentForm.controls['serviceEndDate'].setErrors(null);
      }
    }
  }
}
