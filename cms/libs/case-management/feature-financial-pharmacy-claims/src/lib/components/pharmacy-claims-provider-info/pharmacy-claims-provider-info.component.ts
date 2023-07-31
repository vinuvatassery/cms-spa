import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-pharmacy-claims-provider-info',
  templateUrl: './pharmacy-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();

 
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
}
