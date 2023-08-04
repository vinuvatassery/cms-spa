import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-group-deactivate',
  templateUrl: './financial-pcas-group-deactivate.component.html',
})
export class FinancialPcasGroupDeactivateComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeDeactivateGroupClickedEvent = new EventEmitter();

 
  closeModalClicked() {
    this.closeDeactivateGroupClickedEvent.emit(true);
  }
}
