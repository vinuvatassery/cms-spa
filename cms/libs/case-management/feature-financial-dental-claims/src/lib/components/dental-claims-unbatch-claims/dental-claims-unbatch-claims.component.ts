import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-dental-claims-unbatch-claims',
  templateUrl: './dental-claims-unbatch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalClaimsUnbatchClaimsComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();

 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
