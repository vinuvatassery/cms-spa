import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-object-activate',
  templateUrl: './financial-pcas-object-activate.component.html',
})
export class FinancialPcasObjectActivateComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeActivateObjectClickedEvent = new EventEmitter();

 
  closeModalClicked() {
    this.closeActivateObjectClickedEvent.emit(true);
  }
}
