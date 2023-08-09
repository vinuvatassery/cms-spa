import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-send-notice',
  templateUrl: './financial-premiums-send-notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsSendNoticeComponent {
  @Output() sendNoticeCloseClickedEvent = new EventEmitter();
  closeSendNoticeClicked() {
    this.sendNoticeCloseClickedEvent.emit(true);
  }
}
