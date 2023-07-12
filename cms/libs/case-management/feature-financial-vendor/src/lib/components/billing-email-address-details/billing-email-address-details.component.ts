import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-billing-email-address-details',
  templateUrl: './billing-email-address-details.component.html',
  styleUrls: ['./billing-email-address-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingEmailAddressDetailsComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
