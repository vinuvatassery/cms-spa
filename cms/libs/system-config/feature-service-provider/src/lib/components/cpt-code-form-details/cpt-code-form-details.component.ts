import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-cpt-code-form-details',
  templateUrl: './cpt-code-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CptCodeFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
