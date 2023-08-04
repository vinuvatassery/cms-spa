import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-assignment-form',
  templateUrl: './financial-pcas-assignment-form.component.html',
})
export class FinancialPcasAssignmentFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaSetupClickedEvent = new EventEmitter();

 
  closeAddEditPcaSetupClicked() {
    this.closeAddEditPcaSetupClickedEvent.emit(true);
  }
}
