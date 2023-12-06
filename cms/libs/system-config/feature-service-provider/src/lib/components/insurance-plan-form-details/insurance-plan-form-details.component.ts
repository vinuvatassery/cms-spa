import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-insurance-plan-form-details',
  templateUrl: './insurance-plan-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsurancePlanFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
