import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-assignment-form',
  templateUrl: './financial-pcas-assignment-form.component.html',
  styleUrls: ['./financial-pcas-assignment-form.component.scss'],
})
export class FinancialPcasAssignmentFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaAssignmentClickedEvent = new EventEmitter();

 
  closeAddEditPcaAssignmentClicked() {
    this.closeAddEditPcaAssignmentClickedEvent.emit(true);
  }
}
