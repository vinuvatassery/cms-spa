import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pca-chosen-alert',
  templateUrl: './financial-pca-chosen-alert.component.html',
})
export class FinancialPcaChosenAlertComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Input() chosenPca!: any;
  @Output() confirmChosenPcaAlertClickedEvent = new EventEmitter();
  @Output() closeChosenPcaAlertClickedEvent = new EventEmitter();
 
  closeAlertReportClicked() {
    this.closeChosenPcaAlertClickedEvent.emit(true);
  }

  pcaAssignAlertConfirm(){
    this.confirmChosenPcaAlertClickedEvent.emit(this.chosenPca);
  }
}
 
