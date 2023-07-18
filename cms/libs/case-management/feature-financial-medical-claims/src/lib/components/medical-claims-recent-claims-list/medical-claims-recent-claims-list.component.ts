import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-recent-claims-list',
  templateUrl: './medical-claims-recent-claims-list.component.html',
  styleUrls: ['./medical-claims-recent-claims-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsRecentClaimsListComponent {}
