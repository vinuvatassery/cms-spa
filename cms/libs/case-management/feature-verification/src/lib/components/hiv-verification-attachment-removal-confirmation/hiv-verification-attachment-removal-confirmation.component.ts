import {
  Component,  
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'case-management-hiv-verification-attachment-removal-confirmation',
  templateUrl:
    './hiv-verification-attachment-removal-confirmation.component.html',
  styleUrls: [
    './hiv-verification-attachment-removal-confirmation.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

