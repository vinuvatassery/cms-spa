import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-object-deactivate',
  templateUrl: './financial-pcas-object-deactivate.component.html',
})
export class FinancialPcasObjectDeactivateComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeDeactivateObjectClickedEvent = new EventEmitter();

 
  closeModalClicked() {
    this.closeDeactivateObjectClickedEvent.emit(true);
  }
 
}
