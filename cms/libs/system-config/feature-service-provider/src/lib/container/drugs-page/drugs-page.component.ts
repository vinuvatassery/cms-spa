import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-drugs-page',
  templateUrl: './drugs-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsPageComponent {}
