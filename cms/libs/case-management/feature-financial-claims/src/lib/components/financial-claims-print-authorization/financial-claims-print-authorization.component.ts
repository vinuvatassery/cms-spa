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

  // printLetterCount: number = this.items.length;
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
    let formDataList: FormData[] = [];
    let formData = new Array<FormData>();
    this.finalPrintList.forEach(item => {
      const formData = new FormData();
      formData.append('clientName', item.clientName);
      formData.append('invoiceID', item.invoiceID);
      formData.append('providerName', item.providerName);
      formData.append('totalCost', item.totalCost);
      formDataList.push(formData);
    });
    this.paymentsFacade.loadPrintAdviceLetter(formDataList)
    .subscribe({
      next: (data: any) =>{
        if (data) {
          this.letterContnet = data;
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
