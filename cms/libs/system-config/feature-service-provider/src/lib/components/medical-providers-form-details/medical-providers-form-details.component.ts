import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-medical-providers-form-details',
  templateUrl: './medical-providers-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProvidersFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
