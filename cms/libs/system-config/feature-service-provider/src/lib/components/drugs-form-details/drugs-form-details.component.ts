import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-drugs-form-details',
  templateUrl: './drugs-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
