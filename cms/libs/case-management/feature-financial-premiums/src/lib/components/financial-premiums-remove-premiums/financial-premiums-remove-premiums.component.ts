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
  @Output() deletedEvent = new EventEmitter<boolean>();
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
      this.financialPremiumsFacade.removeSelectedPremiums(this.selectedRemovePremiumsList.SelectedSendReports, this.premiumsType)
      .subscribe({
        next: (data: any) =>{
          if (data) {
            this.deletedEvent.emit(true);
            this.showHideSnackBar(SnackBarNotificationType.SUCCESS , 'Premium removed!')
            this.ref.detectChanges();
            this.closeRemovePremiumsClicked();
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

  closeRemovePremiumsClicked() {
    this.modalCloseRemovePremiumModal.emit(true);
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