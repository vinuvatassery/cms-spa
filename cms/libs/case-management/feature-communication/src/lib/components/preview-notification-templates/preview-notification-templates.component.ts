import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommunicationEvents } from '@cms/case-management/domain';

@Component({
  selector: 'case-management-preview-notification-templates',
  templateUrl: './preview-notification-templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewNotificationTemplatesComponent {
  @Input() PreviewTemplateType !:string;

  /** Output properties  **/
  @Output() closePreviewTemplateEvent = new EventEmitter<CommunicationEvents>();


  onCloseSendMessageClicked() {
  
    this.closePreviewTemplateEvent.emit(CommunicationEvents.Close);
  }
}
