import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-delete-claims',
  templateUrl: './medical-claims-delete-claims.component.html',
  styleUrls: ['./medical-claims-delete-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsDeleteClaimsComponent {}
