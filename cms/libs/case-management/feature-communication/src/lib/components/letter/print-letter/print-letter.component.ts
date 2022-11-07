/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'case-management-print-letter',
  templateUrl: './print-letter.component.html',
  styleUrls: ['./print-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrintLetterComponent {}
