import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-pharmacy-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './pharmacy-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
