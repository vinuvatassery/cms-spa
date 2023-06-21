import { Component, OnInit, ChangeDetectionStrategy , Input, Output, EventEmitter} from '@angular/core';
 
@Component({
  selector: 'cms-batch-refund-confirmation',
  templateUrl: './batch-refund-confirmation.component.html',
  styleUrls: ['./batch-refund-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchRefundConfirmationComponent {

  

  @Output() isModalBatchRefundCloseClicked = new EventEmitter();


  closeBatchRefundClicked(){
    this.isModalBatchRefundCloseClicked.emit(true);  
  }
}
