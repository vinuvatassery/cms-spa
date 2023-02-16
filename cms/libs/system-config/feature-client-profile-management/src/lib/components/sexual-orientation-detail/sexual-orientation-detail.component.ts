import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-sexual-orientation-detail',
  templateUrl: './sexual-orientation-detail.component.html',
  styleUrls: ['./sexual-orientation-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SexualOrientationDetailComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
