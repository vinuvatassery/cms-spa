import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-print-denial-letter',
  templateUrl: './dental-premiums-print-denial-letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsPrintDenialLetterComponent {
  @Output() isModalPremiumsPrintDenialLetterCloseClicked = new EventEmitter();

 
  closePrintDenialLetterClicked() {
    this.isModalPremiumsPrintDenialLetterCloseClicked.emit(true);
  }
}
