import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';
import { UIFormStyle } from '@cms/shared/ui-tpa'; 
	/** Internal Libraries **/
import {PaymentsFacade } from '@cms/case-management/domain';
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
  generatedContentList: any[] = [];
    /** Input properties **/
  @Input() items!: any[];
  @Input() printOption: boolean = false;

  /** Output properties  **/
  @Output() onClosePrintAdviceLetterEvent = new EventEmitter<any>();

  /** Constructor **/
  constructor(private readonly paymentsFacade: PaymentsFacade,
    private readonly loaderService: LoaderService,
    private readonly loggingService: LoggingService,
    private readonly notificationSnackbarService : NotificationSnackbarService,
    private readonly ref: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.finalPrintList = this.items;
    this.getPrintLetterCount();
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

hideLoader(){
    this.loaderService.hide();
}

  loadPrintLetterContent() {
    this.loaderService.show();
    let printAdviceLetterData: any;
    let selectedProviders: any = [];
    let vendorIds: any = [];
    this.finalPrintList.forEach(item => {
      printAdviceLetterData = {      
      vendorId: item.vendorId,
      paymentRequestId: item.paymentRequestId,
      paymentRequestBatchId: item.paymentRequestBatchId,
      providerName: item.providerName,
      selectedProviderList: [],
      clientId: []
    };
    vendorIds.push(item.vendorId);
    const selectedItem = {
      memberID: item.memberID,
      clientName: item.clientName,
      invoiceID: item.invoiceID.toString(),
      totalCost: item.totalCost,
      serviceStateDate: item.serviceStateDate,
      clientDOB: item.clientDOB
    };
    selectedProviders.push(selectedItem);
    });
    printAdviceLetterData.selectedProviderList = selectedProviders;
    printAdviceLetterData.VendorIdList = vendorIds;
    this.paymentsFacade.loadPrintAdviceLetter(printAdviceLetterData)
    .subscribe({
      next: (data: any[]) =>{
        if (data.length > 0) {
          this.items.forEach(item => {
            data.forEach(result => {
            if(item.vendorId.toLowerCase() == result.vendorId.toLowerCase()){
              // const index = this.items.findIndex(item => item.vendorId.toLowerCase() === result.vendorId.toLowerCase());
              // if (index !== -1) {
              //   this.items.splice(index, 1, { ...item, letterContent: result.letterContent });
              //   this.generatedContentList.push(item);
              // }
              var generatedContent = { ...item, letterContent: result.letterContent }
              this.generatedContentList.push(generatedContent);
        }else{
        this.generatedContentList.push(item);
        }
      }); 
    });
          this.ref.detectChanges();
    }
      this.loaderService.hide();
    },
      error: (err) => {
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
}
