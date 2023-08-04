import {
  Component,
  ChangeDetectionStrategy,
  Output, 
  EventEmitter,
} from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-claims-provider-info',
  templateUrl: './financial-claims-provider-info.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsProviderInfoComponent {
  @Output() closeViewProviderDetailClickedEvent = new EventEmitter();
  public formUiStyle : UIFormStyle = new UIFormStyle();
  isEditProvider = false;
  closeViewProviderClicked() {
    this.closeViewProviderDetailClickedEvent.emit(true);
  }
  editProviderClicked(){
    this.isEditProvider = !this.isEditProvider
  }
}
