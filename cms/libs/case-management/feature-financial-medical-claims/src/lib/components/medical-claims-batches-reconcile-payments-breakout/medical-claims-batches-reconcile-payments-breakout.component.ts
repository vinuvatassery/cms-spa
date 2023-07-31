import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-medical-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './medical-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
