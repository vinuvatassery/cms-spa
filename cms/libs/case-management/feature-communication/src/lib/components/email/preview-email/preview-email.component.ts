/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { LoaderSize, LoaderThemeColor, LoaderType } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'case-management-preview-email',
  templateUrl: './preview-email.component.html',
  styleUrls: ['./preview-email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
