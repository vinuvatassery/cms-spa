import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-dental-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './dental-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
