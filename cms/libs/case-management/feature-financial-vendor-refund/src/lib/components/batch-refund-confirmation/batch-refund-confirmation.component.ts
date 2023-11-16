import { Component, ChangeDetectionStrategy, Output , EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'cms-batch-refund-confirmation',
  templateUrl: './batch-refund-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchRefundConfirmationComponent  {

  @Output() isModalBatchRefundsButtonClicked = new EventEmitter<string>();
  @Output() isModalBatchRefundsCloseClicked = new EventEmitter();
  @Input() selectedProcessRefundsCount = 0;


  closeBatchRefundClicked(){
    this.isModalBatchRefundsCloseClicked.emit(true);
  }

  batchClicked(){
    this.isModalBatchRefundsButtonClicked.emit();
  }
}
