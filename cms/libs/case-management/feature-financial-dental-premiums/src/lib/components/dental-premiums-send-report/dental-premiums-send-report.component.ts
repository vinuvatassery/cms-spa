import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-dental-premiums-send-report',
  templateUrl: './dental-premiums-send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DentalPremiumsSendReportComponent {
  @Output() sendReportCloseClickedEvent = new EventEmitter();
  closeSendReportClicked() {
    this.sendReportCloseClickedEvent.emit(true);
  }
}
