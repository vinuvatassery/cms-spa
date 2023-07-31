import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 

@Component({
  selector: 'cms-medical-premiums-preview-payment-request',
  templateUrl: './medical-premiums-preview-payment-request.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsPreviewPaymentRequestComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
