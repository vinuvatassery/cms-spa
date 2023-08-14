import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-setup-form',
  templateUrl: './financial-pcas-setup-form.component.html',
})
export class FinancialPcasSetupFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaSetupClickedEvent = new EventEmitter();

 
  closeAddEditPcaSetupClicked() {
    this.closeAddEditPcaSetupClickedEvent.emit(true);
  }
}
 
