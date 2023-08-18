import { Component, EventEmitter, Output } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa';

@Component({
  selector: 'cms-financial-pcas-assignment-form',
  templateUrl: './financial-pcas-assignment-form.component.html',
  styleUrls: ['./financial-pcas-assignment-form.component.scss'],
})
export class FinancialPcasAssignmentFormComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  @Output() closeAddEditPcaAssignmentClickedEvent = new EventEmitter();
  objectList = [
    {
      lovDesc:'Pharmacy - 4955',
      lovCode: 4955
    },
    {
      lovDesc:'Third Party (TPA) - 4956',
      lovCode: 4956
    },
    {
      lovDesc:'Insurance Premiums - 4957',
      lovCode: 4957
    },
  ]
  groupList = [
    {
      lovDesc:'Group I',
      lovCode: 1
    },
    {
      lovDesc:'Group II',
      lovCode: 2
    },
    {
      lovDesc:'UPP',
      lovCode: 3
    },
    {
      lovDesc:'Bridge',
      lovCode: 4
    },
    {
      lovDesc:'Group 1 INS Gap',
      lovCode: 5
    },
    {
      lovDesc:'Group 2 INS Gap',
      lovCode: 6
    },
    
  ]
  
  closeAddEditPcaAssignmentClicked() {
    this.closeAddEditPcaAssignmentClickedEvent.emit(true);
  }
}
