import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { InvoiceFacade } from '@cms/case-management/domain';
import { SnackBarNotificationType } from '@cms/shared/util-core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { SortDescriptor, State } from '@progress/kendo-data-query';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'cms-invoice-service',
  templateUrl: './invoice-service.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceServiceComponent implements OnChanges {
  @Input() dataItem : any;
  @Input() vendorId : any;
  @Input() tabCode : any;
  @Input() serviceGridView$ :any
  @Input() isInvoiceServiceLoading$: any;
  @Output() loadInvoiceServiceEvent = new EventEmitter<any>();
  gridDataResult!: GridDataResult;
  gridFinancialClaimsInvoiceSubject = new Subject<any>();
  gridFinancialClaimsInvoice$ =  this.gridFinancialClaimsInvoiceSubject.asObservable();
  isInvoiceServiceGridLoaderShow = true
  invoiceServiceLoadingSubscription!:Subscription;
  public state!: State; 
  public sortValue = 'amountDue';
  public sort: SortDescriptor[] = [{
    field: this.sortValue,
  }];
  sortType ="asc"
  constructor(private readonly invoiceFacade: InvoiceFacade) {}
  ngOnChanges(): void {     
    this.state = {
      skip: 0,
      take: 5,
      sort: this.sort,
    };
    this.loadServices();
  }
  loadServices(){
    this.isInvoiceServiceGridLoaderShow = true;
    this.loadInvoiceServices(
      this.dataItem
    );
  }
  loadInvoiceServices(
    dataItem : any
  ) {
    this.invoiceFacade.loadPaymentRequestServices(dataItem,this.vendorId,this.tabCode)
    .subscribe({
      next: (dataResponse) => { 
        this.gridFinancialClaimsInvoiceSubject.next(dataResponse);
        this.isInvoiceServiceGridLoaderShow = false;
      },
      error: (err) => {
        this.isInvoiceServiceGridLoaderShow = false;
        this.invoiceFacade.showHideSnackBar(SnackBarNotificationType.ERROR , err);
         },
    });  
  }
  gridDataHandle() {
    this.serviceGridView$.subscribe((data: GridDataResult) => {   
      this.gridDataResult = data;    
      this.gridFinancialClaimsInvoiceSubject.next(this.gridDataResult);
      this.isInvoiceServiceGridLoaderShow = false;
    });
  
  }
 
}
  

