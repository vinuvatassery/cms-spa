import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
import { FinancialVendorProviderTabCode } from 'libs/case-management/domain/src/lib/enums/financial-vendor-provider-tab-code';

@Component({
  selector: 'cms-financial-vendor-profile',
  templateUrl: './financial-vendor-profile.component.html',
  styleUrls: ['./financial-vendor-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorProfileComponent implements OnInit {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  vendorId!: string;
  providerId!: string;
  tabCode!: string;
  profileInfoTitle!: string;
  addressGridView = [];
  popupClassAction = 'TableActionPopup app-dropdown-action-list';

  constructor(private activeRoute: ActivatedRoute) {}

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
}
