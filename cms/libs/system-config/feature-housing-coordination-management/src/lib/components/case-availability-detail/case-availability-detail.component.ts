import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'system-config-case-availability-detail',
  templateUrl: './case-availability-detail.component.html',
  styleUrls: ['./case-availability-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CaseAvailabilityDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
