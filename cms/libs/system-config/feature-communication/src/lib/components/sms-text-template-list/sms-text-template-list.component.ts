import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'system-config-sms-text-template-list',
  templateUrl: './sms-text-template-list.component.html',
  styleUrls: ['./sms-text-template-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmsTextTemplateListComponent {
}
