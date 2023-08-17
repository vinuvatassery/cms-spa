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
  printCount: number = 0;
  letterContnet!: any;
  entityId: any = '823E2464-0649-49DA-91E7-26DCC76A2A6B';
    /** Input properties **/
  @Input() items!: any[];
  @Input() batchId!: any;
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
    this.getPrintLetterCount();
    if(this.printOption || this.isSaveClicked){
      this.loadPrintLetterContent();
    }else{
      this.reconcilePaymentsAndPrintLetterContent();
    }
  }

  showHideSnackBar(type: SnackBarNotificationType, subtitle: any) {
    if (type == SnackBarNotificationType.ERROR) {
        const err = subtitle;
        this.loggingService.logException(err)
    }
    this.notificationSnackbarService.manageSnackBar(type, subtitle)
    this.hideLoader();
}

hideLoader(){
    this.loaderService.hide();
}

  loadPrintLetterContent() {
    this.loaderService.show();
    let printAdviceLetterData = this.loadPrintLetterModelData(this.finalPrintList);
    this.financialClaimsFacade.loadPrintAdviceLetterData(printAdviceLetterData)
    .subscribe({
      next: (data: any[]) =>{
        if (data.length > 0) {
          this.items.forEach((item: any, index: number) => {
            data.forEach(result => {
            if(item.vendorId.toLowerCase() == result.vendorId.toLowerCase()){
                this.finalPrintList[index+1].item = index + 1,
                this.finalPrintList[index+1].paymentMethodCode = item.paymentMethodCode,
                this.finalPrintList[index+1].amountPaid = item.amountPaid,
                this.finalPrintList[index+1].vendorName = item.vendorName,
                this.finalPrintList[index+1].letterContent = result.letterContent,
                this.finalPrintList[index+1].isChecked = true
        }
      }); 
    });
          this.ref.detectChanges();
    }
      this.loaderService.hide();
    },
      error: (err: Error) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  reconcilePaymentsAndPrintLetterContent() {
    this.loaderService.show();
    let reconcileData = this.reconcilePaymentsData(this.finalPrintList);
    this.financialClaimsFacade.reconcilePaymentsAndLoadPrintLetterContent(this.batchId, reconcileData)
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.loadPrintLetterContent();
          this.ref.detectChanges();
    }
      this.loaderService.hide();
    },
      error: (err: Error) => {
      this.loaderService.hide();
      this.loggingService.logException(err);
      this.showHideSnackBar(SnackBarNotificationType.ERROR,err);
    },
  });
  }

  onClosePrintAdviceLetterClicked() {
    this.onClosePrintAdviceLetterEvent.emit('Close');
  }

  onCheckboxChange(event: any, item: any): void {
    item.isChecked = event.target.checked;
    if(this.printOption){
      if(item.isChecked)
      {
      this.finalPrintList.push(item);
      }
      else{
        this.finalPrintList = this.finalPrintList.filter(element => element.item !== item.item);
      }
    }else{
      if(item.isChecked)
      {
      this.finalPrintList.push(item);
      }
      else{
        this.finalPrintList = this.finalPrintList.filter(element => element.warrantNumber !== item.warrantNumber);
      }
    }
    this.printCount = this.finalPrintList.length;
  }

  getPrintLetterCount(){
    this.printCount = this.items.length;
  }

  onPrintAdviceLetterClicked(){
    console.log(this.letterContnet);
  }

  loadPrintLetterModelData(selectedPrintList: any[]) {
    let printAdviceLetterData: any;
    let vendorIds: any = [];
    selectedPrintList.forEach(item => {
      printAdviceLetterData = {      
      vendorId: item.vendorId,
      selectedProviderList: [],
    };
    vendorIds.push(item.vendorId);
    });
    printAdviceLetterData.paymentRequestBatchId = this.batchId;
    printAdviceLetterData.VendorIdList = vendorIds;
    return printAdviceLetterData;
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
      comments: item.comments
    };
    selectedProviders.push(selectedProvider);
  });
  return selectedProviders;
}
}



