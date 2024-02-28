import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { FinancialPharmacyClaimsFacade, PaymentsFacade } from '@cms/case-management/domain';
import { StatusFlag } from '@cms/shared/ui-common';
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { ConfigurationProvider, LoaderService, LoggingService, NotificationSnackbarService, NotificationSource, SnackBarNotificationType } from '@cms/shared/util-core';
import { UserDataService } from '@cms/system-config/domain';
import { IntlService } from '@progress/kendo-angular-intl';
import { Subscription } from 'rxjs';
@Component({
  selector: 'cms-pharmacy-claims-print-authorization',
  templateUrl: './pharmacy-claims-print-authorization.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PharmacyClaimsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  item = [
    {}, {}
  ]

  letterContentSubscription!: Subscription;
  letterContentListItemSubscription!: Subscription;
  printCount: number = 0;
  reconcileCount: number = 0;
  printAdviceLetterData: any
  letterContent: any;
  letterContentLoader: boolean = false;
  currentIndex: any = 0;
  reconcileArray: any = [];
  finalPrintList!: any[];
  returnResultFinalPrintList!: any[];
  last4OfVisaCard: any = null;
  cardExpirationDate!: Date;
  cardExpirationMonth!: any;
  cardExpirationYear!: any;
  authorizedDate!: any;
  loginUserName!: any;
  dateFormat = this.configurationProvider.appSettings.dateFormat;
  mask = "XXXX - XXXX - XXXX - 0000";
  /** Input properties  **/
  @Input() items!: any;
  @Input() batchId!: any;
  @Input() printOption: boolean = false;
  @Input() letterContentList$: any;
  @Input() letterContentLoader$: any;
  @Input() isReconcilePrintCount: any;
  @Input() claimReconcileCount: any;
  @Input() isSaveClicked!: boolean;
  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();
  @Output() selectUnSelectPayment = new EventEmitter<any>();
  @Output() loadTemplateEvent = new EventEmitter<any>();
  @Output() loadTemplateEventLog = new EventEmitter<any>();
  @Output() onReconcileRecordEvent = new EventEmitter<any>();

  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService: NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly financialPharmacyClaimsFacade: FinancialPharmacyClaimsFacade,
    private elementRef: ElementRef,
    private readonly userDataService: UserDataService,
    public intl: IntlService,
    private configurationProvider: ConfigurationProvider,
  ) { }

  ngOnInit(): void {
    if (this.items['print']) {
      this.loadPrintLetterContent(this.items);
    }
    else {
      this.finalPrintList = this.items;
      this.printAdviceLetterData = this.loadPrintLetterModelData();
      this.loadPrintLetterContent(this.printAdviceLetterData);
    }
    this.letterContentListSubscription();
    this.letterContentLoaderSubscription();
    this.getLoggedInUserProfile();
    this.authorizedDate = new Date();
  }

  letterContentLoaderSubscription() {
    this.letterContentSubscription = this.letterContentLoader$?.subscribe((response: any) => {
      this.letterContentLoader = response;
      this.ref.detectChanges();
    });
  }

  letterContentListSubscription() {
    this.letterContentListItemSubscription = this.letterContentList$?.subscribe((response: any) => {
      this.letterContent = response.letterContent;
      this.ref.detectChanges();
    });
  }

  loadPrintLetterContent(request: any) {
    this.loaderService.show();
    this.financialPharmacyClaimsFacade.loadPrintAdviceLetterData(request)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            data.forEach((result, index: number) => {
              result.paymentNbr = index + 1;
              if (!this.printOption) {
                this.items.forEach((currentItem: any) => {
                  if (result.paymentRequestIds.includes(currentItem.paymentRequestId)) {
                    result.warrantNumberChange = this.assignWarrantNumberChange(currentItem);
                  }
                });
              }
            });
            this.returnResultFinalPrintList = data;
            this.printCount = this.returnResultFinalPrintList.filter(x => x.isPrintAdviceLetter === true).length;
            this.loadTemplateEvent.emit(this.returnResultFinalPrintList[0]);
            this.currentIndex = 0;
          }
          this.loaderService.hide();
        },
        error: (err: Error) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  assignWarrantNumberChange(currentItem: any): any {
    if (currentItem.warrantNumberChanged) {
      return true;
    } else if (currentItem.warrantNumberChanged == undefined) {
      return false;
    }
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any, secondaryText:any = null) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type,secondaryText,NotificationSource.UI, subtitle)
    this.hideLoader();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadPrintLetterModelData() {
    let PrintAdviceLetterInfo: any = [];
    this.finalPrintList.forEach(item => {
      this.printAdviceLetterData = {
        batchId: this.batchId,
        PrintAdviceLetterGenerateInfo: []
      };
      PrintAdviceLetterInfo.push({
        'vendorId': item.vendorId, 'paymentRequestId': item.paymentRequestId, 'batchId': item.batchId, 'warrantNumberChange': item.warrantNumberChanged,
        'vendorAddressId': item.entityId, 'clientId': item.clientId, 'isPrintAdviceLetter': item.isPrintAdviceLetter, 'checkNbr': item.checkNbr
      });
    });
    this.printAdviceLetterData.PrintAdviceLetterGenerateInfo = PrintAdviceLetterInfo;
    return this.printAdviceLetterData;
  }

  onPrintAdviceLetterClicked(buttonText: string) {
    if (buttonText == 'PRINT') {
      this.generateAndPrintAdviceLetter(this.returnResultFinalPrintList[this.currentIndex]);
    } else {
      this.reconcilePaymentsAndPrintAdviceLetter();
    }
  }

  generateAndPrintAdviceLetter(request: any) {
    this.loaderService.show();
    request.last4OfVisaCard = this.last4OfVisaCard;
    request.cardExpirationDate = this.cardExpirationDate;
    request.cardExpirationMonth = this.cardExpirationMonth;
    request.cardExpirationYear = this.cardExpirationYear;
    request.loginUserName = this.loginUserName;
    request.isPrintLetter = StatusFlag.Yes;
    request.authorizedDate = this.intl.formatDate(this.authorizedDate, this.dateFormat);
    this.financialPharmacyClaimsFacade.viewAdviceLetterData(request)
      .subscribe({
        next: (data: any) => {
          if (data) {
            const fileUrl = window.URL.createObjectURL(data);
            window.open(fileUrl, "_blank");
            this.ref.detectChanges();
          }
          if (this.returnResultFinalPrintList[this.currentIndex].isPrintAdviceLetter) {
            this.returnResultFinalPrintList[this.currentIndex].printFlag = StatusFlag.Yes;
          } else {
            this.returnResultFinalPrintList[this.currentIndex].printFlag = StatusFlag.No;
          }
          if (this.currentIndex == this.returnResultFinalPrintList.length - 1) {
            this.onClosePrintAdviceLetterClicked();
          } else {
            let event = {
              index: this.returnResultFinalPrintList.indexOf(this.returnResultFinalPrintList[this.currentIndex + 1]),
            };
            this.onItemChange(event);
          }
          this.loaderService.hide();
        },
        error: (err: Error) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  reconcilePaymentsAndPrintAdviceLetter() {
    this.loaderService.show();
    this.reconcileArray = [];
    this.returnResultFinalPrintList[this.currentIndex].paymentRequestIds?.forEach((paymentRequestId: any) => {
      let payments = this.finalPrintList?.filter(x => x.paymentRequestId === paymentRequestId);
      this.reconcileArray.push({
        paymentRequestId: payments[0].paymentRequestId,
        checkRequestId: payments[0].checkRequestId,
        vendorId: payments[0].vendorId,
        batchId: payments[0].batchId,
        entityId: payments[0].entityId,
        paymentReconciledDate: payments[0].paymentReconciledDate,
        paymentSentDate: payments[0].paymentSentDate,
        checkNbr: payments[0].checkNbr,
        comments: payments[0].comments,
        printFlag: this.returnResultFinalPrintList[this.currentIndex].isPrintAdviceLetter ? StatusFlag.Yes : StatusFlag.No
      });
      if (this.returnResultFinalPrintList[this.currentIndex].isPrintAdviceLetter) {
        this.returnResultFinalPrintList[this.currentIndex].printFlag = StatusFlag.Yes;
      } else {
        this.returnResultFinalPrintList[this.currentIndex].printFlag = StatusFlag.No;
      }
    })
    this.financialPharmacyClaimsFacade.reconcilePaymentsAndLoadPrintLetterContent(this.reconcileArray)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.returnResultFinalPrintList[this.currentIndex].warrantNumberChange = false;
            this.onReconcileRecordEvent.emit(this.returnResultFinalPrintList[this.currentIndex]);
          }
          if (this.reconcileArray[0].printFlag === StatusFlag.Yes) {
            this.generateAndPrintAdviceLetter(this.returnResultFinalPrintList[this.currentIndex]);
          } else if (this.currentIndex == this.returnResultFinalPrintList.length - 1) {
            this.onClosePrintAdviceLetterClicked();
          } else {
            let event = {
              index: this.returnResultFinalPrintList.indexOf(this.returnResultFinalPrintList[this.currentIndex + 1]),
            };
            this.onItemChange(event);
          }
          this.ref.detectChanges();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Payment(s) reconciled!","Events have been logged");
        },
        error: (err: Error) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
  }

  onItemChange(event: any) {
    this.loadTemplateEvent.emit(this.returnResultFinalPrintList[event.index]);
    this.currentIndex = event.index;
    this.ref.detectChanges();
  }

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  onCheckboxChange(event: any, item: any): void {
    item.isPrintAdviceLetter = event.target.checked;
    this.printCount = this.returnResultFinalPrintList.filter(x => x.isPrintAdviceLetter === true).length;
    if (!this.items['print']) {
      this.printAdviceLetterData.PrintAdviceLetterGenerateInfo.forEach((value: any) => {
        if (item.vendorId === value.vendorId) {
          value.isPrintAdviceLetter = event.target.checked;
        }
      });
    }
    if (this.items['print']) {
      this.selectUnSelectPayment.emit({ 'selected': event.target.checked, 'vendorAddressId': item.vendorAddressId });
    }
  }

  onAccountNumberChange(event: any) {
    this.last4OfVisaCard = event;
  }

  onExpirationDateChange(event: any) {
    if (event) {
      this.cardExpirationDate = event;
      this.cardExpirationMonth = event.getMonth() + 1;
      let fullYear = event.getFullYear().toString();
      this.cardExpirationYear = fullYear.slice(-2);
    }
  }

  onAuthorizationDateChange(event: any) {
    this.authorizedDate = this.intl.formatDate(event, this.dateFormat);
  }

  getLoggedInUserProfile() {
    this.loaderService.show();
    this.userDataService.getProfile$.subscribe((profile: any) => {
      if (profile?.length > 0) {
        this.loginUserName = profile[0]?.firstName + ' ' + profile[0]?.lastName;
      }
    })
    this.loaderService.hide();
  }
}
