import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-healthcare-provider-form-details',
  templateUrl: './healthcare-provider-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
