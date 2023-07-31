import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-provider-info',
  templateUrl: './dental-premiums-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();

 
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
}
