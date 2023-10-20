import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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
  ngOnChanges(): void {     
    this.state = {
      skip: 0,
      take: 5,
      sort: this.sort,
    };
    this.loadServices();
  }
  loadServices(){
    this.loadInvoiceServices(
      this.dataItem,
      this.vendorId,
      this.tabCode,
      this.state?.skip ?? 0,
      this.state?.take ?? 0,
      this.sortValue,
      this.sortType
    );
  }
  loadInvoiceServices(
    dataItem : any,
    vendorId:any,
    tabCode:any,
    skipCountValue: number,
    maxResultCountValue: number,
    sortValue: string,
    sortTypeValue: string
  ) {
    this.isInvoiceServiceGridLoaderShow = true;
    const gridDataRefinerValue = {
      dataItem : dataItem,
      vendorId:vendorId,
      tabCode:tabCode,
      skipCount: skipCountValue,
      pagesize: maxResultCountValue,
      sortColumn: sortValue,
      sortType: sortTypeValue    
    };
    this.loadInvoiceServiceEvent.emit(gridDataRefinerValue);
    this.gridDataHandle();
  }
  gridDataHandle() {
    this.serviceGridView$.subscribe((data: GridDataResult) => {   
      this.gridDataResult = data;    
      this.gridFinancialClaimsInvoiceSubject.next(this.gridDataResult);
      this.isInvoiceServiceGridLoaderShow = false;
    });
  
  }
 
}
  

