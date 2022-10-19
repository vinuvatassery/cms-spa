/** Angular **/
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'case-management-preview-letter',
  templateUrl: './preview-letter.component.html',
  styleUrls: ['./preview-letter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLetterComponent {
  /** Input properties **/
  @Input() letterContent!: any;
}
