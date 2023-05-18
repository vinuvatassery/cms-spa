import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-vendor-page',
  templateUrl: './financial-vendor-page.component.html',
  styleUrls: ['./financial-vendor-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialVendorPageComponent {

  public formUiStyle : UIFormStyle = new UIFormStyle();
  public uiTabStripScroll : UITabStripScroll = new UITabStripScroll();
  //todo make the tabstrip  dynamic with vendor type codes
  vendorTypeCode = ''
}
