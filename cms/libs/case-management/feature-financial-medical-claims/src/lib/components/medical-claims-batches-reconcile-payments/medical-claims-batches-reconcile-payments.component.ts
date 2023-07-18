import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-claims-batches-reconcile-payments',
  templateUrl: './medical-claims-batches-reconcile-payments.component.html',
  styleUrls: ['./medical-claims-batches-reconcile-payments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesReconcilePaymentsComponent {
     /** Constructor **/
     constructor(private route: Router, ) {}

     navToBatchDetails(event : any){  
       this.route.navigate(['/financial-management/medical-claims/batch/batch_log_list'] );
     }
}
