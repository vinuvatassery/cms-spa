import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-pharmacy-claims-unbatch-claims',
  templateUrl: './pharmacy-claims-unbatch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsUnbatchClaimsComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();

 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
