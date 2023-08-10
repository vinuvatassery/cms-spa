import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTabCode, FinancialVendorTypeCode } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';


@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorProfileComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  isShownEventLog = false;
  vendorId!: string;
  providerId!: string;
  tabCode!: string;
  vendorTypeCode!: string;
  profileInfoTitle = "info";
  addressGridView = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  selectedVendorInfo$ = this.financialVendorFacade.selectedVendor$;
  vendorProfile$ = this.financialVendorFacade.vendorProfile$
  vendorProfileSpecialHandling$ = this.financialVendorFacade.vendorProfileSpecialHandling$
  constructor(private activeRoute: ActivatedRoute, private financialVendorFacade : FinancialVendorFacade) {}

  ngOnInit(): void {
    this.loadQueryParams();
  }

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  public get vendorTypes(): typeof FinancialVendorTypeCode {
    return FinancialVendorTypeCode;
  }

  /** Private properties **/
  loadQueryParams() {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.providerId = this.activeRoute.snapshot.queryParams['prv_id'];
    this.tabCode = this.activeRoute.snapshot.queryParams['tab_code'];
    
    this.loadVendorInfo();
    if(this.vendorId && this.tabCode)
    {
      this.loadFinancialVendorProfile(this.vendorId)
    }

    switch (this.tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        this.vendorTypeCode = FinancialVendorTypeCode.Manufacturers
        this.profileInfoTitle = 'Manufacture Info';
        break;
      case FinancialVendorProviderTabCode.InsuranceVendors:
        this.vendorTypeCode = FinancialVendorTypeCode.InsuranceVendors
        this.profileInfoTitle = 'Insurance Vendor Info';
        break;
      case FinancialVendorProviderTabCode.MedicalProvider:
        this.vendorTypeCode = FinancialVendorTypeCode.MedicalProviders
        this.profileInfoTitle = 'Provider Info';
        break;
      case FinancialVendorProviderTabCode.DentalProvider:
        this.vendorTypeCode = FinancialVendorTypeCode.DentalProviders
        this.profileInfoTitle = 'Provider Info';
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.vendorTypeCode = FinancialVendorTypeCode.Pharmacy
        this.profileInfoTitle = 'Pharmacy Info';
        break;
    }
  }

  loadVendorInfo() {
    this.financialVendorFacade.getVendorDetails(this.vendorId);
  }

  handleShowEventLogClicked() {
    this.isShownEventLog = !this.isShownEventLog;

  }
  loadSpecialHandling() {
    this.financialVendorFacade.getVendorProfileSpecialHandling(this.vendorId);
  }
  loadFinancialVendorProfile(vendorId : string)
  {
    this.financialVendorFacade.getVendorProfile(vendorId,this.tabCode)
  }

  onVendorEditSuccess(status: boolean) {
    if (status) {
      this.loadVendorInfo();
      this.loadFinancialVendorProfile(this.vendorId);
    }
  }
}
