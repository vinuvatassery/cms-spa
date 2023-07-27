import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'cms-dental-claims-print-authorization',
  templateUrl: './dental-claims-print-authorization.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
