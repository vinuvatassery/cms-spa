import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-racial-or-ethnic-identity-detail',
  templateUrl: './racial-or-ethnic-identity-detail.component.html',
  styleUrls: ['./racial-or-ethnic-identity-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RacialOrEthnicIdentityDetailComponent{

  /** Public properties **/
  ddlIdentityCategory: Array<string> = ["Value 1", "Value 2", "Value 3", "Value 4",];
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
