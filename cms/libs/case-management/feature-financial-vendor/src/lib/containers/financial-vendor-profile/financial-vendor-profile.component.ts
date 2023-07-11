import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FinancialVendorFacade, FinancialVendorProviderTabCode } from '@cms/case-management/domain';
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
  vendorProfile$ = this.financialVendorFacade.vendorProfile$
  vendorProfileSpecialHandling$ = this.financialVendorFacade.vendorProfileSpecialHandling$
  constructor(private activeRoute: ActivatedRoute, private financialVendorFacade : FinancialVendorFacade) {}

  ngOnInit(): void {
    this.loadQueryParams();
  }

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  /** Private properties **/
  loadQueryParams() {
    this.vendorId = this.activeRoute.snapshot.queryParams['v_id'];
    this.providerId = this.activeRoute.snapshot.queryParams['prv_id'];
    this.tabCode = this.activeRoute.snapshot.queryParams['tab_code'];
    this.vendorTypeCode = this.activeRoute.snapshot.queryParams['vendor_type_code'];
    if(this.vendorId && this.tabCode)
    {
    this.loadFinancialVendorProfile(this.vendorId)
    }

    switch (this.tabCode) {
      case FinancialVendorProviderTabCode.Manufacturers:
        this.profileInfoTitle = 'Manufacture Info';
        break;
      case FinancialVendorProviderTabCode.InsuranceVendors:
        this.profileInfoTitle = 'Vendor Info';
        break;
      case FinancialVendorProviderTabCode.MedicalProvider:
      case FinancialVendorProviderTabCode.DentalProvider:
        this.profileInfoTitle = 'Provider Info';
        break;
      case FinancialVendorProviderTabCode.Pharmacy:
        this.profileInfoTitle = 'Pharmacy Info';
        break;
    }
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
}
