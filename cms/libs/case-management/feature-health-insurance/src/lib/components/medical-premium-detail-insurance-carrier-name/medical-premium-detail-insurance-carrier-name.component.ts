import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { VendorFacade, HealthInsurancePolicyFacade, InsurancePlanFacade, InsuranceStatusType, FinancialVendorFacade} from '@cms/case-management/domain';
import { FinancialVendorTypeCode, StatusFlag } from '@cms/shared/ui-common';
import { LoaderService, SnackBarNotificationType } from '@cms/shared/util-core';
import { NavigationMenuFacade, UserManagementFacade } from '@cms/system-config/domain';
@Component({
  selector: 'case-management-medical-premium-detail-insurance-carrier-name',
  templateUrl: './medical-premium-detail-insurance-carrier-name.component.html',
})
export class MedicalPremiumDetailInsuranceCarrierNameComponent
  implements OnInit {
  @Input() healthInsuranceForm: FormGroup;
  @Input() isViewContentEditable!: boolean;
  @Input() insuranceStatus: any;
  @Input() insuranceTypeCode: any;
  @Input() claimsType: any;
  @Output() insuranceCarrierNameChange = new EventEmitter<any>();
  @Output() insuranceCarrierNameData = new EventEmitter<any>();
  public isaddNewInsuranceProviderOpen = false;
  public isLoading = false;
  public formUiStyle: UIFormStyle = new UIFormStyle();
  carrierNames: any = [];
  public caseOwnerfilterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  selectedMedicalProvider: any;
  vendorId: any;
  InsuranceCarrierForm: FormGroup;
  hasInsuranceCarrierCreateUpdatePermission: boolean = false;
  loadCarrier$ = this.vendorFacade.loadCarrier$;
  constructor(
    private formBuilder: FormBuilder,
    private readonly vendorFacade: VendorFacade,
    private readonly loaderService: LoaderService,
    private insurancePolicyFacade: HealthInsurancePolicyFacade,
    private readonly insurancePlanFacade: InsurancePlanFacade,
    private financialVendorFacade: FinancialVendorFacade,
    private readonly cdr: ChangeDetectorRef,
    private userManagementFacade: UserManagementFacade,
    private readonly navigationMenuFacade : NavigationMenuFacade,

  ) {
    this.healthInsuranceForm = this.formBuilder.group({
      insuranceProviderName: [''],
    });
    this.InsuranceCarrierForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
      this.loadInsuranceCarrierName(InsuranceStatusType.dentalInsurance);
    }
    else {
      this.loadInsuranceCarrierName(InsuranceStatusType.healthInsurance);
    }
    this.hasInsuranceCarrierCreateUpdatePermission = this.userManagementFacade.hasPermission(['Service_Provider_Insurance_Vendor_Create_Update']);
    if(this.hasInsuranceCarrierCreateUpdatePermission){
      this.loadCarrier$.subscribe({
        next: (data: any) => {
          this.loadInsuranceCarrierName(InsuranceStatusType.insurancePlanRequest);
        }
      });
    }
  }

  private loadInsuranceCarrierName(type: string) {
    this.isLoading = true;
    this.vendorFacade.loadAllVendors(type).subscribe({
      next: (data: any) => {
        if (!Array.isArray(data)) return;
        this.sortCarrier(data);
        this.insuranceCarrierNameData.emit(this.carrierNames);
        this.isLoading = false;
        this.insurancePlanFacade.planLoaderSubject.next(false);
      },
      error: (error: any) => {
        this.isLoading = false;
      }
    });
  }

  private sortCarrier(data: any) {
    this.carrierNames = data.sort((a: any, b: any) => {
      if (a.vendorName > b.vendorName) return 1;
      return (b.vendorName > a.vendorName) ? -1 : 0;
    });
  }

  public insuranceCarrierNameChangeValue(value: string): void {
    this.healthInsuranceForm.controls['insurancePlanName'].setValue(null);
    this.insuranceCarrierNameChange.emit(value);
  }

  public addNewInsuranceProviderClose(): void {
    this.isaddNewInsuranceProviderOpen = false;
  }

  public addNewInsuranceProviderOpen(): void {
    this.buildVendorForm();
    this.isaddNewInsuranceProviderOpen = true;
  }
  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }
  saveVendorProfile(vendorProfile: any) {

    this.financialVendorFacade.showLoader();
    this.financialVendorFacade.addVendorProfile(vendorProfile).subscribe({
      next: (response: any) => {
        if(vendorProfile.activeFlag === StatusFlag.No)
          {
            this.loadPendingApprovalGeneralCount();
          }
        this.financialVendorFacade.hideLoader();
        this.addNewInsuranceProviderClose();
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.SUCCESS, response.message);
        if (this.insuranceStatus == InsuranceStatusType.dentalInsurance) {
          this.loadInsuranceCarrierName(InsuranceStatusType.dentalInsurance);
        }
        else {
          this.loadInsuranceCarrierName(InsuranceStatusType.healthInsurance);
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.financialVendorFacade.showHideSnackBar(SnackBarNotificationType.ERROR, err);
      }
    });
  }
  buildVendorForm() {
    this.InsuranceCarrierForm.reset();
    this.InsuranceCarrierForm = this.formBuilder.group({
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
      activeFlag: ['']
    });
  }

  loadPendingApprovalGeneralCount() {

    this.navigationMenuFacade.getPendingApprovalGeneralCount();
  }
}
