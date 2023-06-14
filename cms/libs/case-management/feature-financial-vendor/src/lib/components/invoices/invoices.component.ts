import { ChangeDetectionStrategy, Component, Input } from '@angular/core'; 
import { UIFormStyle } from '@cms/shared/ui-tpa';
import { InvoiceFacade } from '@cms/case-management/domain';
import { State } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-invoices',
  templateUrl: './invoices.component.html', 
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InvoicesComponent {
  public formUiStyle: UIFormStyle = new UIFormStyle();
  popupClassAction = 'TableActionPopup app-dropdown-action-list';
  isInvoiceGridLoaderShow = false;
  public sortValue = this.invoiceFacade.sortValue;
  public sortType = this.invoiceFacade.sortType;
  public pageSizes = this.invoiceFacade.gridPageSizes;
  public gridSkipCount = this.invoiceFacade.skipCount;
  public sort = this.invoiceFacade.sort;
  public state!: State;
  invoiceGridView$ = this.invoiceFacade.invoiceData$;
  providerId:any;
  isInvoiceLoading$=  this.invoiceFacade.isInvoiceLoading$
  isInvoiceLoadingSubscription!:Subscription;
  @Input() tabCode: any;
  @Input() vendorId: any;

   /** Constructor **/
   constructor(private readonly invoiceFacade: InvoiceFacade,private readonly router: Router,) {}

  ngOnInit(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value
    };
    this.loadInvoiceListGrid();
    this.isInvoiceLoadingSubscription = this.isInvoiceLoading$.subscribe(data=>{
      this.isInvoiceGridLoaderShow = data;
    })
  }

  ngOnChanges(): void {
    this.state = {
      skip: this.gridSkipCount,
      take: this.pageSizes[0]?.value,
      sort: this.sort,
    };
  }
  public dataStateChange(stateData: any): void {
    this.sort = stateData.sort;
    this.sortValue = stateData.sort[0]?.field ?? this.sortValue;
    this.sortType = stateData.sort[0]?.dir ?? 'asc';
    this.state = stateData;
    this.loadInvoiceListGrid();
  }
  pageSelectionChange(data: any) {
    this.state.take = data.value;
    this.state.skip = 0;
    this.loadInvoiceListGrid();
  }
  loadInvoiceListGrid() {
    this.invoiceFacade.loadInvoiceListGrid(this.vendorId,this.state,this.tabCode,this.sortValue,this.sortType);
  }

  onClientClicked(clientId: any) {
      this.router.navigate([`/case-management/cases/case360/${clientId}`]);
      
  }
  onBatchClicked() {
    this.router.navigate([`/financial-management/medical-claims`]);    
  } 
  onExpand(event:any) {
    this.invoiceFacade.loadPaymentRequestServices(event.dataItem,this.vendorId,this.tabCode)   
  }
}
