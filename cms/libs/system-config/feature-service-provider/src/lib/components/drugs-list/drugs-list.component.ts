import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-drugs-list',
  templateUrl: './drugs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrugsListComponent {}
