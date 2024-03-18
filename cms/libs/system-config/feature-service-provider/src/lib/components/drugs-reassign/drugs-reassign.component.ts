import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-drugs-reassign',
  templateUrl: './drugs-reassign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsReassignComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
