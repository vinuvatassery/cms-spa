import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-send-notice',
  templateUrl: './medical-premiums-send-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsSendNoticeComponent {
  @Output() sendNoticeCloseClickedEvent = new EventEmitter();
  closeSendNoticeClicked() {
    this.sendNoticeCloseClickedEvent.emit(true);
  }
}
