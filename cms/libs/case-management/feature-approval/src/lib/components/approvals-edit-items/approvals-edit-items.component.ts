import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DrugType, DrugsFacade, EmailAddressTypeCode, FinancialVendorFacade, HealthInsurancePlan, InsurancePlanFacade, PendingApprovalGeneralTypeCode, PhoneTypeCode } from '@cms/case-management/domain';
import { FinancialVendorTypeCode, StatusFlag, YesNoFlag } from '@cms/shared/ui-common';


import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
import { LovFacade } from '@cms/system-config/domain';
import { LoaderService } from '@cms/shared/util-core';
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent implements OnInit, OnDestroy {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() selectedSubtypeCode: any;
  @Input() selectedVendor$!: Observable<any>;
  @Input() clinicVendorList$: any;
  @Input() ddlStates$!: any;
  @Input() healthCareForm: any;
  @Input() selectedMasterData: any;
  @Input() clinicVendorLoader$!: Observable<any>;
  @Input() selectedMasterDetail$!: Observable<any>;
  @Input() drugForm:  any;
  @Input() insurancePlanForm: any;
  @Input() insuranceTypelovForPlan$:any;
  @Input() pharmacyForm!:FormGroup;
  @Input() insuranceVendorForm!:FormGroup;
  @Input() insuranceProviderForm!:FormGroup;
  @Input() deliveryMethodLov$! : any;
  @Output() searchClinicVendorClicked = new EventEmitter<any>();
  @Output() updateMasterDetailsClickedEvent = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() recordUpdatedEvent = new EventEmitter<any>();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  clinicSearchSubscription!: Subscription;
  clinicVendorListLocal!: any;
  selectedClinicVendorId!: null;
  isValidateForm!: boolean;
  tinMaskFormat: string = '0 00-0000000';
  selectedVendor!: any;
  selectedParentVendor!: any;
  drugTypesList : any;
  drugType: any;
  providerName: any;
  updateProviderPanelSubject$ :any;
  paymentMethodList: any[] = [];
  paymentRunDateList: any[] = [];
  tempVendorName: any;
  ndcMaskFormat: string = "00000-0000-00"
  startDateValidationError: boolean = false;
  termDateValidationError: boolean = false;
  termDateRequiredValidationError: boolean = false;

  constructor(private insurancePlanFacade : InsurancePlanFacade,
              private drugFacade : DrugsFacade,
              private financialVendorFacade : FinancialVendorFacade,
              private lovFacade: LovFacade,
              private readonly loaderService: LoaderService,
              private readonly cd: ChangeDetectorRef
              ) {}

  ngOnInit(): void {
    this.getPaymentRunDate();
    this.getPaymentMethods();
    this.getDrugType();
    this.bindVendorData();        
    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.clinicSearchSubscription?.unsubscribe();
  }

  private getDrugType() {
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
      if (this.selectedMasterData.hiv == 'YES') {
        this.drugType = DrugType.Hiv;
      } else if (this.selectedMasterData.hepatitis == 'YES') {
        this.drugType = DrugType.Hepatitis;
      } else if (this.selectedMasterData.opportunisticInfection == 'YES') {
        this.drugType = DrugType.OpportunisticInfection;
      }
    }
  }

  searchClinic(clinicName: any) {
    this.clinicSearchSubscription?.unsubscribe();
    if (clinicName === '' || !clinicName) {
      this.clinicVendorListLocal = null;
      return;
    }

    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.financialVendorFacade.loadVendors(clinicName,PendingApprovalGeneralTypeCode.InsuranceVendor);
      this.subscribeSearchVendor();
    } else if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.Drug) {
      this.financialVendorFacade.loadVendors(clinicName,FinancialVendorTypeCode.Manufacturers);
      this.subscribeSearchVendor();
    } else if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider || this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic) {
      this.financialVendorFacade.loadVendors(clinicName,PendingApprovalGeneralTypeCode.MedicalProvider);
      this.subscribeSearchVendor();
    } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider || this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic) {
      this.financialVendorFacade.loadVendors(clinicName,PendingApprovalGeneralTypeCode.DentalProvider);
      this.subscribeSearchVendor();
    }
    this.selectedClinicVendorId = null;
    this.cd.detectChanges();
  }

  searchClinicData(clinicName: any){
    this.clinicSearchSubscription = this.clinicVendorList$.subscribe(
      (data: any) => {
        if (data && clinicName !== '') {
          this.filterSearchClinicData(data);
        }
      }
    );
    this.searchClinicVendorClicked.emit(clinicName);
  }

  filterSearchClinicData(data: any){
    if (
      this.selectedSubtypeCode ===
        PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.selectedSubtypeCode ===
        PendingApprovalGeneralTypeCode.MedicalClinic
    ) {
      this.clinicVendorListLocal = data.filter(
        (item: any) =>
          item.vendorTypeCode ===
          PendingApprovalGeneralTypeCode.MedicalClinic
      );
    } else if (
      this.selectedSubtypeCode ===
        PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode ===
        PendingApprovalGeneralTypeCode.DentalClinic
    ) {
      this.clinicVendorListLocal = data.filter(
        (item: any) =>
          item.vendorTypeCode ===
          PendingApprovalGeneralTypeCode.DentalClinic
      );
    } else if(this.selectedSubtypeCode ===
      PendingApprovalGeneralTypeCode.Drug){
        this.clinicVendorListLocal = data.filter(
          (item: any) =>
            item.vendorTypeCode ===
            PendingApprovalGeneralTypeCode.Drug ? PendingApprovalGeneralTypeCode.Drug : PendingApprovalGeneralTypeCode.MedicalProvider
        );
    } else if (this.selectedSubtypeCode ===
      PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.clinicVendorListLocal = data.filter(
        (item: any) =>
          item.vendorTypeCode ===
            PendingApprovalGeneralTypeCode.InsurancePlan ? PendingApprovalGeneralTypeCode.InsurancePlan : PendingApprovalGeneralTypeCode.MedicalProvider
      );
    }
    this.clinicSearchSubscription?.unsubscribe();
  }

  subscribeSearchVendor(){ 
    this.clinicSearchSubscription = this.financialVendorFacade.vendorDetails$.subscribe({
      next: (vendorData: any) => {
        this.clinicVendorListLocal = vendorData;
        this.cd.detectChanges();
      },
      error: (err)=>{

      }
    }) 
  }

  bindVendorData() {
    this.clinicVendorListLocal = [
      {
        vendorId: this.getVendorId(),
        vendorName: this.getVendorName(),
      },
    ];
    this.selectedParentVendor = this.selectedMasterData.parentVendorId;
    this.selectedVendor = this.selectedMasterData.vendorId;
    this.cd.detectChanges();
    this.bindHealthCareValues();
    this.bindDrugFormValues();
    this.bindInsurancePlanFormValues();
    this.bindInsuranceVendorValues();
    this.bindInsuranceProviderFormValues(); 
    this.bindPharmacyFormValues();
    this.cd.detectChanges();  
  }

  bindInsuranceVendorValues(){
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsuranceVendor) {
      this.insuranceVendorForm.controls['vendorName'].setValue(
        this.selectedMasterData?.vendorName
      );
      this.insuranceVendorForm.controls['nameOnCheck'].setValue(
        this.selectedMasterData?.nameOnCheck
      );
      this.insuranceVendorForm.controls['nameOnEnvelop'].setValue(
        this.selectedMasterData?.nameOnEnvelope
      );
      this.insuranceVendorForm.controls['tin'].setValue(
        this.selectedMasterData?.tin
      );
      this.insuranceVendorForm.controls['addressline1'].setValue(
        this.selectedMasterData?.address1
      );
      this.insuranceVendorForm.controls['addressline2'].setValue(
        this.selectedMasterData?.address2
      );
      this.insuranceVendorForm.controls['city'].setValue(
        this.selectedMasterData?.cityCode
      );
      this.insuranceVendorForm.controls['state'].setValue(
        this.selectedMasterData?.stateCode
      );
      this.insuranceVendorForm.controls['zip'].setValue(
        this.selectedMasterData?.zip
      );
      this.insuranceVendorForm.controls['mailCode'].setValue(
        this.selectedMasterData?.mailCode
      );
      this.insuranceVendorForm.controls['paymentMethod'].setValue(
        this.selectedMasterData?.paymentMethodCode
      );
      this.insuranceVendorForm.controls['acceptsCombinedPayments'].setValue(
         this.selectedMasterData?.acceptsCombinedPaymentsFlag.toUpperCase()
      );
      this.insuranceVendorForm.controls['acceptsReport'].setValue(
         this.selectedMasterData?.acceptsReportsFlag.toUpperCase()
      );
      this.insuranceVendorForm.controls['paymentRunDate'].setValue(
        this.selectedMasterData?.paymentRunDateMonthly.toString()
      );
      this.insuranceVendorForm.controls['contactName'].setValue(
        this.selectedMasterData?.contactName ? this.selectedMasterData?.contactName : ''
      );
      this.insuranceVendorForm.controls['contactPhone'].setValue(
        this.selectedMasterData?.phoneNumber
      );
      this.insuranceVendorForm.controls['contactFax'].setValue(
        this.selectedMasterData?.fax
      );
      this.insuranceVendorForm.controls['contactEmail'].setValue(
        this.selectedMasterData?.email
      );
    }
  }

  bindInsurancePlanFormValues(){
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.insurancePlanForm.controls['providerName'].setValue(
        this.selectedMasterData?.providerName
      );
      if(this.selectedMasterData?.termDate != null) {
        const termDate = new Date(this.selectedMasterData?.termDate);
        this.insurancePlanForm.controls['termDate'].setValue(
          termDate
        );
      }
      if(this.selectedMasterData?.startDate) {
        const startDate = new Date(this.selectedMasterData?.startDate);
        this.insurancePlanForm.controls['startDate'].setValue(
          startDate ? startDate : new Date()
        );
      }
      this.insurancePlanForm.controls['dentalPlanFlag'].setValue(
        this.selectedMasterData?.dentalPlanFlag
      );
      this.insurancePlanForm.controls['canPayForMedicationFlag'].setValue(
        this.selectedMasterData?.canPayForMedicationFlag == 'YES' ? true : false
      );
      this.insurancePlanForm.controls['healthInsuranceTypeCode'].setValue(
        this.selectedMasterData?.healthInsuranceTypeCode
      );
      this.insurancePlanForm.controls['insurancePlanName'].setValue(
        this.selectedMasterData?.insurancePlanName
      );
    }
  }

  bindDrugFormValues(){
    if(this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
      this.drugForm.controls['providerName'].setValue(
        this.selectedMasterData?.manufacturerName
      );
      this.drugForm.controls['drugName'].setValue(this.selectedMasterData.drugName);
      this.drugForm.controls['brandName'].setValue(this.selectedMasterData.brandName);
      this.drugForm.controls['ndcCode'].setValue(this.selectedMasterData.ndcNbr);
      this.drugForm.controls['drugType'].setValue(this.drugType);
      this.drugForm.controls['deliveryMethod'].setValue(this.selectedMasterData.deliveryMethodCode);
    }
  }

  bindHealthCareValues(){
    if(this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.MedicalProvider) {

        this.healthCareForm.controls['providerName'].setValue(
          this.selectedMasterData?.clinicName
        );
        this.healthCareForm.controls['firstName'].setValue(
          this.selectedMasterData?.firstName
        );
        this.healthCareForm.controls['lastName'].setValue(
          this.selectedMasterData?.lastName
        );
        this.healthCareForm.controls['tinNumber'].setValue(
          this.selectedMasterData?.tin
        );
        this.healthCareForm.controls['addressLine1'].setValue(
          this.selectedMasterData?.address1
        );
        this.healthCareForm.controls['addressLine2'].setValue(
          this.selectedMasterData.address2 ?  this.selectedMasterData.address2 : ''
        );
        this.healthCareForm.controls['city'].setValue(
          this.selectedMasterData?.cityCode
        );
        this.healthCareForm.controls['state'].setValue(
          this.selectedMasterData?.stateCode
        );
        this.healthCareForm.controls['zip'].setValue(this.selectedMasterData?.zip);
        this.healthCareForm.controls['contactName'].setValue(
          this.selectedMasterData?.contactName
        );
        this.healthCareForm.controls['contactPhone'].setValue(
          this.selectedMasterData?.phoneNumber
        );
        this.healthCareForm.controls['contactFax'].setValue(
          this.selectedMasterData?.fax
        );
        this.healthCareForm.controls['contactEmail'].setValue(
          this.selectedMasterData?.email
        );
      } 
  }

  bindInsuranceProviderFormValues(){
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsuranceProvider) {
      this.insuranceProviderForm.controls['providerName'].setValue(
        this.selectedMasterData?.vendorName
      );
    } 
  }
  bindPharmacyFormValues(){
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Pharmacy) {
      this.pharmacyForm.controls['pharmacyName'].setValue(this.selectedMasterData?.vendorName);
      this.pharmacyForm.controls['tin'].setValue(this.selectedMasterData?.tin);
      this.pharmacyForm.controls['npi'].setValue(this.selectedMasterData?.npiNbr);
      this.pharmacyForm.controls['preferredPharmacy'].setValue(this.selectedMasterData?.preferredFlag === "Y" ? true : false);
      this.pharmacyForm.controls['mailCode'].setValue(this.selectedMasterData?.mailCode);
      this.pharmacyForm.controls['paymentMethod'].setValue(this.selectedMasterData?.paymentMethodCode.toUpperCase());
      this.pharmacyForm.controls['contactName'].setValue(this.selectedMasterData?.contactName);
      this.pharmacyForm.controls['contactLastName'].setValue(this.selectedMasterData?.contact1LastName);
      this.pharmacyForm.controls['contactPhone'].setValue(this.selectedMasterData?.phoneNumber);
      this.pharmacyForm.controls['contactFax'].setValue(this.selectedMasterData?.fax);
      this.pharmacyForm.controls['contactEmail'].setValue(this.selectedMasterData?.email);
    }
  }

  getVendorId()
  {
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider)
      {
        return this.selectedMasterData?.parentVendorId;
      }
      else{
        return this.selectedMasterData?.vendorId;
      }
  }
  validateForm() {
    if (
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode ==
        PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode ==
        PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.MedicalProvider
    ) {
      if (!this.selectedVendor.parentVendorId) {
        this.healthCareForm.controls['providerName'].setValidators(
          Validators.nullValidator
        );
      } else {
        this.healthCareForm.controls['providerName'].setValidators(
          Validators.required
        );
      }
      this.healthCareForm.controls['providerName'].updateValueAndValidity();

      if(this.selectedMasterData.firstName)
      {
        this.healthCareForm.controls['firstName'].setValidators(
          Validators.required
        );
        this.healthCareForm.controls['firstName'].updateValueAndValidity();
      }
      if(this.selectedMasterData.lastName)
      {
        this.healthCareForm.controls['lastName'].setValidators(
          Validators.required
        );
        this.healthCareForm.controls['lastName'].updateValueAndValidity();
      }

      this.healthCareForm.controls['addressLine1'].setValidators(
        Validators.required
      );
      this.healthCareForm.controls['addressLine1'].updateValueAndValidity();

      this.healthCareForm.controls['city'].setValidators(Validators.required);
      this.healthCareForm.controls['city'].updateValueAndValidity();

      this.healthCareForm.controls['state'].setValidators(Validators.required);
      this.healthCareForm.controls['state'].updateValueAndValidity();

      this.healthCareForm.controls['zip'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 -]+$')]);
      this.healthCareForm.controls['zip'].updateValueAndValidity();
    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
      this.drugForm.controls['providerName'].setValidators(
        Validators.required
      );
      this.drugForm.controls['providerName'].updateValueAndValidity();

      this.drugForm.controls['drugName'].setValidators(
        Validators.required
      );
      this.drugForm.controls['drugName'].updateValueAndValidity();

      this.drugForm.controls['brandName'].setValidators(
        Validators.required
      );
      this.drugForm.controls['brandName'].updateValueAndValidity();

      this.drugForm.controls['drugType'].setValidators(
        Validators.required
      );
      this.drugForm.controls['drugType'].updateValueAndValidity();

      this.drugForm.controls['deliveryMethod'].setValidators(
        Validators.required
      );
      this.drugForm.controls['deliveryMethod'].updateValueAndValidity();
    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.insurancePlanForm.controls['providerName'].setValidators(Validators.required);
      this.insurancePlanForm.controls['providerName'].updateValueAndValidity();

      this.insurancePlanForm.controls['insurancePlanName'].setValidators(Validators.required);
      this.insurancePlanForm.controls['insurancePlanName'].updateValueAndValidity();

      this.insurancePlanForm.controls['healthInsuranceTypeCode'].setValidators(Validators.required);
      this.insurancePlanForm.controls['healthInsuranceTypeCode'].updateValueAndValidity();

      this.insurancePlanForm.controls['startDate'].setValidators(Validators.required);
      this.insurancePlanForm.controls['startDate'].updateValueAndValidity();

      var healthInsuranceValue = this.insurancePlanForm.controls['healthInsuranceTypeCode'].value;

      var termDateValue = this.insurancePlanForm.controls['termDate'].value;
      var startDateValue = this.insurancePlanForm.controls['startDate'].value;

      if(healthInsuranceValue == HealthInsurancePlan.QualifiedHealthPlan && !termDateValue){
        this.termDateRequiredValidationError = true;
      }else{
        this.termDateRequiredValidationError = false;
      }
      
      var startDate = new Date(this.insurancePlanForm.controls['startDate'].value);
      var termDate = new Date(termDateValue);

      if(termDateValue != null && startDateValue != null &&termDate < startDate) {
        this.startDateValidationError = false;
        this.termDateValidationError = true;
        this.termDateRequiredValidationError = false;
      }else {
        this.termDateValidationError = false;
      }
      
      if(termDateValue != null && startDateValue != null && startDate > termDate) {
        this.startDateValidationError = true;
        this.termDateValidationError = false;
        this.termDateRequiredValidationError = false;
      }else{
        this.startDateValidationError = false;
      }

      this.cd.detectChanges();

    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Pharmacy) {
      this.pharmacyForm.controls['pharmacyName'].setValidators(Validators.required)
      this.pharmacyForm.controls['pharmacyName'].updateValueAndValidity();

      this.pharmacyForm.controls['mailCode'].setValidators(Validators.required)
      this.pharmacyForm.controls['mailCode'].updateValueAndValidity();

      this.pharmacyForm.controls['paymentMethod'].setValidators(Validators.required)
      this.pharmacyForm.controls['paymentMethod'].updateValueAndValidity();
    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsuranceVendor) {
      this.insuranceVendorForm.controls['vendorName'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['vendorName'].updateValueAndValidity();

      this.insuranceVendorForm.controls['nameOnCheck'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['nameOnCheck'].updateValueAndValidity();

      this.insuranceVendorForm.controls['nameOnEnvelop'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['nameOnEnvelop'].updateValueAndValidity();

      this.insuranceVendorForm.controls['mailCode'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['mailCode'].updateValueAndValidity();

      this.insuranceVendorForm.controls['addressline1'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['addressline1'].updateValueAndValidity();
      
      this.insuranceVendorForm.controls['city'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['city'].updateValueAndValidity();

      this.insuranceVendorForm.controls['state'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['state'].updateValueAndValidity();

      this.insuranceVendorForm.controls['zip'].setValidators([Validators.required, Validators.pattern('^[A-Za-z0-9 -]+$')])
      this.insuranceVendorForm.controls['zip'].updateValueAndValidity();

      this.insuranceVendorForm.controls['paymentMethod'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['paymentMethod'].updateValueAndValidity();

      this.insuranceVendorForm.controls['paymentRunDate'].setValidators(Validators.required)
      this.insuranceVendorForm.controls['paymentRunDate'].updateValueAndValidity();
    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsuranceProvider) {
      this.insuranceProviderForm.controls['providerName'].setValidators(Validators.required);
      this.insuranceProviderForm.controls['providerName'].updateValueAndValidity();
    }
  }

  onUpdateClicked() {
    let formData;
    this.validateForm();
    this.isValidateForm = true;
    if (!this.checkFormValidation()) {
      return;
    }
    this.updateHealthCareProviderData();
    this.updateDrugData();
    this.updateInsurancePlanData();
    this.updatePharmacyData();
    this.updateInsuranceVendorData();
    this.updateInsuranceProviderData();
    this.closeEditModal();
    this.cd.detectChanges();
  }

  checkFormValidation() : boolean{
    if (!this.healthCareForm.valid  ||
        !this.insurancePlanForm.valid ||
        !this.drugForm.valid ||
        !this.pharmacyForm.valid ||
        !this.insuranceVendorForm.valid ||
        !this.insuranceProviderForm.valid ||
        this.startDateValidationError ||
        this.termDateValidationError ||
        this.termDateRequiredValidationError) {
      return false;
    }
    return true;
  }

  updateHealthCareProviderData(){
    let formData;
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider) {
        this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
        let contact = [];
        let emails = [];
        let phones = [];
        emails.push({
          emailAddress: this.healthCareForm.controls['contactEmail']?.value,
          vendorContactEmailId: this.selectedMasterData.vendorContactEmailId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          emailAddressTypeCode: EmailAddressTypeCode.Work
        })
        phones.push({
          phoneNbr: this.healthCareForm?.controls['contactPhone']?.value,
          faxNbr: this.healthCareForm?.controls['contactFax']?.value,
          vendorContactPhoneId: this.selectedMasterData.vendorContactPhoneId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          phoneTypeCode: PhoneTypeCode.Work
        })
        contact.push(
          {
            contactName: this.healthCareForm.controls['contactName']?.value,
            vendorContactId: this.selectedMasterData.vendorContactId,
            emails,
            phones,            
          }
        )
        let masterData = {
          vendorName: this.providerName ? this.providerName : this.tempVendorName,
          parentVendorId: this.selectedMasterData.parentVendorId,
          vendorId: this.selectedVendor,
          tin: this.healthCareForm?.controls['tinNumber'].value,
          firstName: this.healthCareForm?.controls['firstName'].value,
          lastName: this.healthCareForm?.controls['lastName'].value,
          address: {
            vendorAddressId: this.selectedMasterData.vendorAddressId,
            paymentMethodCode: this.healthCareForm?.controls['paymentMethod']?.value ? this.healthCareForm?.controls['paymentMethod']?.value : '',
            address1: this.healthCareForm?.controls['addressLine1']?.value,
            address2: this.healthCareForm?.controls['addressLine2']?.value,
            cityCode: this.healthCareForm?.controls['city']?.value,
            stateCode: this.healthCareForm?.controls['state']?.value,
            zip: this.healthCareForm?.controls['zip']?.value,
            contacts: contact
          }
        }
        formData = {
          form : masterData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
      }
  }

  updateDrugData(){
    let formData;
    if (this.selectedSubtypeCode ===  PendingApprovalGeneralTypeCode.Drug) {
      this.updateProviderPanelSubject$ = this.drugFacade.updateProviderPanelSubject$;
      let drugData = {
        DrugId: this.selectedMasterData.drugId,
        ManufacturerId : this.selectedMasterData.vendorId,
        NdcNbr : this.drugForm.controls['ndcCode'].value,
        BrandName : this.drugForm.controls['brandName'].value,
        DrugName : this.drugForm.controls['drugName'].value,
        DeliveryMethodCode: this.drugForm.controls['deliveryMethod'].value.toUpperCase(),
        IncludeInManufacturerRebatesFlag: this.selectedMasterData.includeInManufacturerRebatesFlag,
        DrugType: this.drugForm.controls['drugType'].value,
        ManufacturerName : this.providerName ? this.providerName : this.tempVendorName,
      }
      formData = {
        form : drugData,
        subTypeCode: this.selectedSubtypeCode
      }
      this.updateMasterDetailsClickedEvent.emit(formData);
  }
  }

  updateInsurancePlanData(){
    let formData;
    if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.updateProviderPanelSubject$ = this.insurancePlanFacade.updateProviderPanelSubject$;
      let insurancePlanData = {
        insurancePlanId: this.selectedMasterData.insurancePlanId,
        insurancePlanName: this.insurancePlanForm.controls['insurancePlanName'].value,
        healthInsuranceTypeCode: this.insurancePlanForm.controls['healthInsuranceTypeCode'].value,
        canPayForMedicationFlag: this.getMedicationFlagValue(),
        dentalPlanFlag: this.insurancePlanForm.controls['dentalPlanFlag'].value,
        startDate: this.insurancePlanForm.controls['startDate'].value,
        termDate: this.insurancePlanForm.controls['termDate'].value,
        providerName: this.providerName ? this.providerName : this.tempVendorName,
        insuranceProviderId: this.selectedMasterData.vendorId
      }
      formData = {
        form: insurancePlanData,
        subTypeCode: this.selectedSubtypeCode
      }
      this.updateMasterDetailsClickedEvent.emit(formData);
    }
  }

  getMedicationFlagValue(){
    if(this.insurancePlanForm.controls['canPayForMedicationFlag'].value === true){
      return "YES";
    }
    return "No";
  }

  updatePharmacyData(){
    let formData;
    if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.Pharmacy) {
      this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
        let contact = [];
        let emails = [];
        let phones = [];
        emails.push({
          emailAddress: this.pharmacyForm.controls['contactEmail']?.value,
          vendorContactEmailId: this.selectedMasterData.vendorContactEmailId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          emailAddressTypeCode: EmailAddressTypeCode.Work
        })
        phones.push({
          phoneNbr: this.pharmacyForm?.controls['contactPhone']?.value,
          faxNbr: this.pharmacyForm?.controls['contactFax']?.value,
          vendorContactPhoneId: this.selectedMasterData.vendorContactPhoneId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          phoneTypeCode: PhoneTypeCode.Work
        })
        contact.push(
          {
            contactName: this.pharmacyForm.controls['contactName']?.value,
            vendorContactId: this.selectedMasterData.vendorContactId,
            emails,
            phones
          }
        )
        let pharmacyData = {
          vendorName: this.pharmacyForm?.controls['pharmacyName'].value,
          vendorId: this.selectedMasterData.vendorId,
          tin: this.pharmacyForm?.controls['tin'].value,
          NpiNbr: this.pharmacyForm?.controls['npi'].value,
          preferredFlag : this.pharmacyForm?.controls['preferredPharmacy'].value ? 'Y' : 'N',
          address: {
            vendorAddressId: this.selectedMasterData.vendorAddressId,
            paymentMethodCode: this.pharmacyForm?.controls['paymentMethod']?.value ? this.pharmacyForm?.controls['paymentMethod']?.value : '',
            MailCode: this.pharmacyForm.controls['mailCode'].value,
            contacts: contact
          }
        }
        formData = {
          form : pharmacyData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
    }
  }

  updateInsuranceVendorData(){
    let formData;
    if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsuranceVendor) {
      this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
        let contact = [];
        let emails = [];
        let phones = [];
        emails.push({
          emailAddress: this.insuranceVendorForm.controls['contactEmail']?.value,
          vendorContactEmailId: this.selectedMasterData.vendorContactEmailId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          emailAddressTypeCode: EmailAddressTypeCode.Work
        })
        phones.push({
          phoneNbr: this.insuranceVendorForm?.controls['contactPhone']?.value,
          faxNbr: this.insuranceVendorForm?.controls['contactFax']?.value,
          vendorContactPhoneId: this.selectedMasterData.vendorContactPhoneId,
          vendorContactId: this.selectedMasterData.vendorContactId,
          phoneTypeCode: PhoneTypeCode.Work
        })
        contact.push({
            contactName: this.insuranceVendorForm.controls['contactName']?.value,
            vendorContactId: this.selectedMasterData.vendorContactId,
            emails,
            phones
        })
        let insuraceVendorData = {
          vendorName: this.insuranceVendorForm?.controls['vendorName'].value,
          vendorId: this.selectedMasterData.vendorId,
          tin: this.insuranceVendorForm?.controls['tin'].value,
          address: {
            address1 : this.insuranceVendorForm?.controls['addressline1']?.value,
            address2 : this.insuranceVendorForm?.controls['addressline2']?.value,
            cityCode : this.insuranceVendorForm?.controls['city']?.value,
            stateCode : this.insuranceVendorForm?.controls['state']?.value,
            zip : this.insuranceVendorForm?.controls['zip']?.value,
            vendorAddressId: this.selectedMasterData.vendorAddressId,
            nameOnCheck: this.insuranceVendorForm?.controls['nameOnCheck']?.value,
            MailCode: this.insuranceVendorForm.controls['mailCode'].value,
            paymentMethodCode: this.insuranceVendorForm?.controls['paymentMethod']?.value ? this.insuranceVendorForm?.controls['paymentMethod']?.value : '',
            nameOnEnvelope: this.insuranceVendorForm?.controls['nameOnEnvelop']?.value,
            acceptsCombinedPaymentsFlag: this.insuranceVendorForm?.controls['acceptsCombinedPayments']?.value == YesNoFlag.Yes.toUpperCase() ? StatusFlag.Yes : StatusFlag.No ,
            acceptsReportsFlag: this.insuranceVendorForm?.controls['acceptsReport']?.value == YesNoFlag.Yes.toUpperCase() ? StatusFlag.Yes : StatusFlag.No,
            paymentRunDateMonthly: this.insuranceVendorForm?.controls['paymentRunDate']?.value,
            contacts: contact
          }
        }
        formData = {
          form : insuraceVendorData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
    }
  }

  updateInsuranceProviderData(){
    let formData;
    if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsuranceProvider) {
      this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
        let contact = [];
        let emails = [];
        let phones = [];
        emails.push({
          vendorContactEmailId: this.selectedMasterData.vendorContactEmailId,
          vendorContactId: this.selectedMasterData.vendorContactId
        })
        phones.push({
          vendorContactPhoneId: this.selectedMasterData.vendorContactPhoneId,
          vendorContactId: this.selectedMasterData.vendorContactId
        })
        contact.push({
            vendorContactId: this.selectedMasterData.vendorContactId,
            emails,
            phones
        })
        let insuraceProviderData = {
          vendorName: this.insuranceProviderForm?.controls['providerName'].value,
          vendorId: this.selectedMasterData.vendorId,
          address: {
            vendorAddressId: this.selectedMasterData.vendorAddressId,
            contacts: contact
          }
        }
        formData = {
          form : insuraceProviderData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
    }
  }

  get healthCareFormControls() {
    return this.healthCareForm.controls;
  }

  get drugFormControls() {
    return this.drugForm.controls;
  }

  get insurancePlanFormControls() {
    return this.insurancePlanForm.controls;
  }

  onCancel(){
    this.close.emit();
  }

  private getVendorName() {
    if(
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsuranceVendor ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsuranceProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.Pharmacy) {
        this.tempVendorName = this.selectedMasterData?.vendorName;
        return this.selectedMasterData?.vendorName;
      } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.Drug) {
        this.tempVendorName = this.selectedMasterData?.manufacturerName;
        return this.selectedMasterData?.manufacturerName;
    } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.tempVendorName = this.selectedMasterData?.providerName;
      return this.selectedMasterData?.providerName;
    }
    else if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider)
      {
        this.tempVendorName = this.selectedMasterData?.clinicName;
        return this.selectedMasterData?.clinicName;
      }
  }

  public selectionChange(value: any): void {
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider)
      {
        this.selectedMasterData.parentVendorId = value.vendorId;
        this.providerName = value.vendorName;
      }else {
        this.selectedMasterData.vendorId = value.vendorId;
      }
    
  }

  private closeEditModal() {
    this.updateProviderPanelSubject$.subscribe((value: any) => {
      if (value) {
        this.recordUpdatedEvent.emit(value);
      }
    });
  }

  getPaymentMethods() {
    this.lovFacade.getPaymentMethodLov();
    this.loaderService.show();
    this.lovFacade.paymentMethodType$.subscribe((paymentMethod: any) => {
      if (paymentMethod) {
        this.paymentMethodList = paymentMethod;
        this.cd.detectChanges();
        this.loaderService.hide();
      }
    });
    this.cd.detectChanges();
  }

  get pharmacyFormControl() {
    return this.pharmacyForm.controls as any;
  }

  get insuranceVendorFormControls(){
    return this.insuranceVendorForm.controls as any;
  }

  getPaymentRunDate() {
    this.lovFacade.getPaymentRunDateLov();
    this.loaderService.show();
    this.lovFacade.paymentRunDates$.subscribe((paymentRunDates: any) => {
      if (paymentRunDates) {
        this.paymentRunDateList = paymentRunDates;
        this.loaderService.hide();
      }
    })
    this.cd.detectChanges();
  }

  get insuranceProviderFormControls() {
    return this.insuranceProviderForm.controls as any;
  }

  capitalizeFirstLetter(string:any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  accountingNumberValidated: boolean = true;
  restrictTinNumber(event: any){
    this.healthCareForm?.controls['tinNumber'].value;
    if (this.healthCareForm?.controls['tinNumber'].value && (parseInt(this.healthCareForm?.controls['tinNumber'].value.charAt(0)) == 1 || parseInt(this.healthCareForm?.controls['tinNumber'].value.charAt(0)) == 3)) {
      this.accountingNumberValidated = true;
      }else{
      this.accountingNumberValidated = false;
    }
  }

  onStartDateChange(event: any){
    var startDate = new Date(this.insurancePlanForm.controls['startDate'].value);
    var termDate = new Date(this.insurancePlanForm.controls['termDate'].value);

    if(startDate > termDate) {
      this.startDateValidationError = true;
      this.termDateValidationError = false;
      this.termDateRequiredValidationError = false;
    }else{
      this.startDateValidationError = false;
    }
  }

  onTermDateChange(event: any){
    var startDate = new Date(this.insurancePlanForm.controls['startDate'].value);
    var termDate = new Date(this.insurancePlanForm.controls['termDate'].value);

    if(termDate < startDate) {
      this.startDateValidationError = false;
      this.termDateValidationError = true;
      this.termDateRequiredValidationError = false;
    }else {
      this.termDateValidationError = false;
    }
  }
  
}
