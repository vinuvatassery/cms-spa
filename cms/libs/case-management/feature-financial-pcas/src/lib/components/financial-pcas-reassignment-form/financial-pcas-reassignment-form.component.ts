import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-reassignment-form',
  templateUrl: './financial-pcas-reassignment-form.component.html',
  styleUrls: ['./financial-pcas-reassignment-form.component.scss'],
})
export class FinancialPcasReassignmentFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeEditPcaReassignmentClickedEvent = new EventEmitter();

 
  closeEditPcaReassignmentClicked() {
    this.closeEditPcaReassignmentClickedEvent.emit(true);
  }
}

 
