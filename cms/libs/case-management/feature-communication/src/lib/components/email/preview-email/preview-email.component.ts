/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'case-management-preview-email',
  templateUrl: './preview-email.component.html',
  styleUrls: ['./preview-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PreviewEmailComponent {
  /** Input properties **/
  @Input() emailContent!: any;
  @Input() paperlessFlag!: any;
  @Input() attachmentCount!: number;

  /** Input properties **/
  @Output() closeEvent = new EventEmitter();
  
  closeClicked() {
    this.closeEvent.emit();
  }
}
