import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-financial-premiums-send-report',
  templateUrl: './financial-premiums-send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsSendReportComponent {
  @Output() sendReportCloseClickedEvent = new EventEmitter();
  closeSendReportClicked() {
    this.sendReportCloseClickedEvent.emit(true);
  }
}
