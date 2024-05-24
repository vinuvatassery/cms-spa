import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'client-portal-recover-email',
  templateUrl: './recover-email.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoverEmailComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
