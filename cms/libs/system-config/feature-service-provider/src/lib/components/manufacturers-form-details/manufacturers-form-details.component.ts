import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-manufacturers-form-details',
  templateUrl: './manufacturers-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturersFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
