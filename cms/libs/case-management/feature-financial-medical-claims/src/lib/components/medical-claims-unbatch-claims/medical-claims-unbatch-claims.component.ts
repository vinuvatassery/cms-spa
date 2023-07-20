import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-medical-claims-unbatch-claims',
  templateUrl: './medical-claims-unbatch-claims.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalClaimsUnbatchClaimsComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();

 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
