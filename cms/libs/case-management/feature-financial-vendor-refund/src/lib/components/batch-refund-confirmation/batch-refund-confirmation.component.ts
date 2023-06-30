import { Component, ChangeDetectionStrategy, Output , EventEmitter} from '@angular/core';
 
@Component({
  selector: 'cms-batch-refund-confirmation',
  templateUrl: './batch-refund-confirmation.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchRefundConfirmationComponent  {

  

  @Output() isModalBatchRefundCloseClicked = new EventEmitter();
 

  closeBatchRefundClicked(){
    this.isModalBatchRefundCloseClicked.emit(true);  
  }
}
