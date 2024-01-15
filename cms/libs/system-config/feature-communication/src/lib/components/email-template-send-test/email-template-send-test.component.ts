import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-email-template-send-test',
  templateUrl: './email-template-send-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateSendTestComponent {}
