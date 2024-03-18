import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-template-page',
  templateUrl: './template-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatePageComponent {}
