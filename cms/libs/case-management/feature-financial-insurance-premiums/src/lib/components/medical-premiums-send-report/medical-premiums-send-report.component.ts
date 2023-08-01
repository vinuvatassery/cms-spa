import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'cms-medical-premiums-send-report',
  templateUrl: './medical-premiums-send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicalPremiumsSendReportComponent {
  @Output() sendReportCloseClickedEvent = new EventEmitter();
  closeSendReportClicked() {
    this.sendReportCloseClickedEvent.emit(true);
  }
}
