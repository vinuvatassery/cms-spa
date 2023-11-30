import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-pharmacies-list',
  templateUrl: './pharmacies-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmaciesListComponent {}
