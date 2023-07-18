import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-provider-info',
  templateUrl: './medical-claims-provider-info.component.html',
  styleUrls: ['./medical-claims-provider-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsProviderInfoComponent {}
