/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'case-management-medical-payment-detail',
  templateUrl: './medical-payment-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPaymentDetailComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
}
