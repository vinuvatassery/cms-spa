import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-billing-address-details',
  templateUrl: './billing-address-details.component.html',
  styleUrls: ['./billing-address-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingAddressDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
