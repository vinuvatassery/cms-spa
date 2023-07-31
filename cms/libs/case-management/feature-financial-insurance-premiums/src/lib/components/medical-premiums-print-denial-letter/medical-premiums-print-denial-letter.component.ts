import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-print-denial-letter',
  templateUrl: './medical-premiums-print-denial-letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsPrintDenialLetterComponent {
  @Output() isModalPremiumsPrintDenialLetterCloseClicked = new EventEmitter();

 
  closePrintDenialLetterClicked() {
    this.isModalPremiumsPrintDenialLetterCloseClicked.emit(true);
  }
}
