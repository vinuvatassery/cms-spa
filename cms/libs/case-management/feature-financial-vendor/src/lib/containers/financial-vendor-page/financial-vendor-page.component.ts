import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FinancialVendorProviderTabCode } from '@cms/case-management/domain';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialVendorPageComponent {
  isVendorDetailFormShow = false;

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
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Insurance Vendor',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
    },
    {
      text: 'Pharmacy',
      click: (dataItem: any): void => {
        this.clickOpenVendorDetails(dataItem);
      },
    },
  ];
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
  //todo make the tabstrip  dynamic with vendor type codes
  vendorTypeCode = '';

  get financeManagementTabs(): typeof FinancialVendorProviderTabCode {
    return FinancialVendorProviderTabCode;
  }

  clickOpenVendorDetails(dataItem : any) {
    this.isVendorDetailFormShow = true;
  
  }
  clickCloseVendorDetails() {
    this.isVendorDetailFormShow = false;
  }


}
