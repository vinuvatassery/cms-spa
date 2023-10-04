import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-financial-premiums-remove-premiums',
  templateUrl: './financial-premiums-remove-premiums.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsRemovePremiumsComponent {
  @Output() modalCloseRemovePremiumModal = new EventEmitter();

 
  closeRemovePremiumsClicked() {
    this.modalCloseRemovePremiumModal.emit(true);
  }
}
