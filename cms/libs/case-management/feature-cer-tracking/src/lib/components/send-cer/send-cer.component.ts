/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'case-management-send-cer',
  templateUrl: './send-cer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendCerComponent {
  /* Input Properties */
  @Input() isPaperLess!: boolean;
  @Input() clientName!: string;

  /* Output Properties */
  @Output() sendCerEvent = new EventEmitter<any>();
  @Output() cancelSendCerEvent = new EventEmitter<any>();

  /* Public methods */
  sendCer() {
    this.sendCerEvent.emit();
  }

  cancelSendCer() {
    this.cancelSendCerEvent.emit();
  }

}
