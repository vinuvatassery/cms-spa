import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-manufacturers-list',
  templateUrl: './manufacturers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManufacturersListComponent {}
