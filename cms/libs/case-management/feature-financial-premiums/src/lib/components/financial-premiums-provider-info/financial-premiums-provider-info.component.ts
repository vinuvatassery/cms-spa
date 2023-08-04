import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-provider-info',
  templateUrl: './financial-premiums-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();

 
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
}
