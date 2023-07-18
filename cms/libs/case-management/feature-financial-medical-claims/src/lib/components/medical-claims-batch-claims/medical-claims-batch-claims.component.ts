import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-batch-claims',
  templateUrl: './medical-claims-batch-claims.component.html',
  styleUrls: ['./medical-claims-batch-claims.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchClaimsComponent {}
