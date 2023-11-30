import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-healthcare-provider-list',
  templateUrl: './healthcare-provider-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HealthcareProviderListComponent {}
