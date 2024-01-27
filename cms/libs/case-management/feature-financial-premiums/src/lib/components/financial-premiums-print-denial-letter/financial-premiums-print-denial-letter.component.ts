import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-print-denial-letter',
  templateUrl: './financial-premiums-print-denial-letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPrintDenialLetterComponent {
  @Output() isModalPremiumsPrintDenialLetterCloseClicked = new EventEmitter();

 
  closePrintDenialLetterClicked() {
    this.isModalPremiumsPrintDenialLetterCloseClicked.emit(true);
  }
}
