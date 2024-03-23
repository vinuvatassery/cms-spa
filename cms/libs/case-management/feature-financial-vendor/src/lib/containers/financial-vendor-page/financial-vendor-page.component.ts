import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CaseFacade, ContactFacade, FinancialVendorFacade, FinancialVendorProviderTabCode, SearchHeaderType } from '@cms/case-management/domain';
import { FinancialVendorTypeCode } from '@cms/shared/ui-common';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DocumentFacade, SnackBarNotificationType } from '@cms/shared/util-core';
import { ReminderFacade } from '@cms/productivity-tools/domain';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserManagementFacade } from '@cms/system-config/domain';
import { StatusFlag } from '@cms/shared/ui-common';

@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorPageComponent implements OnInit {
  isVendorDetailFormShow = false;
  medicalProviderForm: FormGroup;
  clinicForm: FormGroup;
  providerTypeCode: string = '';

  ShowClinicProvider: boolean = false;
  isShowMedicalProvider: boolean = false;
  isShowDentalProvider: boolean = false;
  isShowInsuranceProvider: boolean = false;
  isShowPharmacyProvider: boolean = false;
  reminderTabOn = true;
  isShowManufacturers: boolean = false;
  hasClinicCreateUpdatePermission = false;
  hasMedicalAndDentalCreateUpdatePermission = false;

  inputProviderTypeForClinic = '';
  selectedClinicType : string = this.financeVendorTypeCodes.MedicalClinic;
  hasinsuranceVendorCreateUpdatePermission:boolean = false;
  hasPharmacyCreateUpdatePermission:boolean = false; 
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
  ddlStates = this.contactFacade.ddlStates$;
  clinicVendorList = this.financialVendorFacade.clinicVendorList$;;
  clinicVendorLoader = this.financialVendorFacade.clinicVendorLoader$;


  private closeMedicalDentalProviderModalSubject = new BehaviorSubject<boolean>(false);
  closeMedicalDentalProviderModal$ = this.closeMedicalDentalProviderModalSubject.asObservable();

  saveVendorEventSubject: Subject<any> = new Subject();

  setupForClinic(providerTypeForClinic: string) {
    if (providerTypeForClinic === FinancialVendorTypeCode.DentalProviders)
      this.selectedClinicType = FinancialVendorTypeCode.DentalProviders;
    else if (providerTypeForClinic === FinancialVendorTypeCode.MedicalProviders)
      this.selectedClinicType = FinancialVendorTypeCode.MedicalProviders;

    this.inputProviderTypeForClinic = FinancialVendorTypeCode.MedicalProviders;

    this.clickOpenClinicProviderDetails();
  }

  constructor(private caseFacade: CaseFacade, private financialVendorFacade: FinancialVendorFacade,
    private readonly formBuilder: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private reminderFacade: ReminderFacade,
    private documentFacade: DocumentFacade,
    private readonly contactFacade: ContactFacade,
    private userManagementFacade: UserManagementFacade
  ) {
    this.medicalProviderForm = this.formBuilder.group({});
    this.clinicForm = this.formBuilder.group({});
  }

  dataExportParameters!: any
  /** Lifecycle hooks **/
  ngOnInit() {
    this.caseFacade.enableSearchHeader(SearchHeaderType.CaseSearch);
    this.contactFacade.loadDdlStates();
    this.hasClinicCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Clinic_Create_Update']);
    this.hasMedicalAndDentalCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Medical_Dental_Provider_Create_Update']);
    this.hasinsuranceVendorCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Insurance_Vendor_Create_Update']);
    this.hasPharmacyCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Pharmacy_Create_Update']);
  }

  searchClinicVendorClicked(clientName: any) {

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

  clickOpenClinicProviderDetails() {
    this.providerTypeCode = FinancialVendorTypeCode.Clinic;
    this.buildVendorForm(this.providerTypeCode);
    this.ShowClinicProvider = true;
  }

  clickOpenDentalProviderDetails() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.DentalProviders;
    this.isShowDentalProvider = true;
  }

  clickCloseMedicalVendorDetails() {
    this.isShowMedicalProvider = false;
  }

  clickCloseClinicVendorDetails() {
    this.ShowClinicProvider = false;
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

  buildVendorForm(providerType?: any) {

    if (providerType === FinancialVendorTypeCode.Clinic)
      this.clinicForm.reset();
    else
      this.medicalProviderForm.reset();

    let form = this.formBuilder.group({
      firstName: [''],
      lastName: [],
      providerName: [''],
      tinNumber: [''],
      npiNbr: [''],
      paymentMethod: [''],
      clinicType: [''],
      specialHandlingDesc: [''],
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
      parentVendorId : [],
      newAddContactForm: this.formBuilder.array([
      ]),
    });

    if (providerType === FinancialVendorTypeCode.Clinic)
      this.clinicForm = form;
    else
      this.medicalProviderForm = form;
  }

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  saveVendorProfile(vendorProfile: any) {

    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next: (response: any) => {
        this.financialVendorFacade.hideLoader();
        this.closeVendorDetailModal(this.providerTypeCode);

        let notificationMessage = "Vendor profile added successfully.";
        if (vendorProfile.activeFlag === StatusFlag.No)
          notificationMessage = "Vendor profile requested successfully.";

        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, notificationMessage);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }

  closeVendorDetailModal(data?: any) {
    if (this.ShowClinicProvider) {
      this.ShowClinicProvider = false;
    } else {
      this.isShowMedicalProvider = false;
      this.isShowDentalProvider = false;
      this.isShowInsuranceProvider = false;
      this.isShowPharmacyProvider = false;
      this.isShowManufacturers = false;
    }
  }

  clickOpenInsuranceVendorModal() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.InsuranceVendors;
    this.isShowInsuranceProvider = true;
  }

  clickOpenPharmacyVendorModal() {
    this.buildVendorForm();
    this.providerTypeCode = FinancialVendorTypeCode.Pharmacy;
    this.isShowPharmacyProvider = true;
  }
  onReminderDoneClicked(event: any) {
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

  exportGridData() {
    const data = this.dataExportParameters
    if (data) {
      const filter = JSON.stringify(data?.filter);

      const vendorPageAndSortedRequest =
      {
        vendorTypeCode: data?.vendorTypeCode,
        SortType: data?.sortType,
        Sorting: data?.sortColumn,
        SkipCount: data?.skipCount,
        MaxResultCount: data?.pagesize,
        Filter: filter
      }
      let fileName = ''
      switch (this.financialVendorFacade.selectedVendorType) {
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
      this.documentFacade.getExportFile(vendorPageAndSortedRequest, 'vendors', fileName)
    }
  }


}
