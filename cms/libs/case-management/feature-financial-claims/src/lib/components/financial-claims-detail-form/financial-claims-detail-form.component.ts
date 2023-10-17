
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { GroupResult, State } from '@progress/kendo-data-query';
import { EntityTypeCode, FinancialClaimsFacade, PaymentMethodCode, FinancialClaims, ServiceSubTypeCode, PaymentRequestType, FinancialPcaFacade, ExceptionTypeCode } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Lov, LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
import { groupBy } from "@progress/kendo-data-query";
import { StatusFlag } from '@cms/shared/ui-common';
@Component({
  selector: 'cms-financial-claims-detail-form',
  templateUrl: './financial-claims-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsDetailFormComponent implements OnDestroy, OnInit {
  @ViewChild('pcaExceptionDialogTemplate', { read: TemplateRef })
  pcaExceptionDialogTemplate!: TemplateRef<any>;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  dropdownInternedClassAction = 'dropdown-intended';
  claimsListData$ = this.financialClaimsFacade.claimsListData$;
  sortValue = this.financialClaimsFacade.sortValueClaims;
  sortType = this.financialClaimsFacade.sortType;
  pageSizes = this.financialClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialClaimsFacade.skipCount;
  sort = this.financialClaimsFacade.sortClaimsList;
  state!: State;
  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  medicalProvidersearchLoaderVisibility$ =
    this.financialClaimsFacade.medicalProviderSearchLoaderVisibility$;
  CPTCodeSearchLoaderVisibility$ =
    this.financialClaimsFacade.CPTCodeSearchLoaderVisibility$;
  pharmacySearchResult$ = this.financialClaimsFacade.pharmacies$;
  searchCTPCode$ = this.financialClaimsFacade.searchCTPCode$;
  vendorId: any;
  clientId: any;
  vendorName: any;
  clientName: any;
  text:any;
  isPrintDenailLetterClicked = false;
  @Input() claimsType: any;
  @Input() printDenialLetterData: any;
  private printLetterDialog: any;
  isRecentClaimShow = false;
  isShowReasonForException = false;
  pcaExceptionDialogService: any;
  chosenPcaForReAssignment: any;
  clientSearchResult = [
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];

  providerSearchResult = [
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234',
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234',
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234',
    },
    {
      providerId: '12',
      providerFullName: 'Fname Lname',
      tin: '2434324324234',
    },
  ];

  clientSearchLoaderVisibility$ =
    this.financialClaimsFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialClaimsFacade.clients$;

  isSubmitted: boolean = false;
  selectedMedicalProvider: any;
  selectedClient: any;
  invoiceId: any;
  claimForm!: FormGroup;
  medicalClaimServices!: FinancialClaims;
  sessionId: any = '';
  clientCaseEligibilityId: any = null;
  title: any;
  addOrEdit: any;
  selectedCPTCode: any = null;
  isSpotsPayment!: boolean;
  textMaxLength: number = 300;
  MaxBenefitExceptionReasonTextLenght :number = 150;
  isExcededMaxBeniftFlag = false;
  isExcededMaxBanifitButtonText = 'Make Exception';
  claimFlagExceptionCounter!: string;
  claimFlagExceptionText = '';
  checkservicescastvalue: any
  exceedMaxBenefitFlag!: boolean;
  showServicesListForm: boolean =false;
  showExceedMaxBenefitException$ = this.financialClaimsFacade.showExceedMaxBenefitException$;
  showIneligibleException$ = this.financialClaimsFacade.showIneligibleException$;
  showBridgeUppException$ = this.financialClaimsFacade.showBridgeUppException$;
  showDuplicatePaymentException$ = this.financialClaimsFacade.showDuplicatePaymentException$;
  providerNotEligiblePriorityArray = ['ineligibleExceptionFlag'];
  exceedMaxBenefitPriorityArray = ['ineligibleExceptionFlag'];
  duplicatePaymentPriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag'];
  oldInvoicePriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag', 'duplicatePaymentExceptionFlag'];
  bridgeUppPriorityArray = ['ineligibleExceptionFlag', 'exceedMaxBenefitExceptionFlag', 'duplicatePaymentExceptionFlag', 'oldInvoiceExceptionFlag'];
  dateFormat = this.configProvider.appSettings.dateFormat;
  providerTin: any;
 groupedPaymentRequestTypes: any;

  private showExceedMaxBenefitSubscription !: Subscription;
  private showIneligibleSubscription !: Subscription;
  private showBridgeUppSubscription !: Subscription;
  private showDuplicatePaymentSubscription !: Subscription;

  @Input() isEdit: any;
  @Input() paymentRequestId: any;
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  readonly financialProvider = 'medical';
  currentFormControl!: FormGroup<any>;
   data:any = [];
   tempData:any = {};
  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private lovFacade: LovFacade,
    private readonly activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly financialPcaFacade: FinancialPcaFacade
  ) {
    this.initMedicalClaimObject();
    this.initClaimForm();
  }

  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  loadClaimsListGrid() {
    this.financialClaimsFacade.loadClaimsListGrid();
  }

  ngOnInit(): void {
    this.lovFacade.getCoPaymentRequestTypeLov();
    this.checkExceptions();
    this.activatedRoute.params.subscribe(data => {
      this.claimsType = data['type']
    });

    if (!this.isEdit && this.claimsType == this.financialProvider) {
      this.title = 'Add Medical';
      this.addOrEdit = 'Add';
      this.addClaimServiceGroup();
    }
    else if (!this.isEdit && this.claimsType != this.financialProvider) {
      this.title = 'Add Dental';
      this.addOrEdit = 'Add';
      this.addClaimServiceGroup();
    }

    if (this.isEdit) {
      this.title = 'Edit';
      this.showServicesListForm = true;
      this.addOrEdit = 'Update';
      this.getMedicalClaimByPaymentRequestId();
    }
    
     this.paymentRequestType$.subscribe((paymentRequestTypes) => {
      paymentRequestTypes = paymentRequestTypes.sort((x,y) => x.sequenceNbr < y.sequenceNbr ? -1 : 1 )
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
  }
  checkExceptions()
  {
    this.showExceedMaxBenefitSubscription = this.showExceedMaxBenefitException$.subscribe(data => {
      if(data)
      {
        if(data?.flag)
        {
          this.resetExceptionFields(data?.indexNumber);
          this.addExceptionForm.at(data?.indexNumber).get('maxBenefitExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
          this.addExceptionForm.at(data?.indexNumber).get('exceedMaxBenefitExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.ExceedMaxBenefits : '')
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
        }
        else
        {
          this.addExceptionForm.at(data?.indexNumber).get('exceedMaxBenefitExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.ExceedMaxBenefits : '')
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
          this.checkDuplicatePaymentException(data?.indexNumber);
        }
        this.cd.detectChanges();
      }
    });
    this.showIneligibleSubscription = this.showIneligibleException$.subscribe(data => {
      if(data?.flag)
      {
        this.resetExceptionFields(data?.indexNumber);
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlag')?.setValue(data?.flag);
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.Ineligible : '')
        this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
        this.cd.detectChanges();
      }
      else
      {
        this.addExceptionForm.at(data?.indexNumber).get('ineligibleExceptionFlag')?.setValue(data?.flag);
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.Ineligible : '')
        this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
        this.checkOldInvoiceException(data?.indexNumber);
        this.checkDuplicatePaymentException(data?.indexNumber);
      }
    });
    this.showBridgeUppSubscription = this.showBridgeUppException$.subscribe(data => {
      if(data)
      {
        if(data?.flag)
        {
          this.resetExceptionFields(data?.indexNumber);
          this.addExceptionForm.at(data?.indexNumber).get('bridgeUppExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
        }
          this.addExceptionForm.at(data?.indexNumber).get('bridgeUppExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.BridgeUpp : '')
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
        this.cd.detectChanges();
      }
    });
    this.showDuplicatePaymentSubscription = this.showDuplicatePaymentException$.subscribe(data => {
      if(data)
      {
        if(data?.flag)
        {
          this.resetExceptionFields(data?.indexNumber);
          this.addExceptionForm.at(data?.indexNumber).get('duplicatePaymentExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
        }
          this.addExceptionForm.at(data?.indexNumber).get('duplicatePaymentExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(data?.flag ? ExceptionTypeCode.DuplicatePayment : '')
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(data?.flag ? StatusFlag.Yes : StatusFlag.No)
        this.cd.detectChanges();
      }
    });
  }
  resetExceptionFields(indexNumber:any)
  {
    this.addExceptionForm.at(indexNumber).reset();
    this.claimForm.controls['parentReasonForException'].setValue('');
    this.claimForm.controls['parentExceptionFlag'].setValue('');
    this.claimForm.controls['parentExceptionTypeCode'].setValue('');
    this.claimForm.controls['providerNotEligibleExceptionFlag'].setValue('');
    this.claimForm.controls['showProviderNotEligibleExceptionReason'].setValue('');
    this.claimForm.controls['providerNotEligibleExceptionFlagText'].setValue(this.isExcededMaxBanifitButtonText);
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
      cptCodeId: ''
    };
  }

  initClaimForm() {
    this.claimForm = this.formBuilder.group({
      medicalProvider: [this.selectedMedicalProvider, Validators.required],
      client: [this.selectedClient, Validators.required],
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

  searchMedicalProvider(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialClaimsFacade.searchPharmacies(searchText, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
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
  }

  searchcptcode(cptcode: any) {
    if (!cptcode || cptcode.length == 0) {
      return;
    }
    this.financialClaimsFacade.searchcptcode(cptcode);
  }

  onPaymentTypeValueChange(cptCodeObject: any, index: number) {
    const serviceForm = this.addClaimServicesForm.at(index) as FormGroup;
    let cptCode = serviceForm.controls['cptCode'].value;
    if (cptCodeObject !== PaymentRequestType.FullPay && cptCode.length > 0) {
      serviceForm.controls['amountDue'].setValue(0);
    }
  }

  loadClientBySearchText(clientSearchText: any) {
    if (!clientSearchText || clientSearchText.length == 0) {
      return;
    }
    clientSearchText = clientSearchText.replace("/", "-");
    clientSearchText = clientSearchText.replace("/", "-");
    this.financialClaimsFacade.loadClientBySearchText(clientSearchText);
  }

  get addClaimServicesForm(): FormArray {
    return this.claimForm.get('claimService') as FormArray;
  }
  get addExceptionForm(): FormArray {
    return this.claimForm.get('exceptionArray') as FormArray;
  }

  addClaimServiceGroup() {
    let startDate;
    let endDate;
    if(this.addClaimServicesForm.length > 0){
        startDate = this.addClaimServicesForm.at(0).get('serviceStartDate')?.value;
        endDate = this.addClaimServicesForm.at(0).get('serviceEndDate')?.value;
      }
    let claimForm = this.formBuilder.group({
      serviceStartDate: new FormControl(
        startDate ? startDate : this.medicalClaimServices.serviceStartDate,
        [Validators.required]
      ),
      serviceEndDate: new FormControl(
        endDate ? endDate : this.medicalClaimServices.serviceEndDate,
        [Validators.required]
      ),
      paymentType: new FormControl(this.medicalClaimServices.paymentType, [
        Validators.required,
      ]),
      cptCode: new FormControl(this.medicalClaimServices.cptCode, [
        Validators.required,
      ]),
      pcaCode: new FormControl(this.medicalClaimServices.pcaCode),
      serviceDescription: new FormControl(
        this.medicalClaimServices.serviceDescription,
        [Validators.required]
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

  onClientValueChange(client: any) {
    if (client != undefined) {
      this.clientCaseEligibilityId = client.clientCaseEligibilityId;
      this.clientId = client.clientId;
      this.clientName = client.clientFullName;
      if (this.clientId != null && this.vendorId != null) {
        this.isRecentClaimShow = true;
      }
      this.showServicesListForm= true ;
    }
  }
  removeService(i: number) {
    if(this.isEdit && this.addClaimServicesForm.length == 1)
    {
       this.addClaimServicesForm.reset();
    }
    if(this.addClaimServicesForm.length > 1 ){
    this.addClaimServicesForm.removeAt(i);
    this.addExceptionForm.removeAt(i);
    }
  }

  IsServiceStartDateValid(index: any) {
    let startDateIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    return startDateIsvalid.controls['serviceStartDate'].status == 'INVALID';
  }

  isControlValid(controlName: string, index: any) {
    let control = this.addClaimServicesForm.at(index) as FormGroup;
    return control.controls[controlName].status == 'INVALID';
  }

  onDateChange(index: any) {
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    if(this.isStartEndDateValid(startDate, endDate))
    {
      this.checkIneligibleEception(startDate,endDate,index);
    }

  }

  isEndDateValid(index:any){
    this.currentFormControl = this.addClaimServicesForm.at(index) as FormGroup;
    this.currentFormControl.controls['serviceEndDate'].setErrors({'incorrect':true});
  }

  isStartEndDateError(index : any){
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    if (startDate != "" && endDate != "" && startDate > endDate) {
      serviceFormData.get('serviceEndDate')?.setErrors({invalid : true});
      return true;
    }
    return false;
  }

  isStartEndDateValid(startDate: any, endDate: any): boolean {
    if (startDate != "" && endDate != "" && startDate > endDate) {
      return false;
    }
    return true;
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
    this.cd.detectChanges();
  }

  save(isPcaAssigned: boolean) {
    this.setExceptionValidation();
    this.isSubmitted = true;

    if (!this.claimForm.valid) {
      this.claimForm.markAllAsTouched()
      return;
    }
    let formValues = this.claimForm.value;
    let bodyData = {
      clientId: formValues.client.clientId,
      vendorId: formValues.medicalProvider.vendorId,
      vendorAddressId: formValues.medicalProvider.vendorAddressId,
      claimNbr: formValues.invoiceId,
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      paymentRequestId: this.isEdit ? this.paymentRequestId : null,
      paymentMethodCode: this.isSpotsPayment ? PaymentMethodCode.SPOTS : PaymentMethodCode.ACH,
      exceptionFlag: formValues.parentExceptionFlag,
      exceptionTypeCode: formValues.parentExceptionTypeCode,
      exceptionReasonCode: formValues.parentReasonForException,
      serviceSubTypeCode: this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim,
      pcaCode: null,
      pcaAssignmentId: null,
      isPcaReassignmentNeeded: null,
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
        exceptionTypeCode: element.exceptionTypeCode
      };
      this.validateStartEndDate(service.serviceStartDate,
        service.serviceEndDate);
      if (service.exceptionFlag === StatusFlag.Yes && !service.exceptionReasonCode) {
        checkDeniedClaim = true;
      }
      bodyData.tpaInvoices.push(service);
    }
    bodyData.tpaInvoices.splice(0, 1);
    if((checkDeniedClaim || (bodyData?.exceptionFlag === StatusFlag.Yes && !bodyData?.exceptionReasonCode)) && !isPcaAssigned)
    {
      this.printDenialLetterData = bodyData;
      this.onPrintDenialLetterOpen();
      return;
    }
    this.getPCACode(isPcaAssigned, bodyData);  
}

  getPCACode(isPcaAssigned: boolean, bodyData: any){
    if (!isPcaAssigned) {
      this.getPcaCode(bodyData);
    }
    else {
      if (this.chosenPcaForReAssignment) {
        bodyData.pcaCode = this.chosenPcaForReAssignment?.pcaCode.toString();
        bodyData.pcaAssignmentId = this.chosenPcaForReAssignment?.pcaAssignmentId;
        bodyData.isPcaReassignmentNeeded = this.chosenPcaForReAssignment?.isReAssignmentNeeded;
      }

      this.saveClaim(bodyData);
    }
  }

  validateStartEndDate(startDate: string, endDate: string) {
    if (
      !this.isStartEndDateValid(
        startDate,
        endDate
      )
    ) {
      this.financialClaimsFacade.showHideSnackBar(
        SnackBarNotificationType.ERROR,
        'Start date must less than end date'
      );
    }
  }

  getMinServiceStartDate(arr: any) {
    const timestamps = arr.map((a: any) => new Date(a.serviceStartDate));
    return this.intl.formatDate(new Date(Math.min(...timestamps)), this.configProvider?.appSettings?.dateFormat);
  };

  getMinServiceEndDate(arr: any) {
    const timestamps = arr.map((a: any) => new Date(a.serviceEndDate));
    return this.intl.formatDate(new Date(Math.max(...timestamps)), this.configProvider?.appSettings?.dateFormat);
  };

  private getPcaCode(claim: any) {
    const totalAmountDue = (claim.tpaInvoices as []).reduce((acc, cur) => acc + (cur as any)?.amountDue ?? 0, 0);
    const minServiceStartDate = this.getMinServiceStartDate(claim.tpaInvoices);
    const maxServiceEndDate = this.getMinServiceEndDate(claim.tpaInvoices);
    const request = {
      clientCaseEligibilityId: claim.clientCaseEligibilityId,
      claimAmount: totalAmountDue,
      serviceStartDate: minServiceStartDate,
      serviceEndDate: maxServiceEndDate,
      paymentRequestId: this.isEdit ? claim.paymentRequestId : null,
    };
    this.loaderService.show();
    this.financialClaimsFacade.getPcaCode(request)
      .subscribe({
        next: (response: any) => {
          this.loaderService.hide();
          if (response) {
            if (response?.isReAssignmentNeeded ?? true) {
              this.chosenPcaForReAssignment = response;
              this.onPcaReportAlertClicked(this.pcaExceptionDialogTemplate);
              return;
            }

            claim.pcaCode = response?.pcaCode.toString();
            claim.pcaAssignmentId = response?.pcaAssignmentId;
            claim.isPcaReassignmentNeeded = response?.isReAssignmentNeeded;
            this.saveClaim(claim);
          }
        },
        error: (error: any) => {
          this.loaderService.hide();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            error
          );
        },
      });
  }

  saveClaim(claim: any) {
    if (!this.isEdit) {
      this.saveData(claim);
    } else {
      this.update(claim);
    }
  }

  public saveData(data: any) {
    this.loaderService.show();
    this.financialClaimsFacade.saveMedicalClaim(data, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if (!response) {
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            'An error occure whilie adding claim'
          );
          this.pcaExceptionDialogService.close();
        } else {
          this.closeAddEditClaimsFormModalClicked();
          this.pcaExceptionDialogService.close();
          this.financialPcaFacade.pcaReassignmentCount();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Claim added successfully'
          );
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          error
        );
      },
    });
  }

  public update(data: any) {
    this.isSubmitted = true;
    this.loaderService.show();
    this.financialClaimsFacade.updateMedicalClaim(data, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if (!response) {
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            'An error occure whilie updating claim'
          );
          this.pcaExceptionDialogService.close();
        } else {
          this.closeAddEditClaimsFormModalClicked();
          this.pcaExceptionDialogService.close();
          this.financialPcaFacade.pcaReassignmentCount();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Claim updated successfully'
          );
        }
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          error
        );
      },
    });
  }

  getMedicalClaimByPaymentRequestId() {
    this.loaderService.show();
    this.financialClaimsFacade
      .getMedicalClaimByPaymentRequestId(this.paymentRequestId, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim)
      .subscribe({
        next: (val) => {
          const clients = [
            {
              clientId: val.clientId,
              clientFullName: val.clientName,
            },
          ];
          const vendors = [
            {
              vendorId: val.vendorId,
              providerFullName: val.vendorName,
              vendorAddressId: val.vendorAddressId
            },
          ];
          this.financialClaimsFacade.clientSubject.next(clients);
          this.selectedClient = clients[0];

          this.financialClaimsFacade.pharmaciesSubject.next(vendors);
          this.selectedMedicalProvider = vendors[0];
          this.claimForm.patchValue({
            invoiceId: val.claimNbr,
            paymentRequestId: val.paymentRequestId,
          });
          this.claimForm.controls['parentReasonForException'].setValue(val.exceptionReasonCode);
          this.claimForm.controls['parentExceptionFlag'].setValue(val.exceptionFlag);
          this.claimForm.controls['parentExceptionTypeCode'].setValue(val.exceptionTypeCode);
          if(val.exceptionFlag === StatusFlag.Yes && val.exceptionTypeCode == ExceptionTypeCode.ProviderIneligible)
          {
            this.claimForm.controls['providerNotEligibleExceptionFlag'].setValue(true);
            if(this.claimForm.controls['parentReasonForException'].value)
            {
              this.claimForm.controls['showProviderNotEligibleExceptionReason'].setValue(true);
              this.claimForm.controls['providerNotEligibleExceptionFlagText'].setValue("Don't Make Exception");
            }
          }
          this.isSpotsPayment = val.isSpotsPayment;
          this.invoiceId = val.claimNbr;
          this.clientCaseEligibilityId = val.clientCaseEligibilityId;
          this.paymentRequestId = val.paymentRequestId;
          this.cd.detectChanges();
          this.loaderService.hide();
          this.setFormValues(val.tpaInvoices);
        },
        error: (err) => {
          this.loaderService.hide();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            err
          );
        },
      });
  }

  setFormValues(services: any) {
    for (let i = 0; i < services.length; i++) {
      let service = services[i];
      this.addClaimServiceGroup();
      let serviceForm = this.addClaimServicesForm.at(i) as FormGroup;
      serviceForm.controls['cptCode'].setValue(service.cptCode);
      serviceForm.controls['serviceStartDate'].setValue(
        new Date(service.serviceStartDate)
      );
      serviceForm.controls['serviceEndDate'].setValue(
        new Date(service.serviceEndDate)
      );
      serviceForm.controls['serviceDescription'].setValue(service.serviceDesc);
      serviceForm.controls['serviceCost'].setValue(service.serviceCost);
      serviceForm.controls['amountDue'].setValue(service.amountDue);
      serviceForm.controls['paymentType'].setValue(service.paymentTypeCode);
      serviceForm.controls['tpaInvoiceId'].setValue(service.tpaInvoiceId);
      serviceForm.controls['reasonForException'].setValue(service.exceptionReasonCode);
      serviceForm.controls['cptCode'].setValue(service.cptCode);
      serviceForm.controls['cptCodeId'].setValue(service.cptCodeId);
      serviceForm.controls['exceptionFlag'].setValue(service.exceptionFlag);
      serviceForm.controls['exceptionTypeCode'].setValue(service.exceptionTypeCode);
      let exceptionForm = this.addExceptionForm.at(i) as FormGroup;
      if(serviceForm.controls['exceptionFlag'].value === StatusFlag.Yes && !this.claimForm.controls['parentExceptionTypeCode'])
      {
        this.setExceptionFormValues(exceptionForm,serviceForm);
      }

    }
    this.cd.detectChanges();
  }
  setExceptionFormValues(exceptionform:FormGroup , serviceForm : FormGroup)
  {
    if(serviceForm.controls['exceptionTypeCode'].value === ExceptionTypeCode.ExceedMaxBenefits)
    {
      exceptionform.controls['exceedMaxBenefitExceptionFlag'].setValue(true);
      if (serviceForm.controls['reasonForException'].value) {
        exceptionform.controls['showMaxBenefitExceptionReason'].setValue(true);
        exceptionform.controls['maxBenefitExceptionFlagText'].setValue("Don't Make Exception");
      }
    }
    if(serviceForm.controls['exceptionTypeCode'].value === ExceptionTypeCode.Ineligible)
    {
      exceptionform.controls['ineligibleExceptionFlag'].setValue(true);
    }
    if(serviceForm.controls['exceptionTypeCode'].value === ExceptionTypeCode.OldInvoice)
    {
      exceptionform.controls['OldInvoiceExceptionFlag'].setValue(true);
      if(serviceForm.controls['reasonForException'].value)
      {
        exceptionform.controls['OldInvoiceExceptionReason'].setValue(true);
        exceptionform.controls['oldInvoiceExceptionFlagText'].setValue("Don't Make Exception");
      }
    }
    if(serviceForm.controls['exceptionTypeCode'].value === ExceptionTypeCode.DuplicatePayment)
    {
      exceptionform.controls['duplicatePaymentExceptionFlag'].setValue(true);
      if(serviceForm.controls['reasonForException'].value)
      {
        exceptionform.controls['duplicatePaymentExceptionReason'].setValue(true);
        exceptionform.controls['duplicatePaymentExceptionFlagText'].setValue("Don't Make Exception");
      }
    }
    if(serviceForm.controls['exceptionTypeCode'].value === ExceptionTypeCode.BridgeUpp)
    {
      exceptionform.controls['bridgeUppExceptionFlag'].setValue(true);
      if(serviceForm.controls['reasonForException'].value)
      {
        exceptionform.controls['bridgeUppExceptionReason'].setValue(true);
        exceptionform.controls['bridgeUppExceptionFlagText'].setValue("Don't Make Exception");
      }
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

  onSpotsPaymentChange(check: any) {
    this.isSpotsPayment = check.currentTarget.checked;
    if(this.claimForm.controls['providerNotEligibleExceptionFlag'].value && this.vendorId)
    {
      this.checkProviderNotEligibleException(this.providerTin);
    }
  }

  serviceDescCharCount(i: number) {
    let serviceDescription = this.claimForm.value.claimService[i].serviceDescription;
    if (serviceDescription) {
      return `${serviceDescription.length}/${this.textMaxLength}`;
    }
    return `0/${this.textMaxLength}`;
  }

  reasonCharCount(i: number) {
    let reasonForException = this.claimForm.value.claimService[i].reasonForException;
    if (reasonForException) {
      return `${reasonForException.length}/${this.MaxBenefitExceptionReasonTextLenght}`;
    }
    return `0/${this.MaxBenefitExceptionReasonTextLenght}`;
  }

  onProviderValueChange($event: any) {
    this.isRecentClaimShow = false;
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    this.checkProviderNotEligibleException($event);
  }
  clientValueChange($event: any) {
    this.clientId = $event.clientId;
    this.clientName = $event.clientFullName;
    if (this.clientId != null && this.vendorId != null) {
      this.isRecentClaimShow = true;
    }
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
  getExceptionFormValue(controlName: string, index: any)
  {
    return this.addExceptionForm.at(index).get(controlName)?.value
  }
  public onPrintDenialLetterOpen() {
    this.isPrintDenailLetterClicked = true;
    this.cd.detectChanges();
  }
  onPrintDenialLetterClosed(status: any) {
    this.isPrintDenailLetterClicked = false;
    if(status)
    {
      this.getPcaCode(this.printDenialLetterData);
    }
  }
  onPcaReportAlertClicked(template: TemplateRef<unknown>): void {
    this.pcaExceptionDialogService = this.dialogService.open({
      content: template,
      cssClass: 'app-c-modal app-c-modal-sm app-c-modal-np',
    });
  }

  onPcaAlertCloseClicked(result: any) {
    if (result) {
      this.pcaExceptionDialogService.close();
    }
  }

  onConfirmPcaAlertClicked(chosenPca: any) {
    this.chosenPcaForReAssignment = chosenPca;
    this.save(true);
  }
  getParentExceptionFormValue(controlName:string)
  {
    return this.claimForm.controls[controlName]?.value;
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
      this.claimForm.controls['parentReasonForException']?.setValue('');
    }
    else
    {
      this.claimForm.controls['providerNotEligibleExceptionFlag']?.setValue(false);
      this.claimForm.controls['parentExceptionTypeCode'].setValue('');
      this.claimForm.controls['parentExceptionFlag']?.setValue(StatusFlag.No);
    }
    this.cd.detectChanges();
  }
  checkOldInvoiceException(index:number)
  {
    if(!this.checkPriority(this.oldInvoicePriorityArray,index,'providerNotEligibleExceptionFlag'))
    {
      return;
    }
    const serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    const serviceStartDate = serviceFormData.controls['serviceStartDate'].value;
    const serviceEndDate = serviceFormData.controls['serviceEndDate'].value;
    if(serviceEndDate && serviceStartDate)
    {
      let today = new Date();
      today.setFullYear(today.getFullYear() - 1);
      serviceEndDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if(serviceEndDate < today)
      {
        this.resetExceptionFields(index);
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.setValue(true);
        this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.OldInvoice)
        this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.Yes)
        this.addClaimServicesForm.at(index).get('reasonForException')?.setValue('');
      }
      else
      {
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.setValue(false);
        this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue('')
        this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.No)
      }
    }
    this.cd.detectChanges();
  }
  checkIneligibleEception(startDate:any, endDate:any, index:number)
  {
    const formValues = this.claimForm.value
    if (startDate && endDate && formValues.client?.clientId) {
      startDate = this.intl.formatDate(startDate,  this.dateFormat ) ;
      endDate = this.intl.formatDate(endDate,  this.dateFormat ) ;
      this.financialClaimsFacade.checkIneligibleException(startDate,endDate, formValues.client?.clientId, index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
    }
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
  checkDuplicatePaymentException(index:number)
  {
    if(!this.checkPriority(this.duplicatePaymentPriorityArray,index,'providerNotEligibleExceptionFlag'))
    {
      return;
    }
    const serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    const startDate = this.intl.formatDate(serviceFormData.controls['serviceStartDate'].value,  this.dateFormat );
    const endDate = this.intl.formatDate(serviceFormData.controls['serviceEndDate'].value,  this.dateFormat ) ;
    const dueAmount = serviceFormData.controls['amountDue'].value;
    const vendorId = this.claimForm.value?.medicalProvider?.vendorId
    if (startDate && endDate && dueAmount && vendorId) {
      this.financialClaimsFacade.checkDuplicatePaymentException(startDate,endDate, vendorId,dueAmount, index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
    }
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
      this.financialClaimsFacade.loadExceededMaxBenefit(totalServiceCost,formValues.client.clientId, index, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
      this.exceedMaxBenefitFlag = this.financialClaimsFacade.serviceCostFlag;
    }
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
  onAmountDueChange(index:any)
  {
    this.loadServiceCostMethod(index);
  }
  ngOnDestroy(): void {
    this.showExceedMaxBenefitSubscription.unsubscribe();
    this.showIneligibleSubscription.unsubscribe();
    this.showBridgeUppSubscription.unsubscribe();
    this.showDuplicatePaymentSubscription.unsubscribe();
  }
  showHideServicesListForm(){
    if(this.claimForm.controls['medicalProvider'].value &&  this.claimForm.controls['client'].value)
    {
      this.showServicesListForm = true;
    }
    else
    {
      this.showServicesListForm= false;
      this.isRecentClaimShow =false;
      
    }
  }
}

