import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-payment-address-details',
  templateUrl: './payment-address-details.component.html',
  styleUrls: ['./payment-address-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentAddressDetailsComponent {

  SpecialHandlingLength = 100;
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
