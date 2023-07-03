/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-delete-refund-confirmation',
  templateUrl: './delete-refund-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRefundConfirmationComponent  {
  @Output() isModalDeleteRefundCloseClicked = new EventEmitter();

 
  closeDeleteRefundClicked() {
    this.isModalDeleteRefundCloseClicked.emit(true);
  }
}
