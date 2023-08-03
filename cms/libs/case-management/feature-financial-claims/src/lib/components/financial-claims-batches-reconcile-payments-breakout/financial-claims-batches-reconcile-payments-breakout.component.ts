import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-financial-claims-batches-reconcile-payments-breakout',
  templateUrl:
    './financial-claims-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
