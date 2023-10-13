import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { CaseFacade, ContactFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode, SearchHeaderType} from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentFacade, SnackBarNotificationType } from '@cms/shared/util-core';
import { ReminderFacade } from '@cms/productivity-tools/domain';
import { UserManagementFacade } from '@cms/system-config/domain';
import { BehaviorSubject } from 'rxjs';

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
  isAddNewClinicOpen: boolean = false;
  isShowMedicalProvider: boolean = false;
  isShowDentalProvider: boolean = false;
  isShowInsuranceProvider: boolean = false;
  isShowPharmacyProvider: boolean = false;
  reminderTabOn = true;
  isShowManufacturers: boolean = false;
  hasHealthcareProviderCreateUpdatePermission=false;
  private closeClinicModalSubject = new BehaviorSubject<boolean>(false);
  closeClinicModal$ = this.closeClinicModalSubject.asObservable();
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
  exportButtonShow$ = this.documentFacade.exportButtonShow$
  ddlStates=this.contactFacade.ddlStates$;
  clinicVendorList= this.financialVendorFacade.clinicVendorList$;;
  clinicVendorLoader= this.financialVendorFacade.clinicVendorLoader$;;
  
  constructor(private caseFacade: CaseFacade, private financialVendorFacade: FinancialVendorFacade,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private reminderFacade: ReminderFacade,
    private documentFacade :  DocumentFacade,
    private readonly contactFacade: ContactFacade,
    private userManagementFacade:UserManagementFacade, 
    ) {
    this.medicalProviderForm = this.formBuilder.group({});
  }
  dataExportParameters! : any
  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
    this.contactFacade.loadDdlStates();  
    this.hasHealthcareProviderCreateUpdatePermission=this.userManagementFacade.hasPermission(['Financial_MedicalProvider_Tab']);//Financial_MedicalProvider_Tab - Healthcare_Provider_Create_Update
  }
  searchClinicVendorClicked(clientName:any)
  {
    
    this.financialVendorFacade.searchClinicVendor(clientName);
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
    this.financialVendorFacade.selectedVendorType = data?.vendorTypeCode.includes('CLINIC') ? data?.vendorTypeCode.split(',')[0] : data?.vendorTypeCode;
    this.dataExportParameters = data
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

  saveClinicProfile(vendorProfile: any){
    // alert('got')
    // return;
    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addClinicProfile(vendorProfile).subscribe({
      next:(response:any)=>{
        this.financialVendorFacade.hideLoader();
        //this.closeVendorDetailModal();
        //this.isAddNewClinicOpen = false;
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS,"Clinic profile added successfully");
        this.cdr.detectChanges();
        this.closeClinicModalSubject.next(true);
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


  exportGridData(){
    const data = this.dataExportParameters
    if(data){
    const  filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest =
      {
        vendorTypeCode: data?.vendorTypeCode,
        SortType : data?.sortType,
        Sorting : data?.sortColumn,
        SkipCount : data?.skipCount,
        MaxResultCount : data?.pagesize,
        Filter : filter
      }
     let fileName = ''
      switch(this.financialVendorFacade.selectedVendorType) {
        case FinancialVendorTypeCode.Manufacturers: {
          fileName = 'Manufacturers';
           break;
        }
        case FinancialVendorTypeCode.DentalProviders: {
          fileName = 'Dental Providers';
           break;
        }
        case FinancialVendorTypeCode.InsuranceVendors: {
          fileName = 'Insurance Vendors';
           break;
        }
        case FinancialVendorTypeCode.MedicalProviders: {
          fileName = 'Medical Providers';
           break;
        }
        case FinancialVendorTypeCode.Pharmacy: {
          fileName = 'Pharmacy';
           break;
        }
     }
      this.documentFacade.getExportFile(vendorPageAndSortedRequest,'vendors' , fileName)
    }
  }


 
}
