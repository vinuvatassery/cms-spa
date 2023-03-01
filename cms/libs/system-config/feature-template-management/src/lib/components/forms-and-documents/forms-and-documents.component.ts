/** Angular **/
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'system-config-forms-and-documents',
  templateUrl: './forms-and-documents.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsAndDocumentsComponent {
  /** Public properties **/
  isOpenAttachment = false;

  /** Internal event methods **/
  onCloseAttachmentClicked() {
    this.isOpenAttachment = false;
  }
  onOpenAttachmentClicked() {
    this.isOpenAttachment = true;
  }
}
