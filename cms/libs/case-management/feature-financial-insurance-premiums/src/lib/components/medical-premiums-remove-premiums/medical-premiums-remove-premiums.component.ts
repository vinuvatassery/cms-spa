import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-medical-premiums-remove-premiums',
  templateUrl: './medical-premiums-remove-premiums.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsRemovePremiumsComponent {
  @Output() modalCloseRemovePremiumModal = new EventEmitter();

 
  closeRemovePremiumsClicked() {
    this.modalCloseRemovePremiumModal.emit(true);
  }
}
