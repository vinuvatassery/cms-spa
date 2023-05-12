/** Angular **/
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'case-management-send-cer',
  templateUrl: './send-cer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendCerComponent implements OnInit {

  /* Input Properties */
  @Input() isPaperLess!: boolean;
  @Input() clientName!: string;

  /* Output Properties */
  @Output() sendCerEvent = new EventEmitter<any>();
  @Output() cancelSendCerEvent = new EventEmitter<any>();

  client!: string;
  paperless!: boolean;

  ngOnInit(): void {
    this.client =this.clientName;
    this.paperless =this.isPaperLess;
  }
  /* Public methods */
  sendCer() {
    this.sendCerEvent.emit();
  }

  cancelSendCer() {
    this.cancelSendCerEvent.emit();
  }

}
