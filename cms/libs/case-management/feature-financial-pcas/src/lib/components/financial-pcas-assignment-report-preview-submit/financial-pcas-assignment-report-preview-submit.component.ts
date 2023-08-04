import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
@Component({
  selector: 'cms-financial-pcas-assignment-report-preview-submit',
  templateUrl:
    './financial-pcas-assignment-report-preview-submit.component.html',
})
export class FinancialPcasAssignmentReportPreviewSubmitComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  items = [
    {},{}
  ]

  @Output() previewSubmitPaymentCloseClicked = new EventEmitter();

 
  closPreviewSubmitClicked() {
    this.previewSubmitPaymentCloseClicked.emit(true);
  }
}
