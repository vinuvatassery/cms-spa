import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-housing-acuity-level-detail',
  templateUrl: './housing-acuity-level-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HousingAcuityLevelDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
