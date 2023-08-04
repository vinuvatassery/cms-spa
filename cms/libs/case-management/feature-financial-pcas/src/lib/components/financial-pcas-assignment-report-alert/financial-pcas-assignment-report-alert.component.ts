import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-assignment-report-alert',
  templateUrl: './financial-pcas-assignment-report-alert.component.html',
})
export class FinancialPcasAssignmentReportAlertComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closePcaReportAlertClickedEvent = new EventEmitter();

 
  closeAlertReportClicked() {
    this.closePcaReportAlertClickedEvent.emit(true);
  }
}
 
