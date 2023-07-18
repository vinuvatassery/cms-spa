import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-detail-form',
  templateUrl: './medical-claims-detail-form.component.html',
  styleUrls: ['./medical-claims-detail-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsDetailFormComponent {}
