import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FinancialVendorFacade, FinancialVendorTypeCode, HealthInsurancePlan, ServiceSubTypeCode} from '@cms/case-management/domain';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { LovFacade } from '@cms/system-config/domain';

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
  insuranceVendorsSearchResult$ = this.financialVendorFacade.insuranceVendors$;
  public isaddNewInsuranceProviderOpen =false;
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
public get vendorTypes(): typeof FinancialVendorTypeCode {
  return FinancialVendorTypeCode;
}
readonly financialProvider = 'medical';

  buildVendorForm() {
    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      firstName:[''],
      lastName:[],
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
      paymentRunDate:[''],
      isAcceptCombinedPayment:[''],
      isAcceptReports: [''],
      newAddContactForm: this.formBuilder.array([
      ]),
    });
  }
  constructor(
    public readonly lovFacade: LovFacade,
    private readonly formBuilder: FormBuilder,
    private financialVendorFacade: FinancialVendorFacade,
   
  ) {
    this.healthInsuranceForm = this.formBuilder.group({});
    this.medicalProviderForm = this.formBuilder.group({});
  }
  searchMedicalProvider(searchText: any) {
    
    if (!searchText || searchText.length == 0) {
      return;
    }
   this.financialVendorFacade.searchInSurnaceVendor(searchText, this.claimsType == this.financialProvider ? ServiceSubTypeCode.medicalClaim : ServiceSubTypeCode.dentalClaim);
  }
  onProviderValueChange($event: any) {
    
    this.isRecentClaimShow = false;
    this.vendorId = $event.vendorId;
    this.vendorName = $event.vendorName;
    this.providerTin = $event;
    this.checkProviderNotEligibleException($event);
  }
  checkProviderNotEligibleException($event:any)
  {
       return null;
  }
  ngOnInit(): void {
    
   

    this.lovFacade.getPremiumFrequencyLovs();
    this.buildVendorForm();
  }

  onSameAsInsuranceIdValueChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.sameAsInsuranceIdFlag = true;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(this.healthInsuranceForm.controls['insuranceIdNumber'].value);
    }
    else {
      this.sameAsInsuranceIdFlag = false;
      this.healthInsuranceForm.controls['paymentIdNbr'].setValue(null);
    }
  }
  closeVendorDetailModal(){
    this.isaddNewInsuranceProviderOpen = false;
  }
  saveVendorProfile(vendorProfile: any){
    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next:(response:any)=>{
        this.financialVendorFacade.hideLoader();
        this.closeVendorDetailModal();
    
      },
      error:(err:any)=>{
     }
    });
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
  public addNewInsuranceProviderClose(): void {
  
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.buildVendorForm();
    this.isaddNewInsuranceProviderOpen = true;
  }
}
