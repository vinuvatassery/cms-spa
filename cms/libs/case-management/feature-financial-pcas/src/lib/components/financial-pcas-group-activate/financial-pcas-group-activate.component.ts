import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-group-activate',
  templateUrl: './financial-pcas-group-activate.component.html',
})
export class FinancialPcasGroupActivateComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeActivateGroupClickedEvent = new EventEmitter();

 
  closeModalClicked() {
    this.closeActivateGroupClickedEvent.emit(true);
  }
}
