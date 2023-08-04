import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-pcas-object-remove',
  templateUrl: './financial-pcas-object-remove.component.html',
})
export class FinancialPcasObjectRemoveComponent { 
  @Output() closeRemoveObjectClickedEvent = new EventEmitter();

 
  closeRemoveClicked() {
    this.closeRemoveObjectClickedEvent.emit(true);
  }
}
