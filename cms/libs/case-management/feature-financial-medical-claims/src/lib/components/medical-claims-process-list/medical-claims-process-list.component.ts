import { Component } from '@angular/core';

@Component({
  selector: 'cms-medical-claims-process-list',
  templateUrl: './medical-claims-process-list.component.html',
  styleUrls: ['./medical-claims-process-list.component.scss'],
})
export class MedicalClaimsProcessListComponent {
  isDeleteBatchClosed = false;
  isProcessBatchClosed = false;
  public claimsProcessMore = [
    {
      buttonType: 'btn-h-primary',
      text: 'Batch Claims',
      icon: 'check',
      click: (data: any): void => {
        if (!this.isProcessBatchClosed) {
          this.isProcessBatchClosed = true;
         
        }
      },
    },

    {
      buttonType: 'btn-h-danger',
      text: 'Delete Claims',
      icon: 'delete',
      click: (data: any): void => {
        if (!this.isDeleteBatchClosed) {
          this.isDeleteBatchClosed = true;
        
        }
      },
    },
  ];
}
