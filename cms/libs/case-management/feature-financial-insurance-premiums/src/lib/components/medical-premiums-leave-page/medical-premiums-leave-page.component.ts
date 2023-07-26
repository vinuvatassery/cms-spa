import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-leave-page',
  templateUrl: './medical-premiums-leave-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsLeavePageComponent {
  @Output() isModalLeavePageCloseClicked = new EventEmitter();

 
  closeLeavePageClicked() {
    this.isModalLeavePageCloseClicked.emit(true);
  }
}
