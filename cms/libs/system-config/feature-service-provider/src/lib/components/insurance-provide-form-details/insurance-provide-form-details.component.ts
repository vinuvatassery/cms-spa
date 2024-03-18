import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-insurance-provide-form-details',
  templateUrl: './insurance-provide-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceProvideFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
