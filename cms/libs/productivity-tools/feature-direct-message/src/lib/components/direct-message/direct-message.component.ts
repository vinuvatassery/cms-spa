/** Angular **/
import {
  Component,
  ChangeDetectionStrategy,
  EventEmitter,
  Output,
} from '@angular/core';

@Component({
  selector: 'productivity-tools-direct-message',
  templateUrl: './direct-message.component.html',
  styleUrls: ['./direct-message.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageComponent {
  /** Output properties  **/
  @Output() closeAction = new EventEmitter();

  /** Public properties **/
  isShownDirectMessage = false;

  /** Internal event methods **/
  onCloseDirectMessageClicked() {
    this.closeAction.emit();
    this.isShownDirectMessage = !this.isShownDirectMessage;
  }
}
