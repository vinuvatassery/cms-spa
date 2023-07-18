import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-medical-claims-payment-details-form',
  templateUrl: './medical-claims-payment-details-form.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPaymentDetailsFormComponent {  
  public formUiStyle: UIFormStyle = new UIFormStyle()
}
