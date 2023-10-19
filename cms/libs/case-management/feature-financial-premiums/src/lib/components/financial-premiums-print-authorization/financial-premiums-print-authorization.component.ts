import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
	/** Internal Libraries **/
import { FinancialPremiumsFacade } from '@cms/case-management/domain';
/** External Libraries **/
import { LoaderService, LoggingService, SnackBarNotificationType, NotificationSnackbarService } from '@cms/shared/util-core';
@Component({
  selector: 'cms-financial-premiums-print-authorization',
  templateUrl: './financial-premiums-print-authorization.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FinancialPremiumsPrintAuthorizationComponent {
  public width = "100%";
  public height = "100%";
  public formUiStyle: UIFormStyle = new UIFormStyle();
  finalPrintList!: any[];
  printCount: number = 0;
  reconcileCount: number = 0;
  returnResultFinalPrintList!: any[];
  printAdviceLetterData: any

    /** Input properties **/
  @Input() items!: any;
  @Input() printOption: boolean = false;
  @Input() batchId: any;
  @Input() premiumsType:any;
  @Input() isSaveClicked!: boolean;

  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();
  @Output() selectUnSelectPayment  = new EventEmitter<any>();

    /** Constructor **/
    constructor(
      private readonly loaderService: LoaderService,
      private readonly loggingService: LoggingService,
      private readonly notificationSnackbarService : NotificationSnackbarService,
      private readonly ref: ChangeDetectorRef,
      private readonly financialPremiumsFacade: FinancialPremiumsFacade) { }

  ngOnInit(): void {
    if(this.items['print']){
      this.loadPrintLetterContent(this.items);
    }
    else
    {
      this.finalPrintList = this.items;
      this.printAdviceLetterData = this.loadPrintLetterModelData();
      this.loadPrintLetterContent(this.printAdviceLetterData);
    }
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
      const err = subtitle;
      this.loggingService.logException(err);
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle);
    this.hideLoader();
  }

  hideLoader() {
    this.loaderService.hide();
  }

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  onCheckboxChange(event: any, item: any): void {
    item.isPrintAdviceLetter = event.target.checked;
    this.printCount = this.returnResultFinalPrintList.filter(x => x.isPrintAdviceLetter === true).length;
    this.reconcileCount = this.returnResultFinalPrintList.length;
    if (!this.items['print']) {
      this.printAdviceLetterData.PrintAdviceLetterGenerateInfo.forEach((value: any) => {
        if (item.vendorId === value.vendorId) {
          value.isPrintAdviceLetter = event.target.checked;
        }
      });
    }
    if (this.items['print']) {
      this.selectUnSelectPayment.emit({'selected':event.target.checked,'vendorAddressId':item.vendorAddressId});
    }
  }

  getPrintLetterCount(){
    this.printCount = this.items.length;
  }

  onPrintAdviceLetterClicked(buttonText: string) {
    if (buttonText == 'PRINT') {
      this.items.PrintAdviceLetterUnSelected =  this.items.PrintAdviceLetterUnSelected.filter((x:any)=>x.selected);
      this.items.PrintAdviceLetterSelected =  this.items.PrintAdviceLetterSelected.filter((x:any)=>x.selected);
      this.generateAndPrintAdviceLetter(this.items);
    } else {
      this.reconcilePaymentsAndPrintAdviceLetter();
    }
  }

  generateAndPrintAdviceLetter(request:any) {
    this.loaderService.show();
    this.financialPremiumsFacade.viewAdviceLetterData(this.batchId, request, this.premiumsType)
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
    this.financialPremiumsFacade.reconcilePaymentsAndLoadPrintLetterContent(this.batchId, reconcileData,this.premiumsType)
      .subscribe({
        next: (data: any) => {
          if (data) {
            let printReconcileRecords = this.printAdviceLetterData?.PrintAdviceLetterGenerateInfo?.filter((x: any) => x.isPrintAdviceLetter === true)
            let request = { 'PrintAdviceLetterGenerateInfo': printReconcileRecords, 'batchId': this.printAdviceLetterData.batchId };
            if(this.printCount > 0){
            this.generateAndPrintAdviceLetter(request);
            }
          }
          this.loaderService.hide();
          this.onClosePrintAdviceLetterClicked();
          this.ref.detectChanges();
          this.showHideSnackBar(SnackBarNotificationType.SUCCESS, "Payment(s) reconciled!");
        },
        error: (err: Error) => {
          this.loaderService.hide();
          this.loggingService.logException(err);
          this.showHideSnackBar(SnackBarNotificationType.ERROR, err);
        },
      });
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

  loadPrintLetterContent(request:any) {
    this.loaderService.show();
    this.financialPremiumsFacade.loadMedicalPremiumPrintAdviceLetterData(this.batchId, request, this.premiumsType)
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
    'vendorAddressId':item.entityId,'clientId':item.clientId,'isPrintAdviceLetter':item.isPrintAdviceLetter, 'checkNbr':item.checkNbr});
    });
    this.printAdviceLetterData.PrintAdviceLetterGenerateInfo = PrintAdviceLetterInfo;
    return this.printAdviceLetterData;
  }
}
