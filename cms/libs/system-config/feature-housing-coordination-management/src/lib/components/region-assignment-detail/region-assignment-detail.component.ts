import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-region-assignment-detail',
  templateUrl: './region-assignment-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegionAssignmentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
