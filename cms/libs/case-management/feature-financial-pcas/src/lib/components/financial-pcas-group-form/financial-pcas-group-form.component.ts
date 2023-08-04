import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-group-form',
  templateUrl: './financial-pcas-group-form.component.html',
})
export class FinancialPcasGroupFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditGroupClickedEvent = new EventEmitter();

 
  closeAddEditGroupClicked() {
    this.closeAddEditGroupClickedEvent.emit(true);
  }
}
