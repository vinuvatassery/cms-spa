import { Component, ChangeDetectionStrategy, Output , EventEmitter, Input} from '@angular/core';

@Component({
  selector: 'cms-unbatch-refund-confirmation',
  templateUrl: './unbatch-refund-confirmation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnbatchRefundConfirmationComponent  {

  @Input() isBulkUnBatchOpened = false;
  @Output() unBatchCloseClickedEvent = new EventEmitter();


  closeUnBatchClicked() {
    this.unBatchCloseClickedEvent.emit(false);
  }

  UnBatchClicked() {
    this.unBatchCloseClickedEvent.emit(true);
  }
}
