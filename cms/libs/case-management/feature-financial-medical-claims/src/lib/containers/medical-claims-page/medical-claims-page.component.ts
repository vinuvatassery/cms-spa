import { Component } from '@angular/core';
import { UIFormStyle, UITabStripScroll } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-medical-claims-page',
  templateUrl: './medical-claims-page.component.html',
})
export class FinancialMedicalClaimsPageComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  public uiTabStripScroll: UITabStripScroll = new UITabStripScroll();
}