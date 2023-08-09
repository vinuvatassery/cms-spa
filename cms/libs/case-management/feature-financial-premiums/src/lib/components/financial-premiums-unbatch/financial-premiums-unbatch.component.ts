import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-premiums-unbatch',
  templateUrl: './financial-premiums-unbatch.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsUnbatchComponent { 
  @Output() modalCloseUnbatchPremiumModal = new EventEmitter();

 
  closeUnBatchClicked() {
    this.modalCloseUnbatchPremiumModal.emit(true);
  }
}
