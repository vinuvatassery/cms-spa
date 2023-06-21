import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html',
  styleUrls: ['./vendor-refund-page.component.css']
})
export class VendorRefundPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
}
