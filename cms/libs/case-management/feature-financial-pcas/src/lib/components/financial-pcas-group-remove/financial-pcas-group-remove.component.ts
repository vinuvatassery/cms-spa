import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-pcas-group-remove',
  templateUrl: './financial-pcas-group-remove.component.html',
})
export class FinancialPcasGroupRemoveComponent {
  @Output() closeRemoveGroupClickedEvent = new EventEmitter();

 
  closeRemoveClicked() {
    this.closeRemoveGroupClickedEvent.emit(true);
  }
}
