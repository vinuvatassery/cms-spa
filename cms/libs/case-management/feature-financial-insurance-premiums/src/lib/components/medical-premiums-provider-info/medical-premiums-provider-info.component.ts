import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-provider-info',
  templateUrl: './medical-premiums-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();

 
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
}
