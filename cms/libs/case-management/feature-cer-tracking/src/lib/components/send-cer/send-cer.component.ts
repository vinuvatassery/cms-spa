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
  @Input() cerId!: string;

  /* Output Properties */
  @Output() sendCerEvent = new EventEmitter<any>();
  @Output() cancelSendCerEvent = new EventEmitter<any>();

  client!: string;
  paperless!: boolean;
  clientCaseEligibilityCerId!:string;

  ngOnInit(): void {
    this.client =this.clientName;
    this.paperless =this.isPaperLess;
    this.clientCaseEligibilityCerId = this.cerId;
  }
  /* Public methods */
  sendCer() {
    this.sendCerEvent.emit(this.clientCaseEligibilityCerId);
  }

  cancelSendCer() {
    this.cancelSendCerEvent.emit();
  }

}
