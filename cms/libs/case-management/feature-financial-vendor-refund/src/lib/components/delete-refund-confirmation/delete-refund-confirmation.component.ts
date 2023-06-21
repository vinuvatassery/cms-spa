/** Angular **/
import { Component, OnInit, ChangeDetectionStrategy , Input, Output, EventEmitter} from '@angular/core';
 
@Component({
  selector: 'cms-delete-refund-confirmation',
  templateUrl: './delete-refund-confirmation.component.html',
  styleUrls: ['./delete-refund-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRefundConfirmationComponent {
  @Output() isModalDeleteRefundCloseClicked = new EventEmitter();


  closeDeleteRefundClicked(){
    this.isModalDeleteRefundCloseClicked.emit(true);  
  }
}
