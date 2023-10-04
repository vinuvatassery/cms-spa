import {
  Component,
  ChangeDetectionStrategy,
  Output,
  Input, 
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-financial-premiums-remove-premiums',
  templateUrl: './financial-premiums-remove-premiums.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsRemovePremiumsComponent {
  @Output() modalCloseRemovePremiumModal = new EventEmitter();

  closeRemovePremiumsClicked() {
    this.modalCloseRemovePremiumModal.emit(true);
  }
  selctedPremiumPaymentIds: any = [];
  @Input() selectedRemovePremiumsList: any = [];
  @Input() removePremiumsCount: number = 0;
  @Input() premiumsType: any;
  @Input() directRemoveClicked: any;

    /** Constructor **/
    constructor(
      private financialPremiumsFacade : FinancialPremiumsFacade ,
        private readonly ref: ChangeDetectorRef,
        private readonly loaderService: LoaderService,
        private readonly loggingService: LoggingService,
        private readonly notificationSnackbarService : NotificationSnackbarService,
      ) {}
    
  removeSelectedPremiums() {
    this.loaderService.show();
    if(this.selectedRemovePremiumsList?.SelectedSendReports.length > 0){
      // this.selectedRemovePremiumsList.SelectedSendReports.forEach((element: any) => {
      //   this.selctedPremiumPaymentIds?.push(element.paymentRequestId);
      // });
      // this.selectedRemovePremiumsList.SelectedSendReports.map((item: any) => item.paymentRequestId);
      this.financialPremiumsFacade.removeSelectedPremiums(this.selectedRemovePremiumsList.SelectedSendReports, this.premiumsType)
      .subscribe({
        next: (data: any) =>{
          if (data) {
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Premium removed!')
            this.ref.detectChanges();
          }
        this.loaderService.hide();
      },
      error: (err: any) => {
        this.loaderService.hide();
        this.loggingService.logException(err);
        this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
      },
    });
    }
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
