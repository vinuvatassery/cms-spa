import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
@Component({
  selector: 'cms-financial-premiums-send-report',
  templateUrl: './financial-premiums-send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsSendReportComponent {
  @Output() sendReportCloseClickedEvent = new EventEmitter();
  @Output() sendReportClickedEvent = new EventEmitter();

  @Input() selectedSendReportList!: any;
  @Input() sendReportCount: number = 0;

      /** Constructor **/
      constructor(
          private financialPremiumsFacade : FinancialPremiumsFacade
        ) {}

  closeSendReportClicked() {
    this.sendReportCloseClickedEvent.emit(true);
  }

  onSendReportClicked(){
    this.sendReportClickedEvent.emit(true);
  }
}
