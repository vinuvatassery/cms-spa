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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DirectMessageComponent {
  /** Output properties  **/
  @Output() closeAction = new EventEmitter();
  public value = ``;
  /** Public properties **/
  isShownDirectMessage = false;
  messageToolBarShow = false;
  ListItemModel = [
    {
      text: "Attach from System", 
    },
    {
      text: "Attach from Computer", 
    },
    {
      text: "Attach from Client’s Attachments", 
    },
   
  ];
  /** Internal event methods **/
  onCloseDirectMessageClicked() {
    this.closeAction.emit();
    this.isShownDirectMessage = !this.isShownDirectMessage;
  }

}
