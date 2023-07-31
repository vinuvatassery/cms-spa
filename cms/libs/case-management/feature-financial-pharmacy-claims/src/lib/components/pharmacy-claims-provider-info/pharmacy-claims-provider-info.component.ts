import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-pharmacy-claims-provider-info',
  templateUrl: './pharmacy-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  isEditProvider = false;
 
  public formUiStyle : UIFormStyle = new UIFormStyle();
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }

  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
  }
}
