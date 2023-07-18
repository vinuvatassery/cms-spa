import { ChangeDetectionStrategy, Component } from '@angular/core'; 
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-claims-batch-list-detail-items',
  templateUrl: './medical-claims-batch-list-detail-items.component.html',
  styleUrls: ['./medical-claims-batch-list-detail-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsBatchListDetailItemsComponent {
  constructor(private route: Router, ) {}

  backToBatchLog(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/batch_log_list'] );
  }
}
