import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-email-template-send-test',
  templateUrl: './email-template-send-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateSendTestComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
