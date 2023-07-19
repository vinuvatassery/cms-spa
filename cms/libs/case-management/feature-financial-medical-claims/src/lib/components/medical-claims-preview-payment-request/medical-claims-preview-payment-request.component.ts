import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 

@Component({
  selector: 'cms-medical-claims-preview-payment-request',
  templateUrl: './medical-claims-preview-payment-request.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPreviewPaymentRequestComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
