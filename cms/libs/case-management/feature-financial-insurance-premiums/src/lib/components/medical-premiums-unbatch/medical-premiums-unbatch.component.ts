import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-medical-premiums-unbatch',
  templateUrl: './medical-premiums-unbatch.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsUnbatchComponent { 
  @Output() UnBatchCloseClickedEvent = new EventEmitter();

 
  closeUnBatchClicked() {
    this.UnBatchCloseClickedEvent.emit(true);
  }
}
