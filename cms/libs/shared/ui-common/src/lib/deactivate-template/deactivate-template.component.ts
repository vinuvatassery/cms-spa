import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'common-deactivate-template',
  templateUrl: './deactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeactivateTemplateComponent {}
