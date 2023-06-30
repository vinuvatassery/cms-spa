/** Angular **/
import { Component, OnInit, OnChanges } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-vendor-refund-page',
  templateUrl: './vendor-refund-page.component.html', 
})
export class VendorRefundPageComponent implements OnInit, OnChanges {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();

  constructor() {}
  ngOnInit(): void {}
  ngOnChanges(): void {}
}
