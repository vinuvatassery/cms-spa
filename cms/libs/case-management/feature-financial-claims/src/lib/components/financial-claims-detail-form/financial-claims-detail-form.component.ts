
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
  OnDestroy,
  ElementRef
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { groupBy, State } from '@progress/kendo-data-query';
import { EntityTypeCode, FinancialClaimsFacade, PaymentMethodCode, FinancialClaims, ServiceSubTypeCode, PaymentRequestType, FinancialPcaFacade, ExceptionTypeCode, ContactFacade, FinancialVendorFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigurationProvider, LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { Lov, LovFacade, NavigationMenuFacade, ScrollFocusValidationfacade } from '@cms/system-config/domain';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '@progress/kendo-angular-dialog';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
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
  recentClaimsGridLists$ = this.financialClaimsFacade.recentClaimsGridLists$;
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
  private deletedServices : string[] = [];

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
  pcaCode!: any;
  textMaxLength: number = 300;
  exceptionReasonMaxLength = 150;

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

 @ViewChild('providerDetailsTemplate', { read: TemplateRef })
 providerDetailsTemplate!: TemplateRef<any>;

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
  providerDetailsDialog: any;
  vendorProfile$ = this.financialVendorFacade.providePanelSubject$
  showDuplicatePaymentHighlightSubject = this.financialClaimsFacade.showDuplicatePaymentHighlightSubject
  updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$
  ddlStates$ = this.contactFacade.ddlStates$;
  paymentMethodCode$ = this.lovFacade.paymentMethodType$
  batchId: any;
  paymentStatusCode: any;
  duplicatePaymentFlagPaymentRequestId : any;
  tempTpaInvoiceId: any;
  specialCharAdded!: boolean;
  informativeText!: string;
  minServiceDate: Date = new Date(2000, 1, 1);
  todayDate: Date = new Date();
  dataLoaded = false;
  min: Date = new Date('1917/1/1');
  maxDate = new Date('9999/12/31');
  serviceStartDateValidator: boolean[] = [];
  serviceEndDateValidator: boolean[] = [];

  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private readonly elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private lovFacade: LovFacade,
    private readonly activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private readonly intl: IntlService,
    private readonly configProvider: ConfigurationProvider,
    private readonly financialPcaFacade: FinancialPcaFacade,
    public contactFacade: ContactFacade,
    private readonly financialVendorFacade : FinancialVendorFacade,
    private readonly navigationMenuFacade: NavigationMenuFacade,
    private route: Router,
    private scrollFocusValidationfacade: ScrollFocusValidationfacade
  ) {
    this.initMedicalClaimObject();
    this.initClaimForm();
  }

  closeAddEditClaimsFormModalClicked(refresh : boolean) {
    this.modalCloseAddEditClaimsFormModal.emit(refresh);
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
      this.informativeText = 'Select a Medical Provider to bulk add services for this claim'
      this.addClaimServiceGroup();
    }
    else if (!this.isEdit && this.claimsType != this.financialProvider) {
      this.title = 'Add Dental';
      this.addOrEdit = 'Add';
      this.informativeText = 'Select a Dental Provider to bulk add services for this claim'
      this.addClaimServiceGroup();
    }

    if (this.isEdit) {
      this.title = 'Edit';
      this.informativeText = 'Make changes as needed and click “Update.”';
      this.showServicesListForm = true;
      this.addOrEdit = 'Update';
      this.duplicatePaymentFlagPaymentRequestId = this.paymentRequestId;
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
    this.cd.detectChanges()
  }

  onCloseViewProviderDetailClicked(result: any){
    if(result){
      this.providerDetailsDialog.close();
    }
  }

  onVendorNameClick(){
    this.providerDetailsDialog = this.dialogService.open({
      content: this.providerDetailsTemplate,
      animation:{
        direction: 'left',
        type: 'slide',
      },
      cssClass: 'app-c-modal app-c-modal-np app-c-modal-right-side',
    });

  }

  getProviderPanel(event:any){
    this.financialVendorFacade.getProviderPanelByVendorAddressId(this.selectedMedicalProvider.vendorAddressId)

  }

  updateProviderProfile(event:any){
    this.financialVendorFacade.updateProviderPanel(event)
  }

  OnEditProviderProfileClick(){
    this.contactFacade.loadDdlStates()
    this.lovFacade.getPaymentMethodLov()
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
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.ExceedMaxBenefits)
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.Yes)
        }
        else if (this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.value === ExceptionTypeCode.ExceedMaxBenefits)
        {
          this.addExceptionForm.at(data?.indexNumber).get('exceedMaxBenefitExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue('');
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.No);
          this.checkOldInvoiceException(data?.indexNumber);
          this.checkBridgeUppEception(data?.indexNumber);
        }
        if (!data?.flag)
        {
          this.duplicatePaymentObject.isDuplicatePaymentFound =true;
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
      if (!data?.flag)
      {
        this.checkDuplicatePaymentException(data?.indexNumber);
        this.checkOldInvoiceException(data?.indexNumber);
        this.checkBridgeUppEception(data?.indexNumber);
      }
      this.cd.detectChanges();
    });
    this.showBridgeUppSubscription = this.showBridgeUppException$.subscribe(data => {
      if(data)
      {
        if(data?.flag)
        {
          this.resetExceptionFields(data?.indexNumber);
          this.addExceptionForm.at(data?.indexNumber).get('bridgeUppExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
          this.addExceptionForm.at(data?.indexNumber).get('bridgeUppExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.BridgeUpp)
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.Yes)
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');

        }
        else if (this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.value === ExceptionTypeCode.BridgeUpp)
        {
          this.addExceptionForm.at(data?.indexNumber).get('bridgeUppExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue('')
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.No)
        }
        this.cd.detectChanges();
      }
    });
    this.showDuplicatePaymentSubscription = this.showDuplicatePaymentException$.subscribe(data => {
      if(data)
      {
        if(data?.flag)
        {
          this.getDuplicateData();
          this.showDuplicatePaymentHighlightSubject.next(true);
          this.resetExceptionFields(data?.indexNumber);
          this.addExceptionForm.at(data?.indexNumber).get('duplicatePaymentExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
          this.addExceptionForm.at(data?.indexNumber).get('duplicatePaymentExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.DuplicatePayment)
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.Yes)
          this.addClaimServicesForm.at(data?.indexNumber).get('reasonForException')?.setValue('');
        }
        else if (this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.value === ExceptionTypeCode.DuplicatePayment)
        { this.duplicatePaymentObject = {}
          this.showDuplicatePaymentHighlightSubject.next(false);
          this.addExceptionForm.at(data?.indexNumber).get('duplicatePaymentExceptionFlag')?.setValue(data?.flag);
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionTypeCode')?.setValue('')
          this.addClaimServicesForm.at(data?.indexNumber).get('exceptionFlag')?.setValue(StatusFlag.No)
          this.checkOldInvoiceException(data?.indexNumber);
          this.checkBridgeUppEception(data?.indexNumber);
        }
        this.cd.detectChanges();
      }
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
      providerNotEligibleExceptionFlagText: new FormControl(this.isExcededMaxBanifitButtonText),
      pcaCode : new FormControl('')
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
    this.checkDuplicatePaymentException(index);
  }

  searchcptcode(cptcode: any, index: number) {
    if (!cptcode || cptcode.length == 0) {
      if (this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.value === ExceptionTypeCode.BridgeUpp)
      {
        this.addExceptionForm.at(index).get('bridgeUppExceptionFlag')?.setValue(false);
        this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue('')
        this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.No)
      }
      return;
    }
    let ctpCodeIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    ctpCodeIsvalid.patchValue({
      serviceDescription: '',
      medicadeRate: '',
      cptCodeId: '',
    });
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
      pcaCode: new FormControl({value: this.medicalClaimServices.pcaCode, disabled:true}),
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
    this.serviceStartDateValidator.push(true);
    this.serviceEndDateValidator.push(true);
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
      this.checkForChildClaimFlags(true);
    }
  }
  removeService(i: number) {
    let servicCount = 0;;
    for(let service of this.claimForm.value.claimService) {
      if (service.tpaInvoiceId) {
        servicCount++;
      }
    }
    if (servicCount == 1) {
      let formControl = this.addClaimServicesForm.controls[i];
      this.tempTpaInvoiceId = this.addClaimServicesForm.value[i].tpaInvoiceId;
      if (this.tempTpaInvoiceId != null || this.tempTpaInvoiceId != undefined) {
        formControl.reset();
      } else {
        this.addClaimServicesForm.removeAt(i);
        this.addExceptionForm.removeAt(i);
      }
      return;
    }

    if(this.addClaimServicesForm.length > 1 ){
    let form = this.addClaimServicesForm.value[i];
    if (form.tpaInvoiceId) {
      this.deletedServices.push(form.tpaInvoiceId);
    }
    this.addClaimServicesForm.removeAt(i);
    this.addExceptionForm.removeAt(i);
    }
  }

  IsServiceStartDateValid(index: any) {
    let startDateIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    return startDateIsvalid.controls['serviceStartDate'].status == 'INVALID';
  }

  isControlValid(controlName: string, index: any) {
    let form = this.addClaimServicesForm.at(index) as FormGroup;
    let control = form.controls[controlName];
    if(control){
      return control?.errors?.['required'] && control.touched;
    }
    return false;
  }

  isAmountDueValid(index: any) {
    let control = this.addClaimServicesForm.at(index) as FormGroup;
    if(control.controls['amountDue']?.value
    && control.controls['serviceCost']?.value
    && (control.controls['amountDue']?.value ?? 0) > (control.controls['serviceCost']?.value ?? 0)){
      control.get('amountDue')?.setErrors({invalid : true});
      return true;
    }

    if(control.controls['amountDue']?.value){
      control.get('amountDue')?.setErrors(null);
    }
    return false;
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
    if (startDate != "" && startDate != null && endDate != null && endDate != "" && startDate > endDate) {
      serviceFormData.get('serviceEndDate')?.setErrors({invalid : true});
      return true;
    }
    serviceFormData.get('serviceEndDate')?.setErrors(null);
    return false;
  }

  isStartGreaterThanCurrentDate(index : any){
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    if (startDate > this.todayDate) {
      serviceFormData.get('serviceStartDate')?.setErrors({invalid : true});
      return true;
    }
    serviceFormData.get('serviceStartDate')?.setErrors(null);
    return false;
  }

  isEndGreaterThanCurrentDate(index : any){
    let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    if (endDate > this.todayDate) {
      serviceFormData.get('serviceEndDate')?.setErrors({invalid : true});
      return true;
    }
    serviceFormData.get('serviceEndDate')?.setErrors(null);
    return false;
  }

  isStartEndDateValid(startDate: any, endDate: any): boolean {
    if (startDate == "" || endDate == "" || startDate < this.minServiceDate || endDate < this.minServiceDate || startDate > endDate) {
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
      this.cd.detectChanges();
      const invalidControl = this.scrollFocusValidationfacade.findInvalidControl(this.claimForm, this.elementRef.nativeElement,null);
      if (invalidControl) {
        invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidControl.focus();
      }

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
      paymentMethodCode: this.isSpotsPayment ? PaymentMethodCode.SPOTS : formValues.medicalProvider.paymentMethodCode,
      exceptionFlag: formValues.parentExceptionFlag,
      exceptionTypeCode: formValues.parentExceptionTypeCode,
      exceptionReasonCode: formValues.parentReasonForException,
      serviceSubTypeCode: this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim,
      pcaCode: null,
      pcaAssignmentId: null,
      isPcaReassignmentNeeded: null,
      tpaInvoices: [{}],
      deletedInvoices : this.deletedServices
    };
    let isTpaInvoiceHasException = false;
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
        tpaInvoiceId: element.tpaInvoiceId ?? this.tempTpaInvoiceId,
        exceptionFlag: element.exceptionFlag,
        exceptionTypeCode: element.exceptionTypeCode,
        pcaCode:element.pcaCode
      };
      this.validateStartEndDate(service.serviceStartDate,
        service.serviceEndDate);
      if (service.exceptionFlag === StatusFlag.Yes) {
        isTpaInvoiceHasException = true;
        checkDeniedClaim = !service.exceptionReasonCode;
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

    if(bodyData.exceptionFlag === StatusFlag.Yes || isTpaInvoiceHasException){
      this.saveClaim(bodyData);
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
      clientId: claim.clientId,
      clientCaseEligibilityId: claim.clientCaseEligibilityId,
      claimAmount: totalAmountDue,
      serviceStartDate: minServiceStartDate,
      serviceEndDate: maxServiceEndDate,
      paymentRequestId: this.isEdit ? claim.paymentRequestId : null,
      objectLedgerName : 'Third Party (TPA)'
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
      claim.paymentStatusCode = this.paymentStatusCode;
      claim.batchId = this.batchId;
      this.update(claim);
    }
  }

  public saveData(data: any) {
    this.loaderService.show();
    this.financialClaimsFacade.saveMedicalClaim(data, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if (!response) {
          this.pcaExceptionDialogService?.close();
        } else {
          let invoiceWithExceedMaxBenefitException = data.tpaInvoices.filter((item: any) => item.exceptionTypeCode === ExceptionTypeCode.ExceedMaxBenefits && item.exceptionReasonCode);
          if(invoiceWithExceedMaxBenefitException)
            {
              this.loadPendingApprovalGeneralCount();
            }
          this.financialClaimsFacade.loadClientBySearchText("");  
          this.closeAddEditClaimsFormModalClicked(true);
          this.pcaExceptionDialogService?.close();
          this.financialPcaFacade.pcaReassignmentCount();
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
          this.navigationMenuFacade.pcaReassignmentCount();
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
        if (response) {
          let invoiceWithExceedMaxBenefitException = data.tpaInvoices.filter((item: any) => item.exceptionTypeCode === ExceptionTypeCode.ExceedMaxBenefits);
          if(invoiceWithExceedMaxBenefitException)
            {
              this.loadPendingApprovalGeneralCount();
            }
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            response.message
          );
          this.financialClaimsFacade.loadClientBySearchText("");  
         this.closeAddEditClaimsFormModalClicked(true);
          this.pcaExceptionDialogService.close();
          this.financialPcaFacade.pcaReassignmentCount();
          this.navigationMenuFacade.pcaReassignmentCount();

        } else {
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            'An error occure whilie updating claim'
          );
          this.pcaExceptionDialogService.close();
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
          this.batchId = val.batchId;
          this.paymentStatusCode = val.paymentStatusCode;
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
              vendorAddressId: val.vendorAddressId,
              vendorName: val.vendorName,
              tin: val.tin,
              mailCode: val.mailCode
            },
          ];
          this.financialClaimsFacade.clientSubject.next(clients);
          this.selectedClient = clients[0];

          this.financialClaimsFacade.pharmaciesSubject.next(vendors);
          this.selectedMedicalProvider =  vendors[0];
          this.vendorId =  val.vendorId;
          this.clientId = val.clientId
          this.claimForm.patchValue({
            invoiceId: val.claimNbr,
            paymentRequestId: val.paymentRequestId,
          });
          if(this.isEdit){
            this.isRecentClaimShow = true;
            this.clientName = val.clientName;
            this.vendorName = val.vendorName;
            this.dataLoaded = true;
          }
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
      serviceForm.controls['pcaCode'].setValue(service.pcaCode);
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
    if(this.vendorId)
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
      return `${reasonForException.length}/${this.exceptionReasonMaxLength}`;
    }
    return `0/${this.exceptionReasonMaxLength}`;
  }

  parentReasonCharCount() {
    let reasonForException = this.claimForm.value.parentReasonForException;
    if (reasonForException) {
      return `${reasonForException.length}/${this.exceptionReasonMaxLength}`;
    }
    return `0/${this.exceptionReasonMaxLength}`;
  }

  onProviderValueChange($event: any) {
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    if (this.clientId != null && this.vendorId != null) {
      this.isRecentClaimShow = true;
    }
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
      this.resetReasonForException(index);
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue("Make Exception");
      this.resetReasonForException(index);
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('bridgeUppExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('bridgeUppExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('bridgeUppExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('bridgeUppExceptionFlagText')?.setValue("Make Exception");
      this.resetReasonForException(index);
    }
    else if(this.addExceptionForm.at(index).get(controlName)?.value && this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlagText')?.setValue("Don't Make Exception");
    } else if(this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlag')?.value) {
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlagText')?.setValue("Make Exception");
      this.resetReasonForException(index);
    }
  }

  resetReasonForException(index:any)
  {
    this.addClaimServicesForm.at(index).get('reasonForException')?.reset();
  }

duplicatePaymentObject:any = {};
  getExceptionFormValue(controlName: string, index: any)
  {
    let formValue = this.addExceptionForm.at(index).get(controlName)?.value;
    const ctpCodeIsvalid = this.addClaimServicesForm.at(index) as FormGroup;
    if(formValue && (controlName == 'bridgeUppExceptionFlag' || controlName == 'bridgeUppExceptionFlagText')){
      ctpCodeIsvalid?.controls['cptCode'].setErrors({'incorrect': true});
    }else{
      ctpCodeIsvalid?.controls['cptCode'].setErrors({'incorrect': null});
      ctpCodeIsvalid?.controls['cptCode'].updateValueAndValidity();
    }
    return formValue;
  }
  public onPrintDenialLetterOpen() {
    this.isPrintDenailLetterClicked = true;
    this.cd.detectChanges();
  }
  onPrintDenialLetterClosed(status: any) {
    this.isPrintDenailLetterClicked = false;
    if(status)
    {
      this.saveClaim(this.printDenialLetterData);
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
      this.claimForm.controls['parentReasonForException'].reset();
    }
  }
  checkProviderNotEligibleException($event:any)
  {
    let checkException = true;
    this.addExceptionForm.controls.forEach((element, index) => {
      checkException = this.checkPriority(this.providerNotEligiblePriorityArray,index,null);
      if(!checkException)
      {
        return;
      }
    });
    if(!checkException)
    {
      return;
    }
    if(!$event?.tin && !this.isSpotsPayment)
    {
      this.addExceptionForm.reset();
      this.claimForm.controls['providerNotEligibleExceptionFlag']?.setValue(true);
      this.claimForm.controls['parentExceptionTypeCode'].setValue(ExceptionTypeCode.ProviderIneligible);
      this.claimForm.controls['parentExceptionFlag']?.setValue(StatusFlag.Yes);
      this.claimForm.controls['parentReasonForException']?.setValue('');
    }
    else if (this.claimForm.controls['parentExceptionTypeCode']?.value === ExceptionTypeCode.ProviderIneligible)
    {
      this.claimForm.controls['providerNotEligibleExceptionFlag']?.setValue(false);
      this.claimForm.controls['parentExceptionTypeCode'].setValue('');
      this.claimForm.controls['parentExceptionFlag']?.setValue(StatusFlag.No);
      this.checkForChildClaimFlags(false);
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
      if(serviceEndDate <= today)
      {
        this.resetExceptionFields(index);
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlagText')?.setValue(this.isExcededMaxBanifitButtonText);
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.setValue(true);
        this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue(ExceptionTypeCode.OldInvoice)
        this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.Yes)
        this.addClaimServicesForm.at(index).get('reasonForException')?.setValue('');
      }
      else if (this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.value === ExceptionTypeCode.OldInvoice)
      {
        this.addExceptionForm.at(index).get('oldInvoiceExceptionFlag')?.setValue(false);
        this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue('');
        this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.No);
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
    if (cptCode && clientId && startDate && endDate) {
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
    const data = {
      invoiceId: this.claimForm.value?.invoiceId,
      clientId: this.claimForm.value?.client.clientId,
      startDate: this.intl.formatDate(serviceFormData.controls['serviceStartDate'].value,  this.dateFormat ),
      endDate: this.intl.formatDate(serviceFormData.controls['serviceEndDate'].value,  this.dateFormat ),
      vendorId: this.claimForm.value?.medicalProvider?.vendorId,
      totalAmountDue:serviceFormData.controls['amountDue'].value,
      paymentRequestId :this.duplicatePaymentFlagPaymentRequestId,
      indexNumber: index,
      typeCode : this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim
    };

    if (data.startDate && data.endDate && data.totalAmountDue && data.vendorId && data.invoiceId) {
      this.financialClaimsFacade.checkDuplicatePaymentException(data);
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
      if(totalServiceCost>0){
        this.financialClaimsFacade.loadExceededMaxBenefit(totalServiceCost,formValues.client.clientId, index,
          this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim, this.clientCaseEligibilityId
          ,this.paymentRequestId);
      }
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
    const amountDue = this.addClaimServicesForm.at(index).get('amountDue')?.value;
    if(!amountDue)
    {
      this.removeAmountDueRelatedClaimFlags(index);
      return;
    }
    this.loadServiceCostMethod(index);
  }

  removeAmountDueRelatedClaimFlags(index : any)
  {
    if (this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.value === ExceptionTypeCode.DuplicatePayment)
    {
      this.duplicatePaymentObject = {}
      this.showDuplicatePaymentHighlightSubject.next(false);
      this.addExceptionForm.at(index).get('duplicatePaymentExceptionFlag')?.setValue(false);
      this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue('')
      this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.No)
      this.checkOldInvoiceException(index);
      this.checkBridgeUppEception(index);
    }

    if (this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.value === ExceptionTypeCode.ExceedMaxBenefits)
    {
      this.addExceptionForm.at(index).get('exceedMaxBenefitExceptionFlag')?.setValue(false);
      this.addClaimServicesForm.at(index).get('exceptionTypeCode')?.setValue('');
      this.addClaimServicesForm.at(index).get('exceptionFlag')?.setValue(StatusFlag.No);
      this.checkOldInvoiceException(index);
      this.checkBridgeUppEception(index);
    }
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
  deleteClaimService(tpaInvoiceId:any){
    this.financialClaimsFacade.deleteClaimService(tpaInvoiceId,this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim).subscribe({
      next:()=>{
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Service Deleted'
        );
      },
      error:(err:any)=> {
        this.loaderService.hide();
        this.financialClaimsFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          err
        );
      },
    })
  }
  getDuplicateData()
  {
    this.duplicatePaymentObject.amountDue = this.addClaimServicesForm.at(0).get('amountDue')?.value;
    this.duplicatePaymentObject.serviceStartDate = this.addClaimServicesForm.at(0).get('serviceStartDate')?.value;
    this.duplicatePaymentObject.serviceEndDate = this.addClaimServicesForm.at(0).get('serviceEndDate')?.value;
  }

  checkForChildClaimFlags(ineligibleCheck : boolean)
  {
    if(ineligibleCheck)
    {
      this.addClaimServicesForm.controls.forEach((element, index) => {
        let serviceFormData = this.addClaimServicesForm.at(index) as FormGroup;
        let startDate = serviceFormData.controls['serviceStartDate'].value;
        let endDate = serviceFormData.controls['serviceEndDate'].value;
        if(startDate && endDate){
          this.checkIneligibleEception(startDate, endDate, index);
        }
      });
    }
    this.addClaimServicesForm.controls.forEach((element, index) => {
      this.loadServiceCostMethod(index);
      this.checkOldInvoiceException(index);
      this.checkBridgeUppEception(index);
    });
  }

  onClientClicked(clientId: any) {
    this.route.navigate([`/case-management/cases/case360/${clientId}`]);
    this.closeAddEditClaimsFormModalClicked(false);
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

  loadPendingApprovalGeneralCount() {

    this.navigationMenuFacade.getPendingApprovalGeneralCount();
  }


  dateValidate(index: any, type: any) {
  
    if (index >= 0) {
      const fg = this.addClaimServicesForm.controls[index];
      
      switch (type.toUpperCase()) {
        case "SERVICESTARTDATE":
          const serviceStartDateControl = fg.get('serviceStartDate');
          serviceStartDateControl?.setErrors(null);
          
          this.serviceStartDateValidator[index] = true;
          if (!this.isValidDateFormat(serviceStartDateControl?.value) || serviceStartDateControl?.value < this.min || serviceStartDateControl?.value > this.maxDate) {
            this.serviceStartDateValidator[index] = false;
            serviceStartDateControl?.setErrors({ 'incorrect': true });
            return;
          }
          
          break;
    
        case "SERVICEENDDATE":
          const serviceEndDateControl = fg.get('serviceEndDate');
          serviceEndDateControl?.setErrors(null);
          
          this.serviceEndDateValidator[index] = true;
          if (!this.isValidDateFormat(serviceEndDateControl?.value) || serviceEndDateControl?.value < this.min || serviceEndDateControl?.value > this.maxDate) {
            this.serviceEndDateValidator[index] = false;
            serviceEndDateControl?.setErrors({ 'incorrect': true });
            return;
          }
          break;
      }
    }
    
  }
  isValidDateFormat(dateString: string): boolean {
    if(dateString){
      const regex = /^[A-Z][a-z]{2}\s[A-Z][a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT[-+]\d{4}\s\((\w+)\sStandard\sTime\)$/;
      return regex.test(dateString);
    }
    else{
      return false
    }
  }
}

