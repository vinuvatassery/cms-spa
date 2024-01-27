import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-assignment-remove',
  templateUrl: './financial-pcas-assignment-remove.component.html',
})
export class FinancialPcasAssignmentRemoveComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeRemovePcaAssignmentClickedEvent = new EventEmitter();

 
  closeRemovePcaAssignmentClicked() {
    this.closeRemovePcaAssignmentClickedEvent.emit(true);
  }
}
