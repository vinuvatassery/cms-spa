import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
	/** Internal Libraries **/
import {FinancialClaimsFacade, PaymentsFacade } from '@cms/case-management/domain';
/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';

@Component({
  selector: 'cms-financial-claims-print-authorization',
  templateUrl: './financial-claims-print-authorization.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialClaimsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  finalPrintList!: any[];
  returnResultFinalPrintList!: any[];
  printCount: number = 0;
  reconcileCount: number = 0;
  letterContnet!: any;
  entityId: any = '823E2464-0649-49DA-91E7-26DCC76A2A6B';
  printAdviceLetterData: any
    /** Input properties **/
  @Input() items!: any[];
  @Input() batchId: any;
  @Input() printOption: boolean = false;
  @Input() isSaveClicked!: boolean;

  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();

  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef,
    private readonly financialClaimsFacade: FinancialClaimsFacade) { }

  ngOnInit(): void {
    this.finalPrintList = this.items;
    this.loadPrintLetterContent();
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  loadPrintLetterContent() {
    this.loaderService.show();
    this.printAdviceLetterData = this.loadPrintLetterModelData();
    this.financialClaimsFacade.loadPrintAdviceLetterData(this.printAdviceLetterData)
      .subscribe({
        next: (data: any[]) => {
          if (data.length > 0) {
            data.forEach((result, index: number) => {
              result.paymentNbr = index + 1;
            });

            this.returnResultFinalPrintList = data;
            this.printCount = this.returnResultFinalPrintList.filter(x => x.isPrintAdviceLetter === true).length;
            this.reconcileCount = this.returnResultFinalPrintList.length
            this.ref.detectChanges();
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

  loadPrintLetterModelData() {
    let PrintAdviceLetterInfo: any = [];
    this.finalPrintList.forEach(item => {
      this.printAdviceLetterData = {       
      batchId:this.batchId,
      PrintAdviceLetterGenerateInfo:[]
    };
    PrintAdviceLetterInfo.push({'vendorId':item.vendorId,'paymentRequestId':item.paymentRequestId,
    'vendorAddressId':item.entityId,'clientId':item.clientId,'isPrintAdviceLetter':item.isPrintAdviceLetter});
    });
    this.printAdviceLetterData.PrintAdviceLetterGenerateInfo = PrintAdviceLetterInfo;
    debugger;
    return this.printAdviceLetterData;
  }

  reconcilePaymentsData(selectedPrintList: any[]) {
    let selectedProviders: any = [];
    selectedPrintList.forEach(item => {
      let selectedProvider = {
        checkRequestId: item.checkRequestId,
        vendorId: item.vendorId,
        entityId: item.entityId,
        paymentReconciledDate: item.paymentReconciledDate,
        paymentSentDate: item.paymentSentDate,
        checkNbr: item.checkNbr,
        comments: item.comments,
        paymentRequestId: item.paymentRequestId
      };
      selectedProviders.push(selectedProvider);
    });
    return selectedProviders;
  }

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  onCheckboxChange(event: any, item: any): void {
    item.isPrintAdviceLetter = event.target.checked;
    this.printCount = this.returnResultFinalPrintList.filter(x => x.isPrintAdviceLetter === true).length;
    this.reconcileCount = this.returnResultFinalPrintList.length;
    this.printAdviceLetterData.PrintAdviceLetterGenerateInfo.forEach((value: any) => {
      if (item.vendorId === value.vendorId) {
        value.isPrintAdviceLetter = event.target.checked;
      }
    });

  }

  onPrintAdviceLetterClicked(buttonText: string) {
    if (buttonText == 'PRINT') {
      this.generateAndPrintAdviceLetter();
    } else {
      this.reconcilePaymentsAndPrintAdviceLetter();
    }
  }

  generateAndPrintAdviceLetter() {
    this.loaderService.show();
    let printReconcileRecords = this.printAdviceLetterData?.PrintAdviceLetterGenerateInfo?.filter((x: any) => x.isPrintAdviceLetter === true)
    let request = { 'PrintAdviceLetterGenerateInfo': printReconcileRecords, 'batchId': this.printAdviceLetterData.batchId };
    this.financialClaimsFacade.viewAdviceLetterData(request)
      .subscribe({
        next: (data: any) => {
          if (data) {
            const fileUrl = window.URL.createObjectURL(data);
            window.open(fileUrl, "_blank");
            this.ref.detectChanges();
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
    let reconcileData = this.reconcilePaymentsData(this.finalPrintList);
    this.financialClaimsFacade.reconcilePaymentsAndLoadPrintLetterContent(this.batchId, reconcileData)
      .subscribe({
        next: (data: any) => {
          if (data) {
            this.generateAndPrintAdviceLetter();
            this.ref.detectChanges();
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
}

