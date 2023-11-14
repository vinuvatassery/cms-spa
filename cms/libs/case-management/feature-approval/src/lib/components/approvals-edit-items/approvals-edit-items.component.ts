import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { DrugsFacade, FinancialVendorFacade, InsurancePlanFacade, PendingApprovalGeneralTypeCode } from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
import { PendingApprovalGeneralFacade } from '../../../../../domain/src';
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent implements OnInit {
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
  @Output() searchClinicVendorClicked = new EventEmitter<any>();
  @Output() updateMasterDetailsClickedEvent = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  @Output() recordUpdatedEvent = new EventEmitter<any>();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  clinicSearchSubscription!: Subscription;
  clinicVendorListLocal!: any;
  selectedClinicVendorId!: null;
  isValidateForm!: boolean;
  tinMaskFormat: string = '0 00-000000';
  selectedVendor!: any;
  drugTypesList : any;
  drugType: any;
  providerName: any;
  updateProviderPanelSubject$ :any;
  constructor(private changeDetector: ChangeDetectorRef,
              private insurancePlanFacade : InsurancePlanFacade,
              private drugFacade : DrugsFacade,
              private financialVendorFacade : FinancialVendorFacade
              ) {}

  ngOnInit(): void {
    this.getDrugType();
    this.bindVendorData();
  }

  private getDrugType() {
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
      if (this.selectedMasterData.hiv == 'YES') {
        this.drugType = 'HIV';
      } else if (this.selectedMasterData.hepatitis == 'YES') {
        this.drugType = 'HEPA';
      } else if (this.selectedMasterData.opportunisticInfection == 'YES') {
        this.drugType = 'OPINF';
      }
    }
  }

  searchClinic(clinicName: any) {
    this.clinicSearchSubscription?.unsubscribe();

    if (clinicName === '' || !clinicName) {
      this.clinicVendorListLocal = null;
      return;
    }

    this.clinicSearchSubscription = this.clinicVendorList$.subscribe(
      (data: any) => {
        if (data && clinicName !== '') {
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
      }
    );    
    this.selectedClinicVendorId = null;
    this.searchClinicVendorClicked.emit(clinicName);
  }

  bindVendorData() {
    this.clinicVendorListLocal = [
      {
        vendorId: this.selectedMasterData.vendorId,
        vendorName: this.getVendorName(),
      },
    ];
    this.selectedVendor = this.selectedMasterData.vendorId;
    if(this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.MedicalProvider) {
        
        this.healthCareForm.controls['providerName'].setValue(
          this.selectedMasterData?.vendorName
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
        this.healthCareForm.controls['phoneNumber'].setValue(
          this.selectedMasterData?.phoneNumber
        );
        this.healthCareForm.controls['email'].setValue(
          this.selectedMasterData?.email
        );
        this.healthCareForm.controls['fax'].setValue(this.selectedMasterData?.fax);
        this.healthCareForm.controls['addressLine1'].setValue(
          this.selectedMasterData?.address1
        );
        this.healthCareForm.controls['addressLine2'].setValue(
          this.selectedMasterData.addressLine2 ?  this.selectedMasterData.addressLine2 : ''
        );
        this.healthCareForm.controls['city'].setValue(
          this.selectedMasterData?.cityCode
        );
        this.healthCareForm.controls['state'].setValue(
          this.selectedMasterData?.stateCode
        );
        this.healthCareForm.controls['zip'].setValue(this.selectedMasterData?.zip);
        this.healthCareForm.controls['contactFirstName'].setValue(
          this.selectedMasterData?.contact1FirstName
        );
        this.healthCareForm.controls['contactLastName'].setValue(
          this.selectedMasterData?.contact1LastName
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
      } else if(this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
        this.drugForm.controls['providerName'].setValue(
          this.selectedMasterData?.manufacturerName
        );
        this.drugForm.controls['drugName'].setValue(this.selectedMasterData.drugName);
        this.drugForm.controls['brandName'].setValue(this.selectedMasterData.brandName);
        this.drugForm.controls['ndcCode'].setValue(this.selectedMasterData.ndcNbr);
        this.drugForm.controls['drugType'].setValue(this.drugType);
        this.drugForm.controls['deliveryMethod'].setValue(this.selectedMasterData.deliveryMethodCode);
    } else if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.InsurancePlan) {
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
    this.changeDetector.detectChanges();
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
      this.healthCareForm.controls['providerName'].setValidators(
        Validators.required
      );
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

      this.healthCareForm.controls['zip'].setValidators(Validators.required);
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
    }
  }

  onUpdateClicked() {
    let formData;
    this.validateForm();
    this.isValidateForm = true;
    if (!this.healthCareForm.valid  || !this.insurancePlanForm.valid || !this.drugForm.valid) {
      return;
    }
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic || 
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider) {
        this.updateProviderPanelSubject$ = this.financialVendorFacade.updateProviderPanelSubject$;
        let contact = [];
        let emails = [];
        let phones = [];    
        emails.push({
          emailAddress: this.healthCareForm.controls['email']?.value,
          vendorContactEmailId: this.selectedMasterData.vendorContactEmailId,
          vendorContactId: this.selectedMasterData.vendorContactId
        })
        phones.push({
          phoneNbr: this.healthCareForm?.controls['phoneNumber']?.value,
          faxNbr: this.healthCareForm?.controls['fax']?.value,
          vendorContactPhoneId: this.selectedMasterData.vendorContactPhoneId,
          vendorContactId: this.selectedMasterData.vendorContactId
        })
        contact.push(
          {
            contactName: this.healthCareForm.controls['contactFirstName']?.value,
            vendorContactId: this.selectedMasterData.vendorContactId,
            emails,
            phones
          }
        )
        let masterData = {
          vendorName: this.providerName,
          vendorId: this.selectedVendor,
          tin: this.healthCareForm?.controls['tinNumber'].value,
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
      } else if (this.selectedSubtypeCode ===  PendingApprovalGeneralTypeCode.Drug) {
        this.updateProviderPanelSubject$ = this.drugFacade.updateProviderPanelSubject$;
        let drugData = {
          DrugId: this.selectedMasterData.drugId,
          ManufacturerId : this.selectedVendor,
          NdcNbr : this.drugForm.controls['ndcCode'].value,
          BrandName : this.drugForm.controls['brandName'].value,
          DrugName : this.drugForm.controls['drugName'].value,
          DeliveryMethodCode: this.drugForm.controls['deliveryMethod'].value,
          IncludeInManufacturerRebatesFlag: this.selectedMasterData.includeInManufacturerRebatesFlag,
          DrugType: this.drugForm.controls['drugType'].value,
          ManufacturerName : this.providerName,
        }
        formData = {
          form : drugData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
    } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      this.updateProviderPanelSubject$ = this.insurancePlanFacade.updateProviderPanelSubject$;
      let insurancePlanData = {
        insurancePlanId: this.selectedMasterData.insurancePlanId,
        insurancePlanName: this.insurancePlanForm.controls['insurancePlanName'].value,
        healthInsuranceTypeCode: this.insurancePlanForm.controls['healthInsuranceTypeCode'].value,
        canPayForMedicationFlag: this.insurancePlanForm.controls['canPayForMedicationFlag'].value == true ? 'YES' : 'No',
        dentalPlanFlag: this.insurancePlanForm.controls['dentalPlanFlag'].value,
        startDate: this.insurancePlanForm.controls['startDate'].value,
        termDate: this.insurancePlanForm.controls['termDate'].value,
        providerName: this.providerName,
        insuranceProviderId: this.selectedVendor
      }
      formData = {
        form: insurancePlanData,
        subTypeCode: this.selectedSubtypeCode
      }
      this.updateMasterDetailsClickedEvent.emit(formData);
    }
    this.closeEditModal();
  }

  get healthCareFormControls() {
    return this.healthCareForm.controls as any;
  }

  get drugFormControls() {
    return this.drugForm.controls as any;
  }
  
  get insurancePlanFormControls() {
    return this.insurancePlanForm.controls as any;
  }

  onCancel(){
    this.close.emit();
  }

  private getVendorName() {
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider) {
        return this.selectedMasterData?.vendorName;
      } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.Drug) {
        return this.selectedMasterData?.manufacturerName;
    } else if (this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.InsurancePlan) {
      return this.selectedMasterData?.providerName;
    }
  }

  public selectionChange(value: any): void {
    this.providerName = value.vendorName;
  }

  private closeEditModal() {
    this.updateProviderPanelSubject$.subscribe((value: any) => {
      if (value) {
        this.recordUpdatedEvent.emit(value);
      }
    });
  }
}
