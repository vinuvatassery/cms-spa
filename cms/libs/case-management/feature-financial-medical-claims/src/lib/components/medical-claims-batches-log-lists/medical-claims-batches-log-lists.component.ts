import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-claims-batches-log-lists',
  templateUrl: './medical-claims-batches-log-lists.component.html',
  styleUrls: ['./medical-claims-batches-log-lists.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchesLogListsComponent {
   /** Constructor **/
   constructor(private route: Router, ) {}

   backToBatch(event : any){  
    this.route.navigate(['/financial-management/medical-claims'] );
  }

  goToBatchItems(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/batch_log_list/batch_log_items'] );
  }

  navToReconcilePayments(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/batch_log_list/reconcile_payments'] );
  }
 
}
