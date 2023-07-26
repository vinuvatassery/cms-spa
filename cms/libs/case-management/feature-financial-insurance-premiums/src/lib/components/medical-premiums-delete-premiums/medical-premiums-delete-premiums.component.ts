import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
@Component({
  selector: 'cms-medical-premiums-delete-premiums',
  templateUrl: './medical-premiums-delete-premiums.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsDeletePremiumsComponent {
  @Output() isModalDeletePremiumsCloseClicked = new EventEmitter();

 
  closeDeletePremiumsClicked() {
    this.isModalDeletePremiumsCloseClicked.emit(true);
  }
}
