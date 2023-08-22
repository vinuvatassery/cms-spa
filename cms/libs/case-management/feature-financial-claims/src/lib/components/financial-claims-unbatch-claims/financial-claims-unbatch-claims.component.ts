import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
@Component({
  selector: 'cms-financial-claims-unbatch-claims',
  templateUrl: './financial-claims-unbatch-claims.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsUnbatchClaimsComponent {
  @Input() isBulkUnBatchOpened = false;
  @Output() UnBatchCloseClickedEvent = new EventEmitter();


  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(false);
  }

  UnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
