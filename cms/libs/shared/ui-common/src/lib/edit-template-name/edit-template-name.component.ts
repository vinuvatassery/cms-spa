import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'common-edit-template-name',
  templateUrl: './edit-template-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditTemplateNameComponent {}
