import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'system-config-sms-text-template-send-test',
  templateUrl: './sms-text-template-send-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmsTextTemplateSendTestComponent {
  public formUiStyle : UIFormStyle = new UIFormStyle();
}
