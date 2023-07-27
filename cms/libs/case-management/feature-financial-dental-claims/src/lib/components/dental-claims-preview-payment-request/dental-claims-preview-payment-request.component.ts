import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 

@Component({
  selector: 'cms-dental-claims-preview-payment-request',
  templateUrl: './dental-claims-preview-payment-request.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsPreviewPaymentRequestComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
