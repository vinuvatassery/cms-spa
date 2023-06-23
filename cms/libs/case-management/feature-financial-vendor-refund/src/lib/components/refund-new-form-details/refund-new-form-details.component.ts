import { Component, OnInit, ChangeDetectionStrategy , Input, Output, EventEmitter} from '@angular/core';
 
@Component({
  selector: 'cms-refund-new-form-details',
  templateUrl: './refund-new-form-details.component.html',
  styleUrls: ['./refund-new-form-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefundNewFormDetailsComponent {
  @Output() onModalCloseAddEditRefundFormModal = new EventEmitter();


  closeAddEditRefundFormModalClicked(){
    this.onModalCloseAddEditRefundFormModal.emit(true);  
  }
}
