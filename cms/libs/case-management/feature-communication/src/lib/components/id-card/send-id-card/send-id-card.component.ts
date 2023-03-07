/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'case-management-send-id-card',
  templateUrl: './send-id-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendIdCardComponent {
  /** Output properties  **/
  @Output() closeSendIdEvent = new EventEmitter();

  /** Internal event methods **/
  onCloseSendIdClicked() {
    this.closeSendIdEvent.emit();
  }
}
