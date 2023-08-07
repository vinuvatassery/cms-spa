import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { State } from '@progress/kendo-data-query';
import {
  EntityTypeCode,
  FinancialMedicalClaimsFacade,
  FinancialVendorRefundFacade,
  WorkflowFacade,
} from '@cms/case-management/domain';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade } from 'libs/system-config/domain/src/lib/application/lov.facade';

@Component({
  selector: 'cms-medical-claims-detail-form',
  templateUrl: './medical-claims-detail-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsDetailFormComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  isShownSearchLoader = false;
  claimsListData$ = this.financialMedicalClaimsFacade.claimsListData$;
  sortValue = this.financialMedicalClaimsFacade.sortValueClaims;
  sortType = this.financialMedicalClaimsFacade.sortType;
  pageSizes = this.financialMedicalClaimsFacade.gridPageSizes;
  gridSkipCount = this.financialMedicalClaimsFacade.skipCount;
  sort = this.financialMedicalClaimsFacade.sortClaimsList;
  state!: State;

  paymentRequestType$ = this.lovFacade.paymentRequestType$;
  medicalProvidersearchLoaderVisibility$ =
    this.financialVendorRefundFacade.medicalProviderSearchLoaderVisibility$;
  pharmacySearchResult$ = this.financialVendorRefundFacade.pharmacies$;

  clientSearchLoaderVisibility$ =
    this.financialVendorRefundFacade.clientSearchLoaderVisibility$;
  clientSearchResult$ = this.financialVendorRefundFacade.clients$;

  isSubmitted: boolean = false;
  selectedMedicalProvider: any;
  selectedClient: any;
  invoiceId: any;
  claimForm!: FormGroup;
  medicalClaimServices = new MedicalClaims();
  sessionId: any = '';
  clientCaseEligibilityId: any = null;
  isEdit = false;
  paymentRequestId: any;
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();

  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private lovFacade: LovFacade
  ) {
    this.initClaimForm();
  }

  ngOnInit(): void {
    this.lovFacade.getCoPaymentRequestTypeLov();
    if (!this.isEdit) {
      this.addClaimServiceGroup();
    }
    if (this.isEdit) {
      this.getMedicalClaimByPaymentRequestId();
    }
  }

  closeAddEditClaimsFormModalClicked() {
    this.modalCloseAddEditClaimsFormModal.emit(true);
  }

  loadClaimsListGrid() {
    this.financialMedicalClaimsFacade.loadClaimsListGrid();
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
    this.financialVendorRefundFacade.searchPharmacies(searchText);
  }

  searchcptcode(cptcode: any, index: number) {
    this.financialMedicalClaimsFacade.searchcptcode(cptcode).subscribe({
      next: (response: any) => {
        let service = response[0];
        let ctpCodeIsvalid = this.AddClaimServicesForm.at(index) as FormGroup;
        ctpCodeIsvalid.patchValue({
          cptCode: service.cptCode1,
          serviceDescription: service.serviceDesc,
          medicadeRate: service.medicadeRate,
        });
        this.calculateMedicadeRate(index);
        this.cd.detectChanges();
      },
      error: (error: any) => {},
    });
  }

  loadClientBySearchText(searchText: any) {
    this.financialVendorRefundFacade.loadClientBySearchText(searchText);
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
      serviceCost: new FormControl(this.medicalClaimServices.serviceCost),
      amountDue: new FormControl(this.medicalClaimServices.amountDue, [
        Validators.required,
      ]),
      reasonForException: new FormControl(
        this.medicalClaimServices.reasonForException
      ),
      medicadeRate: new FormControl(this.medicalClaimServices.medicadeRate),
      paymentRequestId : new FormControl(),
      tpaInvoiceId: new FormControl(),      
    });
    this.AddClaimServicesForm.push(claimForm);
    this.cd.detectChanges();
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
    if (startDate > endDate) {
      this.financialVendorRefundFacade.showHideSnackBar(
        SnackBarNotificationType.ERROR,
        'Start date must less than end date'
      );
      return false;
    }
    return true;
  }

  save() {
    this.isSubmitted = true;
    let formValues = this.claimForm.value;

    let bodyData = {
      clientId: formValues.client.clientId,
      vendorId: formValues.medicalProvider.vendorId,
      claimNbr: formValues.medicalProvider.invoiceId,
      clientCaseEligibilityId: this.clientCaseEligibilityId,
      paymentMethodCode: 'MEDICAL',
      paymentRequestId: this.paymentRequestId,
      tpainvoice: [{}],
    };
    for (let i = 0; i < formValues.claimService.length; i++) {
      let element = formValues.claimService[i];

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
        tpaInvoiceId: element.tpaInvoiceId     
      };
      if (
        !this.isStartEndDateValid(
          service.serviceStartDate,
          service.serviceEndDate
        )
      ) {
        this.financialVendorRefundFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          "Start date must less than end date"
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
    this.financialVendorRefundFacade.saveMedicalClaim(data).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        if(!response){
          this.financialVendorRefundFacade.showHideSnackBar(
            SnackBarNotificationType.ERROR,
            "An error occure whilie adding claim"
          );
        }else{
          this.financialVendorRefundFacade.showHideSnackBar(
            SnackBarNotificationType.SUCCESS,
            'Claim added successfully'
          );
        }        
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.financialVendorRefundFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          error
        );
      },
    });
  }

  public update(data: any) {
    this.isSubmitted = true;
    this.loaderService.show();
    this.financialVendorRefundFacade.updateMedicalClaim(data).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        this.financialVendorRefundFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Claim updated successfully'
        );
      },
      error: (error: any) => {
        this.loaderService.hide();
        this.financialVendorRefundFacade.showHideSnackBar(
          SnackBarNotificationType.ERROR,
          error
        );
      },
    });
  }

  getMedicalClaimByPaymentRequestId() {
    this.loaderService.show();
    this.financialMedicalClaimsFacade
      .getMedicalClaimByPaymentRequestId('3A150DE3-228F-4FFF-A3F4-7991466353C5')
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
          this.financialVendorRefundFacade.clientSubject.next(clients);
          this.selectedClient = clients[0];

          this.financialVendorRefundFacade.pharmaciesSubject.next(vendors);
          this.selectedMedicalProvider = vendors[0];          
          this.claimForm.patchValue({
            invoiceId: val.claimNbr,
            paymentRequestId: val.paymentRequestId
          });      
          
          this.invoiceId = val.claimNbr; 
          this.clientCaseEligibilityId = val.clientCaseEligibilityId;
          this.paymentRequestId = val.paymentRequestId;   
          this.cd.detectChanges();
          this.loaderService.hide();
          this.setFormValues(val.tpainvoice);
        },
        error: (err) => {
          this.loaderService.hide();
          this.financialVendorRefundFacade.showHideSnackBar(
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
}

export class MedicalClaims {
  vendorId: string = '';
  serviceStartDate: string = '';
  serviceEndDate: string = '';
  paymentType: string = '';
  cptCode: string = '';
  pcaCode: string = '';
  serviceDescription: string = '';
  serviceCost: number = 0;
  amoundDue: string = '';
  reasonForException: string = '';
  amountDue: number = 0;
  medicadeRate: number = 0;
}
