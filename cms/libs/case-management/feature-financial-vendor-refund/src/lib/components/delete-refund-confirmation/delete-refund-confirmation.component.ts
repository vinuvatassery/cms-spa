/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

@Component({
  selector: 'cms-delete-refund-confirmation',
  templateUrl: './delete-refund-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteRefundConfirmationComponent  {
  @Output() isModalDeleteRefundsCloseClicked = new EventEmitter();
  @Output() isModalDeletedRefundsButtonClicked = new EventEmitter<boolean>();
  @Input() selectedProcessRefundsCount = 0;
  @Input() deletemodelbody = "";
  @Input() singleRefundDelete = false;


  closeDeleteRefundClicked() {
    this.isModalDeleteRefundsCloseClicked.emit(true);
  }

  deleteClicked(){
    this.isModalDeletedRefundsButtonClicked.emit(true);
  }
}
