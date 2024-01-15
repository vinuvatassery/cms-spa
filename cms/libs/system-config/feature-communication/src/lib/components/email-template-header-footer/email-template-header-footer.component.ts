import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-email-template-header-footer',
  templateUrl: './email-template-header-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailTemplateHeaderFooterComponent {}
