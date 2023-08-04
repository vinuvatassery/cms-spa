import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-object-form',
  templateUrl: './financial-pcas-object-form.component.html',
})
export class FinancialPcasObjectFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditObjectClickedEvent = new EventEmitter();

 
  closeAddEditObjectClicked() {
    this.closeAddEditObjectClickedEvent.emit(true);
  }
}
