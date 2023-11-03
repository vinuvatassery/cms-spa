import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PendingApprovalGeneralTypeCode } from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable } from 'rxjs';
@Component({
  selector: 'productivity-tools-approvals-edit-items',
  templateUrl: './approvals-edit-items.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApprovalsEditItemsComponent implements OnInit{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() selectedSubtypeCode: any;
  @Input() selectedVendor$!: Observable<any>;
  @Input() clinicVendorList$: any;
  @Input() ddlStates$!: any;
  @Input() healthCareForm!: FormGroup;
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  clinicSearchSubscription!: any;
  clinicVendorListLocal!: null;
  selectedClinicVendorId!: null;
  searchClinicVendorClicked!: any;
  vendorData: any;

  /** constructor */

  ngOnInit(): void {
    this.selectedVendor$.subscribe((value:any)=>this.vendorData = value);
    this.bindVendorData();
  }
  
  searchClinic(clinicName: any) {
    this.clinicSearchSubscription?.unsubscribe();

    if (clinicName === '' || !clinicName) {
      this.clinicVendorListLocal = null;
      return;
    }

    this.clinicSearchSubscription = this.clinicVendorList$.subscribe((data: any) => {
      if (data && clinicName !== '') {
        if (this.clinicSearchSubscription === PendingApprovalGeneralTypeCode.MedicalProvider
          || this.clinicSearchSubscription === PendingApprovalGeneralTypeCode.MedicalClinic
        ) {
          this.clinicVendorListLocal = data.filter((item: any) => item.vendorTypeCode === PendingApprovalGeneralTypeCode.MedicalClinic);
        } else if (this.clinicSearchSubscription === PendingApprovalGeneralTypeCode.DentalProvider
          || this.clinicSearchSubscription === PendingApprovalGeneralTypeCode.DentalClinic) {
          this.clinicVendorListLocal = data.filter((item: any) => item.vendorTypeCode === PendingApprovalGeneralTypeCode.DentalClinic);
        }
        this.clinicSearchSubscription?.unsubscribe();
      }
    });


    this.selectedClinicVendorId = null;
    this.searchClinicVendorClicked.emit(clinicName);
  }

  bindVendorData(){
    this.healthCareForm.controls['clinicName'].setValue(this.vendorData.clinicName);
    this.healthCareForm.controls['providerFirstName'].setValue(this.vendorData.providerFirstName);
    this.healthCareForm.controls['providerLastName'].setValue(this.vendorData.providerLastName);
    this.healthCareForm.controls['tinNumber'].setValue(this.vendorData.tinNumber);
    this.healthCareForm.controls['phoneNumber'].setValue(this.vendorData.phoneNumber);
    this.healthCareForm.controls['email'].setValue(this.vendorData.email);
    this.healthCareForm.controls['fax'].setValue(this.vendorData.fax);
    this.healthCareForm.controls['addressLine1'].setValue(this.vendorData.addressLine1);
    this.healthCareForm.controls['addressLine2'].setValue(this.vendorData.addressLine2);
    this.healthCareForm.controls['city'].setValue(this.vendorData.city);
    this.healthCareForm.controls['state'].setValue(this.vendorData.state);
    this.healthCareForm.controls['zip'].setValue(this.vendorData.zip);
    this.healthCareForm.controls['contactFirstName'].setValue(this.vendorData.contactFirstName);
    this.healthCareForm.controls['contactLastName'].setValue(this.vendorData.contactLastName);
    this.healthCareForm.controls['contactPhone'].setValue(this.vendorData.contactPhone);
    this.healthCareForm.controls['contactFax'].setValue(this.vendorData.contactFax);
    this.healthCareForm.controls['contactEmail'].setValue(this.vendorData.contactEmail);
  }
}
