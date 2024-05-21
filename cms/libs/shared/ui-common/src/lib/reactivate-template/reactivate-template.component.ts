import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'common-reactivate-template',
  templateUrl: './reactivate-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReactivateTemplateComponent {}
