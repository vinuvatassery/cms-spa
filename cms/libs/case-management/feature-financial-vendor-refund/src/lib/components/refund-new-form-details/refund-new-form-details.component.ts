import { Component, OnInit, ChangeDetectionStrategy , Output, EventEmitter} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
  styleUrls: ['./refund-new-form-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundNewFormDetailsComponent{
  public formUiStyle: UIFormStyle = new UIFormStyle();
  clientsearchresult =[

    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
    {
      clientId: '12',
      clientFullName: 'Fname Lname',
      ssn: '2434324324234',
      dob: '23/12/2023',
    },
  ];
  selectedPremium =[
    {
    coverageDates:'XX/XX/XXXX-XX/XX/XXXX', 
    warrant:'XXXXXXXXX', 
    amountPaid:'XXXXXXXXX', 
    groupID:'XXXXXXXXX', 
    paymentID:'XXXXXXXXX', 
    pmtMethod:'ACH', 
    pmtStatus:'Recon', 
    PCA:'XXXXXX', 
    mailCode:'XXXX',   
    by: 'by',
  },

];
  @Output() onModalCloseAddEditRefundFormModal = new EventEmitter();


  closeAddEditRefundFormModalClicked(){
    this.onModalCloseAddEditRefundFormModal.emit(true);  
  }
}
