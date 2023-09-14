import { Component, ChangeDetectionStrategy,Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cms-financial-claims-print-denial-letter',
  templateUrl: './financial-claims-print-denial-letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPrintDenialLetterComponent {

  @Output() modalCloseEvent= new EventEmitter<any>();

  closeModal(){
    this.modalCloseEvent.emit(true);
  }
}
