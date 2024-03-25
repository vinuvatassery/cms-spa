/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-preview-letter',
  templateUrl: './preview-letter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewLetterComponent {
  /** Input properties **/
  @Input() letterContent!: any;
  @Input() paperlessFlag! : any
  @Input() attachmentCount!: number;

  /** Input properties **/
  @Output() closeEvent = new EventEmitter();

  closeClicked(){
    this.closeEvent.emit();
  }
}
