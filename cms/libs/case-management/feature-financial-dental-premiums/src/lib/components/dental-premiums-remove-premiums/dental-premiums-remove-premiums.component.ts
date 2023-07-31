import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-dental-premiums-remove-premiums',
  templateUrl: './dental-premiums-remove-premiums.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsRemovePremiumsComponent {
  @Output() modalCloseRemovePremiumModal = new EventEmitter();

 
  closeRemovePremiumsClicked() {
    this.modalCloseRemovePremiumModal.emit(true);
  }
}
