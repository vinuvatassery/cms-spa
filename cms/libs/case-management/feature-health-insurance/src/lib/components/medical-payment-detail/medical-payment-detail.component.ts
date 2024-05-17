/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,EventEmitter,Output, OnDestroy, OnInit, ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';

/** Facades **/
import {
  ClientDocumentFacade,
  HealthInsurancePolicyFacade,
  InsuranceStatusType,
  VendorFacade,
  ClientProfileTabs,
  PaymentRequest,
  EntityTypeCode,
  ServiceSubTypeCode,
  FinancialClaimsFacade,
  ExceptionTypeCode,
  PaymentRequestType,
  FinancialClaims,
  PaymentMethodCode,
  FinancialClaimTypeCode,
} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import {  Lov, LovFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';

import { SnackBarNotificationType, ConfigurationProvider, LoggingService, NotificationSnackbarService } from '@cms/shared/util-core';
import { IntlService } from '@progress/kendo-angular-intl';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { groupBy } from '@progress/kendo-data-query';
import { StatusFlag } from '@cms/shared/ui-common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'case-management-medical-payment-detail',
  templateUrl: './medical-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentDetailComponent implements OnDestroy, OnInit {
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
  medicalProvidersearchLoaderVisibility$ =
  this.financialClaimsFacade.medicalProviderSearchLoaderVisibility$;
  commentCharactersCount!: number;
  commentCounter!: string;
  commentMaxLength = 300;
  commentNote = '';
  isLoading$ = this.vendorFacade.isVendorLoading$;
  carrierNames$ = this.vendorFacade.paymentRequestVendors$;
  pharmacySearchResult$ = this.financialClaimsFacade.pharmacies$;
  isPlanLoading:boolean =false;
  isInsurancePoliciesLoading:boolean =false;
  insurancePlanList!: any;
  insurancePoliciesList!: any;
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  private showIneligibleSubscription !: Subscription;
  statusEndDateIsGreaterThanStartDate: boolean = true;
  paymentRequest !: PaymentRequest;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  @Input() claimsType: any;
  financialProvider = 'medical';
  selectedMedicalProvider: any;
  isRecentClaimShow = false;
  vendorId: any;
  vendorName: any;
  clientName: any;
  providerTin: any;
  claimForm!: FormGroup;
  showIneligibleException$ = this.financialClaimsFacade.showIneligibleException$;
  providerNotEligiblePriorityArray = ['ineligibleExceptionFlag'];
  exceedMaxBenefitPriorityArray = ['ineligibleExceptionFlag'];
  duplicatePaymentPriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag'];
  oldInvoicePriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag', 'duplicatePaymentExceptionFlag'];
  bridgeUppPriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag', 'duplicatePaymentExceptionFlag', 'oldInvoiceExceptionFlag'];
  isSubmitted: boolean = false;
  textMaxLength: number = 300;
  endDateGreaterThanStartDate: boolean = false;
  selectedCPTCode: any = null;
  CPTCodeSearchLoaderVisibility$ =
  this.financialClaimsFacade.CPTCodeSearchLoaderVisibility$;
  searchCTPCode$ = this.financialClaimsFacade.searchCTPCode$;
  clientCaseEligibilityId: any = null;
  @Input() isEdit: any;
  selectedClient: any;
  invoiceId: any;
  @Input() paymentRequestId: any;
  isExcededMaxBanifitButtonText = 'Make Exception';
  groupedPaymentRequestTypes:any;
  isDisabled: boolean = true;
  isClientInEligibleForDates= false;
  specialCharAdded!: boolean;
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
    private readonly financialClaimsFacade: FinancialClaimsFacade,
    private cd: ChangeDetectorRef,
    private readonly elementRef: ElementRef,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.copayPaymentForm = this.formBuilder.group({});

  }

  /** Lifecycle hooks **/
  ngOnInit(){
    if(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_COPAY)
    {
      this.financialProvider="Dental";
    }
    this.checkExceptions();
    this.paymentRequestType$.subscribe((paymentRequestTypes) => {
      let parentRequestTypes = paymentRequestTypes.filter(x => x.parentCode == null);
      let refactoredPaymentRequestTypeArray :Lov[] =[]
      parentRequestTypes.forEach(x => {
        let childPaymentRequestTypes= JSON.parse(JSON.stringify(paymentRequestTypes.filter(y => y.parentCode == x.lovCode))) as Lov[];
       if(childPaymentRequestTypes?.length>0){
        childPaymentRequestTypes.forEach(y => y.parentCode = x.lovDesc )
        refactoredPaymentRequestTypeArray.push(...childPaymentRequestTypes);
       }
       else{
        let noChildPaymentRequestType = JSON.parse(JSON.stringify(x))as Lov;
        noChildPaymentRequestType.parentCode = noChildPaymentRequestType.lovDesc
        refactoredPaymentRequestTypeArray.push(noChildPaymentRequestType)
       }
      })
      this.groupedPaymentRequestTypes = groupBy(refactoredPaymentRequestTypeArray, [{ field: "parentCode" }]);
    });


    this.initMedicalClaimObject();
    this.buildCoPaymentForm();

    this.initClaimForm();
    this.commentCounterInitiation();
    if(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_COPAY){

      this.loadServiceProviderName(InsuranceStatusType.healthInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
    else{

      this.loadServiceProviderName(InsuranceStatusType.dentalInsurance,'VENDOR_PAYMENT_REQUEST',this.clientId,this.caseEligibilityId);
    }
    this.addClaimServiceGroup();
  }

  checkExceptions()
  {
     this.isClientInEligibleForDates = false;
    this.showIneligibleSubscription = this.showIneligibleException$.subscribe(data => {
      this.isClientInEligibleForDates = data?.flag;
      if(data?.flag)
      {
        this.resetExceptionFields(data?.indexNumber);
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlag')?.setValue(data?.flag);
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.Ineligible)
        this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.Yes)
      }
      else if (this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.value === ExceptionTypeCode.Ineligible)
      {
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlag')?.setValue(data?.flag);
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue('')
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.No)
        this.checkProviderNotEligibleException(this.providerTin);
        this.loadServiceCostMethod(data?.indexNumber);

      }

      this.cd.detectChanges();
    });

  }

  resetExceptionFields(indexNumber:any)
  {
    this.addExceptionForm.at(indexNumber).reset();
    this.claimForm.controls['parentReasonForException'].setValue('');
    this.claimForm.controls['parentExceptionFlag'].setValue(StatusFlag.No);
    this.claimForm.controls['parentExceptionTypeCode'].setValue('');
    this.claimForm.controls['providerNotEligibleExceptionFlag'].setValue('');
    this.claimForm.controls['showProviderNotEligibleExceptionReason'].setValue('');
    this.claimForm.controls['providerNotEligibleExceptionFlagText'].setValue(this.isExcededMaxBanifitButtonText);
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
  removeService(i: number) {
    this.addClaimServicesForm.removeAt(i);
    this.addExceptionForm.removeAt(i);
  }
  onPaymentTypeValueChange(cptCodeObject: any, index: number) {
    const serviceForm = this.addClaimServicesForm.at(index) as FormGroup;
    let cptCode = serviceForm.controls['cptCode'].value;
    if (cptCodeObject !== PaymentRequestType.FullPay && cptCode.length > 0) {
      serviceForm.controls['amountDue'].setValue(0);
    }
  }
  onMakeParentExceptionClick(controlName: string)
  {
    this.claimForm.controls[controlName]?.setValue(!this.claimForm.controls[controlName]?.value);
    if (this.claimForm.controls[controlName]?.value &&  this.claimForm.controls['providerNotEligibleExceptionFlag']?.value) {
      this.claimForm.controls['providerNotEligibleExceptionFlagText'].setValue("Don't Make Exception");
    } else if (this.claimForm.controls['providerNotEligibleExceptionFlag']?.value) {
      this.claimForm.controls['providerNotEligibleExceptionFlagText'].setValue("Make Exception");
    }
  }
  public serviceProviderNameChange(value: string): void {
    if(value){
      this.isInsurancePoliciesLoading=true;
      this.insurancePolicyFacade.loadInsurancePoliciesByProviderId(value,this.clientId,this.caseEligibilityId,(this.tabStatus==ClientProfileTabs.DENTAL_INSURANCE_COPAY) ?  ClientProfileTabs.DENTAL_INSURANCE_STATUS: ClientProfileTabs.HEALTH_INSURANCE_STATUS  ).subscribe({
        next: (data: any) => {
          data.forEach((policy:any)=>{
            if(policy.insuranceIdNumber !== null){
              policy["policyValueField"]= '['+policy.insuranceIdNumber+ "] - [" + policy.insurancePlanName +']';
            }
            else{
              policy["policyValueField"]= '[' + policy.insurancePlanName +']';
            }
          });
          this.insurancePoliciesList=data;
          this.isInsurancePoliciesLoading=false;
          if(data.length ===1){
           this.copayPaymentForm.controls['clientInsurancePolicyId'].setValue(data[0].clientInsurancePolicyId);
          }
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

  }
  initMedicalClaimObject() {
    this.medicalClaimServices = {
      vendorId: '',
      serviceStartDate: '',
      serviceEndDate: '',
      paymentType: '',
      cptCode: '',
      pcaCode: '',
      serviceDescription: '',
      amoundDue: '',
      reasonForException: '',
      medicadeRate: 0,
      cptCodeId: '',
    };
  }
  setExceptionValidation()
  {
    if(this.claimForm.controls['showProviderNotEligibleExceptionReason'].value)
    {
      this.claimForm.controls['parentReasonForException'].setValidators(Validators.required);
      this.claimForm.controls['parentReasonForException'].updateValueAndValidity();
    }
    else
    {
      this.claimForm.controls['parentReasonForException'].removeValidators(Validators.required);
      this.claimForm.controls['parentReasonForException'].updateValueAndValidity();
    }
    this.addClaimServicesForm.controls.forEach((element, index) => {
      if(this.addExceptionForm.at(index).get('showMaxBenefitExceptionReason')?.value ||
      this.addExceptionForm.at(index).get('oldInvoiceExceptionReason')?.value ||
      this.addExceptionForm.at(index).get('bridgeUppExceptionReason')?.value ||
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionReason')?.value
      )
      {
        this.addClaimServicesForm.at(index).get('reasonForException')?.setValidators(Validators.required);
        this.addClaimServicesForm.at(index).get('reasonForException')?.updateValueAndValidity();
      }
      else {
        this.addClaimServicesForm.at(index).get('reasonForException')?.removeValidators(Validators.required);
        this.addClaimServicesForm.at(index).get('reasonForException')?.updateValueAndValidity();
      }
    });
  }
  save() {
    this.setExceptionValidation();
    this.isSubmitted = true;
    if (!this.claimForm.valid) {
      this.claimForm.markAllAsTouched()
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.claimForm, this.elementRef.nativeElement, null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }
      return;
    }
    if(this.isClientInEligibleForDates){
   return;
    }
    let formValues = this.claimForm.value;

    let bodyData = {
      clientId: this.clientId,
      vendorId: formValues.medicalProvider.vendorId,
      vendorAddressId: formValues.medicalProvider.vendorAddressId,
      claimNbr: formValues.invoiceId,
      clientCaseEligibilityId: this.caseEligibilityId,
      paymentRequestId: this.isEdit ? this.paymentRequestId : null,
      paymentMethodCode: this.isSpotsPayment ? PaymentMethodCode.SPOTS : PaymentMethodCode.ACH,
      exceptionFlag: formValues.parentExceptionFlag,
      exceptionTypeCode: formValues.parentExceptionTypeCode,
      exceptionReasonCode: formValues.parentReasonForException,
      serviceSubTypeCode:this.financialProvider==FinancialClaimTypeCode.Medical ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim,
      pcaCode:'',
      tpaInvoices: [{}],
    };
    let checkDeniedClaim = false;
    for (let element of formValues.claimService) {
      let service = {
        vendorId: bodyData.vendorId,
        clientId: bodyData.clientId,
        claimNbr: element.invoiceId,
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        cptCode: element.cptCode,
        serviceStartDate: this.intl.formatDate(element.serviceStartDate,  this.dateFormat ),
        serviceEndDate: this.intl.formatDate(element.serviceEndDate,  this.dateFormat ),
        PaymentTypeCode: element.paymentType,
        serviceCost: element.serviceCost,
        entityTypeCode: EntityTypeCode.Vendor,
        amountDue: element.amountDue,
        ServiceDesc: element.serviceDescription,
        exceptionReasonCode: element.reasonForException,
        tpaInvoiceId: element.tpaInvoiceId,
        exceptionFlag: element.exceptionFlag,
        exceptionTypeCode: element.exceptionTypeCode,
        pcaCode:"",
        entryDate:element.entryDate
      };
      if (
        !this.isStartEndDateValid(
          service.serviceStartDate,
          service.serviceEndDate
        )
      ) {
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          'Start date must less than end date'
        );
        return;
      }

      bodyData.tpaInvoices.push(service);
    }
    bodyData.tpaInvoices.splice(0, 1);




    this.savePaymentDetailsClicked(bodyData);
  }
  savePaymentDetailsClicked(bodyData:any) {


      this.insurancePolicyFacade.showLoader();
      this.insurancePolicyFacade.savePaymentRequest(bodyData).subscribe({
        next: () => {

          this.insurancePolicyFacade.getMedicalClaimMaxbalance(this.clientId,this.caseEligibilityId);
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

  populatePaymentRequest() {
    this.paymentRequest = new PaymentRequest()
    this.paymentRequest.clientId = this.clientId;
    this.paymentRequest.clientCaseEligibilityId =  this.caseEligibilityId;
    this.paymentRequest.entityId = this.copayPaymentForm.controls['vendorId'].value;
    this.paymentRequest.entityTypeCode = EntityTypeCode.Vendor.toUpperCase();
    this.paymentRequest.clientInsurancePolicyId = this.copayPaymentForm.controls['clientInsurancePolicyId'].value;
    this.paymentRequest.serviceTypeCode = this.copayPaymentForm.controls['serviceTypeCode'].value;
    this.paymentRequest.amountRequested = this.copayPaymentForm.controls['amountRequested'].value;
    this.paymentRequest.paymentTypeCode = this.copayPaymentForm.controls['paymentTypeCode'].value;
    this.paymentRequest.txtDate = this.intl.formatDate(this.copayPaymentForm.controls['entryDate'].value, this.dateFormat);
    this.paymentRequest.paymentRequestTypeCode = 'Expense'
    this.paymentRequest.serviceStartDate = this.intl.formatDate(this.copayPaymentForm.controls['serviceStartDate'].value, this.dateFormat);
    this.paymentRequest.serviceEndDate = this.intl.formatDate(this.copayPaymentForm.controls['serviceEndDate'].value, this.dateFormat);
    this.paymentRequest.comments = this.copayPaymentForm.controls['comments'].value;
    this.paymentRequest.serviceSubTypeCode = ServiceSubTypeCode.notApplicable

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
    this.copayPaymentForm.controls['serviceStartDate'].setValidators([Validators.required,]);

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
  searchMedicalProvider(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
      this.financialClaimsFacade.searchPharmacies(searchText, ClientProfileTabs.DENTAL_INSURANCE_COPAY !=this.tabStatus? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
 }

  onProviderValueChange($event: any) {
    this.isRecentClaimShow = false;
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    this.checkProviderNotEligibleException($event);
  }
  get addExceptionForm(): FormArray {
    return this.claimForm.get('exceptionArray') as FormArray;
  }
  checkPriority(exceptionControls:any, indexNumber:any, parentExceptionControl:string|null) : boolean
  {
    if(parentExceptionControl && this.claimForm.controls[parentExceptionControl].value )
    {
      return false;
    }
    for (const controls of exceptionControls) {
      if(this.addExceptionForm.at(indexNumber).get(controls)?.value)
      {
          return false;
      }
    }
    return true;
  }
  isSpotsPayment!: boolean;
  checkProviderNotEligibleException($event:any)
  {
    this.addExceptionForm.controls.forEach((element, index) => {
      if(!this.checkPriority(this.providerNotEligiblePriorityArray,index,null))
      {
        return;
      }
    });
    if(!$event?.tin && !this.isSpotsPayment)
    {
      this.addExceptionForm.reset();
      this.claimForm.controls['providerNotEligibleExceptionFlag']?.setValue(true);
      this.claimForm.controls['parentExceptionTypeCode'].setValue(ExceptionTypeCode.ProviderIneligible);
      this.claimForm.controls['parentExceptionFlag']?.setValue(StatusFlag.Yes);
    }
    else
    {
      this.claimForm.controls['providerNotEligibleExceptionFlag']?.setValue(false);
      this.claimForm.controls['parentExceptionTypeCode'].setValue('');
      this.claimForm.controls['parentExceptionFlag']?.setValue(StatusFlag.No);
    }

  }
  getParentExceptionFormValue(controlName:string)
  {
    return this.claimForm.controls[controlName]?.value;
  }
  get addClaimServicesForm(): FormArray {
    return this.claimForm.get('claimService') as FormArray;
  }
  isControlValid(controlName: string, index: any) {
    let control = this.addClaimServicesForm.at(index) as FormGroup;
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      return { 'INVALID': true };
    }
    return control.controls[controlName].status == 'INVALID';
  }
  getExceptionFormValue(controlName: string, index: any)
  {
    return this.addExceptionForm.at(index).get(controlName)?.value
  }
  reasonCharCount(i: number) {
    let reasonForException = this.claimForm.value.claimService[i].reasonForException;
    if (reasonForException) {
      return `${reasonForException.length}/${this.textMaxLength}`;
    }
    return `0/${this.textMaxLength}`;
  }
  onMakeExceptionClick(controlName: string,index: any) {
    this.addExceptionForm.at(index).get(controlName)?.setValue(!this.addExceptionForm.at(index).get(controlName)?.value);
    if (this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('exceedMaxBenefitExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('maxBenefitExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('exceedMaxBenefitExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('maxBenefitExceptionFlagText')?.setValue("Make Exception");
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue("Make Exception");
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('bridgeUppExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('bridgeUppExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('bridgeUppExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('bridgeUppExceptionFlagText')?.setValue("Make Exception");
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlagText')?.setValue("Make Exception");
    }
  }
  onAmountDueChange(index:any)
  {
    this.loadServiceCostMethod(index);
    this.checkDuplicatePaymentException(index);
  }
  loadServiceCostMethod(index:number){
    if(!this.checkPriority(this.exceedMaxBenefitPriorityArray,index,'providerNotEligibleExceptionFlag'))
    {
      return;
    }
    const formValues = this.claimForm.value
    if(formValues.client?.clientId)
    {
      let totalServiceCost = 0;
      this.addClaimServicesForm.controls.forEach((element, index) => {
          totalServiceCost += + element.get('amountDue')?.value;
      });
      this.financialClaimsFacade.loadExceededMaxBenefit(totalServiceCost,formValues.client.clientId,
        index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim,
        this.clientCaseEligibilityId, this.paymentRequestId);
      this.exceedMaxBenefitFlag = this.financialClaimsFacade.serviceCostFlag;
    }
  }
  exceedMaxBenefitFlag!: boolean;
  checkDuplicatePaymentException(index:number)
  {
    if(!this.checkPriority(this.duplicatePaymentPriorityArray,index,'providerNotEligibleExceptionFlag'))
    {
      return;
    }
    const serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    const data = {
      invoiceId: this.claimForm.value?.invoiceId,
      clientId: this.claimForm.value?.client.clientId,
      startDate: this.intl.formatDate(serviceFormData.controls['serviceStartDate'].value,  this.dateFormat ),
      endDate: this.intl.formatDate(serviceFormData.controls['serviceEndDate'].value,  this.dateFormat ),
      vendorId: this.claimForm.value?.medicalProvider?.vendorId,
      totalAmountDue:serviceFormData.controls['amountDue'].value,
      paymentRequestId :null,
      indexNumber: index,
      typeCode : this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim
    };

    if (data.startDate && data.endDate && data.totalAmountDue && data.vendorId && data.invoiceId) {
      this.financialClaimsFacade.checkDuplicatePaymentException(data);
    }
  }

  calculateMedicadeRate(index: number) {
    const serviceForm = this.addClaimServicesForm.at(index) as FormGroup;
    let paymentType = serviceForm.controls['paymentType'].value;
    if (paymentType == PaymentRequestType.FullPay) {
      const medicadeRate = serviceForm.controls['medicadeRate'].value ?? 0;
      let amoundDue = serviceForm.controls['amountDue'].value ?? 0;
      if (medicadeRate > 0) {
        amoundDue = (medicadeRate * 0.25) + medicadeRate;
        serviceForm.controls['amountDue'].setValue(amoundDue);
      }
    }
  }
  isStartEndDateValid(startDate: any, endDate: any): boolean {
    if (startDate != "" && endDate != "" && startDate > endDate) {
      this.endDateGreaterThanStartDate = true;
      return false;
    }
    return true;
  }
  isStartEndDateError(index : any){
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    return this.isStartEndDateValid(startDate, endDate);
  }
  onCPTCodeValueChange(event: any, index: number) {
    let service = event;
    let ctpCodeIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    ctpCodeIsvalid.patchValue({
      cptCode: service.cptCode1,
      serviceDescription: service.serviceDesc != undefined ? service.serviceDesc : '',
      medicadeRate: service.medicaidRate,
      cptCodeId: service.cptCodeId,
    });
    this.calculateMedicadeRate(index);
    this.checkBridgeUppEception(index);
    this.checkDuplicatePaymentException(index);
  }

  checkBridgeUppEception(index:number)
  {
    if(!this.checkPriority(this.bridgeUppPriorityArray,index,'providerNotEligibleExceptionFlag'))
    {
      return;
    }
    const serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    const ctpCodeIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    const cptCode = ctpCodeIsvalid?.controls['cptCode'].value
    const clientId = this.claimForm.value?.client?.clientId
    if(startDate && endDate)
    {
      startDate = this.intl.formatDate(startDate,  this.dateFormat ) ;
      endDate = this.intl.formatDate(endDate,  this.dateFormat ) ;
    }
    else
    {
      startDate = null;
      endDate = null;
    }
    if (cptCode && clientId) {
      this.financialClaimsFacade.checkGroupException(startDate,endDate, clientId,cptCode, index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
    }
  }
  checkIneligibleEception(startDate:any, endDate:any, index:number)
  {
    const formValues = this.claimForm.value
    if (startDate && endDate && formValues.client) {
      startDate = this.intl.formatDate(startDate,  this.dateFormat ) ;
      endDate = this.intl.formatDate(endDate,  this.dateFormat ) ;
      this.financialClaimsFacade.checkIneligibleException(startDate,endDate, formValues.client, index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
    }
  }
  serviceDescCharCount(i: number) {
    let serviceDescription = this.claimForm.value.claimService[i].serviceDescription;
    if (serviceDescription) {
      return `${serviceDescription.length}/${this.textMaxLength}`;
    }
    return `0/${this.textMaxLength}`;
  }
  searchcptcode(cptcode: any) {
    if (!cptcode || cptcode.length == 0) {
      return;
    }
    this.financialClaimsFacade.searchcptcode(cptcode);
  }
  onDateChange(index: any) {
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;

    const minDate = new Date('1/1/1900');
    const maxDate = new Date('31/12/2099');
    startDate = new Date(this.intl.formatDate(startDate,  this.dateFormat )) ;
    endDate = new Date(this.intl.formatDate(endDate,  this.dateFormat )) ;
    if(startDate == "Invalid Date") return;
    if(endDate == "Invalid Date") return;
    if(startDate < minDate || startDate > maxDate || endDate < minDate || endDate > maxDate){
      return;
    }
    if(this.isStartEndDateValid(startDate, endDate))
    {
      this.checkIneligibleEception(startDate,endDate,index);
    }

  }
  initClaimForm() {
    this.claimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.clientId, Validators.required],
      invoiceId: [this.invoiceId, Validators.required],
      paymentRequestId: [this.paymentRequestId],
      parentReasonForException: new FormControl(''),
      parentExceptionFlag: new FormControl(StatusFlag.No),
      parentExceptionTypeCode: new FormControl(''),
      claimService: new FormArray([]),
      exceptionArray : new FormArray([]),
      providerNotEligibleExceptionFlag: new FormControl(false),
      showProviderNotEligibleExceptionReason: new FormControl(false),
      providerNotEligibleExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText)
    });
  }
  medicalClaimServices!: FinancialClaims;

  onclikaddClaimServiceGroup()
  {
    this.isSubmitted = true;
    if (!this.claimForm.valid) {
      this.claimForm.markAllAsTouched()
      return;
    }
    this.isSubmitted = false;
    this.addClaimServiceGroup();
  }
  addClaimServiceGroup() {
    let claimForm = this.formBuilder.group({
      serviceStartDate: new FormControl(
        this.addClaimServicesForm.value[0]?.serviceStartDate,
        [Validators.required,this.dateValidator]
      ),
      serviceEndDate: new FormControl(
        this.addClaimServicesForm.value[0]?.serviceEndDate,
        [Validators.required,this.dateValidator]
      ),
      paymentType: new FormControl(this.medicalClaimServices.paymentType, [
        Validators.required,
      ]),
      cptCode: new FormControl(this.medicalClaimServices.cptCode, [
        Validators.required,
      ]),
      pcaCode: new FormControl(this.medicalClaimServices.pcaCode),
      serviceDescription: new FormControl(
        this.medicalClaimServices.serviceDescription,[
          Validators.required,
        ]
      ),
      serviceCost: new FormControl(this.medicalClaimServices.serviceCost, [
        Validators.required,
      ]),
      amountDue: new FormControl(this.medicalClaimServices.amountDue, [
        Validators.required,
      ]),
      reasonForException: new FormControl(
        this.medicalClaimServices.reasonForException
      ),
      exceptionFlag: new FormControl(
        StatusFlag.No
      ),
      exceptionTypeCode: new FormControl(''),
      medicadeRate: new FormControl(this.medicalClaimServices.medicadeRate),
      paymentRequestId: new FormControl(),
      tpaInvoiceId: new FormControl(),
      cptCodeId: new FormControl(this.medicalClaimServices.cptCodeId, [
        Validators.required,
      ]),
      exceedMaxBenefitExceptionFlag: new FormControl(false),
    });
    this.addClaimServicesForm.push(claimForm);
    this.addExceptionClaimForm();
  }
  addExceptionClaimForm()
  {
    let exceptionForm = this.formBuilder.group({
      exceedMaxBenefitExceptionFlag: new FormControl(false),
      showMaxBenefitExceptionReason: new FormControl(false),
      maxBenefitExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText),
      oldInvoiceExceptionFlag: new FormControl(false),
      oldInvoiceExceptionReason: new FormControl(false),
      oldInvoiceExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText),
      ineligibleExceptionFlag: new FormControl(false),
      bridgeUppExceptionFlag: new FormControl(false),
      bridgeUppExceptionReason: new FormControl(false),
      bridgeUppExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText),
      duplicatePaymentExceptionFlag: new FormControl(false),
      duplicatePaymentExceptionReason: new FormControl(false),
      duplicatePaymentExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText),

    });
    this.addExceptionForm.push(exceptionForm);
  }
  dateValidator(control: AbstractControl): { [key: string]: any } | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date('1/1/1900');

    if (selectedDate < currentDate) {
      return { 'invalidDate': true };
    }

    return null;
  }

  ngOnDestroy(): void {
    this.showIneligibleSubscription.unsubscribe();

  }

  restrictSpecialChar(event: any) {
    const status = ((event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 8 || event.charCode == 32 ||
      (event.charCode >= 48 && event.charCode <= 57) ||
      event.charCode == 45);
    if (status) {
      this.claimForm.controls['invoiceId'].setErrors(null);
      this.specialCharAdded = false;
    }
    return status;
  }
}
