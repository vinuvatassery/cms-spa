import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-pcas-reassignment-confirmation',
  templateUrl: './financial-pcas-reassignment-confirmation.component.html',
})
export class FinancialPcasReassignmentConfirmationComponent {
  @Output() closeConfirmationPcaReassignmentClickedEvent = new EventEmitter();
  @Output() onConfirmationPcaReassignmentClicked = new EventEmitter<boolean>();
  @Input() selectedPcaCount = 0;
  closeEPcaReassignmentClicked() {
    this.closeConfirmationPcaReassignmentClickedEvent.emit(true);
  }
  ConfirmationPcaReassignmentClicked(){
    this.onConfirmationPcaReassignmentClicked.emit(true);
  }

}
