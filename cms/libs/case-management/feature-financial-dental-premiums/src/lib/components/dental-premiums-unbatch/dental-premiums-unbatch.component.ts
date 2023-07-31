import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-dental-premiums-unbatch',
  templateUrl: './dental-premiums-unbatch.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsUnbatchComponent { 
  @Output() modalCloseUnbatchPremiumModal = new EventEmitter();

 
  closeUnBatchClicked() {
    this.modalCloseUnbatchPremiumModal.emit(true);
  }
}
