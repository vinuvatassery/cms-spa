import {
  Component,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
  OnInit,
} from '@angular/core';
import { ClientFacade } from '@cms/case-management/domain';
import { Observable } from 'rxjs';
@Component({
  selector: 'case-management-hiv-verification-attachment-removal-confirmation',
  templateUrl:
    './hiv-verification-attachment-removal-confirmation.component.html',
  styleUrls: [
    './hiv-verification-attachment-removal-confirmation.component.scss',
  ],
})
export class HivVerificationAttachmentRemovalConfirmationComponent {
  @Output() closeRemoveAttachmentConfirmationEvent = new EventEmitter();
  @Output() removeAttachmentConfirmationEvent = new EventEmitter();
  onCloseRemoveAttachmentConfirmationClicked() {
    this.closeRemoveAttachmentConfirmationEvent.emit();
  }
  onRemoveAttachmentConfirmationClicked() {
    this.removeAttachmentConfirmationEvent.emit();
  }
}

