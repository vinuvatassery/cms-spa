import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { PendingApprovalGeneralTypeCode } from '@cms/case-management/domain';

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
  @Input() healthCareForm!: FormGroup;
  @Input() selectedMasterData: any;
  @Input() clinicVendorLoader$!: Observable<any>;
  @Input() selectedMasterDetail$!: Observable<any>;
  @Input() drugForm!:  FormGroup<any>;
  @Output() searchClinicVendorClicked = new EventEmitter<any>();
  @Output() updateMasterDetailsClickedEvent = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  clinicSearchSubscription!: Subscription;
  clinicVendorListLocal!: any;
  selectedClinicVendorId!: null;
  isValidateForm!: boolean;
  tinMaskFormat: string = '0 00-000000';
  selectedVendor!: any;
  drugTypesList : any;
  drugType: any;
  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getDrugType();
    this.bindVendorData();
  }

  private getDrugType() {
    if (this.selectedSubtypeCode == PendingApprovalGeneralTypeCode.Drug) {
      if (this.selectedMasterData.hiv == 'YES') {
        this.drugType = 'hiv';
      } else if (this.selectedMasterData.hepatitis == 'YES') {
        this.drugType = 'hepatitis';
      } else if (this.selectedMasterData.opportunisticInfection == 'YES') {
        this.drugType = 'opportunisticInfection';
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
    //this.selectedVendor = this.clinicVendorListLocal[0];
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
    }
  }

  onUpdateClicked() {
    let formData;
    this.validateForm();
    this.isValidateForm = true;
    if (!this.healthCareForm.valid || !this.drugForm.valid) {
      return;
    }
    if(this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalClinic || 
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.MedicalProvider ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalClinic ||
      this.selectedSubtypeCode === PendingApprovalGeneralTypeCode.DentalProvider) {
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
          vendorName: this.selectedMasterData.vendorName,
          vendorId: this.selectedMasterData.vendorId,
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
        let drugData = {
          DrugId: this.selectedMasterData.drugId,
          ManufacturerId : this.selectedMasterData.vendorId,
          NdcNbr : this.drugForm.controls['ndcCode'].value,
          BrandName : this.drugForm.controls['brandName'].value,
          DrugName : this.drugForm.controls['drugName'].value,
          DeliveryMethodCode: this.drugForm.controls['deliveryMethod'].value,
          IncludeInManufacturerRebatesFlag: this.selectedMasterData.includeInManufacturerRebatesFlag,
          DrugType: this.drugForm.controls['drugType'].value,
          ManufacturerName : this.drugForm.controls['providerName'].value,
        }
        formData = {
          form : drugData,
          subTypeCode: this.selectedSubtypeCode
        }
        this.updateMasterDetailsClickedEvent.emit(formData);
      }
  }

  get healthCareFormControls() {
    return this.healthCareForm.controls as any;
  }

  get drugFormControls() {
    return this.drugForm.controls as any;
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
      }
  }
}
