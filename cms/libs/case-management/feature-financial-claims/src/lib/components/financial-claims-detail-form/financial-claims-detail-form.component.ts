import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import { EntityTypeCode, FinancialClaimsFacade } from '@cms/case-management/domain';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from '@cms/system-config/domain';
import { ActivatedRoute } from '@angular/router';
import {FinancialProvider} from '@cms/case-management/domain'
import {PaymentMethodCode} from '@cms/case-management/domain'
import {FinancialClaims} from '@cms/case-management/domain'

@Component({
  selector: 'cms-financial-claims-detail-form',
  templateUrl: './financial-claims-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsDetailFormComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
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
  vendorId:any;
  clientId:any;
  vendorName:any;
  clientName:any;
  isRecentClaimShow:boolean=false;
  @Input() claimsType: any;
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
  isSpotsPayment!: boolean ;
  textMaxLength: number = 300;

  @Input() isEdit: any;
  @Input() paymentRequestId: any;
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  readonly financialProvider = 'medical';

  constructor(private readonly financialClaimsFacade: FinancialClaimsFacade,
    private formBuilder: FormBuilder,
      private cd: ChangeDetectorRef,
      private readonly loaderService: LoaderService,
      private lovFacade: LovFacade,
      private readonly activatedRoute: ActivatedRoute,
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
    this.activatedRoute.params.subscribe(data => {
      this.claimsType = data['type']
    });


    if (!this.isEdit && this.claimsType == this.financialProvider) {
      this.title = 'Add Medical';
      this.addOrEdit = 'Add';
      this.addClaimServiceGroup();
    }
    else if(!this.isEdit && this.claimsType != this.financialProvider){
      this.title = 'Add Dental';
      this.addOrEdit = 'Add';
      this.addClaimServiceGroup();
    }
    
    if (this.isEdit) {
      this.title = 'Edit';
      this.addOrEdit = 'Edit';
      this.getMedicalClaimByPaymentRequestId();
    }
  }

  initMedicalClaimObject(){
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
      claimService: new FormArray([]),
    });
  }

  searchMedicalProvider(searchText: any) {
    this.financialClaimsFacade.searchPharmacies(searchText, this.claimsType == this.financialProvider ? FinancialProvider.MedicalProvider : FinancialProvider.DentalProvider);
  }
  onCPTCodeValueChange(event: any, index: number) {
    let service = event;
    let ctpCodeIsvalid = this.AddClaimServicesForm.at(index) as FormGroup;
    ctpCodeIsvalid.patchValue({
      cptCode: service.cptCode1,
      serviceDescription: service.serviceDesc != undefined ? service.serviceDesc : '',
      medicadeRate: service.medicaidRate,
      cptCodeId: service.cptCodeId,
    });
    this.calculateMedicadeRate(index);
  }
  searchcptcode(cptcode: any) {
    this.financialClaimsFacade.searchcptcode(cptcode);
  }

  loadClientBySearchText(searchText: any) {
    this.financialClaimsFacade.loadClientBySearchText(searchText);
  }

  get AddClaimServicesForm(): FormArray {
    return this.claimForm.get('claimService') as FormArray;
  }

  addClaimServiceGroup() {
    let claimForm = this.formBuilder.group({
      serviceStartDate: new FormControl(
        this.medicalClaimServices.serviceStartDate,
        [Validators.required]
      ),
      serviceEndDate: new FormControl(
        this.medicalClaimServices.serviceEndDate,
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
      medicadeRate: new FormControl(this.medicalClaimServices.medicadeRate),
      paymentRequestId: new FormControl(),
      tpaInvoiceId: new FormControl(),
      cptCodeId: new FormControl(this.medicalClaimServices.cptCodeId, [
        Validators.required,
      ]),
    });
    this.AddClaimServicesForm.push(claimForm);
  }

  onClientValueChange(event: any) {
    this.clientCaseEligibilityId = event.clientCaseEligibilityId;
  }

  removeService(i: number) {
    this.AddClaimServicesForm.removeAt(i);
  }

  IsServiceStartDateValid(index: any) {
    let startDateIsvalid = this.AddClaimServicesForm.at(index) as FormGroup;
    return startDateIsvalid.controls['serviceStartDate'].status == 'INVALID';
  }

  isControlValid(controlName: string, index: any) {
    let control = this.AddClaimServicesForm.at(index) as FormGroup;
    return control.controls[controlName].status == 'INVALID';
  }

  onDateChange(index: any) {
    let serviceFormData = this.AddClaimServicesForm.at(index) as FormGroup;
    let startDate = serviceFormData.controls['serviceStartDate'].value;
    let endDate = serviceFormData.controls['serviceEndDate'].value;
    this.isStartEndDateValid(startDate, endDate);
  }

  isStartEndDateValid(startDate: any, endDate: any): boolean {
    if (startDate != "" && endDate != "" && startDate > endDate) {
      this.financialClaimsFacade.errorShowHideSnackBar(
        'Start date must less than end date'
      );
      return false;
    }
    return true;
  }

  save() {
    this.isSubmitted = true;    
    if (!this.claimForm.valid) {
      this.claimForm.markAllAsTouched()
      return;
    }
    let formValues = this.claimForm.value;

    let bodyData = {
      clientId: formValues.client.clientId,
      vendorId: formValues.medicalProvider.vendorId,
      claimNbr: formValues.invoiceId,
      clientCaseEligibilityId: this.clientCaseEligibilityId,      
      paymentRequestId: this.isEdit ? this.paymentRequestId : null,
      paymentMethodCode: this.isSpotsPayment ? PaymentMethodCode.SPOTS: PaymentMethodCode.ACH,
      serviceSubTypeCode: this.claimsType == this.financialProvider ? "MEDICAL": "DENTAL",
      tpainvoice: [{}],
    };
    for (let element  of formValues.claimService) {
      let service = {
        vendorId: bodyData.vendorId,
        clientId: bodyData.clientId,
        claimNbr: element.invoiceId,
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        cptCode: element.cptCode,
        serviceStartDate: element.serviceStartDate,
        serviceEndDate: element.serviceEndDate,
        PaymentTypeCode: element.paymentType,
        serviceCost: element.serviceCost,
        entityTypeCode: EntityTypeCode.Vendor,
        amountDue: element.amountDue,
        ServiceDesc: element.serviceDescription,
        exceptionReasonCode: element.reasonForException,
        tpaInvoiceId: element.tpaInvoiceId,
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
      bodyData.tpainvoice.push(service);
    }
    bodyData.tpainvoice.splice(0, 1);
    if (!this.isEdit) {
      this.saveData(bodyData);
    } else {
      this.update(bodyData);
    }
  }

  public saveData(data: any) {
    this.loaderService.show();
    this.financialClaimsFacade.saveMedicalClaim(data,this.claimsType == this.financialProvider ? FinancialProvider.MedicalProvider : FinancialProvider.DentalProvider).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if (!response) {
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            'An error occure whilie adding claim'
          );
        } else {
          this.closeAddEditClaimsFormModalClicked();
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
    this.financialClaimsFacade.updateMedicalClaim(data,this.claimsType == this.financialProvider ? FinancialProvider.MedicalProvider : FinancialProvider.DentalProvider).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if (!response) {
          this.financialClaimsFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            'An error occure whilie updating claim'
          );
        } else {
          this.closeAddEditClaimsFormModalClicked();
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
      .getMedicalClaimByPaymentRequestId(this.paymentRequestId,this.claimsType == this.financialProvider ? FinancialProvider.MedicalProvider : FinancialProvider.DentalProvider)
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
          this.isSpotsPayment = val.isSpotsPayment;
          this.invoiceId = val.claimNbr;
          this.clientCaseEligibilityId = val.clientCaseEligibilityId;
          this.paymentRequestId = val.paymentRequestId;
          this.cd.detectChanges();
          this.loaderService.hide();
          this.setFormValues(val.tpainvoice);
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
      let serviceForm = this.AddClaimServicesForm.at(i) as FormGroup;
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
    }
    this.cd.detectChanges();
  }

  calculateMedicadeRate(index: number) {
    const serviceForm = this.AddClaimServicesForm.at(index) as FormGroup;
    let paymentType = serviceForm.controls['paymentType'].value;
    if (paymentType == 'FULL_PAY') {
      const medicadeRate = serviceForm.controls['medicadeRate'].value ?? 0;
      let amoundDue = serviceForm.controls['amountDue'].value ?? 0;
      if (medicadeRate > 0 && amoundDue > 0) {
        amoundDue = medicadeRate * 0.25 + amoundDue;
        serviceForm.controls['amountDue'].setValue(amoundDue);
      }
    }
  }

  onSpotsPaymentChange(check: any){
    this.isSpotsPayment = check.currentTarget.checked;
  }

  serviceDescCharCount( i: number){
    let serviceDescription = this.claimForm.value.claimService[i].serviceDescription; 
    if(serviceDescription){
      return `${serviceDescription.length}/${this.textMaxLength}`;
    }
    return `0/${this.textMaxLength}`;
  }

  reasonCharCount(i: number){    
    let reasonForException = this.claimForm.value.claimService[i].reasonForException;
    if(reasonForException){
      return `${reasonForException.length}/${this.textMaxLength}`;
    }    
    return `0/${this.textMaxLength}`;
  }

}

