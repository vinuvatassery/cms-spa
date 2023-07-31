import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'cms-medical-claims-print-authorization',
  templateUrl: './medical-claims-print-authorization.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]
}
