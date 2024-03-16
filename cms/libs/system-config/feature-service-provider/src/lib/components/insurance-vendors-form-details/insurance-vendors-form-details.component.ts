import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-insurance-vendors-form-details',
  templateUrl: './insurance-vendors-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InsuranceVendorsFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
