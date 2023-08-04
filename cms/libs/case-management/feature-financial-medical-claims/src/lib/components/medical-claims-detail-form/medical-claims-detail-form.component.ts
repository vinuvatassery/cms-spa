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
import { Observable } from 'rxjs';
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
  medicalProvidersearchLoaderVisibility$ = this.financialVendorRefundFacade.medicalProviderSearchLoaderVisibility$;
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
  @Output() modalCloseAddEditClaimsFormModal = new EventEmitter();
  constructor(
    private readonly financialVendorRefundFacade: FinancialVendorRefundFacade,
    private readonly financialMedicalClaimsFacade: FinancialMedicalClaimsFacade,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
    private workflowFacade: WorkflowFacade,
    private lovFacade: LovFacade
  ) {
    this.initClaimForm();
    this.lovFacade.getCoPaymentRequestTypeLov();
  }

  ngOnInit(): void {
    this.addClaimServiceGroup();
    if(this.isEdit){
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
      claimService: new FormArray([]),
    });
  }

  searchMedicalProvider(searchText: any) {
    this.financialVendorRefundFacade.searchPharmacies(searchText);
  }

  searchctpcode(cptcode:any, index:number){
    let _cptcode = this.financialMedicalClaimsFacade.searchctpcode(cptcode)
    .subscribe({
      next: (response: any) => {
        let service=response[0]
        let ctpCodeIsvalid = this.AddClaimServicesForm.at(index) as FormGroup;
        ctpCodeIsvalid.patchValue({
          cptCode: service.cptCode1,
          serviceDescription: service.serviceDesc
        }); 
        this.cd.detectChanges();
      },
      error:(error: any) => {
      }
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
      ctpCode: new FormControl(this.medicalClaimServices.ctpCode, [
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
      paymentMethodCode: "MEDICAL",
      tpainvoice: [{}],
    };
    for (let i = 0; i < formValues.claimService.length; i++) {
      let element = formValues.claimService[i];

      let service = {
        vendorId: bodyData.vendorId,
        clientId: bodyData.clientId,
        claimNbr: element.invoiceId,
        clientCaseEligibilityId: this.clientCaseEligibilityId,
        ctpCode: element.ctpCode,
        serviceStartDate: element.serviceStartDate,
        serviceEndDate: element.serviceEndDate,
        paymentType: element.paymentType,
        serviceCost: element.serviceCost,
        entityTypeCode: EntityTypeCode.Vendor,
        amountDue: element.amountDue,
        ServiceDesc: element.serviceDescription,
        reasonForException: element.reasonForException,
      };
      if (!this.isStartEndDateValid(service.serviceStartDate, service.serviceEndDate)) {
        return;
      }
      bodyData.tpainvoice.push(service);
    }
    bodyData.tpainvoice.splice(0, 1);
    this.saveData(bodyData);
  }

  public saveData(data: any) {
    this.loaderService.show();
    this.financialVendorRefundFacade.saveMedicalClaim(data).subscribe({
      next: (response: any) => {
        this.loaderService.hide();
        this.financialVendorRefundFacade.showHideSnackBar(
          SnackBarNotificationType.SUCCESS,
          'Claim added successfully'
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

  update() {
    this.isSubmitted = true;
  }

  getMedicalClaimByPaymentRequestId() {
    this.loaderService.show();
    this.financialMedicalClaimsFacade.getMedicalClaimByPaymentRequestId('AF1338C1-A6CC-4E76-8741-B9ABA59ABC99').subscribe(
      {
        next: (val) => {
          const clients = [
            {
              clientId: val.clientId,
              clientFullName: val.clientName
            }
          ];
          const vendors = [
            {
              vendorId: val.vendorId,
              providerFullName: val.vendorName
            }
          ];
          this.financialVendorRefundFacade.clientSubject.next(clients);
          this.selectedClient = clients[0];

          this.financialVendorRefundFacade.pharmaciesSubject.next(vendors)
          this.selectedMedicalProvider = vendors[0];

          this.claimForm.patchValue({
            invoiceId: val.claimNbr
          })
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
        }
      }
    );
  }

  setFormValues(services: any) {
    const serviceFormData = this.AddClaimServicesForm as FormArray;
    for (let i = 0; i < services.length; i++) {
      let service = services[i];
      let serviceForm = serviceFormData.at(i) as FormGroup
      serviceForm.controls['ctpCode'].setValue(service.ctpCode);
      serviceForm.controls['serviceStartDate'].setValue(new Date(service.serviceStartDate));
      serviceForm.controls['serviceEndDate'].setValue(new Date(service.serviceEndDate));
      serviceForm.controls['serviceDescription'].setValue(service.serviceDesc);
      serviceForm.controls['serviceCost'].setValue(service.serviceCost);
      serviceForm.controls['amountDue'].setValue(service.amountDue);
    }

    this.cd.detectChanges();
  }
}

export class MedicalClaims {
  vendorId: string = '';
  serviceStartDate: string = '';
  serviceEndDate: string = '';
  paymentType: string = '';
  ctpCode: string = '';
  pcaCode: string = '';
  serviceDescription: string = '';
  serviceCost: number = 0;
  amoundDue: string = '';
  reasonForException: string = '';
  amountDue: number = 0;
}
