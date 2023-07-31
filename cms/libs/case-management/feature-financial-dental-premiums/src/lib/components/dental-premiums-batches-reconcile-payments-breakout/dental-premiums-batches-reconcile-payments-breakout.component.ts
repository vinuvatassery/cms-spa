import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-batches-reconcile-payments-breakout',
  templateUrl:
    './dental-premiums-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
