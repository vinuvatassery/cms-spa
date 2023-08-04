import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-pcas-reassignment-confirmation',
  templateUrl: './financial-pcas-reassignment-confirmation.component.html',
})
export class FinancialPcasReassignmentConfirmationComponent {
  @Output() closeConfirmationPcaReassignmentClickedEvent = new EventEmitter();

 
  closeEPcaReassignmentClicked() {
    this.closeConfirmationPcaReassignmentClickedEvent.emit(true);
  }
}
