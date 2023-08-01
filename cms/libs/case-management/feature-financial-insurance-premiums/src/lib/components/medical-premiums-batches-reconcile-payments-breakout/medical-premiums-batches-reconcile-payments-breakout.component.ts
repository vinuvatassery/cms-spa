import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-batches-reconcile-payments-breakout',
  templateUrl:
    './medical-premiums-batches-reconcile-payments-breakout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsBatchesReconcilePaymentsBreakoutComponent {
  reconcileBreakoutGridLists$ : any;
}
