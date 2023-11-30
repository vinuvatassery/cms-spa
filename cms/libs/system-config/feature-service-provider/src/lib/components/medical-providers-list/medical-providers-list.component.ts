import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'system-config-medical-providers-list',
  templateUrl: './medical-providers-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalProvidersListComponent {}
