import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
  Input,
} from '@angular/core';
@Component({
  selector: 'cms-pharmacy-claims-unbatch-claims',
  templateUrl: './pharmacy-claims-unbatch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsUnbatchClaimsComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();
  @Input() isBulkUnBatchOpened = false;
 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(false);
  }

  UnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
