import { Component, OnInit, ChangeDetectionStrategy , Input, Output, EventEmitter} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
  styleUrls: ['./refund-new-form-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundNewFormDetailsComponent {
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
  @Output() onModalCloseAddEditRefundFormModal = new EventEmitter();


  closeAddEditRefundFormModalClicked(){
    this.onModalCloseAddEditRefundFormModal.emit(true);  
  }
}
