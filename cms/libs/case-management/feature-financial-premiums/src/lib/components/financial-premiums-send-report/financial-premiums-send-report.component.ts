import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-financial-premiums-send-report',
  templateUrl: './financial-premiums-send-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsSendReportComponent {
  @Output() sendReportCloseClickedEvent = new EventEmitter();

  @Input() selectedSendReportList!: any;
  @Input() sendReportCount: number = 0;

      /** Constructor **/
      constructor(
          private readonly loaderService: LoaderService,
          private readonly loggingService: LoggingService,
          private readonly notificationSnackbarService : NotificationSnackbarService,
        ) {}

  closeSendReportClicked() {
    this.sendReportCloseClickedEvent.emit(true);
  }

  onSendReportClicked(){
    this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Report sent!')
    this.closeSendReportClicked();
  }

  showHideSnackBar(type : SnackBarNotificationType , subtitle : any)
  {
      if(type == SnackBarNotificationType.ERROR)
      {
        const err= subtitle;
        this.loggingService.logException(err)
      }
        this.notificationSnackbarService.manageSnackBar(type,subtitle)
        this.hideLoader();
  }

  hideLoader()
  {
    this.loaderService.hide();
  }
}