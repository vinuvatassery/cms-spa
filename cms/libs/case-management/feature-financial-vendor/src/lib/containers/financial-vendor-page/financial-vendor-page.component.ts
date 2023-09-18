import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CaseFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, SearchHeaderType } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { ReminderFacade } from '@cms/productivity-tools/domain';

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
  reminderTabOn = true;
  isShowManufacturers: boolean = false;

  data = [
    {
      text: 'Manufacturer',
      click: (dataItem: any): void => {
        this.clickOpenManufacturers();
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
  selectedVendorType = this.financialVendorFacade.selectedVendorType
  constructor(private caseFacade: CaseFacade, private financialVendorFacade: FinancialVendorFacade,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private reminderFacade: ReminderFacade) {
    this.medicalProviderForm = this.formBuilder.group({});
  }

  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
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
    this.providerTypeCode = FinancialVendorTypeCode.MedicalProviders;
    this.isShowMedicalProvider = true;
  }

  clickOpenDentalProviderDetails() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.DentalProviders;
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
    this.financialVendorFacade.selectedVendorType = data?.vendorTypeCode
    this.financialVendorFacade.getVendors(data?.skipCount, data?.pagesize, data?.sortColumn, data?.sortType, data?.vendorTypeCode, data?.filter)
  }

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

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  saveVendorProfile(vendorProfile: any){
    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next:(response:any)=>{
        this.financialVendorFacade.hideLoader();
        this.closeVendorDetailModal();
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,"Vendor profile added successfully");
        this.cdr.detectChanges();
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
    this.isShowManufacturers = false;
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
  onReminderDoneClicked(event:any) {
    this.reminderFacade.showHideSnackBar(
      SnackBarNotificationType.SUCCESS,
      'Item  updated to Done successfully'
    );
  }

  clickOpenManufacturers() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.Manufacturers;
    this.isShowManufacturers = true;
  }


  exportGridData(data: any){
    if(data){
      this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Files Exported Successfully')
    }
  }
}
