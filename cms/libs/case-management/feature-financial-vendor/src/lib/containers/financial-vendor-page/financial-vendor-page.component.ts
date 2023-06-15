import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CaseFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, SearchHeaderType } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorPageComponent implements OnInit {
  isVendorDetailFormShow = false;
  medicalProviderForm: FormGroup;
  providerTypeCode: string = '';
  isShowMedicalProvider: boolean = false;
  isShowDentalProvider: boolean = false;
  isShowInsuranceProvider: boolean = false;
  isShowPharmacyProvider: boolean = false;

  data = [
    {
      text: 'Manufacture',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Medical Provider',
      click: (dataItem: any): void => {
        this.clickOpenMedicalProviderDetails();
      },
    },
    {
      text: 'Insurance Vendor',
      click: (dataItem: any): void => {
        this.clickOpenInsuranceVendorModal();
      },
    },
    {
      text: 'Pharmacy',
      click: (dataItem: any): void => {
        this.clickOpenPharmacyVendorModal();
      },

    },
    {
      text: 'Dental Provider',
      click: (dataItem: any): void => {
        this.clickOpenDentalProviderDetails();
      },

    },
  ];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  vendorsList$ = this.financialVendorFacade.vendorsList$
  pageSizes = this.financialVendorFacade.gridPageSizes;
  sortValue = this.financialVendorFacade.sortValue;
  sortType = this.financialVendorFacade.sortType;
  sort = this.financialVendorFacade.sort;

  constructor(private caseFacade: CaseFacade, private financialVendorFacade: FinancialVendorFacade,
    private readonly formBuilder: FormBuilder) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.VendorSearch);
  }

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  get financeVendorTypeCodes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  clickOpenVendorDetails(dataItem: any) {
    this.isVendorDetailFormShow = true;

  }

  clickOpenMedicalProviderDetails() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.MedicalProvider;
    this.isShowMedicalProvider = true;
  }

  clickOpenDentalProviderDetails() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.DentalProvider;
    this.isShowDentalProvider = true;
  }

  clickCloseMedicalVendorDetails() {
    this.isShowMedicalProvider = false;
  }

  clickCloseDentalVendorDetails() {
    this.isShowDentalProvider = false;
  }

  clickCloseVendorDetails() {
    this.isVendorDetailFormShow = false;
  }

  loadFinancialVendorsList(data: any) {

    this.financialVendorFacade.getVendors(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType, data?.vendorTypeCode)
  }

  buildVendorForm() {
    this.medicalProviderForm.reset();
    this.medicalProviderForm = this.formBuilder.group({
      firstName:[''],
      lastName:[],
      providerName: [''],
      tinNumber: [''],
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
      isPreferedPharmacy: [''],
      paymentRunDate:[''],
      isAcceptCombinedPayment:[''],
      isAcceptReports: [''],
      newAddContactForm: this.formBuilder.array([
      ]),
    });
  }

  public get vendorTypes(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  saveVendorProfile(vendorProfile: any){
    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next:(response:any)=>{
        this.financialVendorFacade.hideLoader();
        this.closeVendorDetailModal();
      },
      error:(err:any)=>{
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      }
    });
  }

  closeVendorDetailModal(){
    this.isShowMedicalProvider = false;
    this.isShowDentalProvider = false;
    this.isShowInsuranceProvider =false;
    this.isShowPharmacyProvider = false;
  }

  clickOpenInsuranceVendorModal(){
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.InsuranceVendors;
    this.isShowInsuranceProvider = true;
  }

  clickOpenPharmacyVendorModal(){
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.Pharmacy;
    this.isShowPharmacyProvider = true;
  }
}
