import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-pharmacies-form-details',
  templateUrl: './pharmacies-form-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesFormDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
