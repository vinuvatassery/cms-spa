
import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-setup-remove',
  templateUrl: './financial-pcas-setup-remove.component.html',
})
export class FinancialPcasSetupRemoveComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeRemovePcaSetupClickedEvent = new EventEmitter();

 
  closeRemovePcaSetupClicked() {
    this.closeRemovePcaSetupClickedEvent.emit(true);
  }
}
 
