/** Angular **/
import {
  Component, 
  ChangeDetectionStrategy} from '@angular/core';
  import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-premium-payment-detail',
  templateUrl: './medical-premium-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
