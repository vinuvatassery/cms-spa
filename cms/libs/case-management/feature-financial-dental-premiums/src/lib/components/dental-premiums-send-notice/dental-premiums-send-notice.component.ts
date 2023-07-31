import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-send-notice',
  templateUrl: './dental-premiums-send-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsSendNoticeComponent {
  @Output() sendNoticeCloseClickedEvent = new EventEmitter();
  closeSendNoticeClicked() {
    this.sendNoticeCloseClickedEvent.emit(true);
  }
}
