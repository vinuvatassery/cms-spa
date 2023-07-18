import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-medical-claims-batches-list',
  templateUrl: './medical-claims-batches-list.component.html',
  styleUrls: ['./medical-claims-batches-list.component.scss'],
})
export class MedicalClaimsBatchesListComponent {

   /** Constructor **/
   constructor(private route: Router, ) {}

  navToBatchDetails(event : any){  
    this.route.navigate(['/financial-management/medical-claims/batch/batch_log_list'] );
  }


}
