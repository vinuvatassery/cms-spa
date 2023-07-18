import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-batch-list-detail-items',
  templateUrl: './medical-claims-batch-list-detail-items.component.html',
  styleUrls: ['./medical-claims-batch-list-detail-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchListDetailItemsComponent {}
