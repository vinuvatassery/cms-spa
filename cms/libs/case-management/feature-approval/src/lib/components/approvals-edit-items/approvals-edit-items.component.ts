import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FinancialVendorFacade, PendingApprovalGeneralTypeCode } from '@cms/case-management/domain';

import { UIFormStyle } from '@cms/shared/ui-tpa';
import { Observable, Subscription } from 'rxjs';
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
  @Output() searchClinicVendorClicked = new EventEmitter<any>();
  @Output() updateMasterDetailsClickedEvent = new EventEmitter<any>();
  readonly subTypeConst = PendingApprovalGeneralTypeCode;
  clinicSearchSubscription!: Subscription;
  clinicVendorListLocal!: any;
  selectedClinicVendorId!: null;
  isValidateForm!: boolean;
  tinMaskFormat: string = '0 00-000000';
  selectedVendor!: any;

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.bindVendorData();
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
          } else {
            this.clinicVendorListLocal = data;
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
        vendorName: this.selectedMasterData?.vendorName,
      },
    ];
    this.selectedVendor = this.clinicVendorListLocal[0];
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
      this.selectedMasterData?.addressLine2
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

      this.healthCareForm.controls['firstName'].setValidators(
        Validators.required
      );
      this.healthCareForm.controls['firstName'].updateValueAndValidity();

      this.healthCareForm.controls['lastName'].setValidators(
        Validators.required
      );
      this.healthCareForm.controls['lastName'].updateValueAndValidity();

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
    }
  }

  onUpdateClicked() {
    this.validateForm();
    this.isValidateForm = true;
    if (this.healthCareForm.valid) {
      this.updateMasterDetailsClickedEvent.emit(this.healthCareForm.value);
    }
  }

  get healthCareFormControls() {
    return this.healthCareForm.controls as any;
  }
}
