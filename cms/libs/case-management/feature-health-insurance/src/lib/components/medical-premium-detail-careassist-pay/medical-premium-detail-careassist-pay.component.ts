import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ContactFacade, FinancialClaimsFacade, FinancialVendorFacade, HealthInsurancePlan} from '@cms/case-management/domain';
import { FinancialVendorTypeCode, StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { LovFacade, NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';

@Component({
  selector: 'case-management-medical-premium-detail-careassist-pay',
  templateUrl: './medical-premium-detail-careassist-pay.component.html',
})
export class MedicalPremiumDetailCareassistPayComponent implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() sameAsInsuranceIdFlag!: boolean;
  @Input() ddlInsuranceType: string = '';
  @Input() clientId: any;
  @Input() caseEligibilityId: any;
  @Input() claimsType: any;
  @Output() saveProviderEventClicked = new EventEmitter<any>();
  insuranceVendorsSearchResult$ = this.financialVendorFacade.insuranceVendors$;
  public isaddNewInsuranceProviderOpen = false;
  InsurancePlanTypes: typeof HealthInsurancePlan = HealthInsurancePlan;
  premiumFrequencyList$ = this.lovFacade.premiumFrequencylov$;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  specialCharAdded: boolean = false;
  selectedMedicalProvider: any;
  vendorId: any;
  vendorName: any;
  clientName: any;
  isRecentClaimShow = false;
  providerTin: any;
  isShowInsuranceProvider: boolean = false;
  medicalProviderForm: FormGroup;
  ddlStates = this.contactFacade.ddlStates$;
  clinicVendorList = this.financialVendorFacade.clinicVendorList$;;
  clinicVendorLoader = this.financialVendorFacade.clinicVendorLoader$;;
  hasinsuranceVendorCreateUpdatePermission: boolean = false;
  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }
  providerName = 'Medical';
  buildVendorForm() {

    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      firstName: [''],
      lastName: [],
      providerName: [''],
      tinNumber: [''],
      npiNbr: [''],
      paymentMethod: [''],
      specialHandling: [''],
      mailCode: [''],
      nameOnCheck: [''],
      nameOnEnvolop: [''],
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      zip: [''],
      physicalAddressFlag: [''],
      isPreferedPharmacy: [''],
      paymentRunDate: [''],
      isAcceptCombinedPayment: [''],
      isAcceptReports: [''],
      newAddContactForm: this.formBuilder.array([
      ]),
    });
  }
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private financialVendorFacade: FinancialVendorFacade,
    private financialClaimsFacade: FinancialClaimsFacade,
    private readonly contactFacade: ContactFacade,
    private userManagementFacade: UserManagementFacade,
    private readonly cdr: ChangeDetectorRef,
    private readonly navigationMenuFacade : NavigationMenuFacade,

  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
    this.medicalProviderForm = this.formBuilder.group({});
    this.hasinsuranceVendorCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Insurance_Vendor_Create_Update']);
  }

  saveVendorProfile(vendorProfile: any) {
    this.financialVendorFacade.showLoader();
    if (vendorProfile.vendorTypeCode == FinancialVendorTypeCode.Manufacturers) {
      this.financialVendorFacade.updateManufacturerProfile(vendorProfile).subscribe({
        next: (response: any) => {

          this.financialVendorFacade.hideLoader();
          this.closeVendorDetailModal();
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
    }
    else {
      this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
        next: (response: any) => {
          if(vendorProfile.activeFlag === StatusFlag.No)
            {
              this.loadPendingApprovalGeneralCount();
            }
          this.financialVendorFacade.hideLoader();
          this.closeVendorDetailModal();
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        }
      });
    }
  }

  searchMedicalProvider(searchText: any) {
    if (!searchText || searchText.length == 0) {
      return;
    }
    this.financialVendorFacade.searchInsurnaceVendor(searchText);
  }
  onProviderValueChange($event: any) {

    this.isRecentClaimShow = false;
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    this.checkProviderNotEligibleException($event);
  }
  checkProviderNotEligibleException($event: any) {
    return null;
  }

  ngOnInit(): void {

    this.contactFacade.loadDdlStates();
    if (this.ddlInsuranceType == HealthInsurancePlan.DentalInsurance) {
      this.providerName = "Dental";
    }
    this.lovFacade.getPremiumFrequencyLovs();
    this.buildVendorForm();
  }

  onSameAsInsuranceIdValueChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.sameAsInsuranceIdFlag = true;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(this.healthInsuranceForm.controls['insuranceIdNumber'].value);
      this.healthInsuranceForm.controls['paymentIdNbr'].disable();
    }
    else {
      this.sameAsInsuranceIdFlag = false;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(null);
      this.healthInsuranceForm.controls['paymentIdNbr'].enable();
    }
  }

  restrictSpecialChar(event: any) {
    const status = ((event.charCode > 64 && event.charCode < 91) ||
      (event.charCode > 96 && event.charCode < 123) ||
      event.charCode == 8 || event.charCode == 32 ||
      (event.charCode >= 48 && event.charCode <= 57) ||
      event.charCode == 45);
    if (status) {
      this.healthInsuranceForm.controls['insuranceEndDate'].setErrors(null);
      this.specialCharAdded = false;
    }
    else {
      this.healthInsuranceForm.controls['insuranceIdNumber'].setErrors({ 'incorrect': true });
      this.specialCharAdded = true;
    }
    return status;
  }


  public addNewInsuranceProviderOpen(): void {

    this.buildVendorForm();
    this.isShowInsuranceProvider = true;
  }

  searchClinicVendorClicked(data: any) {

    this.financialVendorFacade.searchClinicVendor(data);

  }
  closeVendorDetailModal() {
    this.isShowInsuranceProvider = false;
  }

  loadPendingApprovalGeneralCount() {

    this.navigationMenuFacade.getPendingApprovalGeneralCount();
  }
}
