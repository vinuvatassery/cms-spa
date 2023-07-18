import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cms-medical-claims-app-payments-list',
  templateUrl: './medical-claims-app-payments-list.component.html',
  styleUrls: ['./medical-claims-app-payments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsAppPaymentsListComponent {}
